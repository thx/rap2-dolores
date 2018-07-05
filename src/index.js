import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/index.css'
import 'animate.css'

import React from 'react'
import Family, { render } from './family'
import { call, put } from 'redux-saga/effects'
import Routes from './routes'
import AccountRelative from './relatives/AccountRelative'
import HomeRelative from './relatives/HomeRelative'
import StatusRelative from './relatives/StatusRelative'
import OrganizationRelative from './relatives/OrganizationRelative'
import RepositoryRelative from './relatives/RepositoryRelative'
import EditorRelative from './relatives/EditorRelative'

import Spin from './components/utils/Spin'
import * as AccountAction from './actions/account'
import AccountService from './relatives/services/Account'

// 渲染整站开屏动画
function renderOpeningScreenAdvertising () {
  render(
    <div className='OpeningScreenAdvertising'><Spin /></div>,
    document.getElementById('root')
  )
}

function * authorize () {
  let auth = yield call(AccountService.fetchLoginInfo)
  if (auth) {
    yield put(AccountAction.fetchLoginInfoSucceeded(auth))
  }
}

document.addEventListener('DOMContentLoaded', () => {
  Family
    .setRoutes(Routes)
    .addRelative(AccountRelative)
    .addRelative(HomeRelative)
    .addRelative(StatusRelative)
    .addRelative(OrganizationRelative)
    .addRelative(RepositoryRelative)
    .addRelative(EditorRelative)
    .addPrefilter(renderOpeningScreenAdvertising)
    .addPrefilter(authorize)
    .start(document.getElementById('root'))
})
