import Family from './Family'
import Bundle from './Bundle'
export default Family
export { Bundle }

export const PropTypes = require('prop-types')
export { render, findDOMNode } from 'react-dom' // ReactDOM
export { connect, createStore, applyMiddleware, combineReducers, Provider } from 'react-redux'
export { BrowserRouter, HashRouter, NavLink, Link, Redirect, Router, Route, Switch } from 'react-router-dom'
export { push, replace, go, goBack, goForward } from 'react-router-redux'
export { call, put, take, takeLatest } from 'redux-saga/effects'
export { delay } from 'redux-saga'
export const _ = require('lodash')
export const URI = require('urijs')
export const StoreStateRouterLocationURI = (store) => {
  let { pathname, search, hash } = store.getState().router.location
  return URI(pathname + search + hash)
}
export const Mock = require('mockjs')
export const moment = require('moment')
require('moment/locale/zh-cn')
moment.locale('zh-cn')
