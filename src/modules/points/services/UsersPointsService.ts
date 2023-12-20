import type { AxiosPromise } from 'axios'
import axios from 'axios'

class UsersPointsService {
  contextPath = 'users_points'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }
}

export const usersPointsService = new UsersPointsService()
