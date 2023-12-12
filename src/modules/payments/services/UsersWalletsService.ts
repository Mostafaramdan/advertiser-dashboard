import type { AxiosPromise } from 'axios'
import axios from 'axios'

class UsersWalletsService {
  contextPath = 'users_wallet'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }
}

export const usersWalletsService = new UsersWalletsService()
