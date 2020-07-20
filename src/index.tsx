import './assets/index.css'
import 'animate.css'

import React from 'react'
import Family, { render } from './family'
import { call, put } from 'redux-saga/effects'
import AccountRelative from './relatives/AccountRelative'
import HomeRelative from './relatives/HomeRelative'
import StatusRelative from './relatives/StatusRelative'
import OrganizationRelative from './relatives/OrganizationRelative'
import RepositoryRelative from './relatives/RepositoryRelative'
import EditorRelative from './relatives/EditorRelative'

import Spin from './components/utils/Spin'
import * as AccountAction from './actions/account'
import AccountService from './relatives/services/Account'
import { CACHE_KEY } from 'utils/consts'
import { AnyAction } from 'redux'

if (process.env.NODE_ENV !== 'production') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render/dist/no-classes-transpile/umd/whyDidYouRender.min.js')
  whyDidYouRender(React)
}
// 渲染整站开屏动画
function* renderOpeningScreenAdvertising() {
  yield new Promise((resolve) => {
    render(
      (
        <div className="OpeningScreenAdvertising">
          <Spin />
        </div>
      ),
      document.getElementById('root'),
      () => {
        resolve()
      }
    )
  })
}

// 获取用户登陆信息 或者 等待用户登陆成功
function* authenticate() {
  const auth = yield call(AccountService.fetchLoginInfo)
  if (auth) {
    yield put(AccountAction.fetchLoginInfoSucceeded(auth))
    yield put(AccountAction.fetchUserSettings([CACHE_KEY.THEME_ID]) as AnyAction)
  } else {
    const { pathname, search, hash } = window.location
    // const uri = URI(pathname + search + hash)
    if (pathname.indexOf('/account/login') > -1 || pathname.indexOf('/account/resetpwd') > -1 ) {
      yield Promise.resolve()
      return
    }
    const hasOriginal = pathname !== '/'
    window.location.href = `/account/login${hasOriginal ? `?original=${encodeURIComponent(pathname + search + hash)}` : ''}`
    yield Promise.reject()
  }
}

document.addEventListener('DOMContentLoaded', () => {
  Family
    .addRelative(AccountRelative)
    .addRelative(HomeRelative)
    .addRelative(StatusRelative)
    .addRelative(OrganizationRelative)
    .addRelative(RepositoryRelative)
    .addRelative(EditorRelative)
    .addPrefilter(renderOpeningScreenAdvertising)
    .addPrefilter(authenticate)
    .start(document.getElementById('root'))
})
