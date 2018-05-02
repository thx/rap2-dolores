import React, { Component } from 'react'
import { PropTypes, connect } from '../../family'
import { login } from '../../actions/account'
import { Link } from 'react-router-dom'
import { serve } from '../../config'
import Mock from 'mockjs'
import './LoginForm.css'

// 模拟数据
const mockUser = process.env.NODE_ENV === 'development'
  ? () => Mock.mock({
    email: 'admin@rap2.com',
    password: 'admin'
  })
  : () => ({
    email: '',
    password: ''
  })

mockUser.captchaId = Date.now()

// 展示组件
class LoginForm extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }
  static propTypes = {
    auth: PropTypes.object.isRequired
  }
  constructor (props) {
    super(props)
    this.state = mockUser()
  }
  render () {
    return (
      <section className='LoginForm'>
        <div className='header'>
          <span className='title'>登录</span>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className='body'>
            <div className='form-group'>
              <label>邮箱：</label>
              <input value={this.state.email} onChange={e => this.setState({ email: e.target.value })} className='form-control' placeholder='Email' autoFocus='true' required />
            </div>
            <div className='form-group'>
              <label>密码：</label>
              <input value={this.state.password} type='password' onChange={e => this.setState({ password: e.target.value })} className='form-control' placeholder='Password' required />
            </div>
            <div className='form-group'>
              <label>验证码：</label>
              <input onChange={e => this.setState({ captcha: e.target.value })} className='form-control' placeholder='验证码' required />
              <img src={`${serve}/captcha?t=${this.state.captchaId || ''}`} onClick={e => this.setState({ captchaId: Date.now() })} alt='captcha' />
            </div>
          </div>
          <div className='footer'>
            <button type='submit' className='btn btn-primary w140 mr20'>提交</button>
            <Link to='/account/register'>注册</Link>
          </div>
          {this.props.auth.message &&
            <div className='alert alert-danger fade show' role='alert'>
              {this.props.auth.message}
            </div>
          }
        </form>
      </section>
    )
  }
  handleSubmit = (e) => {
    let { history, onLogin } = this.props
    e.preventDefault()
    onLogin(this.state, () => {
      let { pathname } = history.location
      if (pathname !== '/account/login') history.push(pathname) // 如果用户在其他业务页面，则不跳转
      else history.push('/') // 跳转到用户面板
    })
  }
}

// 容器组件
const mapStateToProps = (state) => ({
  auth: state.auth
})
const mapDispatchToProps = ({
  onLogin: login
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginForm)
