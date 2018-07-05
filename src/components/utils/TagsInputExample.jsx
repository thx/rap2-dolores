import React, { Component } from 'react'
import TagsInput from './TagsInput'
import { mock } from 'mockjs'
import AccountService from '../../relatives/services/Account'

// 可选项不仅仅是字符串，可能是对象：把具体场景写成组件
// √ 过滤可选项中的已选值
// TODO 2.2 输入框的宽度自适应
// √ 整合到仓库和团队表单
// √ 用户列表按照 name 查询
// TODO 2.2 从 SSO 查询用户列表
// TODO 2.2 删除最后一个已选项
// √ 高度变化后重设浮层的位置
class Example extends Component {
  constructor (props) {
    super(props)
    this.state = {
      members: mock({ 'list|10': [{ id: '@int', label: '@cname' }] }).list,
      options: []
    }
  }
  render () {
    return (
      <div>
        <TagsInput value={this.state.members} options={this.state.options} placeholder={'名称检索'}
          onSeed={this.handleSeed} onChange={this.handleChange} />
      </div>
    )
  }
  handleSeed = async (seed) => {
    if (!seed) {
      this.setState({ options: [] })
      return
    }
    let users = await AccountService.fetchUserList({ name: seed })
    this.setState({
      options: users.data.map(item => ({ id: item.id, label: item.fullname }))
    })
  }
  handleChange = (value) => {
    this.setState({ members: value, options: [] })
  }
}
export default Example
