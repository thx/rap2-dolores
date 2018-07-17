import React, { Component } from 'react'
import { PropTypes, connect } from '../../family'
import { updateUser } from '../../actions/account'
import './UpdateForm.css'

// 展示组件
class UpdateForm extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  }
  constructor (props) {
    super(props)
    this.state = {
      fullname: '',
      email: '',
      password: ''
    }
  }
  render () {
    const auth = this.props.auth
    return (
      <section className='UpdateForm'>
        <div className='header'>
          <span className='title'>个人资料修改</span>
        </div>
        <form className='body' onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label>姓名：</label>
            <input value={auth.fullname} className='form-control' placeholder='Name' disabled />
          </div>
          <div className='form-group'>
            <label>邮箱：</label>
            <input value={auth.email} className='form-control' placeholder='Email' disabled />
          </div>
          <div className='form-group'>
            <label>密码：</label>
            <input value={this.state.password} onChange={e => this.setState({ password: e.target.value })} type='password' className='form-control' placeholder='Password' required autoFocus='true' />
          </div>
          <div className='form-group'>
            <label>确认密码：</label>
            <input value={this.state.passwordConfirm} onChange={e => this.setState({ passwordConfirm: e.target.value })} type='password' className='form-control' placeholder='Password' required autoFocus='true' />
          </div>
          <button type='submit' className='btn btn-primary w140 mr20'>提交</button>
          <a onClick={e => { e.preventDefault(); window.history.go(-1) }} >取消</a>
        </form>
      </section>
    )
  }
  handleSubmit = (e) => {
    let { history, onUpdateUser } = this.props
    e.preventDefault()
    if (this.state.password && this.state.password === this.state.passwordConfirm) {
      onUpdateUser({ password: this.state.password }, (errMsg) => {
        if (errMsg) {
          window.alert(errMsg)
        } else {
          history.push('/')
        }
      })
    } else {
      window.alert('两次密码不一致，请检查后重新输入')
    }
  }
}

// 容器组件
const mapStateToProps = (state) => ({
  auth: state.auth
})
const mapDispatchToProps = ({
  onUpdateUser: updateUser
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateForm)
