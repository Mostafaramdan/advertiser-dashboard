import type { AxiosPromise } from 'axios'
import axios from 'axios'
import type { Entity } from './../interfaces/Entity'

class EntitiesService {
  contextPath = 'entities'

  /** **************** get ******************/
  getEntities(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  /** **************** post ******************/
  createEntity(data: Entity): AxiosPromise {
    return axios.post(`${this.contextPath}`, data)
  }

  /** **************** put ******************/
  editEntity(data: Entity): AxiosPromise {
    return axios.put(`${this.contextPath}/${data.id}`, data)
  }

  /** **************** delete ******************/
  deleteEntity(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }
}

export const entitiesService = new EntitiesService()
