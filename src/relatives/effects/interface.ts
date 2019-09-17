import {
  call,
  put
} from 'redux-saga/effects'
import * as InterfaceAction from '../../actions/interface'
import EditorService from '../services/Editor'
import * as RepositoryAction from '../../actions/repository'

export function* addInterface(action: any) {
  try {
    const payload = yield call(EditorService.addInterface, action.interface)
    yield put(InterfaceAction.addInterfaceSucceeded(payload))
    if (action.onResolved) { action.onResolved() }
  } catch (e) {
    console.error(e.message)
    yield put(InterfaceAction.addInterfaceFailed(e.message))
    if (action.onRejected) { action.onRejected() }
  }
}
export function* updateInterface(action: any) {
  try {
    const result = yield call(EditorService.updateInterface, action.interface)
    yield put(InterfaceAction.updateInterfaceSucceeded(result))
    if (action.onResolved) { action.onResolved() }
  } catch (e) {
    console.error(e.message)
    yield put(InterfaceAction.updateInterfaceFailed(e.message))
    if (action.onRejected) { action.onRejected() }
  }
}
export function* moveInterface(action: any) {
  try {
    const {
      repoId,
      ...params
    } = action.params
    yield call(EditorService.moveInterface, params)
    yield put(RepositoryAction.fetchRepository({
      id: repoId,
      repository: undefined,
    }))
    action.onResolved && action.onResolved()
  } catch (e) {
    console.error(e.message)
    yield put(InterfaceAction.moveInterfaceFailed(e.message))
    action.onRejected && action.onRejected()
  }
}
export function* deleteInterface(action: any) {
  try {
    yield call(EditorService.deleteInterface, action.id)
    yield put(InterfaceAction.deleteInterfaceSucceeded({
      id: action.id,
    }))
    if (action.onResolved) { action.onResolved() }
  } catch (e) {
    console.error(e.message)
    yield put(InterfaceAction.deleteInterfaceFailed(e.message))
  }
}
export function* fetchInterfaceCount() {
  try {
    const count = yield call(EditorService.fetchInterfaceCount)
    yield put(InterfaceAction.fetchInterfaceCountSucceeded(count))
  } catch (e) {
    console.error(e.message)
    yield put(InterfaceAction.fetchInterfaceCountFailed(e.message))
  }
}
export function* lockInterface(action: any) {
  try {
    const payload = yield call(EditorService.lockInterface, action.id)
    yield put(InterfaceAction.lockInterfaceSucceeded(action.id, payload))
    if (action.onResolved) { action.onResolved() }
  } catch (e) {
    console.error(e.message)
    yield put(InterfaceAction.lockInterfaceFailed(e.message))
  }
}
export function* unlockInterface(action: any) {
  try {
    const res = yield call(EditorService.unlockInterface, action.id)
    if (res.isOk) {
      yield put(InterfaceAction.unlockInterfaceSucceeded(action.id))
      if (action.onResolved) { action.onResolved() }
    } else {
      window.alert(`发生错误：${res.errMsg}`)
    }
  } catch (e) {
    console.error(e.message)
    yield put(InterfaceAction.unlockInterfaceFailed(e.message))
  }
}
export function* sortInterfaceList(action: any) {
  try {
    const count = yield call(EditorService.sortInterfaceList, action.ids)
    yield put(InterfaceAction.sortInterfaceListSucceeded(count, action.ids, action.moduleId))
    if (action.onResolved) { action.onResolved() }
  } catch (e) {
    console.error(e.message)
    yield put(InterfaceAction.sortInterfaceListFailed(e.message))
  }
}
