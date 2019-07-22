import { MSG_TYPE } from '../components/common/Message'

export const refresh = () => ({ type: 'REFRESH' })
export type SHOW_MESSAGE = 'shared/SHOW_MESSAGE'
export const SHOW_MESSAGE: SHOW_MESSAGE = 'shared/SHOW_MESSAGE'

export function showMessage(message: string, type?: MSG_TYPE): ShowMessageAction {
  let t: MSG_TYPE
  if (type === undefined) {
    t = MSG_TYPE.INFO
  } else {
    t = type
  }

  const result = {
    type: SHOW_MESSAGE,
    payload: {
      message,
      type: t,
    },
  }
  return result
}

export { MSG_TYPE } from 'components/common/Message'

export interface ShowMessageAction {
  type: SHOW_MESSAGE
  payload: {
    message: string
    type: MSG_TYPE
  }
}
