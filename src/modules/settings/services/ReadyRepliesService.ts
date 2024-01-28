import type { AxiosPromise } from 'axios'
import axios from 'axios'
import type { ReadyReply, ReadyReplyBase } from './../interfaces/ReadyReply'

class ReadyRepliesService {
  contextPath = 'betrend_admin_replies'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  getSingleItem(id: any): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}`)
  }

  /** **************** post ******************/
  createItem(data: ReadyReplyBase): AxiosPromise {
    return axios.post(`${this.contextPath}`, data)
  }

  /** **************** put ******************/
  editItem(data: ReadyReply): AxiosPromise {
    return axios.put(`${this.contextPath}/${data.id}`, data)
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }
}

export const readyRepliesService = new ReadyRepliesService()
