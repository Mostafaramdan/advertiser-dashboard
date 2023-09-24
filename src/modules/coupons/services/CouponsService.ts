import type { AxiosPromise } from 'axios'
import axios from 'axios'
import type { AdvertiserCouponFormProps } from '../interfaces/AdvertiserCoupon'
import type { PlatformCoupon } from './../interfaces/PlatformCoupon'
import type { UserCoupon } from './../interfaces/UsersCoupon'

class CouponsService {
  contextPath = 'coupons'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  /** **************** post ******************/
  createItem(data: PlatformCoupon | AdvertiserCouponFormProps | UserCoupon): AxiosPromise {
    return axios.post(`${this.contextPath}`, data)
  }

  /** **************** put ******************/
  editItem(data: PlatformCoupon | AdvertiserCouponFormProps | UserCoupon): AxiosPromise {
    return axios.put(`${this.contextPath}/${data.id}`, data)
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }
}

export const couponsService = new CouponsService()
