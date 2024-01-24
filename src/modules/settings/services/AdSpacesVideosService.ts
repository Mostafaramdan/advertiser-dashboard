import type { AxiosPromise } from 'axios'
import axios from 'axios'
import type { Video, VideoBase } from './../interfaces/Video'

class AdSpacesVideosService {
  contextPath = 'ad_spaces_videos'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  /** **************** post ******************/
  createItem(data: VideoBase): AxiosPromise {
    return axios.post(`${this.contextPath}`, data)
  }

  /** **************** put ******************/
  editItem(data: Video): AxiosPromise {
    return axios.put(`${this.contextPath}/${data.id}`, data)
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }
}

export const adSpacesVideosService = new AdSpacesVideosService()
