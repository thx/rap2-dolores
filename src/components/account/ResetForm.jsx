import React, { Component } from 'react'
import { PropTypes, connect } from '../../family'
import { reset } from '../../actions/account'
import { Link } from 'react-router-dom'
import './ResetForm.css'

// 展示组件
class LoginForm extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }
  static propTypes = {
    auth: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      showPassword: false,
      newPassword: '',
    }
  }
  render() {
    const { showPassword, email, password, newPassword } = this.state
    if (newPassword) {
      return (
        <section className='ResetForm'>
          <div className='header'>
            <span className='title'>找回密码</span>
          </div>
          <div className='body'>
            <div className='form-group'>
              您的密码已重设为: {newPassword}, 请重新登陆。
            </div>
          </div>
        </section>
      )
    }
    return (
      <section className='ResetForm'>
        <div className='header'>
          <span className='title'>找回密码</span>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className='body'>
            <div className='form-group'>
              <label>邮箱：</label>
              <input value={email} onChange={e => this.setState({ email: e.target.value })} className='form-control' placeholder='Email' autoFocus='true' required disabled={showPassword} />
            </div>
            {showPassword && <div>
              <div className='form-group'>
                <label>验证码：</label>
                <input value={password} onChange={e => this.setState({ password: e.target.value })} className='form-control' placeholder='验证码' />
              </div>
              <div className='form-group'>
                已发送验证码至您输入的邮箱，请输入验证码以重置您的密码。
              </div>
            </div>}
          </div>
          <div className='footer'>
            <button type='submit' className='btn btn-primary w80 mr10'>提交</button>
            <Link to='/account/login' className='mr10'>返回</Link>
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
    const { onReset } = this.props
    const { email, password } = this.state
    e.preventDefault()
    if (email) {
      this.setState({
        showPassword: true,
      })
      onReset(email, password, (result) => {
        if (!result.isOk) {
          alert(result.errMsg)
          return
        }
        if (result.data) {
          this.setState({
            newPassword: result.data,
          })
        }
      })
    }
  }
}

// 容器组件
const mapStateToProps = (state) => ({
  auth: state.auth
})
const mapDispatchToProps = ({
  onReset: reset,
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginForm)
