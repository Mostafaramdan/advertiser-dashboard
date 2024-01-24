import type { AxiosPromise } from 'axios'
import axios from 'axios'
import type { Partner, PartnerBase } from './../interfaces/Partner'

class OffersPartnersService {
  contextPath = 'offers_partners'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  getSingleItem(id: any): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}`)
  }

  /** **************** post ******************/
  createItem(data: PartnerBase): AxiosPromise {
    return axios.post(`${this.contextPath}`, data)
  }

  /** **************** put ******************/
  editItem(data: Partner): AxiosPromise {
    return axios.put(`${this.contextPath}/${data.id}`, data)
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }
}

export const offersPartnersService = new OffersPartnersService()
