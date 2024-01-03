import type { AxiosPromise } from 'axios'
import axios from 'axios'

class ListService {
  contextPath = 'dropdown_menu'

  /** **************** get ******************/
  getCountries(): AxiosPromise {
    return axios.get(`${this.contextPath}/countries`)
  }

  getAreas(country_id: number): AxiosPromise {
    return axios.get(`${this.contextPath}/areas?country_id=${country_id}`)
  }

  getQuestionsCategories(): AxiosPromise {
    return axios.get(`${this.contextPath}/support_categories`)
  }

  getTermsConditionsTypes(): AxiosPromise {
    return axios.get(`${this.contextPath}/page_rule_types`)
  }

  getVideosLists(): AxiosPromise {
    return axios.get(`${this.contextPath}/available_video_types`)
  }

  getPackagesLists(): AxiosPromise {
    return axios.get(`${this.contextPath}/packages`)
  }

  getPackagePeriods(package_id: number): AxiosPromise {
    return axios.get(`${this.contextPath}/periods_of_packages?package_id=${package_id}`)
  }

  getCategories(params: any = {}): AxiosPromise {
    return axios.get(`${this.contextPath}/categories`, { params })
  }

  getUsers(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/users`, { params })
  }

  getStores(): AxiosPromise {
    return axios.get(`${this.contextPath}/stores`)
  }

  getEntitiesLists(): AxiosPromise {
    return axios.get(`${this.contextPath}/entities`)
  }

  getTags(): AxiosPromise {
    return axios.get(`${this.contextPath}/tags`)
  }

  getAdmins(): AxiosPromise {
    return axios.get(`${this.contextPath}/admins`)
  }

  getDisputesProcedures(): AxiosPromise {
    return axios.get(`${this.contextPath}/dispute_procedures`)
  }

  getDisputesTypes(): AxiosPromise {
    return axios.get(`${this.contextPath}/dispute_types`)
  }

  getReadyReplies(type: string): AxiosPromise {
    return axios.get(`${this.contextPath}/admin_replies?type=${type}`)
  }

  getTicketsTypes(): AxiosPromise {
    return axios.get(`${this.contextPath}/support_types`)
  }

  getEmployeesRolesCategories(): AxiosPromise {
    return axios.get(`${this.contextPath}/role_categories`)
  }

  getEmployeesRoles(): AxiosPromise {
    return axios.get(`${this.contextPath}/roles`)
  }

  getOffers(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/offers`, { params })
  }

  getUnits(): AxiosPromise {
    return axios.get(`${this.contextPath}/units`)
  }

  getPendingRequests(params: any): AxiosPromise {
    return axios.get(`exchange-pending-requests`, { params })
  }

  getAdsSpacesCategories(): AxiosPromise {
    return axios.get(`${this.contextPath}/space_categories`)
  }

  getProducts(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/products`, { params })
  }

  getResponsibles(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/responsibles`, { params })
  }

  getOfferDeadlines(): AxiosPromise {
    return axios.get(`${this.contextPath}/deadlines`)
  }

  getOfferPaymentMethods(): AxiosPromise {
    return axios.get(`${this.contextPath}/payment_methods`)
  }
}

export const listService = new ListService()
