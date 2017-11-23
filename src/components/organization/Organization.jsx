import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
// import { Random } from 'mockjs'

import { replaceLocation, handleDelete, handleJoin, handleExit } from './OrganizationListParts'
import { Popover, RModal } from '../utils'
import OrganizationForm from './OrganizationForm'

import { GoOrganization } from 'react-icons/lib/go'

// 展示组件
class Organization extends Component {
  static contextTypes = {
    store: PropTypes.object,
    onAddOrganization: PropTypes.func,
    onDeleteOrganization: PropTypes.func,
    onUpdateOrganization: PropTypes.func,
    auth: PropTypes.object
  }
  replaceLocation = replaceLocation
  handleUpdate = replaceLocation
  handleDelete = handleDelete
  handleJoin = handleJoin
  // DONE 2.2 退出确认
  handleExit = handleExit
  constructor (props) {
    super(props)
    this.state = { update: false }
  }
  static avatar (user) {
    // return Random.dataImage('30x30', user.fullname[0].toUpperCase())
    // DONE 2.1 成员列表参考 ProductHunt
    // DONE 2.1 测试环境总会会请求到 BOSS 们的头像。。。
    // process.env.NODE_ENV === 'development' ? ... : ...
    return `https://work.alibaba-inc.com/photo/${user.empId}.220x220.jpg`
  }
  render () {
    let { auth } = this.context
    let { organization } = this.props
    let owned = organization.owner.id === auth.id
    let joined = organization.members.find(user => user.id === auth.id)
    let selfHelpJoin = false // DONE 2.1 不允许自助加入团队
    return (
      <section className='Organization card'>
        <div className='card-block'>
          <div className='header clearfix'>
            <span className='title'>
              <GoOrganization className='mr6 color-9' />
              <Link to={`/organization/repository?organization=${organization.id}`} >{organization.name}</Link>
            </span>
            <span className='toolbar'>
              {owned || joined ? ( // 拥有或已加入
                <span className='fake-link operation mr5' onClick={e => this.setState({ update: true })}>编辑</span>
              ) : null}
              {this.state.update && (
                <RModal when={this.state.update} onClose={e => this.setState({ update: false })} onResolve={e => this.handleUpdate()}>
                  <OrganizationForm title={`编辑团队 #${organization.id}`} organization={organization} />
                </RModal>
              )}
              {owned ? ( // 拥有
                <Link to='' onClick={e => this.handleDelete(e, organization)} className='operation mr5'>删除</Link>
              ) : null}
              {!owned && joined ? ( // 不拥有，已加入
                <Link to='' onClick={e => this.handleExit(e, organization)} className='operation mr5'>退出</Link>
              ) : null}
              {!owned && !joined && selfHelpJoin ? ( // 不拥有，未加入
                <Link to='' onClick={e => this.handleJoin(e, organization)} className='operation mr5'>加入</Link>
              ) : null}
            </span>
          </div>
          <div className='body'>
            <div className='desc'>{organization.description}</div>
            <div className='members'>
              <Popover content={`${organization.owner.fullname} ${organization.owner.id}`}>
                <img alt={organization.owner.fullname} src={Organization.avatar(organization.owner)} className='avatar owner' />
              </Popover>
              {organization.members.map(user =>
                <Popover key={user.id} content={`${user.fullname} ${user.id}`}>
                  <img alt={user.fullname} title={user.fullname} src={Organization.avatar(user)} className='avatar' />
                </Popover>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }
}

// 容器组件
const mapStateToProps = (state) => ({})
const mapDispatchToProps = ({})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Organization)
