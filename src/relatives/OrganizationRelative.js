import * as OrganizationAction from '../actions/organization'
import * as OrganizationEffects from './effects/organization'

export default {
  reducers: {
    organization (state = {}, action) {
      switch (action.type) {
        case 'ORGANIZATION_FETCH_SUCCEEDED':
          return action.organization || {}
        case 'ORGANIZATION_FETCH_FAILED':
          return {}
        default:
          return state
      }
    },
    organizations (state = { data: [], pagination: { total: 0, limit: 10 }, fetching: false }, action) {
      switch (action.type) {
        case 'ORGANIZATION_ADD_SUCCEEDED':
          return { data: [...state.data, action.organization], pagination: state.pagination }
        case 'ORGANIZATION_COUNT_FETCH_SUCCEEDED':
          return { data: [...state.data], pagination: {...state.pagination, total: action.count} }
        case OrganizationAction.fetchOrganizationList().type:
          return {
            data: { ...state.data },
            pagination: { ...state.pagination },
            fetching: true
          }
        case OrganizationAction.fetchOrganizationListSucceeded().type:
          return {
            data: action.organizations.data,
            pagination: action.organizations.pagination,
            fetching: false
          }
        case OrganizationAction.fetchOrganizationListFailed().type:
          return {
            data: [],
            pagination: { ...state.pagination, total: 0 },
            fetching: false
          }
        default:
          return state
      }
    },
    ownedOrganizations (state = { data: [], pagination: { total: 0, limit: 10 }, fetching: false }, action) {
      switch (action.type) {
        case OrganizationAction.fetchOwnedOrganizationList().type:
          return {
            data: [...state.data],
            pagination: { ...state.pagination },
            fetching: true
          }
        case OrganizationAction.fetchOwnedOrganizationListSucceeded().type:
          return {
            data: action.organizations.data,
            pagination: action.organizations.pagination,
            fetching: false
          }
        case OrganizationAction.fetchOwnedOrganizationListFailed().type:
          return {
            data: [],
            pagination: { ...state.pagination, total: 0 },
            fetching: false
          }
        default:
          return state
      }
    },
    joinedOrganizations (state = { data: [], pagination: { total: 0, limit: 10 }, fetching: false }, action) {
      switch (action.type) {
        case OrganizationAction.fetchJoinedOrganizationList().type:
          return {
            data: [...state.data],
            pagination: { ...state.pagination },
            fetching: true
          }
        case OrganizationAction.fetchJoinedOrganizationListSucceeded().type:
          return {
            data: action.organizations.data,
            pagination: action.organizations.pagination,
            fetching: false
          }
        case OrganizationAction.fetchJoinedOrganizationListFailed().type:
          return {
            data: [],
            pagination: { ...state.pagination, total: 0 },
            fetching: false
          }
        default:
          return state
      }
    }
  },
  sagas: {
    [OrganizationAction.addOrganization().type]: OrganizationEffects.addOrganization,
    [OrganizationAction.deleteOrganization().type]: OrganizationEffects.deleteOrganization,
    [OrganizationAction.updateOrganization().type]: OrganizationEffects.updateOrganization,
    [OrganizationAction.fetchOrganization().type]: OrganizationEffects.fetchOrganization,
    [OrganizationAction.fetchOrganizationCount().type]: OrganizationEffects.fetchOrganizationCount,
    [OrganizationAction.fetchOrganizationList().type]: OrganizationEffects.fetchOrganizationList,
    [OrganizationAction.fetchOwnedOrganizationList().type]: OrganizationEffects.fetchOwnedOrganizationList,
    [OrganizationAction.fetchJoinedOrganizationList().type]: OrganizationEffects.fetchJoinedOrganizationList
  },
  listeners: {
    '/organization': [OrganizationAction.fetchOwnedOrganizationList, OrganizationAction.fetchJoinedOrganizationList],
    '/organization/joined': [OrganizationAction.fetchOwnedOrganizationList, OrganizationAction.fetchJoinedOrganizationList],
    '/organization/all': [OrganizationAction.fetchOrganizationList],
    '/organization/repository': [OrganizationAction.fetchOrganization]
  }
}
