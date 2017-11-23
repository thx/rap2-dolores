import { call, put } from 'redux-saga/effects'
import * as InterfaceAction from '../../actions/interface'
import EditorService from '../services/Editor'

export function * addInterface (action) {
  try {
    const itf = yield call(EditorService.addInterface, action.interface)
    yield put(InterfaceAction.addInterfaceSucceeded(itf))
    if (action.onResolved) action.onResolved()
  } catch (e) {
    console.error(e.message)
    yield put(InterfaceAction.addInterfaceFailed(e.message))
    if (action.onRejected) action.onRejected()
  }
}
export function * updateInterface (action) {
  try {
    const itf = yield call(EditorService.updateInterface, action.interface)
    yield put(InterfaceAction.updateInterfaceSucceeded(itf))
    if (action.onResolved) action.onResolved()
  } catch (e) {
    console.error(e.message)
    yield put(InterfaceAction.updateInterfaceFailed(e.message))
    if (action.onRejected) action.onRejected()
  }
}
export function * deleteInterface (action) {
  try {
    const count = yield call(EditorService.deleteInterface, action.id)
    yield put(InterfaceAction.deleteInterfaceSucceeded(count))
    if (action.onResolved) action.onResolved()
  } catch (e) {
    console.error(e.message)
    yield put(InterfaceAction.deleteInterfaceFailed(e.message))
  }
}
export function * fetchInterfaceCount (action) {
  try {
    const count = yield call(EditorService.fetchInterfaceCount)
    yield put(InterfaceAction.fetchInterfaceCountSucceeded(count))
  } catch (e) {
    console.error(e.message)
    yield put(InterfaceAction.fetchInterfaceCountFailed(e.message))
  }
}
export function * lockInterface (action) {
  try {
    const count = yield call(EditorService.lockInterface, action.id)
    yield put(InterfaceAction.lockInterfaceSucceeded(count))
    if (action.onResolved) action.onResolved()
  } catch (e) {
    console.error(e.message)
    yield put(InterfaceAction.lockInterfaceFailed(e.message))
  }
}
export function * unlockInterface (action) {
  try {
    const count = yield call(EditorService.unlockInterface, action.id)
    yield put(InterfaceAction.unlockInterfaceSucceeded(count))
    if (action.onResolved) action.onResolved()
  } catch (e) {
    console.error(e.message)
    yield put(InterfaceAction.unlockInterfaceFailed(e.message))
  }
}
export function * sortInterfaceList (action) {
  try {
    const count = yield call(EditorService.sortInterfaceList, action.ids)
    yield put(InterfaceAction.sortInterfaceListSucceeded(count))
    if (action.onResolved) action.onResolved()
  } catch (e) {
    console.error(e.message)
    yield put(InterfaceAction.sortInterfaceListFailed(e.message))
  }
}
