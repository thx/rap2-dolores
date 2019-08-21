import { call, put, select } from 'redux-saga/effects'
import * as RepositoryAction from '../../actions/repository'
import RepositoryService from '../services/Repository'
import { RootState } from 'actions/types'

//
export function* fetchRepositoryCount(action: any) {
  try {
    const count = yield call(RepositoryService.fetchRepositoryCount, action)
    yield put(RepositoryAction.fetchRepositoryCountSucceeded(count))
  } catch (e) {
    yield put(RepositoryAction.fetchRepositoryCountFailed(e.message))
  }
}
export function* fetchRepositoryList(action: any) {
  try {
    const repositories = yield call(RepositoryService.fetchRepositoryList, action)
    yield put(RepositoryAction.fetchRepositoryListSucceeded(repositories))
  } catch (e) {
    yield put(RepositoryAction.fetchRepositoryListFailed(e.message))
  }
}
export function* addRepository(action: any) {
  try {
    const repository = yield call(RepositoryService.addRepository, action.repository)
    yield put(RepositoryAction.addRepositorySucceeded(repository))
    if (action.onResolved) { action.onResolved() }
  } catch (e) {
    yield put(RepositoryAction.addRepositoryFailed(e.message))
  }
}
export function* deleteRepository(action: any) {
  try {
    const count = yield call(RepositoryService.deleteRepository, action.id)
    yield put(RepositoryAction.deleteRepositorySucceeded(count))
    if (action.onResolved) { action.onResolved() }
  } catch (e) {
    yield put(RepositoryAction.deleteRepositoryFailed(e.message))
  }
}
export function* updateRepository(action: any) {
  try {
    const r = action.repository
    const acceptedKeys = ['creatorId', 'organizationId', 'memberIds', 'id', 'collaboratorIds', 'description', 'ownerId', 'visibility', 'name']
    const params: any = {}
    acceptedKeys.forEach(x => {
      params[x] = r[x]
    })
    yield call(RepositoryService.updateRepository, params)
    yield put(RepositoryAction.updateRepositorySucceeded(params))
    yield put(RepositoryAction.fetchRepository({id: params.id}))
    if (action.onResolved) { action.onResolved() }
  } catch (e) {
    yield put(RepositoryAction.updateRepositoryFailed(e.message))
  }
}

export function* importRepository(action: any) {
  try {
    const res = yield call(RepositoryService.importRepository, action.data)
    if (res.isOk) {
      yield put(RepositoryAction.importRepositorySucceeded())
      if (action.onResolved) { action.onResolved(res) }
    } else {
      throw new Error(res.message)
    }
  } catch (e) {
    yield put(RepositoryAction.importRepositoryFailed(e.message))
  }
}

export function* fetchRepository(action: any) {
  try {
    const count = yield call(RepositoryService.fetchRepository, action.repository || action.id)
    yield put(RepositoryAction.fetchRepositorySucceeded(count))
  } catch (e) {
    yield put(RepositoryAction.fetchRepositoryFailed(e.message))
  }
}

export function* handleRepositoryLocationChange(action: any) {
  const repositoryId = yield select((state: RootState) => state.repository && state.repository.data && state.repository.data.id)
  if (Number(action.id) !== repositoryId) {
    yield put(RepositoryAction.fetchRepository(action))
  }
}

export function* fetchOwnedRepositoryList(action: any) {
  try {
    const repositories = yield call(RepositoryService.fetchOwnedRepositoryList, action)
    yield put(RepositoryAction.fetchOwnedRepositoryListSucceeded(repositories))
  } catch (e) {
    yield put(RepositoryAction.fetchOwnedRepositoryListFailed(e.message))
  }
}

export function* fetchJoinedRepositoryList(action: any) {
  try {
    const repositories = yield call(RepositoryService.fetchJoinedRepositoryList, action)
    yield put(RepositoryAction.fetchJoinedRepositoryListSucceeded(repositories))
  } catch (e) {
    yield put(RepositoryAction.fetchJoinedRepositoryListFailed(e.message))
  }
}
