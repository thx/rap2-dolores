declare interface IConfig {
  serve: string
  keys: string[]
  session: {
    key: string
  }
}

declare interface IMessage {
  message: string
  type: MSG_TYPE
  timestamp: number
}

/** normal callback */
declare type TCB = (isOk: boolean, data?: any) => void


declare interface IPager {
  offset: number
  limit: number
  order?: TOrder
  orderBy?: string
  query?: string
}

declare interface IPagerList<T> {
  rows: T[]
  count: number
}