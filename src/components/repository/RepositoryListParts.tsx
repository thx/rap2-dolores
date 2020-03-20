import React, { Component, useState, useEffect } from 'react'
import { PropTypes, push, replace, URI, StoreStateRouterLocationURI } from '../../family'
import { Spin, RModal, Pagination } from '../utils'

import RepositoryList from './RepositoryList'
import RepositoryForm from './RepositoryForm'
import ImportRepositoryForm from './ImportRepositoryForm'
import { addRepository, updateRepository, deleteRepository } from '../../actions/repository'

import { GoArrowRight } from 'react-icons/go'
import { Organization, RootState } from 'actions/types'
import { useDispatch, useSelector } from 'react-redux'
import { Select, MenuItem, TextField, Button } from '@material-ui/core'
import OrganizationForm from 'components/organization/OrganizationForm'

export const mapDispatchToProps = {
  onAddRepository: addRepository,
  onUpdateRepository: updateRepository,
  onDeleteRepository: deleteRepository,
}

interface CreateButtonProps {
  organization?: Organization
  callback?: string
}

export function CreateButton(props: CreateButtonProps) {
  const { organization, callback } = props
  const [creating, setCreating] = useState(false)
  const [importing, setImporting] = useState(false)
  const [updateOrganization, setUpdateOrganization] = useState(false)
  const dispatch = useDispatch()
  const router = useSelector((state: RootState) => state.router)
  const handleUpdate = () => {
    if (callback) {
      dispatch(replace(callback))
    } else {
      const uri = StoreStateRouterLocationURI(router)
      dispatch(replace(uri.href()))
    }
  }

  return (
    <span className="float-right ml10">
      {organization && (
        <Button
          style={{ marginRight: 8 }}
          className="RepositoryCreateButton"
          variant="contained"
          color="primary"
          onClick={() => setUpdateOrganization(true)}
        >
          编辑团队
        </Button>
      )}

      <OrganizationForm
        organization={organization}
        open={updateOrganization}
        onClose={() => setUpdateOrganization(false)}
      />

      <Button
        className="RepositoryCreateButton"
        variant="contained"
        color="primary"
        onClick={() => setCreating(true)}
      >
        新建仓库
      </Button>

      <RepositoryForm
        title="新建仓库"
        open={creating}
        onClose={() => setCreating(false)}
        organizationId={organization ? organization.id : undefined}
      />

      {organization && (
        <Button
          style={{ marginLeft: 8 }}
          className="RepositoryCreateButton"
          variant="contained"
          color="primary"
          onClick={() => setImporting(true)}
        >
          <GoArrowRight /> 导入仓库
        </Button>
      )}

      {organization && (
        <RModal
          when={importing && !!organization}
          onClose={() => setImporting(false)}
          onResolve={handleUpdate}
        >
          <ImportRepositoryForm title="导入仓库" orgId={organization.id} />
        </RModal>
      )}
    </span>
  )
}

// TODO 2.2 <select> => <Dropdown>
export function RepositoriesTypeDropdown(props: { url: string }) {
  const { url } = props
  const dispatch = useDispatch()
  const handlePush = (url: string) => {
    dispatch(push(url))
  }
  return (
    <Select className="mr8" value={url} onChange={e => handlePush(e.target.value as string)}>
      <MenuItem value="/repository/joined">我的仓库</MenuItem>
      <MenuItem value="/repository/all">所有仓库</MenuItem>
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

export const RepositoryListWithSpin = ({ name, repositories }: any) =>
  repositories.fetching ? (
    <Spin />
  ) : (
    <RepositoryList name={name} repositories={repositories.data} editor="/repository/editor" />
  )

export const OrganizationRepositoryListWithSpin = ({ name, repositories }: any) =>
  repositories.fetching ? (
    <Spin />
  ) : (
    <RepositoryList
      name={name}
      repositories={repositories.data}
      editor="/organization/repository/editor"
    />
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
