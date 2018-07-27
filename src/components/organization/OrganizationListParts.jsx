import React, { Component } from 'react'
import { PropTypes, push, replace, URI, StoreStateRouterLocationURI } from '../../family'
import { Spin, RModal, Pagination } from '../utils'

import OrganizationList from './OrganizationList'
import OrganizationForm from './OrganizationForm'
import { addOrganization, deleteOrganization, updateOrganization } from '../../actions/organization'

import { GoOrganization } from 'react-icons/lib/go'

export const contextTypes = {
  store: PropTypes.object
}

export const childContextTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object,
  onAddOrganization: PropTypes.func,
  onDeleteOrganization: PropTypes.func,
  onUpdateOrganization: PropTypes.func,
  auth: PropTypes.object
}

export function getChildContext () {
  let { history, location, match, onAddOrganization, onDeleteOrganization, onUpdateOrganization, auth } = this.props
  return { history, location, match, onAddOrganization, onDeleteOrganization, onUpdateOrganization, auth }
}

export const mapDispatchToProps = ({
  onAddOrganization: addOrganization,
  onDeleteOrganization: deleteOrganization,
  onUpdateOrganization: updateOrganization
})

export class CreateButton extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }
  constructor (props) {
    super(props)
    this.state = { create: false }
  }
  render () {
    return (
      <span className='float-right ml10'>
        <button className='OrganizationCreateButton btn btn-success' onClick={e => this.setState({ create: true })}>
          <GoOrganization /> 新建团队
        </button>
        {this.state.create && (
          <RModal when={this.state.create} onClose={e => this.setState({ create: false })} onResolve={this.handleUpdate}>
            <OrganizationForm title='新建团队' />
          </RModal>
        )}
      </span>
    )
  }
  handleUpdate = (e) => {
  }
}

// TODO 2.2 <select> => <Dropdown>
export class OrganizationsTypeDropdown extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }
  render () {
    let { url } = this.props
    return (
      <select className='OrganizationsTypeDropdown form-control float-left w160 mr12' value={url} onChange={e => this.handlePush(e.target.value)} size='1'>
        <option value='/organization/joined'>我拥有和加入的团队</option>
        <option value='/organization/all'>全部团队</option>
      </select>
    )
  }
  handlePush = (url) => {
    let { store } = this.context
    store.dispatch(push(url))
  }
}

export class SearchGroup extends Component {
  static contextTypes = {
    store: PropTypes.object
  }
  constructor (props) {
    super(props)
    this.state = { name: props.name || '' }
  }
  render () {
    // <div className='input-group float-right w280'>
    //   <input type='text' value={this.state.name} className='form-control' placeholder='团队名称或 ID' autoComplete='off'
    //     onChange={e => this.setState({ name: e.target.value.trim() })}
    //     onKeyUp={e => e.which === 13 && this.handleSearch()} />
    //   <span className='btn input-group-addon' onClick={this.handleSearch}><span className=''>&#xe60b;</span></span>
    // </div>
    return (
      <input type='text' value={this.state.name} className='form-control float-left w280' placeholder='搜索团队：输入名称或 ID' autoComplete='off'
        onChange={e => this.setState({ name: e.target.value.trim() })}
        onKeyUp={e => e.which === 13 && this.handleSearch()}
        ref={$input => { this.$input = $input }} />
    )
  }
  componentDidMount () {
    if (this.state.name) {
      this.$input.focus()
    }
  }
  handleSearch = () => {
    let { store } = this.context
    let { pathname, hash, search } = store.getState().router.location
    let uri = URI(pathname + hash + search).removeSearch('cursor')
    this.state.name ? uri.setSearch('name', this.state.name) : uri.removeSearch('name')
    store.dispatch(push(uri.href()))
  }
}

// DONE 把控制钱从 Dialog 移动到 Component 中！
// DONE 2.1 通常应该用 replaceLocation
// DONE 2.1 删除确认
export function handleDelete (e, organization) {
  e.preventDefault()
  let message = `团队被删除后不可恢复！\n确认继续删除『#${organization.id} ${organization.name}』吗？`
  if (!window.confirm(message)) return
  let { onDeleteOrganization } = this.context
  onDeleteOrganization(organization.id, () => {
    this.replaceLocation()
  })
}

// DONE 重构表之间的对应关系，分为多张表。否则每次更新成员都会导致当前团队排到第一位！待测试。
export function replaceLocation () {
  let { store } = this.context
  let uri = StoreStateRouterLocationURI(store)
  store.dispatch(replace(uri.href()))
}

export function handleJoin (e, organization) {
  e.preventDefault()
  let { auth, onUpdateOrganization } = this.context
  let next = {
    id: organization.id,
    memberIds: [...organization.members.map(user => user.id), auth.id]
  }
  onUpdateOrganization(next, () => {
    this.replaceLocation()
  })
}

export function handleExit (e, organization) {
  e.preventDefault()
  let message = `确认继续退出『#${organization.id} ${organization.name}』吗？`
  if (!window.confirm(message)) return
  let { auth, onUpdateOrganization } = this.context
  let next = {
    id: organization.id,
    memberIds: organization.members.filter(user => user.id !== auth.id).map(user => user.id)
  }
  onUpdateOrganization(next, () => {
    this.replaceLocation()
  })
}

export const OrganizationListWithSpin = ({ name, organizations }) => (
  organizations.fetching
    ? <Spin />
    : <OrganizationList name={name} organizations={organizations.data} />
)

export class PaginationWithLocation extends Component {
  static contextTypes = {
    location: PropTypes.object
  }
  render () {
    let { calculated } = this.props
    let { location } = this.context
    return <Pagination location={location} calculated={calculated} />
  }
}
