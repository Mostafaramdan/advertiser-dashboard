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

  logout(): AxiosPromise {
    return axios.post(`${this.contextPath}/logout`)
  }
}

export const authService = new AuthService()
