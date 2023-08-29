import type { AxiosPromise } from 'axios'
import axios from 'axios'

class UsersService {
  contextPath = 'users/users'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }
}

export const usersService = new UsersService()
