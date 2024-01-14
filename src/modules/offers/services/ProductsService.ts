import type { AxiosPromise } from 'axios'
import axios from 'axios'
import type { OfferNoteModalPayload } from '../interfaces/Offer'

class ProductsService {
  contextPath = 'products'
  notesPath = 'notes'

  /** **************** get ******************/
  getNotes(id: number, params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}/${this.notesPath}`, { params })
  }

  /** **************** post ******************/
  createNote(payload: OfferNoteModalPayload): AxiosPromise {
    return axios.post(`${this.contextPath}/${payload.productId}/${this.notesPath}`, payload.data)
  }

  /** **************** put ******************/
  post(id: number, data: any): AxiosPromise {
    return axios.put(`${this.contextPath}/${id}/post`, data)
  }

  editNote(payload: any): AxiosPromise {
    return axios.put(
      `${this.contextPath}/${payload.productId}/${this.notesPath}/${payload.data.id}`,
      payload.data,
    )
  }

  /** **************** delete ******************/
  deleteNote({ productId, noteId }: { productId: number; noteId: number }): AxiosPromise {
    return axios.delete(`${this.contextPath}/${productId}/${this.notesPath}/${noteId}`)
  }
}

export const productsService = new ProductsService()
