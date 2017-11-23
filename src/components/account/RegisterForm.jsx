import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Mock from 'mockjs'
import { addUser } from '../../actions/account'
import './RegisterForm.css'

// 模拟数据
const mockUser = process.env.NODE_ENV === 'development'
  ? () => Mock.mock({
    fullname: '@CNAME',
    email: '@email',
    password: '@string(6)'
  })
  : () => ({
    fullname: '',
    email: '',
    password: ''
  })

// 展示组件
class RegisterForm extends Component {
  constructor (props) {
    super(props)
    this.state = mockUser()
  }
  render () {
    return (
      <section className='RegisterForm'>
        <div className='header'>
          <span className='title'>注册</span>
        </div>
        <form className='body' onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label>姓名：</label>
            <input value={this.state.fullname} onChange={e => this.setState({ fullname: e.target.value })} className='form-control' placeholder='Name' autoFocus='true' required />
          </div>
          <div className='form-group'>
            <label>邮箱：</label>
            <input value={this.state.email} onChange={e => this.setState({ email: e.target.value })} className='form-control' placeholder='Email' required />
          </div>
          <div className='form-group'>
            <label>密码：</label>
            <input value={this.state.password} onChange={e => this.setState({ password: e.target.value })} type='password' className='form-control' placeholder='Password' required />
          </div>
          <button type='submit' className='btn btn-primary w140 mr20'>提交</button>
          <Link to='/account' className=''>取消</Link>
        </form>
      </section>
    )
  }
  handleSubmit = (e) => {
    let { history, onAddUser } = this.props
    e.preventDefault()
    onAddUser(this.state, () => {
      history.push('/') // 另一种方式是 <Redirect to="/somewhere/else"/>
    })
  }
}

// 容器组件
const mapStateToProps = (state) => ({})
const mapDispatchToProps = ({
  onAddUser: addUser
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterForm)
