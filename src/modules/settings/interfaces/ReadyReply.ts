export interface ReadyReplyBase {
  reply: string
  types: string[]
  is_active: boolean
}

export interface ReadyReply extends ReadyReplyBase {
  id: number
  sort: number
}
