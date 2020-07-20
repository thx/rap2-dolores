import { ApiError, IRSAA } from 'redux-api-middleware'

export interface CommonFetchFailureAction {
  payload: ApiError
  error: true
}

const RSAA_BASE: Partial<IRSAA> = {
  credentials: 'include',
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
}

export const mergeRSAABase = (options: Partial<IRSAA>) => {
  return {
    ...RSAA_BASE,
    ...options,
  } as IRSAA
}
