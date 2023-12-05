import type { OfferAcceptModalFormPayload, OfferNoteModalPayload } from '@/interfaces/Offer'
import type { AxiosPromise } from 'axios'
import axios from 'axios'

class OffersService {
  contextPath = 'offers'

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

  getOfferNotes(id: number, params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}/offer_notes`, { params })
  }

  getStatistics(id: number): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}/statistics`)
  }

  getOfferStartReminders(id: number, params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}/start_reminder_requests`, { params })
  }

  getOfferQtyAvailabilityReminders(id: number, params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}/availability_reminder_requests`, { params })
  }

  /** **************** post ******************/
  createItem(data: any): AxiosPromise {
    return axios.post(`${this.contextPath}`, data)
  }

  createOfferNote(payload: OfferNoteModalPayload): AxiosPromise {
    return axios.post(`${this.contextPath}/${payload.offerId}/offer_notes`, payload.data)
  }

  /** **************** put ******************/
  editItem(data: any): AxiosPromise {
    return axios.put(`${this.contextPath}/${data.id}`, data)
  }

  editOfferNote(payload: any): AxiosPromise {
    return axios.put(
      `${this.contextPath}/${payload.offerId}/offer_notes/${payload.data.id}`,
      payload.data,
    )
  }

  acceptOffer(payload: OfferAcceptModalFormPayload): AxiosPromise {
    return axios.put(`${this.contextPath}/${payload.offerId}/accept`, payload.data)
  }

  rejectOffer(id: number): AxiosPromise {
    return axios.put(`${this.contextPath}/${id}/reject`)
  }

  cancelOffer(id: number): AxiosPromise {
    return axios.put(`${this.contextPath}/${id}/cancel`)
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }

  deleteOfferNote({ offerId, noteId }: { offerId: number; noteId: number }): AxiosPromise {
    return axios.delete(`${this.contextPath}/${offerId}/offer_notes/${noteId}`)
  }
}

export const offersService = new OffersService()
