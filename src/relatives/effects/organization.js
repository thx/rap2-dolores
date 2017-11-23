import { call, put } from 'redux-saga/effects'
import * as Organization from '../../actions/organization'
import OrganizationService from '../services/Organization'

export function * fetchOrganizationCount (action) {
  try {
    const organizations = yield call(OrganizationService.fetchOrganizationCount, action)
    yield put(Organization.fetchOrganizationCountSucceeded(organizations))
  } catch (e) {
    console.error(e.message)
    yield put(Organization.fetchOrganizationCountFailed(e.message))
  }
}

export function * fetchOrganizationList (action) {
  try {
    const organizations = yield call(OrganizationService.fetchOrganizationList, action)
    yield put(Organization.fetchOrganizationListSucceeded(organizations))
  } catch (e) {
    console.error(e.message)
    yield put(Organization.fetchOrganizationListFailed(e.message))
  }
}

export function * fetchOwnedOrganizationList (action) {
  try {
    const organizations = yield call(OrganizationService.fetchOwnedOrganizationList, action)
    yield put(Organization.fetchOwnedOrganizationListSucceeded(organizations))
  } catch (e) {
    console.error(e.message)
    yield put(Organization.fetchOwnedOrganizationListFailed(e.message))
  }
}

export function * fetchJoinedOrganizationList (action) {
  try {
    const organizations = yield call(OrganizationService.fetchJoinedOrganizationList, action)
    yield put(Organization.fetchJoinedOrganizationListSucceeded(organizations))
  } catch (e) {
    console.error(e.message)
    yield put(Organization.fetchJoinedOrganizationListFailed(e.message))
  }
}

export function * fetchOrganization (action) {
  try {
    if (!action.organization && !action.id) return
    const organization = yield call(OrganizationService.fetchOrganization, action.organization || action.id)
    yield put(Organization.fetchOrganizationSucceeded(organization))
  } catch (e) {
    console.error(e.message)
    yield put(Organization.fetchOrganizationFailed(e.message))
  }
}

export function * addOrganization (action) {
  try {
    const organization = yield call(OrganizationService.addOrganization, action.organization)
    yield put(Organization.addOrganizationSucceeded(organization))
    if (action.onResolved) action.onResolved()
  } catch (e) {
    console.error(e.message)
    yield put(Organization.addOrganizationFailed(e.message))
    if (action.onRejected) action.onRejected()
  }
}

export function * deleteOrganization (action) {
  try {
    const count = yield call(OrganizationService.deleteOrganization, action.id)
    yield put(Organization.deleteOrganizationSucceeded(count))
    if (action.onResolved) action.onResolved()
  } catch (e) {
    console.error(e.message)
    yield put(Organization.deleteOrganizationFailed(e.message))
  }
}
export function * updateOrganization (action) {
  try {
    const organization = yield call(OrganizationService.updateOrganization, action.organization)
    yield put(Organization.updateOrganizationSucceeded(organization))
    if (action.onResolved) action.onResolved()
  } catch (e) {
    console.error(e.message)
    yield put(Organization.updateOrganizationFailed(e.message))
    if (action.onRejected) action.onRejected()
  }
}
