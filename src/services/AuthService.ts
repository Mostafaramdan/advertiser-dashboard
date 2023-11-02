import type { AxiosPromise } from 'axios'
import axios from 'axios'

class AuthService {
  contextPath = 'auth'

  /** **************** get ******************/
  getPermissions(): AxiosPromise {
    return axios.get(`${this.contextPath}/getMyPermissions`)
  }

  /** **************** post ******************/
  login(payload: object): AxiosPromise {
    return axios.post(`${this.contextPath}/login`, payload)
  }

  setFcmToken(fcm_token: string): AxiosPromise {
    return axios.post(`set_fcm_token`, { fcm_token })
  }

  deleteFcmToken(fcm_token: string): AxiosPromise {
    return axios.post(`delete_fcm_token`, { fcm_token })
  }

  logout(): AxiosPromise {
    return axios.post(`${this.contextPath}/logout`)
  }
}

export const authService = new AuthService()
