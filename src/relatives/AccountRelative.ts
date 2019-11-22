import { call, put, select } from 'redux-saga/effects'
import * as AccountAction from '../actions/account'
import * as CommonAction from '../actions/common'
import AccountService from './services/Account'
import { StoreStateRouterLocationURI, replace, push } from '../family'
import { RootState } from '../actions/types'
import { showMessage, MSG_TYPE } from 'actions/common'

const relatives = {
  reducers: {
    loading(state: boolean = false, action: any) {
      switch (action.type) {
        case 'INTERFACE_LOCK':
        case 'INTERFACE_UNLOCK':
        case 'REPOSITORY_UPDATE':
        case 'PROPERTIES_UPDATE':
          return true
        case 'INTERFACE_LOCK_SUCCEEDED':
        case 'INTERFACE_LOCK_FAILED':
        case 'INTERFACE_UNLOCK_SUCCEEDED':
        case 'INTERFACE_UNLOCK_FAILED':
        case 'REPOSITORY_UPDATE_SUCCEEDED':
        case 'REPOSITORY_UPDATE_FAILED':
        case 'PROPERTIES_UPDATE_SUCCEEDED':
        case 'PROPERTIES_UPDATE_FAILED':
          return false
      }
      return state
    },
    auth(state: any = {}, action: any) {
      switch (action.type) {
        case AccountAction.loginSucceeded({}).type:
        case AccountAction.fetchLoginInfoSucceeded({}).type:
          return action.user && action.user.id ? action.user : {}
        case AccountAction.loginFailed('').type:
        case AccountAction.logoutSucceeded().type:
        case AccountAction.logoutFailed().type:
        case AccountAction.fetchLoginInfoFailed('').type:
          return {}
        default:
          return state
      }
    },
    user(state: any = {}, action: any) {
      switch (action.type) {
        case AccountAction.loginSucceeded({}).type:
        case AccountAction.fetchLoginInfoSucceeded({}).type:
          return action.user && action.user.id ? action.user : {}
        case AccountAction.loginFailed('').type:
        case AccountAction.logoutSucceeded().type:
        case AccountAction.logoutFailed().type:
        case AccountAction.fetchLoginInfoFailed('').type:
          return {}
        default:
          return state
      }
    },
    users(
      state: any = {
        data: [],
        pagination: { total: 0, limit: 100, cursor: 1 },
      },
      action: any
    ) {
      switch (action.type) {
        case '...':
          return state
        case AccountAction.addUserSucceeded({}).type:
          return {
            data: [...state.data, action.user],
            pagination: state.pagination,
          }
        case AccountAction.fetchUserCountSucceeded(0).type:
          return {
            data: [...state.data],
            pagination: { ...state.pagination, total: action.count },
          }
        case AccountAction.fetchUserListSucceeded([]).type:
          return action.users
        default:
          return state
      }
    },
  },
  sagas: {
    *[CommonAction.refresh().type]() {
      const router = yield select((state: RootState) => state.router)
      const uri = StoreStateRouterLocationURI(router)
      yield put(replace(uri.href()))
    },
    *[AccountAction.fetchLoginInfo().type]() {
      try {
        const user = yield call(AccountService.fetchLoginInfo)
        if (user.id) {
          yield put(AccountAction.fetchLoginInfoSucceeded(user))
        }
      } catch (e) {
        yield put(AccountAction.fetchLoginInfoFailed(e.message))
      }
    },
    *[AccountAction.addUser(null, null).type](action: any) {
      try {
        const user = yield call(AccountService.addUser, action.user)
        let isOk = false
        if (user && user.id) {
          isOk = true
          yield put(AccountAction.addUserSucceeded(user))
          try {
            const user = yield call(AccountService.fetchLoginInfo)
            if (user.id) {
              yield put(AccountAction.fetchLoginInfoSucceeded(user))
            }
          } catch (e) {
            yield put(AccountAction.fetchLoginInfoFailed(e.message))
          }
          yield put(push('/'))
        } else {
          yield put(showMessage(`注册失败：${user.errMsg}`, MSG_TYPE.ERROR))
          yield put(AccountAction.addUserFailed('注册失败'))
        }
        if (action.onResolved) {
          action.onResolved(isOk)
        }
      } catch (e) {
        yield put(AccountAction.addUserFailed(e.message))
      }
    },
    *[AccountAction.login({}, () => {
      /** empty */
    }).type](action: any) {
      try {
        const user = yield call(AccountService.login, action.user)
        if (user.errMsg) {
          throw new Error(user.errMsg)
        }
        if (user) {
          yield put(AccountAction.loginSucceeded(user))
          // yield put(AccountAction.fetchLoginInfo()) // 注意：更好的方式是在 rootSaga 中控制跳转，而不是在这里重再次请求。
          if (action.onResolved) {
            action.onResolved()
          }
        } else {
          yield put(AccountAction.loginFailed(undefined))
        }
      } catch (e) {
        yield put(showMessage(e.message, MSG_TYPE.WARNING))
        yield put(AccountAction.loginFailed(e.message))
      }
    },
    *[AccountAction.logout().type]() {
      try {
        yield call(AccountService.logout)
        yield put(AccountAction.logoutSucceeded())
        yield put(push('/account/login'))
      } catch (e) {
        yield put(AccountAction.logoutFailed())
      }
    },
    *[AccountAction.deleteUser({}).type](action: any) {
      try {
        const count = yield call(AccountService.deleteUser, action.id)
        yield put(AccountAction.deleteUserSucceeded(count))
      } catch (e) {
        yield put(AccountAction.deleteUserFailed(e.message))
      }
    },
    *[AccountAction.fetchUserCount().type](action: any) {
      try {
        const count = yield call(AccountService.fetchUserCount as any, action)
        yield put(AccountAction.fetchUserCountSucceeded(count))
      } catch (e) {
        yield put(AccountAction.fetchUserCountFailed(e.message))
      }
    },
    *[AccountAction.fetchUserList().type](action: any) {
      try {
        const users = yield call(AccountService.fetchUserList, action)
        yield put(AccountAction.fetchUserListSucceeded(users))
      } catch (e) {
        yield put(AccountAction.fetchUserListFailed(e.message))
      }
    },
  },
  listeners: {
    '/account': [AccountAction.fetchUserList],
  },
}

export default relatives
