import { call, put } from 'redux-saga/effects'
import * as AccountAction from '../actions/account'
import AccountService from './services/Account'

export default {
  reducers: {
    auth (state = {}, action) {
      switch (action.type) {
        case AccountAction.loginSucceeded().type:
        case AccountAction.fetchLoginInfoSucceeded().type:
          return action.user && action.user.id ? action.user : {}
        case AccountAction.logoutSucceeded().type:
        case AccountAction.logoutFailed().type:
        case AccountAction.fetchLoginInfoFailed().type:
          return {}
        case AccountAction.loginFailed().type:
          return { message: action.message }
        default:
          return state
      }
    },
    user (state = {}, action) {
      switch (action.type) {
        default:
          return state
      }
    },
    users (state = { data: [], pagination: { total: 0, limit: 100, cursor: 1 } }, action) {
      switch (action.type) {
        case '...':
          return state
        case AccountAction.addUserSucceeded().type:
          return { data: [...state.data, action.user], pagination: state.pagination }
        case AccountAction.fetchUserCountSucceeded().type:
          return { data: [...state.data], pagination: {...state.pagination, total: action.count} }
        case AccountAction.fetchUserListSucceeded().type:
          return action.users
        default:
          return state
      }
    }
  },
  sagas: {
    * [AccountAction.fetchLoginInfo().type] (action) {
      try {
        const user = yield call(AccountService.fetchLoginInfo)
        if (user.id) {
          yield put(AccountAction.fetchLoginInfoSucceeded(user))
        }
      } catch (e) {
        yield put(AccountAction.fetchLoginInfoFailed(e.message))
      }
    },
    * [AccountAction.addUser().type] (action) {
      try {
        const user = yield call(AccountService.addUser, action.user)
        if (user && user.id) {
          yield put(AccountAction.addUserSucceeded(user))
          yield put(AccountAction.fetchLoginInfoSucceeded(user))
          if (action.onResolved) action.onResolved()
        } else if (user.isOk === false) {
          throw new Error(user.errMsg || 'Unknown error occurred')
        }
      } catch (e) {
        yield put(AccountAction.addUserFailed(e.message))
      }
    },
    * [AccountAction.updateUser().type] (action) {
      try {
        const result = yield call(AccountService.updateUser, action.user)
        if (result.isOk) {
          yield put(AccountAction.updateUserSucceeded(result))
          if (action.onResolved) action.onResolved()
        } else {
          throw new Error(result.errMsg || '更新失败')
        }
      } catch (e) {
        yield put(AccountAction.updateUserFailed(e.message))
      }
    },
    * [AccountAction.login().type] (action) {
      try {
        const user = yield call(AccountService.login, action.user)
        if (user && user.id) {
          yield put(AccountAction.loginSucceeded(user))
          if (action.onResolved) action.onResolved()
        } else if (user && user.errMsg) {
          yield put(AccountAction.loginFailed(user.errMsg))
        }
      } catch (e) {
        console.error(e.message)
        yield put(AccountAction.loginFailed(e.message))
      }
    },
    * [AccountAction.logout().type] (action) {
      try {
        const user = yield call(AccountService.logout, action.user)
        yield put(AccountAction.logoutSucceeded(user))
      } catch (e) {
        console.error(e.message)
        yield put(AccountAction.logoutFailed(e.message))
      }
    },
    * [AccountAction.deleteUser().type] (action) {
      try {
        const count = yield call(AccountService.deleteUser, action.id)
        yield put(AccountAction.deleteUserSucceeded(count))
      } catch (e) {
        console.error(e.message)
        yield put(AccountAction.deleteUserFailed(e.message))
      }
    },
    * [AccountAction.fetchUserCount().type] (action) {
      try {
        const count = yield call(AccountService.fetchUserCount, action)
        yield put(AccountAction.fetchUserCountSucceeded(count))
      } catch (e) {
        console.error(e.message)
        yield put(AccountAction.fetchUserCountFailed(e.message))
      }
    },
    * [AccountAction.fetchUserList().type] (action) {
      try {
        const users = yield call(AccountService.fetchUserList, action)
        yield put(AccountAction.fetchUserListSucceeded(users))
      } catch (e) {
        console.error(e.message)
        yield put(AccountAction.fetchUserListFailed(e.message))
      }
    }
  },
  listeners: {
    '/account': [AccountAction.fetchUserList],
    '/account/register': [AccountAction.fetchUserList]
  }
}
