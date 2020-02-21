import React, { Component } from 'react'
import { PropTypes, connect, Link, replace, _ } from '../../family'
import { serve } from '../../relatives/services/constant'
import { Spin } from '../utils'
import RepositoryForm from '../repository/RepositoryForm'
import RepositorySearcher from './RepositorySearcher'
import ModuleList from './ModuleList'
import InterfaceList from './InterfaceList'
import InterfaceEditor from './InterfaceEditor'
import DuplicatedInterfacesWarning from './DuplicatedInterfacesWarning'
import RapperInstallerModal from './RapperInstallerModal'

import {
  addRepository,
  updateRepository,
  clearRepository,
  fetchRepository
} from '../../actions/repository'
import {
  addModule,
  updateModule,
  deleteModule,
  sortModuleList
} from '../../actions/module'
import {
  addInterface,
  updateInterface,
  deleteInterface,
  lockInterface,
  unlockInterface
} from '../../actions/interface'
import {
  addProperty,
  updateProperty,
  deleteProperty,
  updateProperties,
  sortPropertyList
} from '../../actions/property'
import {
  GoRepo,
  GoPlug,
  GoDatabase,
  GoJersey,
  GoLinkExternal,
  GoPencil,
  GoCode,
  GoEllipsis
} from 'react-icons/go'

import './RepositoryEditor.css'
import ExportPostmanForm from '../repository/ExportPostmanForm'
import { RootState, Repository, Module, Interface } from 'actions/types'
import DefaultValueModal from './DefaultValueModal'

// DONE 2.1 import Spin from '../utils/Spin'
// TODO 2.2 缺少测试器
// DONE 2.2 各种空数据下的视觉效果：空仓库、空模块、空接口、空属性
// TODO 2.1 大数据测试，含有大量模块、接口、属性的仓库

interface Props {
  auth: any
  repository: any
  location: any
  onClearRepository: any
  room: any
  replace: any
  router: any
}

interface States {
  rapperInstallerModalOpen: boolean
  defaultValuesModalOpen: boolean
  update: boolean
  exportPostman: boolean
}

// 展示组件
class RepositoryEditor extends Component<Props, States> {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    repository: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    onClearRepository: PropTypes.func.isRequired,
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
    onAddProperty: PropTypes.func.isRequired,
    onUpdateProperty: PropTypes.func.isRequired,
    onUpdateProperties: PropTypes.func.isRequired,
    onDeleteProperty: PropTypes.func.isRequired,
    onSortPropertyList: PropTypes.func.isRequired,
  }

  constructor(props: any) {
    super(props)
    this.state = {
      update: false,
      exportPostman: false,
      rapperInstallerModalOpen: false,
      defaultValuesModalOpen: false,
    }
  }
  getChildContext() {
    return _.pick(this.props, Object.keys(RepositoryEditor.childContextTypes))
  }

  componentDidMount() {
    // const id = +this.props.location.params.id
    // if (!this.props.repository.data || this.props.repository.data.id !== id) {
    //   this.props.onFetchRepository({ id })
    // }
  }
  render() {
    const {
      location: { params },
      auth,
    } = this.props
    const { repository: repositoryAsync } = this.props
    if (!repositoryAsync.fetching && !repositoryAsync.data) {
      return <div className="p100 fontsize-30 text-center">未找到对应仓库</div>
    }
    if (repositoryAsync.fetching || !repositoryAsync.data || !repositoryAsync.data.id) {
      return <Spin />
    }

    const repository: Repository = repositoryAsync.data
    if (repository.name) {
      document.title = `RAP2 ${repository.name}`
    }

    const mod: Module =
      repository && repository.modules && repository.modules.length
        ? repository.modules.find(item => item.id === +params.mod) ||
          repository.modules[0]
        : {} as Module
    const itf: Interface =
      mod.interfaces && mod.interfaces.length
        ? mod.interfaces.find((item: any) => item.id === +params.itf) ||
          mod.interfaces[0]
        : {} as Interface
    const properties = itf.properties || []

    const ownerlink = repository.organization
      ? `/organization/repository?organization=${repository.organization.id}`
      : `/repository/joined?user=${repository.owner.id}`

    const isOwned = repository.owner.id === auth.id
    const isJoined = repository.members && repository.members.find(
      (item: any) => item.id === auth.id
    )

    return (
      <article className="RepositoryEditor">
        <div className="header">
          <span className="title">
            <GoRepo className="mr6 color-9" />
            <Link to={`${ownerlink}`}>
              {repository.organization
                ? repository.organization.name
                : repository.owner.fullname}
            </Link>
            <span className="slash"> / </span>
            <span>{repository.name}</span>
          </span>
          <div className="toolbar">
            {/* 编辑权限：拥有者或者成员 */}

            {isOwned || isJoined ? (
              <span
                className="fake-link edit"
                onClick={() => this.setState({ update: true })}
              >
                <GoPencil /> 编辑
              </span>
            ) : null}
            <RepositoryForm
              open={this.state.update}
              onClose={ok => {
                ok && this.handleUpdate()
                this.setState({ update: false })
              }}
              title="编辑仓库"
              repository={repository}
            />
            <a
              href={`${serve}/app/plugin/${repository.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="api"
            >
              <GoPlug /> 插件
            </a>
            <a
              href={`${serve}/repository/get?id=${repository.id}&token=${repository.token}`}
              target="_blank"
              rel="noopener noreferrer"
              className="api"
            >
              <GoDatabase /> 数据
            </a>
            <span
              className="fake-link edit"
              onClick={() => this.setState({ exportPostman: true })}
            >
              <GoLinkExternal /> 导出
            </span>

            <ExportPostmanForm
              title="导出"
              open={this.state.exportPostman}
              repoId={repository.id}
              onClose={() => this.setState({ exportPostman: false })}
            />
            <span
              className="fake-link edit"
              onClick={() => this.setState({ defaultValuesModalOpen: true })}
            >
              <GoEllipsis />默认值
            </span>
            <DefaultValueModal
              open={this.state.defaultValuesModalOpen}
              handleClose={() => this.setState({ defaultValuesModalOpen: false })}
              repositoryId={repository.id}
            />
            <span
              className="fake-link edit"
              style={{color: '#f95e49'}}
              onClick={() => this.setState({ rapperInstallerModalOpen: true })}
            >
              <GoCode /> 内测用户你好，点这里可以帮你生成 TS 代码！
            </span>
            <RapperInstallerModal
              open={this.state.rapperInstallerModalOpen}
              handleClose={() => this.setState({ rapperInstallerModalOpen: false })}
              repository={repository}
            />
          </div>
          <RepositorySearcher repository={repository} />
          <div className="desc">{repository.description}</div>
          <DuplicatedInterfacesWarning repository={repository} />
        </div>
        <div className="body">
          <ModuleList
            mods={repository.modules}
            repository={repository}
            mod={mod}
          />
          <div className="InterfaceWrapper">
            <InterfaceList
              itfs={mod.interfaces}
              repository={repository}
              mod={mod}
              itf={itf}
            />
            <InterfaceEditor
              itf={itf}
              properties={properties}
              mod={mod}
              repository={repository}
            />
          </div>
        </div>
      </article >
    )
  }
  handleUpdate = () => {
    const { pathname, hash, search } = this.props.router.location
    this.props.replace(pathname + search + hash)
  };
}

// 容器组件
const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
  repository: state.repository,
  router: state.router,
})
const mapDispatchToProps = {
  onFetchRepository: fetchRepository,
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
  onAddProperty: addProperty,
  onUpdateProperty: updateProperty,
  onUpdateProperties: updateProperties,
  onDeleteProperty: deleteProperty,
  onSortPropertyList: sortPropertyList,
  replace,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RepositoryEditor)
