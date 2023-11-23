import type { AxiosPromise } from 'axios'
import axios from 'axios'
import type { AdsType, AdsTypeBase } from './../interfaces/AdsType'

class AdsTypesService {
  contextPath = 'ads_types'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  /** **************** post ******************/
  createItem(data: AdsTypeBase): AxiosPromise {
    return axios.post(`${this.contextPath}`, data)
  }

  /** **************** put ******************/
  editItem(data: AdsType): AxiosPromise {
    return axios.put(`${this.contextPath}/${data.id}`, data)
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }
}

export const adsTypesService = new AdsTypesService()
