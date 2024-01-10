import type { AxiosPromise } from 'axios'
import axios from 'axios'

class ProductsService {
  contextPath = 'products'

  /** **************** get ******************/

  /** **************** post ******************/

  /** **************** put ******************/
  post(id: number, data: any): AxiosPromise {
    return axios.put(`${this.contextPath}/${id}/post`, data)
  }

  /** **************** delete ******************/
}

export const productsService = new ProductsService()
