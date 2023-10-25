import type { AxiosPromise } from 'axios'
import axios from 'axios'

class ChatService {
  contextPath = 'chat'

  /** **************** get ******************/
  getChatUrl(): AxiosPromise {
    return axios.get(`${this.contextPath}/authenticate`)
  }
}

export const chatService = new ChatService()
