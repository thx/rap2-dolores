import { call, put } from 'redux-saga/effects'
import * as ModuleAction from '../../actions/module'
import EditorService from '../services/Editor'

export function * addModule (action) {
  try {
    const module = yield call(EditorService.addModule, action.module)
    yield put(ModuleAction.addModuleSucceeded(module))
    if (action.onResolved) action.onResolved()
  } catch (e) {
    console.error(e.message)
    yield put(ModuleAction.addModuleFailed(e.message))
    if (action.onRejected) action.onRejected()
  }
}
export function * updateModule (action) {
  try {
    const module = yield call(EditorService.updateModule, action.module)
    yield put(ModuleAction.updateModuleSucceeded(module))
    if (action.onResolved) action.onResolved()
  } catch (e) {
    console.error(e.message)
    yield put(ModuleAction.updateModuleFailed(e.message))
    if (action.onRejected) action.onRejected()
  }
}
export function * deleteModule (action) {
  try {
    const count = yield call(EditorService.deleteModule, action.id)
    yield put(ModuleAction.deleteModuleSucceeded(count))
    if (action.onResolved) action.onResolved()
  } catch (e) {
    console.error(e.message)
    yield put(ModuleAction.deleteModuleFailed(e.message))
  }
}

export function * sortModuleList (action) {
  try {
    const count = yield call(EditorService.sortModuleList, action.ids)
    yield put(ModuleAction.sortModuleListSucceeded(count))
    if (action.onResolved) action.onResolved()
  } catch (e) {
    console.error(e.message)
    yield put(ModuleAction.sortModuleListFailed(e.message))
  }
}
