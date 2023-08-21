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
}

export const listService = new ListService()
