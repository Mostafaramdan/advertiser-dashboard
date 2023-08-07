import type { AxiosPromise } from 'axios'
import axios from 'axios'

class SharedService {
  contextPath = ''

  /** **************** get ******************/

  /** **************** post ******************/

  /** **************** put ******************/
  toggleActivation(payload: { model: string; id: number }): AxiosPromise {
    return axios.put('toggle_activation', payload)
  }

  toggleActivationBulk(payload: { model: string; ids: number[]; action: number }): AxiosPromise {
    return axios.put('multi_toggle_activation', payload)
  }

  /** **************** delete ******************/
  deleteBulk(payload: { model: string; ids: number[] }): AxiosPromise {
    return axios.delete('multi_destroy', { data: payload })
  }
}

export const sharedService = new SharedService()
