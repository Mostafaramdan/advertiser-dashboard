import type { AxiosPromise } from 'axios'
import axios from 'axios'
import type { PlatformNewsItem, PlatformNewsItemBase } from './../interfaces/PlatformNewsItem'

class AdSpacesPlatformNewsService {
  contextPath = 'ad_spaces_page_news'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  getSingleItem(id: any): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}`)
  }

  /** **************** post ******************/
  createItem(data: PlatformNewsItemBase): AxiosPromise {
    return axios.post(`${this.contextPath}`, data)
  }

  /** **************** put ******************/
  editItem(data: PlatformNewsItem): AxiosPromise {
    return axios.put(`${this.contextPath}/${data.id}`, data)
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }
}

export const adSpacesPlatformNewsService = new AdSpacesPlatformNewsService()
