import React from 'react'
import { Bundle, Switch, Route } from './family'

import { NoMatch, Spin } from './components/utils'

import Header from './components/common/Header'
import Footer from './components/common/Footer'
import Home from './components/home/Home'

import LoginForm from './components/account/LoginForm'
import RegisterForm from './components/account/RegisterForm'

const UserList = (props: any) => (
  <Bundle load={(cb: any) => import('./components/account/UserList').then(comp => cb(comp))}>
    {(CustomComponent: any) => CustomComponent ? <CustomComponent {...props} /> : null}
  </Bundle>
)

const JoinedRepositoryList = (props: any) => (
  <Bundle load={(cb: any) => import('./components/repository/JoinedRepositoryList').then(comp => cb(comp))}>
    {(CustomComponent: any) => CustomComponent ? <CustomComponent {...props} /> : null}
  </Bundle>
)
const JoinedRepositoryListWithCreateForm = (props: any) => (
  <Bundle load={(cb: any) => import('./components/repository/JoinedRepositoryList').then(comp => cb(comp))}>
    {(CustomComponent: any) => CustomComponent ? <CustomComponent {...props} create={true} /> : null}
  </Bundle>
)
const AllRepositoryList = (props: any) => (
  <Bundle load={(cb: any) => import('./components/repository/AllRepositoryList').then(comp => cb(comp))}>
    {(CustomComponent: any) => CustomComponent ? <CustomComponent {...props} /> : null}
  </Bundle>
)
const RepositoryEditor = (props: any) => (
  <Bundle load={(cb: any) => import('./components/editor/RepositoryEditor').then(comp => cb(comp))}>
    {(CustomComponent: any) => CustomComponent ? <CustomComponent {...props} /> : null}
  </Bundle>
)
const RepositoryTester = (props: any) => (
  <Bundle load={(cb: any) => import('./components/tester/Tester').then(comp => cb(comp))}>
    {(CustomComponent: any) => CustomComponent ? <CustomComponent {...props} /> : null}
  </Bundle>
)
const RepositoryChecker = (props: any) => (
  <Bundle load={(cb: any) => import('./components/checker/Checker').then(comp => cb(comp))}>
    {(CustomComponent: any) => CustomComponent ? <CustomComponent {...props} /> : null}
  </Bundle>
)

const JoinedOrganizationList = (props: any) => (
  <Bundle load={(cb: any) => import('./components/organization/JoinedOrganizationList').then(comp => cb(comp))}>
    {(CustomComponent: any) => CustomComponent ? <CustomComponent {...props} /> : null}
  </Bundle>
)
const AllOrganizationList = (props: any) => (
  <Bundle load={(cb: any) => import('./components/organization/AllOrganizationList').then(comp => cb(comp))}>
    {(CustomComponent: any) => CustomComponent ? <CustomComponent {...props} /> : null}
  </Bundle>
)
const OrganizationRepositoryList = (props: any) => (
  <Bundle load={(cb: any) => import('./components/organization/OrganizationRepositoryList').then(comp => cb(comp))}>
    {(CustomComponent: any) => CustomComponent ? <CustomComponent {...props} /> : null}
  </Bundle>
)

const Status = (props: any) => (
  <Bundle load={(cb: any) => import('./components/status/Status').then(comp => cb(comp))}>
    {(CustomComponent: any) => CustomComponent ? <CustomComponent {...props} /> : null}
  </Bundle>
)

const API = (props: any) => (
  <Bundle load={(cb: any) => import('./components/api/API').then(comp => cb(comp))}>
    {(CustomComponent: any) => CustomComponent ? <CustomComponent {...props} /> : null}
  </Bundle>
)

// import Utils from './components/utils/Utils'
const Utils = (props: any) => (
  <Bundle load={(cb: any) => import('./components/utils/Utils').then(comp => cb(comp))}>
    {(CustomComponent: any) => CustomComponent ? <CustomComponent {...props} /> : null}
  </Bundle>
)

const Routes = ({ store }: any) => {
  const auth = store.getState().auth
  if (!auth) { return <Spin /> } // 渲染整站开屏动画，已经在 src/index 中实现。这里的代码用于支持没有接入 SSO 的情况。
  if (!auth.id) { // 引导用户登陆，已经在 src/index 中实现。这里的代码用于支持没有接入 SSO 的情况。
    return (
      <article>
        <Switch>
          <Route path="/account/register" component={RegisterForm} />
          <Route component={LoginForm} />
        </Switch>
      </article>
    )
  }
  return (
    <article className="Routes">
      <div className="btn-top" onClick={() => { console.log('hahaha'); window.scrollTo(0, 0) }}>
        回到顶部
      </div>
      <Route component={Header} />
      <div className="body">
        <Switch>
          <Route exact={true} path="/" component={Home} />
          <Route
            path="/repository"
            children={() => (
              <Switch>
                <Route exact={true} path="/repository" component={JoinedRepositoryList} />
                <Route exact={true} path="/repository/joined" component={JoinedRepositoryList} />
                <Route exact={true} path="/repository/joined/create" component={JoinedRepositoryListWithCreateForm} />
                <Route exact={true} path="/repository/all" component={AllRepositoryList} />
                <Route exact={true} path="/repository/editor" component={RepositoryEditor} />
                <Route exact={true} path="/repository/tester" component={RepositoryTester} />
                <Route exact={true} path="/repository/checker" component={RepositoryChecker} />
                <Route component={NoMatch} />
              </Switch>
            )}
          />
          <Route
            path="/organization"
            children={() => (
              <Switch>
                <Route exact={true} path="/organization" component={JoinedOrganizationList} />
                <Route exact={true} path="/organization/joined" component={JoinedOrganizationList} />
                <Route exact={true} path="/organization/all" component={AllOrganizationList} />
                <Route exact={true} path="/organization/repository" component={OrganizationRepositoryList} />
                <Route exact={true} path="/organization/repository/editor" component={RepositoryEditor} />
                <Route component={NoMatch} />
              </Switch>
            )}
          />
          <Route
            path="/status"
            children={() => (
              <Switch>
                <Route path="/status" component={Status} />
                <Route component={NoMatch} />
              </Switch>
            )}
          />
          <Route
            path="/account"
            children={() => (
              <Switch>
                <Route exact={true} path="/account" component={UserList} />
                <Route path="/account/users" component={UserList} />
                <Route path="/account/login" component={LoginForm} />
                <Route path="/account/register" component={RegisterForm} />
                <Route component={NoMatch} />
              </Switch>
            )}
          />
          <Route
            path="/utils"
            children={() => (
              <div className="container">
                <Route path="/utils" component={Utils} />
              </div>
            )}
          />
          <Route
            path="/api"
            children={() => (
              <Switch>
                <Route exact={true} path="/api" component={API} />
                <Route component={NoMatch} />
              </Switch>
            )}
          />
          <Route component={NoMatch} />
        </Switch>
      </div>
      <Footer />
      <div id="portal" />
    </article>
  )
}

export default Routes
