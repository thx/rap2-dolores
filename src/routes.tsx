import React, { lazy, Suspense } from 'react'

import { Switch, Route } from './family'

import { NoMatch, Spin } from './components/utils'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import Home from './components/home/Home'
import LoginForm from './components/account/LoginForm'
import RegisterForm from './components/account/RegisterForm'
import FindpwdForm from './components/account/FindpwdForm'
import ResetpwdForm from './components/account/ResetpwdForm'
import Message from 'components/common/Message'
import { useSelector } from 'react-redux'
import { RootState } from 'actions/types'
import MySettingsView from './components/account/MySettingsView'
import AboutView from './components/home/AboutView'
import MyAccountView from 'components/account/MyAccountView'

const UserList = lazy(() => import(/* webpackChunkName: "./components/account/UserList" */ './components/account/UserList'))

const JoinedRepositoryList =
  lazy(() => import(/* webpackChunkName: "./components/repository/JoinedRepositoryList" */ './components/repository/JoinedRepositoryList'))

const JoinedRepositoryListWithCreateForm =
  lazy(() => import(/* webpackChunkName: "./components/repository/JoinedRepositoryList" */ './components/repository/JoinedRepositoryList'))

const AllRepositoryList =
  lazy(() => import(/* webpackChunkName: "./components/repository/AllRepositoryList" */ './components/repository/AllRepositoryList'))

const RepositoryEditor =
  lazy(() => import(/* webpackChunkName: "./components/repository/RepositoryEditor" */ './components/editor/RepositoryEditor'))

const RepositoryTester = lazy(() => import(/* webpackChunkName: "./components/tester/Tester" */ './components/tester/Tester'))

const RepositoryChecker = lazy(() => import(/* webpackChunkName: "./components/checker/Checker" */ './components/checker/Checker'))

const JoinedOrganizationList =
  lazy(() => import(/* webpackChunkName: "./components/organization/JoinedOrganizationList" */ './components/organization/JoinedOrganizationList'))

const AllOrganizationList =
  lazy(() => import(/* webpackChunkName: "./components/organization/AllOrganizationList" */ './components/organization/AllOrganizationList'))

const OrganizationRepositoryList =
  lazy(() =>
    import(/* webpackChunkName: "./components/organization/OrganizationRepositoryList" */ './components/organization/OrganizationRepositoryList'))

const Status = lazy(() => import(/* webpackChunkName: "./components/status/Status" */ './components/status/Status'))

const API = lazy(() => import(/* webpackChunkName: "./components/api/API" */ './components/api/API'))

const Utils = lazy(() => import(/* webpackChunkName: "./components/utils/Utils" */ './components/utils/Utils'))

const Routes = () => {
  const auth = useSelector((state: RootState) => state.auth)
  const message = useSelector((state: RootState) => state.message)
  if (!auth) { return <Spin /> } // 渲染整站开屏动画，已经在 src/index 中实现。这里的代码用于支持没有接入 SSO 的情况。
  if (!auth.id) { // 引导用户登陆，已经在 src/index 中实现。这里的代码用于支持没有接入 SSO 的情况。
    return (
      <article>
        <Message messageInfo={message} />
        <Switch>
          <Route path="/account/register" component={RegisterForm} />
          <Route path="/account/findpwd" component={FindpwdForm} />
          <Route path="/account/resetpwd" component={ResetpwdForm} />
          <Route component={LoginForm} />
        </Switch>
      </article>
    )
  }
  return (
    <article className="Routes">
      <Message messageInfo={message} />
      <div className="btn-top" onClick={() => window.scrollTo(0, 0)}>
        回到顶部
      </div>
      <Route component={Header} />
      <div className="body">
        <Suspense fallback={<Spin />}>
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
                  <Route exact={true} path="/account/myAccount" component={MyAccountView} />
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
            <Route
              path="/preferences"
              children={() => (
                <Switch>
                  <MySettingsView />
                </Switch>
              )}
            />
            <Route
              path="/about"
              children={() => (
                <Switch>
                  <Route exact={true} path="/about" component={AboutView} />
                </Switch>
              )}
            />
            <Route component={NoMatch} />
          </Switch>
        </Suspense>
      </div>
      <Footer />
      <div id="portal" />
    </article>
  )
}

export default Routes
