import React, { Component } from 'react'
import {
  connect,
  Link,
  replace,
  StoreStateRouterLocationURI
} from '../../family'
import { sortInterfaceList } from '../../actions/interface'
import { RModal, RSortable } from '../utils'
import InterfaceForm from './InterfaceForm'
import { GoPencil, GoTrashcan, GoLock } from 'react-icons/go'
import { getCurrentInterface } from '../../selectors/interface'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'

import './InterfaceList.css'
import { RootState } from 'actions/types'
type InterfaceProps = any
type InterfaceState = any
class InterfaceBase extends Component<InterfaceProps, InterfaceState> {
  static contextTypes = {
    store: PropTypes.object,
    onDeleteInterface: PropTypes.func.isRequired,
  }
  constructor(props: any) {
    super(props)
    this.state = { update: false }
  }
  render() {
    const { auth, repository, mod, itf, router } = this.props
    const selectHref = StoreStateRouterLocationURI(router)
      .setSearch('itf', itf.id)
      .href()
    const isOwned = repository.owner.id === auth.id
    const isJoined = repository.members.find((i: any) => i.id === auth.id)
    return (
      <div className="Interface clearfix">
        <span>
          <Link
            to={selectHref}
            onClick={e => {
              if (
                this.props.curItf &&
                this.props.curItf.locker &&
                !window.confirm(
                  '编辑模式下切换接口，会导致编辑中的资料丢失，是否确定切换接口？'
                )
              ) {
                e.preventDefault()
              }
            }}
          >
            <div className="name">{itf.name}</div>
            <div className="url">{itf.url}</div>
          </Link>
        </span>
        {isOwned || isJoined ? (
          <div className="toolbar">
            {itf.locker ? (
              <span className="locked mr5">
                <GoLock />
              </span>
            ) : null}
            {!itf.locker || itf.locker.id === auth.id ? (
              <span
                className="fake-link"
                onClick={() => this.setState({ update: true })}
              >
                <GoPencil />
              </span>
            ) : null}
            <RModal
              when={this.state.update}
              onClose={() => this.setState({ update: false })}
              onResolve={this.handleUpdate}
            >
              <InterfaceForm
                title="修改接口"
                repository={repository}
                mod={mod}
                itf={itf}
              />
            </RModal>
            {!itf.locker ? (
              <Link to="" onClick={e => this.handleDelete(e, itf)}>
                <GoTrashcan />
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    )
  }
  handleDelete = (e: any, itf: any) => {
    e.preventDefault()
    const message = `接口被删除后不可恢复！\n确认继续删除『#${itf.id} ${
      itf.name
    }』吗？`
    if (window.confirm(message)) {
      const { onDeleteInterface } = this.context
      onDeleteInterface(itf.id, () => {
        const { store } = this.context
        const uri = StoreStateRouterLocationURI(store)
        const deleteHref = this.props.active
          ? uri.removeSearch('itf').href()
          : uri.href()
        store.dispatch(replace(deleteHref))
      })
    }
  };
  handleUpdate = () => {
    /** test */
  };
}

const Interface = connect((state: any) => ({ router: state.router }))(
  InterfaceBase
)
type InterfaceListProps = any
type InterfaceListState = any
class InterfaceList extends Component<InterfaceListProps, InterfaceListState> {
  constructor(props: any) {
    super(props)
    this.state = { create: false }
  }
  render() {
    const { auth, repository, mod, itfs = [], itf, curItf } = this.props
    if (!mod.id) {
      return null
    }
    const isOwned = repository.owner.id === auth.id
    const isJoined = repository.members.find((i: any) => i.id === auth.id)
    return (
      <article className="InterfaceList">
        {isOwned || isJoined ? (
          <div className="header">
            <Button
              variant="outlined"
              fullWidth={true}
              color="primary"
              onClick={() => this.setState({ create: true })}
            >
              新建接口
            </Button>
            <RModal
              when={this.state.create}
              onClose={() => this.setState({ create: false })}
              onResolve={this.handleCreate}
            >
              <InterfaceForm
                title="新建接口"
                repository={repository}
                mod={mod}
              />
            </RModal>
          </div>
        ) : null}
        <RSortable onChange={this.handleSort} disabled={!isOwned && !isJoined}>
          <ul className="body">
            {itfs.map((item: any) => (
              <li
                key={item.id}
                className={item.id === itf.id ? 'active sortable' : 'sortable'}
                data-id={item.id}
              >
                <Interface
                  repository={repository}
                  mod={mod}
                  itf={item}
                  active={item.id === itf.id}
                  auth={auth}
                  curItf={curItf}
                />
              </li>
            ))}
          </ul>
        </RSortable>
      </article>
    )
  }
  handleCreate = () => {
    /** empty */
  };
  handleSort = (_: any, sortable: any) => {
    const { onSortInterfaceList, mod } = this.props
    onSortInterfaceList(sortable.toArray(), mod.id)
  };
}
const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
  curItf: getCurrentInterface(state),
  router: state.router,
})
const mapDispatchToProps = {
  onSortInterfaceList: sortInterfaceList,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InterfaceList)
