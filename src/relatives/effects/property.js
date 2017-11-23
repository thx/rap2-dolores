import { call, put } from 'redux-saga/effects'
import * as PropertyAction from '../../actions/property'
import EditorService from '../services/Editor'

export function * addProperty (action) {
  try {
    const property = yield call(EditorService.addProperty, action.property)
    yield put(PropertyAction.addPropertySucceeded(property))
    if (action.onResolved) action.onResolved()
  } catch (e) {
    console.error(e.message)
    yield put(PropertyAction.addPropertyFailed(e.message))
    if (action.onRejected) action.onRejected()
  }
}
export function * deleteProperty (action) {
  try {
    const count = yield call(EditorService.deleteProperty, action.id)
    yield put(PropertyAction.deletePropertySucceeded(count))
    if (action.onResolved) action.onResolved()
  } catch (e) {
    console.error(e.message)
    yield put(PropertyAction.deletePropertyFailed(e.message))
  }
}
export function * updateProperty (action) {
  try {
    const property = yield call(EditorService.updateProperty, action.property)
    yield put(PropertyAction.updatePropertySucceeded(property))
    if (action.onResolved) action.onResolved()
  } catch (e) {
    console.error(e.message)
    yield put(PropertyAction.updatePropertyFailed(e.message))
    if (action.onRejected) action.onRejected()
  }
}
export function * updateProperties (action) {
  try {
    const properties = yield call(EditorService.updateProperties, action.itf, action.properties)
    yield put(PropertyAction.updatePropertiesSucceeded(properties))
    if (action.onResolved) action.onResolved()
  } catch (e) {
    console.error(e.message)
    yield put(PropertyAction.updatePropertiesFailed(e.message))
    if (action.onRejected) action.onRejected()
  }
}
export function * sortPropertyList (action) {
  try {
    const count = yield call(EditorService.sortPropertyList, action.ids)
    yield put(PropertyAction.sortPropertyListSucceeded(count))
    if (action.onResolved) action.onResolved()
  } catch (e) {
    console.error(e.message)
    yield put(PropertyAction.sortPropertyListFailed(e.message))
  }
}
