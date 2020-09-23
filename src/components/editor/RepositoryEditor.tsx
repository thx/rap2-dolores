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
import { addRepository, updateRepository, clearRepository, fetchRepository } from '../../actions/repository'
import { addModule, updateModule, deleteModule, sortModuleList } from '../../actions/module'
import { addInterface, updateInterface, deleteInterface, lockInterface, unlockInterface } from '../../actions/interface'
import { addProperty, updateProperty, deleteProperty, updateProperties, sortPropertyList } from '../../actions/property'
import { GoRepo, GoVersions, GoPlug, GoDatabase, GoCode, GoLinkExternal, GoPencil, GoEllipsis } from 'react-icons/go'
import { FaHistory } from 'react-icons/fa'
import './RepositoryEditor.css'
import ExportPostmanForm from '../repository/ExportPostmanForm'
import ImportSwaggerRepositoryForm from '../repository/ImportSwaggerRepositoryForm'
import { RootState, Repository, Module, Interface } from 'actions/types'
import DefaultValueModal from './DefaultValueModal'
import RapperInstallerModal from './RapperInstallerModal'
import HistoryLogDrawer from './HistoryLogDrawer'
import Joyride from 'react-joyride'
import { Typography } from '@material-ui/core'
import { doFetchUserSettings, updateUserSetting } from 'actions/account'
import Markdown from 'markdown-to-jsx'
import { CACHE_KEY, ENTITY_TYPE } from 'utils/consts'

// DONE 2.1 import Spin from '../utils/Spin'
// TODO 2.2 缺少测试器
// DONE 2.2 各种空数据下的视觉效果：空仓库、空模块、空接口、空属性
// TODO 2.1 大数据测试，含有大量模块、接口、属性的仓库

interface Props {
  auth: any
  repository: any
  location: any
  onClearRepository: any
  replace: any
  router: any
  doFetchUserSettings: typeof doFetchUserSettings
  updateUserSetting: typeof updateUserSetting
}

interface States {
  rapperInstallerModalOpen: boolean
  defaultValuesModalOpen: boolean
  historyLogDrawerOpen: boolean
  update: boolean
  exportPostman: boolean
  importSwagger: boolean
  guideOpen: boolean
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
      importSwagger: false,
      historyLogDrawerOpen: false,
      guideOpen: false,
    }
  }

  getChildContext() {
    return _.pick(this.props, Object.keys(RepositoryEditor.childContextTypes))
  }

  changeDocumentTitle() {
    const repository = this.props.repository.data
    if (repository && repository.name) {
      document.title = `RAP2 ${repository.name}`
    }
  }

  componentDidUpdate() {
    this.changeDocumentTitle()
  }

  componentDidMount() {
    this.changeDocumentTitle()
    this.props.doFetchUserSettings([CACHE_KEY.GUIDE_20200714], (isOk, payload) => {
      const open = !payload.data?.GUIDE_20200714
      if (open) {
        this.setState({ guideOpen: true })
        this.props.updateUserSetting(CACHE_KEY.GUIDE_20200714, '1')
      }
    })
  }

  componentWillUnmount() {
    document.title = `RAP2`
  }

  render() {
    const {
      location: { params },
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

    const mod: any =
      repository && repository.modules && repository.modules.length
        ? repository.modules.find(item => item.id === +params.mod) || repository.modules[0]
        : ({} as Module)
    const itf: Interface =
      mod.interfaces && mod.interfaces.length
        ? mod.interfaces.find((item: any) => item.id === +params.itf) || mod.interfaces[0]
        : ({} as Interface)

    const ownerlink = repository.organization
      ? `/organization/repository?organization=${repository.organization.id}`
      : `/repository/joined?user=${repository.owner.id}`

    return (
      <article className="RepositoryEditor">
        <div className="header">
          <span className="title">
            <GoRepo className="mr6 color-9" />
            <Link to={`${ownerlink}`} className="g-link">
              {repository.organization ? repository.organization.name : repository.owner.fullname}
            </Link>
            <span className="slash"> / </span>
            <span>{repository.name}</span>
          </span>
          <div className="toolbar">
            {/* 编辑权限：拥有者或者成员 */}

            {repository.canUserEdit ? (
              <span className="g-link edit mr1" onClick={() => this.setState({ update: true })}>
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
              className="g-link"
            >
              <GoPlug /> 插件
            </a>
            <a
              href={`${serve}/repository/get?id=${repository.id}&token=${repository.token}`}
              target="_blank"
              rel="noopener noreferrer"
              className="g-link"
            >
              <GoDatabase /> 数据
            </a>
            <span className="g-link edit mr1" onClick={() => this.setState({ importSwagger: true })}>
              <GoLinkExternal /> 导入
            </span>
            <ImportSwaggerRepositoryForm
              open={this.state.importSwagger}
              onClose={ok => {
                ok && this.handleUpdate()
                this.setState({ importSwagger: false })
              }}
              repositoryId={repository.id}
              orgId={(repository.organization || {}).id}
              modId={+mod?.id || 0}
              mode="manual"
            />
            <span className="g-link edit mr1" onClick={() => this.setState({ exportPostman: true })}>
              <GoLinkExternal /> 导出
            </span>
            <ExportPostmanForm
              title="导出"
              open={this.state.exportPostman}
              repoId={repository.id}
              onClose={() => this.setState({ exportPostman: false })}
            />
            <span
              className="g-link edit mr1"
              onClick={() => this.setState({ defaultValuesModalOpen: true })}
            >
              <GoEllipsis /> 默认值
            </span>
            <span
              className="g-link edit mr1 guide-1"
              onClick={() => this.setState({ historyLogDrawerOpen: true })}
            >
              <FaHistory /> 历史
            </span>
            <DefaultValueModal
              open={this.state.defaultValuesModalOpen}
              handleClose={() => this.setState({ defaultValuesModalOpen: false })}
              repositoryId={repository.id}
            />
            <HistoryLogDrawer
              open={this.state.historyLogDrawerOpen}
              onClose={() => this.setState({ historyLogDrawerOpen: false })}
              entityId={repository?.id}
              entityType={ENTITY_TYPE.REPOSITORY}
            />
            <span
              className="g-link edit"
              onClick={() => this.setState({ rapperInstallerModalOpen: true })}
            >
              <GoCode /> Rapper
            </span>
            <RapperInstallerModal
              open={this.state.rapperInstallerModalOpen}
              handleClose={() => this.setState({ rapperInstallerModalOpen: false })}
              repository={repository}
            />
          </div>
          <RepositorySearcher repository={repository} />
          <div className="desc"><Markdown>{repository.description}</Markdown></div>
          {this.renderRelatedProjects()}
          <DuplicatedInterfacesWarning repository={repository} />
        </div>
        <div className="body">
          <ModuleList mods={repository.modules} repository={repository} mod={mod} />
          <div className="InterfaceWrapper">
            <InterfaceList itfs={mod.interfaces} repository={repository} mod={mod} itf={itf} />
            <InterfaceEditor itf={itf} mod={mod} repository={repository} />
          </div>
        </div>
        <Joyride
          continuous={true}
          scrollToFirstStep={true}
          showProgress={true}
          showSkipButton={true}
          run={this.state.guideOpen}
          locale={{
            skip: '跳过',
            next: '下一步',
            back: '上一步',
            last: '完成',
          }}
          steps={[
            {
              title: '历史记录上线',
              disableBeacon: true,
              content: <Typography variant="h6">现在您可以查看项目修改历史了!</Typography>,
              placement: 'top',
              target: '.guide-1',
            },
            {
              title: '历史记录上线',
              disableBeacon: true,
              content: <Typography variant="h6">您也可以查看指定接口的所有改动记录。</Typography>,
              placement: 'top',
              target: '.guide-2',
            }, {
              title: '皮肤自定义上线',
              disableBeacon: true,
              content: <Typography variant="h6">在系统偏好设置里，选择一个喜爱的颜色吧！比如原谅绿？</Typography>,
              placement: 'top',
              target: '.guide-3',
            }
          ]}
        />
      </article>
    )
  }
  renderRelatedProjects() {
    const { repository } = this.props
    const { collaborators } = repository.data
    return (
      <div className="RelatedProjects">
        {collaborators &&
          Array.isArray(collaborators) &&
          collaborators.map(collab => (
            <div className="CollabProject Project" key={`collab-${collab.id}`}>
              <span className="title">
                <GoVersions className="mr5" />
                协同
              </span>
              <Link to={`/repository/editor?id=${collab.id}`}>{collab.name}</Link>
            </div>
          ))}
      </div>
    )
  }
  handleUpdate = () => {
    const { pathname, hash, search } = this.props.router.location
    this.props.replace(pathname + search + hash)
  }
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
  doFetchUserSettings,
  updateUserSetting,
}
export default connect(mapStateToProps, mapDispatchToProps)(RepositoryEditor)
