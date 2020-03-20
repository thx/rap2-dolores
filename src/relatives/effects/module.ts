import {
  call,
  put,
  select
} from 'redux-saga/effects'
import { RootState } from 'actions/types'
import * as ModuleAction from '../../actions/module'
import * as InterfaceAction from '../../actions/interface'
import * as RepositoryAction from '../../actions/repository'
import EditorService from '../services/Editor'

export function* addModule(action: any) {
  try {
    const module = yield call(EditorService.addModule, action.module)
    yield put(ModuleAction.addModuleSucceeded(module))
    yield put(RepositoryAction.fetchRepository({
      id: action.module.repositoryId,
      repository: undefined,
    }))
    if (action.onResolved) { action.onResolved() }
  } catch (e) {
    console.error(e.message)
    yield put(ModuleAction.addModuleFailed(e.message))
    if (action.onRejected) { action.onRejected() }
  }
}
export function* updateModule(action: any) {
  try {
    const {
      id,
      name,
      description,
    } = action.module
    const payload = yield call(EditorService.updateModule, {
      id,
      name,
      description,
    })
    yield put(ModuleAction.updateModuleSucceeded({
      id,
      name: payload.name,
      description: payload.description,
    }))
    if (action.onResolved) { action.onResolved() }
  } catch (e) {
    console.error(e.message)
    yield put(ModuleAction.updateModuleFailed(e.message))
    if (action.onRejected) { action.onRejected() }
  }
}
export function* moveModule(action: any) {
  try {
    const params = action.params
    const currRepositoryId = yield select(
      (state: RootState) => state.repository && state.repository.data && state.repository.data.id,
    )
    yield call(EditorService.moveModule, params)
    yield put(InterfaceAction.moveInterfaceSucceeded())
    yield put(
      RepositoryAction.fetchRepository({
        id: currRepositoryId,
        repository: undefined,
      }),
    )
    action.onResolved && action.onResolved()
  } catch (e) {
    console.error(e.message)
    yield put(InterfaceAction.moveInterfaceFailed(e.message))
    action.onRejected && action.onRejected()
  }
}
export function* deleteModule(action: any) {
  try {
    const count = yield call(EditorService.deleteModule, action.id)
    yield put(ModuleAction.deleteModuleSucceeded(count))
    yield put(RepositoryAction.fetchRepository({
      id: action.repoId,
      repository: undefined,
    }))
    if (action.onResolved) { action.onResolved() }
  } catch (e) {
    console.error(e.message)
    yield put(ModuleAction.deleteModuleFailed(e.message))
  }
}

export function* sortModuleList(action: any) {
  try {
    const count = yield call(EditorService.sortModuleList, action.ids)
    yield put(ModuleAction.sortModuleListSucceeded(count, action.ids))
    if (action.onResolved) { action.onResolved() }
  } catch (e) {
    console.error(e.message)
    yield put(ModuleAction.sortModuleListFailed(e.message))
  }
}
