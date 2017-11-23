import React, { Component } from 'react'
import { PropTypes, connect, Link, replace, _ } from '../../family'
import { serve } from '../../relatives/services/constant'
import { RModal, Spin } from '../utils'
import RepositoryForm from '../repository/RepositoryForm'
import RepositorySearcher from './RepositorySearcher'
import ModuleList from './ModuleList'
import InterfaceList from './InterfaceList'
import InterfaceEditor from './InterfaceEditor'
import DuplicatedInterfacesWarning from './DuplicatedInterfacesWarning'
import { addRepository, updateRepository, clearRepository } from '../../actions/repository'
import { addModule, updateModule, deleteModule, sortModuleList } from '../../actions/module'
import { addInterface, updateInterface, deleteInterface, lockInterface, unlockInterface, sortInterfaceList } from '../../actions/interface'
import { addProperty, updateProperty, deleteProperty, updateProperties, sortPropertyList } from '../../actions/property'
import { GoRepo, GoPencil, GoPlug, GoDatabase, GoJersey } from 'react-icons/lib/go'

import './RepositoryEditor.css'

// DONE 2.1 import Spin from '../utils/Spin'
// TODO 2.2 缺少测试器
// DONE 2.2 各种空数据下的视觉效果：空仓库、空模块、空接口、空属性
// TODO 2.1 大数据测试，含有大量模块、接口、属性的仓库

// 展示组件
class RepositoryEditor extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }
  static propTypes = {
    auth: PropTypes.object.isRequired,
    repository: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    onClearRepository: PropTypes.func.isRequired
  }
  static childContextTypes = {
    onAddRepository: PropTypes.func.isRequired,
    onUpdateRepository: PropTypes.func.isRequired,
    onAddModule: PropTypes.func.isRequired,
    onUpdateModule: PropTypes.func.isRequired,
    onDeleteModule: PropTypes.func.isRequired,
    onSortModuleList: PropTypes.func.isRequired,
    onAddInterface: PropTypes.func.isRequired,
    onUpdateInterface: PropTypes.func.isRequired,
    onDeleteInterface: PropTypes.func.isRequired,
    onLockInterface: PropTypes.func.isRequired,
    onUnlockInterface: PropTypes.func.isRequired,
    onSortInterfaceList: PropTypes.func.isRequired,
    onAddProperty: PropTypes.func.isRequired,
    onUpdateProperty: PropTypes.func.isRequired,
    onUpdateProperties: PropTypes.func.isRequired,
    onDeleteProperty: PropTypes.func.isRequired,
    onSortPropertyList: PropTypes.func.isRequired
  }
  getChildContext () {
    return _.pick(this.props, Object.keys(RepositoryEditor.childContextTypes))
  }
  constructor (props) {
    super(props)
    this.state = {
      update: false
    }
  }
  render () {
    let { location: { params }, auth, repository } = this.props
    if (!repository.fetching && !repository.data) return <div className='p100 fontsize-40 text-center'>404</div>

    repository = repository.data
    if (!repository.id) return <Spin /> // // DONE 2.2 每次获取仓库都显示加载动画不合理，应该只在初始加载时显示动画。

    let mod = repository && repository.modules && repository.modules.length
      ? (repository.modules.find(item => item.id === +params.mod) || repository.modules[0]) : {}
    let itf = mod.interfaces && mod.interfaces.length
      ? (mod.interfaces.find(item => item.id === +params.itf) || mod.interfaces[0]) : {}
    let properties = itf.properties || []

    let ownerlink = repository.organization
      ? `/organization/repository?organization=${repository.organization.id}`
      : `/repository/joined?user=${repository.owner.id}`

    let isOwned = repository.owner.id === auth.id
    let isJoined = repository.members.find(itme => itme.id === auth.id)

    return (
      <article className='RepositoryEditor'>
        <div className='header'>
          <span className='title'>
            <GoRepo className='mr6 color-9' />
            <Link to={`${ownerlink}`}>{repository.organization ? repository.organization.name : repository.owner.fullname}</Link>
            <span className='slash'> / </span>
            <span>{repository.name}</span>
          </span>
          <div className='toolbar'>
            {/* 编辑权限：拥有者或者成员 */}
            {isOwned || isJoined
              ? <span className='fake-link edit' onClick={e => this.setState({ update: true })}><GoPencil /> 编辑</span>
              : null
            }
            <RModal when={this.state.update} onClose={e => this.setState({ update: false })} onResolve={this.handleUpdate}>
              <RepositoryForm title='编辑仓库' repository={repository} />
            </RModal>
            <Link to={`${serve}/app/plugin/${repository.id}`} target='_blank' className='api'><GoPlug /> 插件</Link>
            <Link to={`${serve}/repository/get?id=${repository.id}`} target='_blank' className='api'><GoDatabase /> 数据</Link>
            <Link to={`${serve}/test/test.plugin.jquery.html?id=${repository.id}`} target='_blank' className='api'><GoJersey /> 测试</Link>
          </div>
          <RepositorySearcher repository={repository} />
          <div className='desc'>{repository.description}</div>
          <DuplicatedInterfacesWarning repository={repository} />
        </div>
        <div className='body'>
          <ModuleList mods={repository.modules} repository={repository} mod={mod} />
          <div className='InterfaceWrapper'>
            <InterfaceList itfs={mod.interfaces} repository={repository} mod={mod} itf={itf} />
            <InterfaceEditor itf={itf} properties={properties} mod={mod} repository={repository} />
          </div>
        </div>
      </article>
    )
  }
  handleUpdate = (e) => {
    let { store } = this.context
    let { pathname, hash, search } = store.getState().router.location
    store.dispatch(replace(pathname + search + hash))
  }
  componentWillUnmount () {
    this.props.onClearRepository()
  }
}

// 容器组件
const mapStateToProps = (state) => ({
  auth: state.auth,
  repository: state.repository
})
const mapDispatchToProps = ({
  onAddRepository: addRepository,
  onUpdateRepository: updateRepository,
  onClearRepository: clearRepository,
  onAddModule: addModule,
  onUpdateModule: updateModule,
  onDeleteModule: deleteModule,
  onSortModuleList: sortModuleList,
  onAddInterface: addInterface,
  onUpdateInterface: updateInterface,
  onDeleteInterface: deleteInterface,
  onLockInterface: lockInterface,
  onUnlockInterface: unlockInterface,
  onSortInterfaceList: sortInterfaceList,
  onAddProperty: addProperty,
  onUpdateProperty: updateProperty,
  onUpdateProperties: updateProperties,
  onDeleteProperty: deleteProperty,
  onSortPropertyList: sortPropertyList
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RepositoryEditor)
