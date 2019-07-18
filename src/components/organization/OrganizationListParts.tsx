import React, { Component, useState, useEffect } from 'react'
import { PropTypes, push, replace, URI, StoreStateRouterLocationURI } from '../../family'
import { Spin, Pagination } from '../utils'
import OrganizationList from './OrganizationList'
import OrganizationForm from './OrganizationForm'
import { addOrganization, deleteOrganization, updateOrganization } from '../../actions/organization'
import { useDispatch, useSelector } from 'react-redux'
import { Select, MenuItem, TextField, Button } from '@material-ui/core'
import { RootState } from 'actions/types'

export const contextTypes = {
  store: PropTypes.object,
}

export const childContextTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object,
  onAddOrganization: PropTypes.func,
  onDeleteOrganization: PropTypes.func,
  onUpdateOrganization: PropTypes.func,
  auth: PropTypes.object,
}

export function getChildContext(this: any) {
  const { history, location, match, onAddOrganization, onDeleteOrganization, onUpdateOrganization, auth } = this.props
  return { history, location, match, onAddOrganization, onDeleteOrganization, onUpdateOrganization, auth }
}

export const mapDispatchToProps = ({
  onAddOrganization: addOrganization,
  onDeleteOrganization: deleteOrganization,
  onUpdateOrganization: updateOrganization,
})

export function CreateButton() {
  const [open, setOpen] = useState(false)
  return (
    <span className="float-right ml10">
      <Button className="OrganizationCreateButton" variant="contained" color="primary" onClick={() => setOpen(true)}> 新建团队 </Button>
      <OrganizationForm open={open} onClose={() => setOpen(false)} />
    </span>
  )
}

// TODO 2.2 <select> => <Dropdown>
export function OrganizationsTypeDropdown({ url }: { url: string }) {
  const dispatch = useDispatch()
  const handlePush = (url: string) => {
    dispatch(push(url))
  }

  return (
    <Select
      className="mr8"
      value={url}
      onChange={e => handlePush(e.target.value as string)}
    >
      <MenuItem value="/organization/joined">我的团队</MenuItem>
      <MenuItem value="/organization/all">全部团队</MenuItem>
    </Select>
  )
}

export function SearchGroup(props: { name: string }) {
  const { name } = props
  const dispatch = useDispatch()
  const router = useSelector((state: RootState) => state.router)
  const [query, setQuery] = useState('')
  const handleSearch = () => {
    const { pathname, hash, search } = router.location
    const uri = URI(pathname + hash + search).removeSearch('cursor')
    query ? uri.setSearch('name', query) : uri.removeSearch('name')
    dispatch(push(uri.href()))
  }
  useEffect(() => {
    setQuery(name)
  }, [name])
  return (
    <TextField
      value={query || ''}
      placeholder="搜索仓库：名称、ID"
      autoComplete="off"
      onChange={e => setQuery(e.target.value.trim())}
      onKeyUp={e => e.which === 13 && handleSearch()}
      style={{ width: 200 }}
    />
  )
}

// DONE 把控制钱从 Dialog 移动到 Component 中！
// DONE 2.1 通常应该用 replaceLocation
// DONE 2.1 删除确认
export function handleDelete(this: any, e: any, organization: any) {
  e.preventDefault()
  const message = `团队被删除后不可恢复！\n确认继续删除『#${organization.id} ${organization.name}』吗？`
  if (!window.confirm(message)) { return }
  const { onDeleteOrganization } = this.context
  onDeleteOrganization(organization.id, () => {
    this.replaceLocation()
  })
}

// DONE 重构表之间的对应关系，分为多张表。否则每次更新成员都会导致当前团队排到第一位！待测试。
export function replaceLocation(this: any) {
  const { router } = this.props
  const uri = StoreStateRouterLocationURI(router)
  replace(uri.href())
}

export function handleJoin(this: any, e: any, organization: any) {
  e.preventDefault()
  const { auth, onUpdateOrganization } = this.context
  const next = {
    id: organization.id,
    memberIds: [...organization.members.map((user: any) => user.id), auth.id],
  }
  onUpdateOrganization(next, () => {
    this.replaceLocation()
  })
}

export function handleExit(this: any, e: any, organization: any) {
  e.preventDefault()
  const message = `确认继续退出『#${organization.id} ${organization.name}』吗？`
  if (!window.confirm(message)) { return }
  const { auth, onUpdateOrganization } = this.context
  const next = {
    id: organization.id,
    memberIds: organization.members.filter((user: any) => user.id !== auth.id).map((user: any) => user.id),
  }
  onUpdateOrganization(next, () => {
    this.replaceLocation()
  })
}

export const OrganizationListWithSpin = ({ name, organizations }: any) => (
  organizations.fetching
    ? <Spin />
    : <OrganizationList name={name} organizations={organizations.data} />
)

export class PaginationWithLocation extends Component<any, any> {
  static contextTypes = {
    location: PropTypes.object,
  }
  render() {
    const { calculated } = this.props
    const { location } = this.context
    return <Pagination location={location} calculated={calculated} />
  }
}
