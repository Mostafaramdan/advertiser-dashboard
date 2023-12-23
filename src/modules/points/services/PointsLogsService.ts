import type { AxiosPromise } from 'axios'
import axios from 'axios'

class PointsLogsService {
  contextPath = 'points_logs'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }
}

export const pointsLogsService = new PointsLogsService()
