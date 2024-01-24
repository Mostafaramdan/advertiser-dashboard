import type { AxiosPromise } from 'axios'
import axios from 'axios'
import type { AboutUsItem, AboutUsItemBase } from './../interfaces/AboutUsItem'

class OffersAboutUsService {
  contextPath = 'offers_abouts'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  getSingleItem(id: any): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}`)
  }

  /** **************** post ******************/
  createItem(data: AboutUsItemBase): AxiosPromise {
    return axios.post(`${this.contextPath}`, data)
  }

  /** **************** put ******************/
  editItem(data: AboutUsItem): AxiosPromise {
    return axios.put(`${this.contextPath}/${data.id}`, data)
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }
}

export const offersAboutUsService = new OffersAboutUsService()
