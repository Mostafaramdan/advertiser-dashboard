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
    return axios.get(`${this.contextPath}/get_periods_of_packages?package_id=${package_id}`)
  }
}

export const listService = new ListService()
