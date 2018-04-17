import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { login, logout } from '../../actions/account'
import Navigation from './Navigation'
import './Header.css'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import './nprogress.css'

const LoginAction = () => (
  <Link to='/account/login'>Sign in</Link>
)
const RegisterAction = () => (
  <Link to='/account/register'>Sign up</Link>
)
/* eslint-enable no-unused-vars */

const Header = ({ match, location, onLogout, fetching, user = {} }) => {
  document.body.style.cursor = fetching ? 'wait' : 'default' // TODO 2.3 应该有更好的方式监听整个 APP 是否有未完成的请求！
  fetching ? NProgress.start() : NProgress.done()
  return (
    <section className='Header'>
      <nav className='clearfix'>
        <Navigation />
        {user.id ? (
          <ul className='nav-actions list-inline float-right'>
            <li><Link to='/account/update' className='name'>{user.fullname}</Link></li>
            <li><a href='/account/login' onClick={onLogout}>退出</a></li>
          </ul>
        ) : (
          <ul className='nav-actions list-inline float-right'>
            <li><LoginAction /></li>
            <li><RegisterAction /></li>
          </ul>
        )}
      </nav>
    </section>
  )
}

// 容器组件
const mapStateToProps = (state) => ({
  fetching: (() => {
    let fetching = 0
    for (let key in state) {
      if (state[key].fetching) fetching += 1
    }
    return fetching
  })(), // state.fetching
  user: state.auth
})
const mapDispatchToProps = ({
  onLogin: login,
  onLogout: logout
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)
