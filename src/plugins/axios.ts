/* eslint-disable indent */
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import { useSharedStore } from '@/stores/SharedStore'
import { useAuthStore } from '@/stores/AuthStore'

export const axiosConf = {
  install: (app: any) => {
    const { $router, $i18n } = app.config.globalProperties
    const router = $router
    const sharedStore = useSharedStore()
    const authStore = useAuthStore()

    const toast = useToast()

    axios.defaults.baseURL = import.meta.env.VITE_BASE_API_URL

    /**
     *
     * @param config
     */
    function setHeaders(config: any) {
      const headers: any = config.headers
      const token = authStore.getToken
      if (token) headers.Authorization = `Bearer ${token}`

      headers['Content-Type'] = config.headers['Content-Type'] || 'application/json'
      headers['Accept-Language'] = $i18n.locale

      return headers
    }

    axios.interceptors.request.use(
      /**
       *
       * @param config
       */
      (config: InternalAxiosRequestConfig<any>) => {
        // set Headers
        config.headers = setHeaders(config)

        sharedStore.setLoading(true)

        return config
      },
      (error: AxiosError<any>) => {
        sharedStore.setLoading(false)

        return Promise.reject(error)
      },
    )

    axios.interceptors.response.use(
      /**
       *
       * @param response
       */
      (response: AxiosResponse<any>) => {
        sharedStore.setLoading(false)

        return response
      },
      /**
       *
       * @param error
       */
      (error: AxiosError<any>): Promise<AxiosError<any>> => {
        sharedStore.setLoading(false)

        const errorResponse = error.response
        switch (errorResponse?.status) {
          case 400:
          // Bad Request
            toast.error(errorResponse?.data?.message)
            break
          case 401:
          // Unauthorized
          // clear user data
            toast.error(errorResponse?.data?.message || errorResponse?.data?.error)
            authStore.clearAuthUser()

            if (router.currentRoute.value.name !== 'login-page') {
              router.push({
                name: 'login-page',
                query: {
                  redirect: router.currentRoute.value.fullPath,
                },
              })
            }
            break
          case 403:
          // Forbidden
            toast.error(errorResponse?.data?.message)
            router.push({
              name: 'error-page',
              query: { message: 'This url is invalid' },
            })
            break
          case 500:
            router.push({
              name: 'error-page',
              query: { message: 'Something Went Wrong! Try Again Later' },
            })
            break
          default:
            toast.error(errorResponse?.data?.message)
            break
        }
        console.log('Axios Error IS:', error)

        return Promise.reject(error)
      },
    )
  },
}
export default axiosConf
