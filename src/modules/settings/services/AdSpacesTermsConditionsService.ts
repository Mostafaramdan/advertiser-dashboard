import type { AxiosPromise } from 'axios'
import axios from 'axios'
import type {
  TermsConditionsItem,
  TermsConditionsItemBase,
} from './../interfaces/TermsConditionsItem'

class AdSpacesTermsConditionsService {
  contextPath = 'ad_spaces_terms'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  getSingleItem(id: any): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}`)
  }

  /** **************** post ******************/
  createItem(data: TermsConditionsItemBase): AxiosPromise {
    return axios.post(`${this.contextPath}`, data)
  }

  /** **************** put ******************/
  editItem(data: TermsConditionsItem): AxiosPromise {
    return axios.put(`${this.contextPath}/${data.id}`, data)
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }
}

export const adSpacesTermsConditionsService = new AdSpacesTermsConditionsService()
