import type { AxiosPromise } from 'axios'
import axios from 'axios'

class ListService {
  contextPath = 'dropdown_menu'

  /** **************** get ******************/
  getCountries(): AxiosPromise {
    return axios.get(`${this.contextPath}/countries`)
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
}

export const listService = new ListService()
