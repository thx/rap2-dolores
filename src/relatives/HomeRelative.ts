import { call, put } from 'redux-saga/effects'
import * as AccountAction from '../actions/account'
import * as RepositoryAction from '../actions/repository'
import AccountService from './services/Account'

export default {
  reducers: {
    logs(state: any = { data: [], pagination: { total: 0, limit: 100 }, fetching: false }, action: any) {
      switch (action.type) {
        case AccountAction.fetchLogList().type:
          return {
            data: { ...state.data },
            pagination: { ...state.pagination },
            fetching: true,
          }
        case AccountAction.fetchLogListSucceeded([]).type:
          return {
            data: action.logs.data,
            pagination: action.logs.pagination,
            fetching: false,
          }
        case AccountAction.fetchLogListFailed('').type:
          return {
            data: [],
            pagination: { ...state.pagination, total: 0 },
            fetching: false,
          }
        default:
          return state
      }
    },
  },
  sagas: {
    * [AccountAction.fetchLogList().type](action: any) {
      try {
        const logs = yield call(AccountService.fetchLogList, action)
        yield put(AccountAction.fetchLogListSucceeded(logs))
      } catch (e) {
        yield put(AccountAction.fetchLogListFailed(e.message))
      }
    },
  },
  listeners: {
    '/': [RepositoryAction.fetchOwnedRepositoryList, RepositoryAction.fetchJoinedRepositoryList, AccountAction.fetchLogList],
  },
}
