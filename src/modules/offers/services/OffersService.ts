import type { AxiosPromise } from 'axios'
import axios from 'axios'

class OffersService {
  contextPath = 'offers'
  settingsPath = 'offer_settings'
  productsPath = 'products'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  getSingleItem(id: number): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}`)
  }

  getOfferLogs(id: number, params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}/logs`, { params })
  }

  getStatistics(id: number): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}/statistics`)
  }

  getPermissions(id: number): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}/permissions`)
  }

  getOfferStartReminders(id: number, params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}/start_reminder_requests`, { params })
  }

  getOfferQtyAvailabilityReminders(id: number, params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}/availability_reminder_requests`, { params })
  }

  getSettings(): AxiosPromise {
    return axios.get(`${this.settingsPath}`)
  }

  getOfferProducts(id: number): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}/products`)
  }

  /** **************** post ******************/
  createItem(data: any): AxiosPromise {
    return axios.post(`${this.contextPath}`, data)
  }

  /** **************** put ******************/
  editItem(data: any): AxiosPromise {
    return axios.put(`${this.contextPath}/${data.id}`, data)
  }

  offerProductsAcceptance(data: any): AxiosPromise {
    return axios.put(`${this.productsPath}/acceptance`, data)
  }

  offerProductsQtyAvailability(data: any): AxiosPromise {
    return axios.put(`${this.productsPath}/toggle_availability_quantity`, data)
  }

  offerProductsToggleActivation(data: any): AxiosPromise {
    return axios.put(`${this.productsPath}/toggle_activation`, data)
  }

  editOfferStatus(id: number, data: any): AxiosPromise {
    return axios.put(`${this.contextPath}/${id}/update_offer_status`, data)
  }

  updatePermissions(id: number, data: any): AxiosPromise {
    return axios.put(`${this.contextPath}/${id}/permissions`, data)
  }

  /** **************** patch ******************/
  editSettings(data: any): AxiosPromise {
    return axios.patch(`${this.settingsPath}/update_all`, data)
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }
}

export const offersService = new OffersService()
