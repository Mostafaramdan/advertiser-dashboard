import type { AxiosPromise } from 'axios'
import axios from 'axios'

class AdsService {
  contextPath = 'ads'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  getDetails(id: number): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}`)
  }

  getComments({ id, params }: { id: number; params: any }): AxiosPromise {
    return axios.get(`comments/ads/${id}`, { params })
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }

  deleteComment(id: number): AxiosPromise {
    return axios.delete(`comments/${id}`)
  }

  /** **************** put ******************/
  restoreItem(id: number): AxiosPromise {
    return axios.put(`${this.contextPath}/${id}/restore`)
  }
}

export const adsService = new AdsService()
