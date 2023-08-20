import type { AxiosPromise } from 'axios'
import axios from 'axios'
import type { File } from '@/interfaces/Shared'

class SharedService {
  contextPath = ''

  /** **************** get ******************/

  /** **************** post ******************/
  sortBulk(payload: { model: string; ids: number[]; target_id: number }): AxiosPromise {
    return axios.post('sorting', payload)
  }

  uploadFile(file: File): AxiosPromise {
    return axios.post('file', { file }, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

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
