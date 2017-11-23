import { call, put } from 'redux-saga/effects'
import * as StatusAction from '../actions/analytics'
import * as AccountAction from '../actions/account'
import * as OrganizationAction from '../actions/organization'
import * as RepositoryAction from '../actions/repository'
import * as InterfaceAction from '../actions/interface'
import StatusService from './services/Status'

export default {
  reducers: {
    counter (state = {}, action) {
      switch (action.type) {
        case 'ANALYTICS_COUNTER_FETCH_SUCCEEDED':
          return action.counter || {}
        case 'ANALYTICS_COUNTER_FETCH_FAILED':
          return {}
        default:
          return state
      }
    },
    analyticsRepositoriesCreated (state = { data: [], fetching: false }, action) {
      switch (action.type) {
        case StatusAction.fetchAnalyticsRepositoriesCreated().type:
          return { data: [...state.data], fetching: true }
        case StatusAction.fetchAnalyticsRepositoriesCreatedSucceeded().type:
          return { data: [...action.analytics], fetching: false }
        case StatusAction.fetchAnalyticsRepositoriesCreatedFailed().type:
          return { data: [], fetching: false }
        default:
          return state
      }
    },
    analyticsRepositoriesUpdated (state = { data: [], fetching: false }, action) {
      switch (action.type) {
        case StatusAction.fetchAnalyticsRepositoriesUpdated().type:
          return { data: [...state.data], fetching: true }
        case StatusAction.fetchAnalyticsRepositoriesUpdatedSucceeded().type:
          return { data: [...action.analytics], fetching: false }
        case StatusAction.fetchAnalyticsRepositoriesUpdatedFailed().type:
          return { data: [], fetching: false }
        default:
          return state
      }
    },
    analyticsUsersActivation (state = { data: [], fetching: false }, action) {
      switch (action.type) {
        case StatusAction.fetchAnalyticsUsersActivation().type:
          return { data: [...state.data], fetching: true }
        case StatusAction.fetchAnalyticsUsersActivationSucceeded().type:
          return { data: [...action.analytics], fetching: false }
        case StatusAction.fetchAnalyticsUsersActivationFailed().type:
          return { data: [], fetching: false }
        default:
          return state
      }
    },
    analyticsRepositoriesActivation (state = { data: [], fetching: false }, action) {
      switch (action.type) {
        case StatusAction.fetchAnalyticsRepositoriesActivation().type:
          return { data: [...state.data], fetching: true }
        case StatusAction.fetchAnalyticsRepositoriesActivationSucceeded().type:
          return { data: [...action.analytics], fetching: false }
        case StatusAction.fetchAnalyticsRepositoriesActivationFailed().type:
          return { data: [], fetching: false }
        default:
          return state
      }
    }
  },
  sagas: {
    * ANALYTICS_COUNTER_FETCH (action) {
      try {
        const counter = yield call(StatusService.fetchCounter)
        yield put(StatusAction.fetchCounterSucceeded(counter))
      } catch (e) {
        yield put(StatusAction.fetchCounterFailed(e.message))
      }
    },
    * [StatusAction.fetchAnalyticsRepositoriesCreated().type] (action) {
      try {
        const analytics = yield call(StatusService.fetchRepositoriesCreated, action)
        yield put(StatusAction.fetchAnalyticsRepositoriesCreatedSucceeded(analytics))
      } catch (e) {
        yield put(StatusAction.fetchAnalyticsRepositoriesCreatedFailed(e.message))
      }
    },
    * [StatusAction.fetchAnalyticsRepositoriesUpdated().type] (action) {
      try {
        const analytics = yield call(StatusService.fetchRepositoriesUpdated, action)
        yield put(StatusAction.fetchAnalyticsRepositoriesUpdatedSucceeded(analytics))
      } catch (e) {
        yield put(StatusAction.fetchAnalyticsRepositoriesUpdatedFailed(e.message))
      }
    },
    * [StatusAction.fetchAnalyticsUsersActivation().type] (action) {
      try {
        const analytics = yield call(StatusService.fetchUsersActivation, action)
        yield put(StatusAction.fetchAnalyticsUsersActivationSucceeded(analytics))
      } catch (e) {
        yield put(StatusAction.fetchAnalyticsUsersActivationFailed(e.message))
      }
    },
    * [StatusAction.fetchAnalyticsRepositoriesActivation().type] (action) {
      try {
        const analytics = yield call(StatusService.fetchRepositoriesActivation, action)
        yield put(StatusAction.fetchAnalyticsRepositoriesActivationSucceeded(analytics))
      } catch (e) {
        yield put(StatusAction.fetchAnalyticsRepositoriesActivationFailed(e.message))
      }
    }
  },
  listeners: {
    '*': [StatusAction.fetchCounter],
    '/status': [
      StatusAction.fetchCounter,
      AccountAction.fetchUserCount,
      OrganizationAction.fetchOrganizationCount,
      RepositoryAction.fetchRepositoryCount,
      InterfaceAction.fetchInterfaceCount,
      StatusAction.fetchAnalyticsRepositoriesCreated,
      StatusAction.fetchAnalyticsRepositoriesUpdated,
      StatusAction.fetchAnalyticsUsersActivation,
      StatusAction.fetchAnalyticsRepositoriesActivation
    ]
  }
}
