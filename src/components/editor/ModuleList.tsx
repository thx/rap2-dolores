import React, { Component } from 'react'
import { connect, Link, replace, StoreStateRouterLocationURI } from '../../family'
import { RModal, RSortable } from '../utils'
import ModuleForm from './ModuleForm'
import { GoPencil, GoTrashcan, GoPackage } from 'react-icons/go'
import { RootState } from 'actions/types'

class ModuleBase extends Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = { update: false }
  }
  render() {
    const { auth, repository, mod, router } = this.props
    const uri = StoreStateRouterLocationURI(router).removeSearch('itf')
    const selectHref = uri.setSearch('mod', mod.id).href()
    return (
      <div className="Module clearfix">
        <Link to={selectHref} className="name">{mod.name}</Link>
        <div className="toolbar">
          {/* 编辑权限：拥有者或者成员 */}
          {repository.owner.id === auth.id || repository.members.find((item: any) => item.id === auth.id)
            ? <span className="fake-link" onClick={() => this.setState({ update: true })}><GoPencil /></span>
            : null
          }
          {repository.owner.id === auth.id || repository.members.find((item: any) => item.id === auth.id)
            ? <span className="fake-link" onClick={e => this.handleDelete(e, mod)}><GoTrashcan /></span>
            : null
          }
        </div>
        <RModal when={this.state.update} onClose={() => this.setState({ update: false })} onResolve={this.handleUpdate}>
          <ModuleForm title="修改模块" mod={mod} repository={repository} />
        </RModal>
      </div>
    )
  }
  handleUpdate = () => {
    this.props.replace(StoreStateRouterLocationURI(this.props.router).href())
  }
  handleDelete = (e: any, mod: any) => {
    const { router } = this.props
    e.preventDefault()
    const message = `模块被删除后不可恢复，并且会删除相关的接口！\n确认继续删除『#${mod.id} ${mod.name}』吗？`
    if (window.confirm(message)) {
      this.context.onDeleteModule(this.props.mod.id, () => {
        const { store } = this.context
        const uri = StoreStateRouterLocationURI(router)
        const deleteHref = this.props.active ? uri.removeSearch('mod').href() : uri.href()
        store.dispatch(replace(deleteHref))
      }, this.props.repository.id)
    }
  }
}

const Module = connect((state: any) => ({
  router: state.router,
}))(ModuleBase)

class ModuleList extends Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = { create: false }
  }
  render() {
    const { auth, repository = {}, mods = [], mod = {} } = this.props
    const isOwned = repository.owner.id === auth.id
    const isJoined = repository.members.find((item: any) => item.id === auth.id)
    return (
      <RSortable onChange={this.handleSort} disabled={!isOwned && !isJoined}>
        <ul className="ModuleList clearfix">
          {mods.map((item: any) =>
            <li key={item.id} className={item.id === mod.id ? 'active sortable' : 'sortable'} data-id={item.id}>
              <Module key={item.id} mod={item} active={item.id === mod.id} repository={repository} auth={auth} />
            </li>
          )}
          {/* 编辑权限：拥有者或者成员 */}
          {isOwned || isJoined
            ? <li>
              <span className="fake-link" onClick={() => this.setState({ create: true })}>
                <GoPackage className="fontsize-14" /> 新建模块
              </span>
              <RModal when={this.state.create} onClose={() => this.setState({ create: false })} onResolve={this.handleCreate}>
                <ModuleForm title="新建模块" repository={repository} />
              </RModal>
            </li>
            : null
          }
        </ul>
      </RSortable>
    )
  }
  handleCreate = () => {
    const { router, replace } = this.props
    replace(StoreStateRouterLocationURI(router).href())
  }
  handleSort = (_: any, sortable: any) => {
    const { onSortModuleList } = this.context
    onSortModuleList(sortable.toArray())
  }
}

const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
  router: state.router,
})
const mapDispatchToProps = ({
  replace,
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModuleList)
