import type { AxiosPromise } from 'axios'
import axios from 'axios'

class OffersPlatformService {
  contextPath = 'offers_platform_setting'

  /** **************** get ******************/
  getGeneralData(country_id: number): AxiosPromise {
    return axios.get(`${this.contextPath}/general?country_id=${country_id}`)
  }

  getWorkTimeData(): AxiosPromise {
    return axios.get(`${this.contextPath}/schedules`)
  }

  getSocialsData(): AxiosPromise {
    return axios.get(`${this.contextPath}/social`)
  }

  getPaymentMethodsData(): AxiosPromise {
    return axios.get(`${this.contextPath}/billing_cards`)
  }

  /** **************** patch ******************/
  editGeneralData(country_id: number, data: any): AxiosPromise {
    return axios.patch(`${this.contextPath}/general/all?country_id=${country_id}`, { data })
  }

  editWorkTimeData(data: any): AxiosPromise {
    return axios.patch(`${this.contextPath}/schedules/all`, data)
  }

  editSocialsData(data: any): AxiosPromise {
    return axios.patch(`${this.contextPath}/social/all`, data)
  }

  editPaymentMethod(data: any): AxiosPromise {
    return axios.patch(`${this.contextPath}/billing_cards/${data.id}`, data)
  }

  /** ***************** delete ******************/
  deletePaymentMethod(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/billing_cards/${id}`)
  }

  /** ***************** post ******************/
  createPaymentMethod(data: any): AxiosPromise {
    return axios.post(`${this.contextPath}/billing_cards`, data)
  }
}

export const offersPlatformService = new OffersPlatformService()
