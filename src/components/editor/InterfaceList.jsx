import React, { Component } from 'react'
import { PropTypes, connect, Link, replace, StoreStateRouterLocationURI } from '../../family'
import { RModal, RSortable } from '../utils'
import InterfaceForm from './InterfaceForm'
import { GoPencil, GoTrashcan, GoRocket, GoLock } from 'react-icons/lib/go'

class Interface extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired,
    onDeleteInterface: PropTypes.func.isRequired
  }
  static propTypes = {
    auth: PropTypes.object.isRequired,
    repository: PropTypes.object.isRequired,
    mod: PropTypes.object.isRequired,
    itf: PropTypes.object.isRequired,
    active: PropTypes.bool.isRequired
  }
  constructor (props) {
    super(props)
    this.state = { update: false }
  }
  render () {
    let { store } = this.context
    let { auth, repository, mod, itf } = this.props
    let selectHref = StoreStateRouterLocationURI(store).setSearch('itf', itf.id).href()
    let isOwned = repository.owner.id === auth.id
    let isJoined = repository.members.find(itme => itme.id === auth.id)
    return (
      <div className='Interface clearfix'>
        {/* 这层 name 包裹的有点奇怪，name 应该直接加到 a 上 */}
        {/* TODO 2.3 <a> 的范围应该扩大至整个 Interface，否则只有点击到 <a> 才能切换，现在不容易点击到 <a> */}
        <span className='name'>
          {itf.locker ? <span className='locked mr5'><GoLock /></span> : null}
          <Link to={selectHref}><span>{itf.name}</span></Link>
        </span>
        {isOwned || isJoined
          ? <div className='toolbar'>
            {/* DONE 2.2 X 支持双击修改 */}
            {!itf.locker || itf.locker.id === auth.id
              ? <span className='fake-link' onClick={e => this.setState({ update: true })}><GoPencil /></span>
              : null
            }
            <RModal when={this.state.update} onClose={e => this.setState({ update: false })} onResolve={this.handleUpdate}>
              <InterfaceForm title='修改接口' repository={repository} mod={mod} itf={itf} />
            </RModal>
            {!itf.locker
              ? <Link to='' onClick={e => this.handleDelete(e, itf)}><GoTrashcan /></Link>
              : null
            }
          </div>
          : null
        }
      </div>
    )
  }
  handleDelete = (e, itf) => {
    e.preventDefault()
    let message = `接口被删除后不可恢复！\n确认继续删除『#${itf.id} ${itf.name}』吗？`
    if (window.confirm(message)) {
      let { onDeleteInterface } = this.context
      onDeleteInterface(itf.id, () => {
        let { store } = this.context
        let uri = StoreStateRouterLocationURI(store)
        let deleteHref = this.props.active ? uri.removeSearch('itf').href() : uri.href()
        store.dispatch(replace(deleteHref))
      })
    }
  }
  handleUpdate = (e) => {
    let { store } = this.context
    let uri = StoreStateRouterLocationURI(store)
    store.dispatch(replace(uri.href()))
  }
}

class InterfaceList extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired,
    onSortInterfaceList: PropTypes.func.isRequired
  }
  static propTypes = {
    auth: PropTypes.object.isRequired,
    repository: PropTypes.object.isRequired,
    mod: PropTypes.object.isRequired,
    itfs: PropTypes.array,
    itf: PropTypes.object
  }
  constructor (props) {
    super(props)
    this.state = { create: false }
  }
  render () {
    let { auth, repository, mod, itfs = [], itf } = this.props
    if (!mod.id) return null
    let isOwned = repository.owner.id === auth.id
    let isJoined = repository.members.find(itme => itme.id === auth.id)
    return (
      <article className='InterfaceList'>
        <RSortable onChange={this.handleSort} disabled={!isOwned && !isJoined}>
          <ul className='body'>
            {itfs.map(item =>
              <li key={item.id} className={item.id === itf.id ? 'active sortable' : 'sortable'} data-id={item.id}>
                <Interface repository={repository} mod={mod} itf={item} active={item.id === itf.id} auth={auth} />
              </li>
            )}
          </ul>
        </RSortable>
        {isOwned || isJoined
          ? <div className='footer'>
            {/* DONE 2.2 反复 setState() 还是很繁琐，需要提取一个类似 DialogController 的组件 */}
            {/* DONE 2.2 如何重构为高阶组件 */}
            <span className='fake-link' onClick={e => this.setState({ create: true })}>
              <span className='fontsize-14'><GoRocket /></span> 新建接口
            </span>
            <RModal when={this.state.create} onClose={e => this.setState({ create: false })} onResolve={this.handleCreate}>
              <InterfaceForm title='新建接口' repository={repository} mod={mod} />
            </RModal>
          </div>
          : null}
      </article>
    )
  }
  handleCreate = (e) => {
    let { store } = this.context
    let uri = StoreStateRouterLocationURI(store)
    store.dispatch(replace(uri.href()))
  }
  handleSort = (e, sortable) => {
    let { onSortInterfaceList } = this.context
    onSortInterfaceList(sortable.toArray())
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
})
const mapDispatchToProps = ({})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InterfaceList)
