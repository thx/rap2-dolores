import { call, put } from 'redux-saga/effects'
import * as RepositoryAction from '../../actions/repository'
import RepositoryService from '../services/Repository'

//
export function * fetchRepositoryCount (action) {
  try {
    const count = yield call(RepositoryService.fetchRepositoryCount, action)
    yield put(RepositoryAction.fetchRepositoryCountSucceeded(count))
  } catch (e) {
    console.error(e.message)
    yield put(RepositoryAction.fetchRepositoryCountFailed(e.message))
  }
}
export function * fetchRepositoryList (action) {
  try {
    const repositories = yield call(RepositoryService.fetchRepositoryList, action)
    yield put(RepositoryAction.fetchRepositoryListSucceeded(repositories))
  } catch (e) {
    console.error(e.message)
    yield put(RepositoryAction.fetchRepositoryListFailed(e.message))
  }
}
export function * addRepository (action) {
  try {
    const repository = yield call(RepositoryService.addRepository, action.repository)
    yield put(RepositoryAction.addRepositorySucceeded(repository))
    if (action.onResolved) action.onResolved()
  } catch (e) {
    console.error(e.message)
    yield put(RepositoryAction.addRepositoryFailed(e.message))
  }
}
export function * deleteRepository (action) {
  try {
    const count = yield call(RepositoryService.deleteRepository, action.id)
    yield put(RepositoryAction.deleteRepositorySucceeded(count))
    if (action.onResolved) action.onResolved()
  } catch (e) {
    console.error(e.message)
    yield put(RepositoryAction.deleteRepositoryFailed(e.message))
  }
}
export function * updateRepository (action) {
  try {
    let r = action.repository
    let acceptedKeys = ['creatorId', 'organizationId', 'memberIds', 'id', 'collaboratorIds', 'description', 'ownerId', 'visibility', 'name']
    let params = {}
    acceptedKeys.forEach(x => {
      params[x] = r[x]
    })
    const repository = yield call(RepositoryService.updateRepository, params)
    yield put(RepositoryAction.updateRepositorySucceeded(repository))
    if (action.onResolved) action.onResolved()
  } catch (e) {
    console.error(e.message)
    yield put(RepositoryAction.updateRepositoryFailed(e.message))
  }
}

export function * importRepository (action) {
  try {
    const res = yield call(RepositoryService.importRepository, action.data)
    if (res.isOk) {
      yield put(RepositoryAction.importRepositorySucceeded(res.data))
      if (action.onResolved) action.onResolved(res)
    } else {
      throw new Error(res.message)
    }
  } catch (e) {
    console.error(e.message)
    yield put(RepositoryAction.importRepositoryFailed(e.message))
  }
}

export function * fetchRepository (action) {
  try {
    const count = yield call(RepositoryService.fetchRepository, action.repository || action.id)
    yield put(RepositoryAction.fetchRepositorySucceeded(count))
  } catch (e) {
    console.error(e.message)
    yield put(RepositoryAction.fetchRepositoryFailed(e.message))
  }
}

export function * fetchOwnedRepositoryList (action) {
  try {
    const repositories = yield call(RepositoryService.fetchOwnedRepositoryList, action)
    yield put(RepositoryAction.fetchOwnedRepositoryListSucceeded(repositories))
  } catch (e) {
    console.error(e.message)
    yield put(RepositoryAction.fetchOwnedRepositoryListFailed(e.message))
  }
}

export function * fetchJoinedRepositoryList (action) {
  try {
    const repositories = yield call(RepositoryService.fetchJoinedRepositoryList, action)
    yield put(RepositoryAction.fetchJoinedRepositoryListSucceeded(repositories))
  } catch (e) {
    console.error(e.message)
    yield put(RepositoryAction.fetchJoinedRepositoryListFailed(e.message))
  }
}
