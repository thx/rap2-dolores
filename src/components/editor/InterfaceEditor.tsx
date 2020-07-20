import React, { Component } from 'react'
import { PropTypes, connect, _ } from '../../family'
import InterfaceEditorToolbar from './InterfaceEditorToolbar'
import InterfaceSummary, {
  BODY_OPTION,
  REQUEST_PARAMS_TYPE,
  rptFromStr2Num,
} from './InterfaceSummary'
import PropertyList from './PropertyList'
import MoveInterfaceForm from './MoveInterfaceForm'
import { fetchRepository } from '../../actions/repository'
import { RootState } from 'actions/types'
import { lockInterface, unlockInterface, fetchInterface } from 'actions/interface'
import { updateProperties } from 'actions/property'
import { updateInterface } from 'actions/interface'
import Spin from '../../components/utils/Spin'

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
}

type InterfaceEditorState = {
  summaryState: any
  itf: any
  properties: any
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
        bodyOption: BODY_OPTION.FORM_DATA,
        requestParamsType: REQUEST_PARAMS_TYPE.QUERY_PARAMS,
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
      this.props.fetchInterface(this.state.itf.id, () => {})
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
    const { id, locker } = this.state.itf
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
              bodyOption={this.state.summaryState.bodyOption}
              requestParamsType={this.state.summaryState.requestParamsType}
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
    const requestParamsType = this.state.summaryState.requestParamsType
    const rpt = rptFromStr2Num(requestParamsType)

    properties.forEach((item: any) => {
      if (item.memory === undefined) {
        item.memory = true
      }
      if (item.id === undefined) {
        item.id = _.uniqueId('memory-')
      }
      item.pos = rpt
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
        if (cb) {
          cb()
        }
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
    updateInterface(
      {
        id: itf.id,
        name: itf.name,
        url: itf.url,
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
}
export default connect(mapStateToProps, mapDispatchToProps)(InterfaceEditor)
