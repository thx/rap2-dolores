import React, { Component } from 'react'
import { PropTypes, connect, _ } from '../../family'
import InterfaceEditorToolbar from './InterfaceEditorToolbar'
import InterfaceSummary, { BODY_OPTION, REQUEST_PARAMS_TYPE, rptFromStr2Num } from './InterfaceSummary'
import PropertyList from './PropertyList'
import { RModal } from '../utils'
import MoveInterfaceForm from './MoveInterfaceForm'
import { fetchRepository } from '../../actions/repository'
import { RootState } from 'actions/types'
import { lockInterface, unlockInterface } from 'actions/interface'
import { updateProperties } from 'actions/property'
import { updateInterface } from 'actions/interface'

export const RequestPropertyList = (props: any) => {
  return <PropertyList scope="request" title="请求参数" label="请求" {...props} />
}
export const ResponsePropertyList = (props: any) => (
  <PropertyList scope="response" title="响应内容" label="响应" {...props} />
)
type InterfaceEditorProps = {
  auth: any
  itf: any
  properties: any[]
  mod: any
  repository: any
  lockInterface: typeof lockInterface
  unlockInterface: typeof unlockInterface
  updateInterface: typeof updateInterface
  updateProperties: typeof updateProperties
}

type InterfaceEditorState = {
  summaryState: any
  itf: any
  properties: any
  editable: boolean
  moveInterfaceDialogOpen: boolean,
}
// TODO 2.x 参考 MySQL Workbench 的字段编辑器
// TODO 2.x 支持复制整个接口到其他模块、其他项目
class InterfaceEditor extends Component<
  InterfaceEditorProps,
  InterfaceEditorState
  > {
  static childContextTypes = {
    handleLockInterface: PropTypes.func.isRequired,
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
    // { itf: {}, properties: [] }
  }
  static mapPropsToState(prevProps: any, prevStates: any = {}) {
    const { auth, itf, properties } = prevProps
    return {
      ...prevStates,
      itf,
      properties: properties.map((property: any) => ({ ...property })),
      editable: !!(itf.locker && (itf.locker.id === auth.id)),
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
      nextProps.itf.updatedAt === this.state.itf.updatedAt
    ) { return }
    const prevStates = this.state
    this.setState(InterfaceEditor.mapPropsToState(nextProps, prevStates))
  }
  // Use shouldComponentUpdate() to let React know if a component's output is not affected by the current change in state or props.
  // TODO 2.2
  // shouldComponentUpdate (nextProps, nextState) {}

  render() {
    const { auth, repository, mod } = this.props
    const { editable, itf } = this.state
    const { id, locker } = this.state.itf
    if (!id) { return null }
    return (
      <article className="InterfaceEditor">
        <InterfaceEditorToolbar
          locker={locker}
          auth={auth}
          repository={repository}
          editable={editable}
          itfId={itf.id}
          moveInterface={this.handleMoveInterface}
          handleLockInterface={this.handleLockInterface}
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
        <RequestPropertyList
          properties={this.state.properties}
          auth={auth}
          editable={editable}
          repository={repository}
          mod={mod}
          itf={this.state.itf}
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
          itf={this.state.itf}
          handleChangeProperty={this.handleChangeProperty}
          handleDeleteMemoryProperty={this.handleDeleteMemoryProperty}
        />
        <RModal
          when={this.state.moveInterfaceDialogOpen}
          onClose={() => this.setState({ moveInterfaceDialogOpen: false })}
          onResolve={this.handleMoveInterfaceSubmit}
        >
          <MoveInterfaceForm title="移动接口" repository={repository} itfId={itf.id} />
        </RModal>
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
      if (item.memory === undefined) { item.memory = true }
      if (item.id === undefined) { item.id = _.uniqueId('memory-') }
      item.pos = rpt
    })
    const nextState = { properties: [...this.state.properties, ...properties] }
    this.setState(nextState, () => {
      if (cb) { cb(properties) }
    })
  }
  handleDeleteMemoryProperty = (property: any, cb: any) => {
    const properties = [...this.state.properties]
    const index = properties.findIndex(item => item.id === property.id)
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
        if (cb) { cb() }
      })
    }
  }
  handleChangeProperty = (property: any) => {
    const properties = [...this.state.properties]
    const index = properties.findIndex(item => item.id === property.id)
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
    updateInterface({
      id: itf.id,
      name: itf.name,
      url: itf.url,
      method: itf.method,
      status: itf.status,
      description: itf.description,
    }, () => {
      /** empty */
    })
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
  handleLockInterface = () => {
    const { itf, lockInterface } = this.props
    lockInterface(itf.id)
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
  unlockInterface,
  updateProperties,
  updateInterface,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InterfaceEditor)
