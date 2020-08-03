import React, { Component } from 'react'
import { PropTypes, connect, _ } from '../../family'
import InterfaceEditorToolbar from './InterfaceEditorToolbar'
import InterfaceSummary from './InterfaceSummary'
import PropertyList from './PropertyList'
import MoveInterfaceForm from './MoveInterfaceForm'
import { fetchRepository } from '../../actions/repository'
import { RootState, Property } from 'actions/types'
import { lockInterface, unlockInterface, fetchInterface } from 'actions/interface'
import { updateProperties } from 'actions/property'
import { updateInterface } from 'actions/interface'
import Spin from '../../components/utils/Spin'
import { showMessage, MSG_TYPE } from 'actions/common'

export const RequestPropertyList = (props: any) => {
  return <PropertyList scope="request" title="请求参数" label="请求" {...props} />
}
export const ResponsePropertyList = (props: any) => (
  <PropertyList scope="response" title="响应内容" label="响应" {...props} />
)
type InterfaceEditorProps = {
  auth: any
  itf: any
  mod: any
  repository: any
  lockInterface: typeof lockInterface
  fetchInterface: typeof fetchInterface
  unlockInterface: typeof unlockInterface
  updateInterface: typeof updateInterface
  updateProperties: typeof updateProperties
  showMessage: typeof showMessage
}

type InterfaceEditorState = {
  summaryState: any
  itf: any
  properties: Property[]
  editable: boolean
  moveInterfaceDialogOpen: boolean
}
// TODO 2.x 参考 MySQL Workbench 的字段编辑器
// TODO 2.x 支持复制整个接口到其他模块、其他项目
class InterfaceEditor extends Component<InterfaceEditorProps, InterfaceEditorState> {
  static childContextTypes = {
    handleUnlockInterface: PropTypes.func.isRequired,
    handleSaveInterfaceAndProperties: PropTypes.func.isRequired,
    handleMoveInterface: PropTypes.func.isRequired,
    handleAddMemoryProperty: PropTypes.func.isRequired,
    handleAddMemoryProperties: PropTypes.func.isRequired,
    handleDeleteMemoryProperty: PropTypes.func.isRequired,
    handleChangeProperty: PropTypes.func.isRequired,
  }
  constructor(props: any) {
    super(props)
    this.state = {
      ...InterfaceEditor.mapPropsToState(props),
      summaryState: {
        bodyOption: props.bodyOption,
      },
      moveInterfaceDialogOpen: false,
    }
    this.summaryStateChange = this.summaryStateChange.bind(this)
  }
  static mapPropsToState(prevProps: any, prevStates: any = {}) {
    const { auth, itf } = prevProps
    const editable = !!(itf.locker && itf.locker.id === auth.id)
    return {
      ...prevStates,
      itf,
      // 编辑模式下不替换 properties
      properties:
        editable && prevStates.properties
          ? prevStates.properties
          : itf.properties?.map((property: any) => ({ ...property })),
      editable,
    }
  }
  getChildContext() {
    return _.pick(this, Object.keys(InterfaceEditor.childContextTypes))
  }

  summaryStateChange(summaryState: any) {
    this.setState({ summaryState })
  }

  componentWillReceiveProps(nextProps: any) {
    if (
      nextProps.itf.id === this.state.itf.id &&
      nextProps.itf.updatedAt === this.state.itf.updatedAt &&
      nextProps.itf.locker === this.state.itf.locker &&
      this.state.properties !== undefined
    ) {
      return
    }
    const prevStates = this.state
    this.setState(InterfaceEditor.mapPropsToState(nextProps, prevStates))
  }

  fetchInterfaceProperties() {
    // 发现接口信息没有 properties 就发起请求
    if (this.state.properties === undefined) {
      this.props.fetchInterface(this.state.itf.id, () => { })
    }
  }

  componentDidMount() {
    this.fetchInterfaceProperties()
  }

  componentDidUpdate() {
    this.fetchInterfaceProperties()
  }

  render() {
    const { auth, repository, mod } = this.props
    const { editable, itf } = this.state
    const { id, locker, bodyOption } = this.state.itf
    if (!id) {
      return null
    }
    return (
      <article className="InterfaceEditor">
        <InterfaceEditorToolbar
          locker={locker}
          auth={auth}
          repository={repository}
          editable={editable}
          itfId={itf.id}
          moveInterface={this.handleMoveInterface}
          handleEditInterface={this.handleEditInterface}
          handleMoveInterface={this.handleMoveInterface}
          handleSaveInterfaceAndProperties={this.handleSaveInterfaceAndProperties}
          handleUnlockInterface={this.handleUnlockInterface}
        />
        <InterfaceSummary
          repository={repository}
          mod={mod}
          itf={itf}
          active={true}
          editable={editable}
          stateChangeHandler={this.summaryStateChange}
          handleChangeInterface={this.handleChangeInterface}
        />

        {this.state.properties ? (
          <>
            <RequestPropertyList
              properties={this.state.properties}
              auth={auth}
              editable={editable}
              repository={repository}
              mod={mod}
              interfaceId={itf.id}
              bodyOption={bodyOption}
              posFilter={this.state.summaryState.posFilter}
              handleChangeProperty={this.handleChangeProperty}
              handleDeleteMemoryProperty={this.handleDeleteMemoryProperty}
            />
            <ResponsePropertyList
              properties={this.state.properties}
              auth={auth}
              editable={editable}
              repository={repository}
              mod={mod}
              interfaceId={itf.id}
              handleChangeProperty={this.handleChangeProperty}
              handleDeleteMemoryProperty={this.handleDeleteMemoryProperty}
            />
          </>
        ) : (
            <Spin />
          )}

        {this.state.moveInterfaceDialogOpen && (
          <MoveInterfaceForm
            title="移动/复制接口"
            mod={mod}
            repository={repository}
            itfId={itf.id}
            open={this.state.moveInterfaceDialogOpen}
            onClose={() => this.setState({ moveInterfaceDialogOpen: false })}
          />
        )}
      </article>
    )
  }
  handleAddMemoryProperty = (property: any, cb: any) => {
    this.handleAddMemoryProperties([property], cb)
  }
  handleAddMemoryProperties = (properties: any, cb: any) => {

    properties.forEach((item: any) => {
      if (item.memory === undefined) {
        item.memory = true
      }
      if (item.id === undefined) {
        item.id = _.uniqueId('memory-')
      }
    })
    const nextState = { properties: [...this.state.properties, ...properties] }
    this.setState(nextState, () => {
      if (cb) {
        cb(properties)
      }
    })
  }
  handleDeleteMemoryProperty = (property: any, cb: any) => {
    const properties = [...this.state.properties]
    const index = properties.findIndex((item) => item.id === property.id)
    if (index >= 0) {
      properties.splice(index, 1)

      // 清除后代属性
      const deletedParentIds = [property.id]
      for (let index = 0; index < properties.length; index++) {
        if (deletedParentIds.indexOf(properties[index].parentId) !== -1) {
          deletedParentIds.push(properties[index].id)
          properties.splice(index--, 1)
          index = 0 // 强制从头开始查找，避免漏掉后代属性
        }
      }

      this.setState({ properties }, () => {
        cb && cb()
      })
    }
  }
  handleChangeProperty = (property: any) => {
    const properties = [...this.state.properties]
    const index = properties.findIndex((item) => item.id === property.id)
    if (index >= 0) {
      properties.splice(index, 1, property)
      this.setState({ properties })
    }
  }
  handleChangeInterface = (newItf: any) => {
    this.setState({
      itf: {
        ...this.state.itf,
        ...newItf,
      },
    })
  }
  handleSaveInterfaceAndProperties = (e: any) => {
    e.preventDefault()
    const { itf } = this.state
    const { updateProperties, updateInterface } = this.props
    if (!itf.name.trim()) {
      this.props.showMessage('名称不能为空', MSG_TYPE.WARNING)
      return
    }

    if (!itf.url.trim()) {
      this.props.showMessage('URL地址不能为空', MSG_TYPE.WARNING)
      return
    }

    if (itf.url.substring(0, 4) !== 'http' && itf.url[0] !== '/') {
      this.props.showMessage('合法的URL地址，需以 http 或 / 开头，例如/a/b 或者 https://www.taobao.com', MSG_TYPE.WARNING)
      return
    }

    // 判断参数命名冲突
    const pMap: { [key: string]: number } = {}
    const getPKey = (p: Property) => `${p.name}|${p.parentId}|${p.scope}`
    for (const p of this.state.properties) {
      if (!p.name.trim()) {
        this.props.showMessage(`有参数未命名，请检查...${p.description ? '描述为：' + p.description : ''}`, MSG_TYPE.WARNING)
        return
      }
      p.name = p.name.trim()
      const key = getPKey(p)
      if (pMap[key]) {
        pMap[key]++
      } else {
        pMap[key] = 1
      }
      if (pMap[key] > 1) {
        this.props.showMessage(`参数${p.name}命名冲突，同层级不能有相同的属性名`, MSG_TYPE.WARNING)
        return
      }
    }

    updateInterface(
      {
        id: itf.id,
        name: itf.name.trim(),
        url: itf.url.trim(),
        method: itf.method,
        status: itf.status,
        description: itf.description,
      },
      () => {
        /** empty */
      },
    )
    updateProperties(this.state.itf.id, this.state.properties, this.state.summaryState, () => {
      this.handleUnlockInterface()
    })
  }
  handleMoveInterface = () => {
    this.setState({
      moveInterfaceDialogOpen: true,
    })
  }
  handleMoveInterfaceSubmit = () => {
    /** empty */
  }
  handleEditInterface = () => {
    const { lockInterface, fetchInterface } = this.props
    fetchInterface(this.state.itf.id, (res: any) => {
      if (!res.locker) {
        lockInterface(res.id)
      }
    })
  }
  handleUnlockInterface = () => {
    const { itf, unlockInterface } = this.props
    unlockInterface(itf.id)
  }
}

const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
  fetchRepository,
})

const mapDispatchToProps = {
  lockInterface,
  fetchInterface,
  unlockInterface,
  updateProperties,
  updateInterface,
  showMessage,
}
export default connect(mapStateToProps, mapDispatchToProps)(InterfaceEditor)
