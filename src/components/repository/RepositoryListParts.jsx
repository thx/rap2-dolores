import React, { Component } from 'react'
import { PropTypes, push, replace, URI, StoreStateRouterLocationURI } from '../../family'
import { Spin, RModal, Pagination } from '../utils'

import RepositoryList from './RepositoryList'
import RepositoryForm from './RepositoryForm'
import ImportRepositoryForm from './ImportRepositoryForm'
import { addRepository, updateRepository, deleteRepository } from '../../actions/repository'

import { GoRepo, GoMoveRight } from 'react-icons/lib/go'

export const contextTypes = {
  store: PropTypes.object
}

export const childContextTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object,
  onAddRepository: PropTypes.func,
  onUpdateRepository: PropTypes.func,
  onDeleteRepository: PropTypes.func
}

export function getChildContext () {
  let { history, location, match, onAddRepository, onUpdateRepository, onDeleteRepository } = this.props
  return { history, location, match, onAddRepository, onUpdateRepository, onDeleteRepository }
}

export const mapDispatchToProps = ({
  onAddRepository: addRepository,
  onUpdateRepository: updateRepository,
  onDeleteRepository: deleteRepository
})

export class CreateButton extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }
  static propTypes = {
    create: PropTypes.bool,
    callback: PropTypes.string,
    organization: PropTypes.object
  }
  constructor (props) {
    super(props)
    this.state = {
      create: !!props.create,
      import: !!props.import
    }
  }
  render () {
    let { organization } = this.props
    return (
      <span className='float-right ml10'>
        {/* DONE 2.1 √我加入的仓库、X所有仓库 是否应该有 新建仓库 */}
        <button className='RepositoryCreateButton btn btn-success' onClick={e => this.setState({ create: true })}>
          <GoRepo /> 新建仓库
        </button>
        {organization &&
          <button className='RepositoryCreateButton btn btn-secondary ml8' onClick={e => this.setState({ import: true })}>
            <GoMoveRight /> 导入仓库
        </button>
        }
        <RModal when={this.state.create} onClose={e => this.setState({ create: false })} onResolve={this.handleUpdate}>
          <RepositoryForm title='新建仓库' organization={organization} />
        </RModal>
        {organization &&
          <RModal when={this.state.import && !!organization} onClose={e => this.setState({ import: false })} onResolve={this.handleUpdate}>
            <ImportRepositoryForm title='导入仓库' orgId={organization.id} />
          </RModal>
        }
      </span>
    )
  }
  handleUpdate = (e) => {
    let { callback } = this.props
    let { store } = this.context
    if (callback) {
      store.dispatch(replace(callback))
    } else {
      let uri = StoreStateRouterLocationURI(store)
      store.dispatch(replace(uri.href()))
    }
  }
}

// TODO 2.2 <select> => <Dropdown>
export class RepositoriesTypeDropdown extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }
  render () {
    let { url } = this.props
    return (
      <select className='RepositoriesTypeDropdown form-control float-left w160 mr12' value={url} onChange={e => this.handlePush(e.target.value)} size='1'>
        <option value='/repository/joined'>我拥有和加入的仓库</option>
        <option value='/repository/all'>所有仓库</option>
      </select>
    )
  }
  handlePush = (url) => {
    let { store } = this.context
    store.dispatch(push(url))
    // let uri = StoreStateRouterLocationURI(store)
    // store.dispatch(replace(uri.href()))
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
    //   <input type='text' value={this.state.name} className='form-control' placeholder='仓库名称或 ID' autoComplete='off'
    //     onChange={e => this.setState({ name: e.target.value.trim() })}
    //     onKeyUp={e => e.which === 13 && this.handleSearch()} />
    //   <span className='btn input-group-addon' onClick={this.handleSearch}><span className=''>&#xe60b;</span></span>
    // </div>
    return (
      <input type='text' value={this.state.name} className='form-control float-left w280' placeholder='搜索仓库：输入名称或 ID' autoComplete='off'
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

export const RepositoryListWithSpin = ({ name, repositories }) => (
  repositories.fetching
    ? <Spin />
    : <RepositoryList name={name} repositories={repositories.data} editor='/repository/editor' />
)

export const OrganizationRepositoryListWithSpin = ({ name, repositories }) => (
  repositories.fetching
    ? <Spin />
    : <RepositoryList name={name} repositories={repositories.data} editor='/organization/repository/editor' />
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
