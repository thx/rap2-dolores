import React, { Component } from 'react'
import { connect } from 'react-redux'
import { login } from '../../actions/account'
import { Link } from 'react-router-dom'
import Mock from 'mockjs'
import './LoginForm.css'
import { RootState } from 'actions/types'
import config from '../../config'
import { Button, Card } from '@material-ui/core'
import { getBGImageUrl } from 'utils/ImageUtils'
import Logo from 'components/layout/Logo'

const { serve } = config

// 模拟数据
const mockUser: any = process.env.NODE_ENV === 'development'
  ? () => Mock.mock({
    email: 'admin@rap2.com',
    password: 'admin',
  })
  : () => ({
    email: '',
    password: '',
  })

mockUser.captchaId = Date.now()

// 展示组件
class LoginForm extends Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      ...mockUser(),
      bg: getBGImageUrl(),
    }
  }
  render() {
    return (
      <div className="wrapper" style={{ background: this.state.bg }}>
        <Card className="LoginForm">
          <div className="header">
            <Logo color="#3f51b5" />
          </div>
          <form onSubmit={this.handleSubmit}>
            <div className="body">
              <div className="form-group">
                <label>邮箱：</label>
                <input
                  value={this.state.email}
                  onChange={e => this.setState({ email: e.target.value })}
                  className="form-control"
                  placeholder="Email"
                  autoFocus={true}
                  required={true}
                />
              </div>
              <div className="form-group">
                <label>密码：</label>
                <input
                  value={this.state.password}
                  type="password"
                  onChange={e => this.setState({ password: e.target.value })}
                  className="form-control"
                  placeholder="Password"
                  required={true}
                />
              </div>
              <div className="form-group">
                <label>验证码：</label>
                <input onChange={e => this.setState({ captcha: e.target.value })} className="form-control" placeholder="验证码" required={true} />
                <img src={`${serve}/captcha?t=${this.state.captchaId || ''}`} onClick={() => this.setState({ captchaId: Date.now() })} alt="captcha" />
              </div>
            </div>
            <div className="footer">
              <Button type="submit" className="mr10" variant="contained" color="primary" style={{ marginRight: 10 }}>登录</Button>
              <Link to="/account/register" className="mr10">注册</Link>
              {/* <Link to="/account/reset">密码找回</Link> */}
            </div>
            {this.props.auth.message &&
              <div className="alert alert-danger fade show" role="alert">
                {this.props.auth.message}
              </div>
            }
          </form>
        </Card>
      </div>
    )
  }
  handleSubmit = (e: any) => {
    const { onLogin } = this.props
    e.preventDefault()
    const { email, password, captcha } = this.state
    onLogin({ email, password, captcha }, () => {
      window.location.href = '/'
    })
  }
}

// 容器组件
const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
})
const mapDispatchToProps = ({
  onLogin: login,
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginForm)
