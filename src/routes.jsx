import React from 'react'
import { Bundle, PropTypes, Switch, Route } from './family'

import { NoMatch, Spin } from './components/utils'

import Header from './components/common/Header'
import Footer from './components/common/Footer'
import Home from './components/home/Home'

import LoginForm from './components/account/LoginForm'
import RegisterForm from './components/account/RegisterForm'
import UpdateForm from './components/account/UpdateForm'
import ResetForm from './components/account/ResetForm'

const UserList = (props) => (
  <Bundle load={cb => require.ensure([], require => cb(require('./components/account/UserList')))}>
    {CustomComponent => CustomComponent ? <CustomComponent {...props} /> : null}
  </Bundle>
)

const JoinedRepositoryList = (props) => (
  <Bundle load={cb => require.ensure([], require => cb(require('./components/repository/JoinedRepositoryList')))}>
    {CustomComponent => CustomComponent ? <CustomComponent {...props} /> : null}
  </Bundle>
)
const JoinedRepositoryListWithCreateForm = (props) => (
  <Bundle load={cb => require.ensure([], require => cb(require('./components/repository/JoinedRepositoryList')))}>
    {CustomComponent => CustomComponent ? <CustomComponent {...props} create /> : null}
  </Bundle>
)
const AllRepositoryList = (props) => (
  <Bundle load={cb => require.ensure([], require => cb(require('./components/repository/AllRepositoryList')))}>
    {CustomComponent => CustomComponent ? <CustomComponent {...props} /> : null}
  </Bundle>
)
const RepositoryEditor = (props) => (
  <Bundle load={cb => require.ensure([], require => cb(require('./components/editor/RepositoryEditor')))}>
    {CustomComponent => CustomComponent ? <CustomComponent {...props} /> : null}
  </Bundle>
)
const RepositoryTester = (props) => (
  <Bundle load={cb => require.ensure([], require => cb(require('./components/tester/Tester')))}>
    {CustomComponent => CustomComponent ? <CustomComponent {...props} /> : null}
  </Bundle>
)
const RepositoryChecker = (props) => (
  <Bundle load={cb => require.ensure([], require => cb(require('./components/checker/Checker')))}>
    {CustomComponent => CustomComponent ? <CustomComponent {...props} /> : null}
  </Bundle>
)

const JoinedOrganizationList = (props) => (
  <Bundle load={cb => require.ensure([], require => cb(require('./components/organization/JoinedOrganizationList')))}>
    {CustomComponent => CustomComponent ? <CustomComponent {...props} /> : null}
  </Bundle>
)
const AllOrganizationList = (props) => (
  <Bundle load={cb => require.ensure([], require => cb(require('./components/organization/AllOrganizationList')))}>
    {CustomComponent => CustomComponent ? <CustomComponent {...props} /> : null}
  </Bundle>
)
const OrganizationRepositoryList = (props) => (
  <Bundle load={cb => require.ensure([], require => cb(require('./components/organization/OrganizationRepositoryList')))}>
    {CustomComponent => CustomComponent ? <CustomComponent {...props} /> : null}
  </Bundle>
)

const Status = (props) => (
  <Bundle load={cb => require.ensure([], require => cb(require('./components/status/Status')))}>
    {CustomComponent => CustomComponent ? <CustomComponent {...props} /> : null}
  </Bundle>
)

const API = (props) => (
  <Bundle load={cb => require.ensure([], require => cb(require('./components/api/API')))}>
    {CustomComponent => CustomComponent ? <CustomComponent {...props} /> : null}
  </Bundle>
)

// import Utils from './components/utils/Utils'
const Utils = (props) => (
  <Bundle load={cb => require.ensure([], require => cb(require('./components/utils/Utils')))}>
    {CustomComponent => CustomComponent ? <CustomComponent {...props} /> : null}
  </Bundle>
)

const Routes = ({ match, location }, { store }) => {
  let auth = store.getState().auth
  if (!auth) return <Spin /> // 渲染整站开屏动画，已经在 src/index 中实现。这里的代码用于支持没有接入 SSO 的情况。
  if (!auth.id) { // 引导用户登陆，已经在 src/index 中实现。这里的代码用于支持没有接入 SSO 的情况。
    return (
      <article>
        {/* <Route component={Header}/> */}
        <Switch>
          <Route path='/account/register' component={RegisterForm} />
          <Route path='/account/reset' component={ResetForm} />
          <Route component={LoginForm} />
        </Switch>
        {/* <Footer/> */}
      </article>
    )
  }
  return (
    <article className='Routes'>
      <Route component={Header} />
      <div className='body'>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/repository' children={() => (
            <Switch>
              <Route exact path='/repository' component={JoinedRepositoryList} />
              <Route exact path='/repository/joined' component={JoinedRepositoryList} />
              <Route exact path='/repository/joined/create' component={JoinedRepositoryListWithCreateForm} />
              <Route exact path='/repository/all' component={AllRepositoryList} />
              <Route exact path='/repository/editor' component={RepositoryEditor} />
              <Route exact path='/repository/tester' component={RepositoryTester} />
              <Route exact path='/repository/checker' component={RepositoryChecker} />
              <Route component={NoMatch} />
            </Switch>
          )} />
          <Route path='/organization' children={() => (
            <Switch>
              <Route exact path='/organization' component={JoinedOrganizationList} />
              <Route exact path='/organization/joined' component={JoinedOrganizationList} />
              <Route exact path='/organization/all' component={AllOrganizationList} />
              <Route exact path='/organization/repository' component={OrganizationRepositoryList} />
              <Route exact path='/organization/repository/editor' component={RepositoryEditor} />
              <Route component={NoMatch} />
            </Switch>
          )} />
          <Route path='/status' children={() => (
            <Switch>
              <Route path='/status' component={Status} />
              <Route component={NoMatch} />
            </Switch>
          )} />
          <Route path='/account' children={() => (
            <Switch>
              <Route exact path='/account' component={UserList} />
              <Route path='/account/users' component={UserList} />
              <Route path='/account/login' component={LoginForm} />
              <Route path='/account/register' component={RegisterForm} />
              <Route path='/account/update' component={UpdateForm} />
              <Route component={NoMatch} />
            </Switch>
          )} />
          <Route path='/utils' children={() => (
            <div className='container'>
              <Route path='/utils' component={Utils} />
            </div>
          )} />
          <Route path='/api' children={() => (
            <Switch>
              <Route exact path='/api' component={API} />
              <Route component={NoMatch} />
            </Switch>
          )} />
          <Route component={NoMatch} />
        </Switch>
      </div>
      <Footer />
      <div id='portal' />
    </article>
  )
}

Routes.contextTypes = {
  store: PropTypes.object
}

export default Routes
