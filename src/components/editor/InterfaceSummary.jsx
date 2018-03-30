import React, { Component } from 'react'
import { PropTypes, Link, replace, StoreStateRouterLocationURI } from '../../family'
import { DialogController } from '../utils'
import { serve } from '../../relatives/services/constant'
import InterfaceForm from './InterfaceForm'

class InterfaceSummary extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired,
    onDeleteInterface: PropTypes.func.isRequired
  }
  static propTypes = {
    repository: PropTypes.object.isRequired,
    mod: PropTypes.object.isRequired,
    itf: PropTypes.object.isRequired,
    active: PropTypes.bool.isRequired
  }
  render () {
    let { repository = {}, mod = {}, itf = {} } = this.props
    if (!itf.id) return null
    return (
      <div className='InterfaceSummary'>
        <div className='header'>
          <span className='title'>
            {mod.name}
            <span className='slash'> / </span>
            {itf.name}
          </span>
          {/* TODO 2.2 √模板接口、√数据接口、JSONSchema 接口 */}
          {/* TODO 2.2 权限控制，被别人锁定时不能编辑和删除 */}
          {/* TODO 2.2 这里的接口编辑和右侧的编辑容易引起歧义，很难受 */}
          <span className='hide'>
            <DialogController content={<InterfaceForm title='修改接口' repository={repository} mod={mod} itf={itf} />} onResolved={this.handleUpdate}>
              <Link to='' onClick={e => e.preventDefault()} title='修改接口' className='edit'>编辑</Link>
            </DialogController>
            <Link to='' onClick={e => this.handleDelete(e, itf)} className='delete'>删除</Link>
          </span>
        </div>
        <ul className='body'>
          <li>
            <span className='label'>地址：</span>
            <Link to={`${serve}/app/mock/${repository.id}/${itf.url}`} target='_blank'>{itf.url}</Link>
          </li>
          <li><span className='label'>类型：</span>{itf.method}</li>
          {itf.description &&
            <li><span className='label'>简介：</span>{itf.description}</li>
          }
        </ul>
      </div>
    )
  }
  handleDelete = (e, itf) => {
    e.preventDefault()
    let message = '接口被删除后不可恢复！\n确认继续删除吗？'
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

export default InterfaceSummary
