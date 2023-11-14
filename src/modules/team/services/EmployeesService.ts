import type { AxiosPromise } from 'axios'
import axios from 'axios'
import type { EmployeeFormProps } from './../interfaces/Employee'

class EmployeesService {
  contextPath = 'admins'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  getSingleItem(id: any): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}`)
  }

  getUniqueCode(): AxiosPromise {
    return axios.get(`${this.contextPath}/generate_unique_code`)
  }

  /** **************** post ******************/
  createItem(data: EmployeeFormProps): AxiosPromise {
    return axios.post(`${this.contextPath}`, data)
  }

  /** **************** put ******************/
  editItem(data: EmployeeFormProps): AxiosPromise {
    return axios.put(`${this.contextPath}/${data.id}`, data)
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }
}

export const employeesService = new EmployeesService()
