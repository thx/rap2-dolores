import React, { Component } from 'react'
import { PropTypes, connect, _ } from '../../family'
import InterfaceEditorToolbar from './InterfaceEditorToolbar'
import InterfaceSummary from './InterfaceSummary'
import InterfaceHeader, { BODY_OPTION, REQUEST_PARAMS_TYPE, rptFromStr2Num } from './InterfaceHeader'
import InterfaceProxy from './InterfaceProxy'
import InterfaceMocks from './InterfaceMocks'
import { RModal } from '../utils'
import MoveInterfaceForm from './MoveInterfaceForm'
import { fetchRepository } from '../../actions/repository'

// TODO 2.x 参考 MySQL Workbench 的字段编辑器
// TODO 2.x 支持复制整个接口到其他模块、其他项目
class InterfaceEditor extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    itf: PropTypes.object.isRequired,
    properties: PropTypes.array.isRequired,
    mod: PropTypes.object.isRequired,
    repository: PropTypes.object.isRequired
  }
  static contextTypes = {
    store: PropTypes.object.isRequired,
    onLockInterface: PropTypes.func.isRequired,
    onUnlockInterface: PropTypes.func.isRequired,
    onUpdateProperties: PropTypes.func.isRequired
  }
  static childContextTypes = {
    handleLockInterface: PropTypes.func.isRequired,
    handleUnlockInterface: PropTypes.func.isRequired,
    handleSaveInterface: PropTypes.func.isRequired,
    handleMoveInterface: PropTypes.func.isRequired,
    handleAddMemoryProperty: PropTypes.func.isRequired,
    handleAddMemoryProperties: PropTypes.func.isRequired,
    handleDeleteMemoryProperty: PropTypes.func.isRequired,
    handleChangeProperty: PropTypes.func.isRequired,
    handleAddInterfaceMock: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    console.log(`------InterfaceEditor-------`)
    console.log(props)
    this.state = {
      ...InterfaceEditor.mapPropsToState(props),
      // todo 请求头的控制信息暂时 只处理 requestParamsType（Property 数据库存储）
      summaryState: {
        bodyOption: BODY_OPTION.FORM_DATA,
        requestParamsType: REQUEST_PARAMS_TYPE.QUERY_PARAMS
      },
      moveInterfaceDialogOpen: false,
      isAddMocks: false
    }
    this.summaryStateChange = this.summaryStateChange.bind(this)
    // { itf: {}, properties: [] }
  }

  getChildContext () {
    return _.pick(this, Object.keys(InterfaceEditor.childContextTypes))
  }

  static mapPropsToState (prevProps, prevStates) {
    let {auth, itf, properties} = prevProps
    return {
      ...prevStates,
      itf,
      properties: properties.map(property => ({...property})),
      editable: !!(itf.locker && (itf.locker.id === auth.id))
    }
  }

  summaryStateChange (summaryState) {
    this.setState({summaryState})
  }

  componentWillReceiveProps (nextProps) {
    if (
      nextProps.itf.id === this.state.itf.id &&
      nextProps.itf.updatedAt === this.state.itf.updatedAt
    ) return
    const prevStates = this.state
    this.setState(InterfaceEditor.mapPropsToState(nextProps, prevStates))
  }

  // Use shouldComponentUpdate() to let React know if a component's output is not affected by the current change in state or props.
  // TODO 2.2
  // shouldComponentUpdate (nextProps, nextState) {}

  render () {
    const {auth, repository, mod, itf} = this.props
    const {editable} = this.state
    const {id, locker} = this.state.itf
    if (!id) return null
    return (
      <article className='InterfaceEditor'>
        <InterfaceEditorToolbar locker={locker} auth={auth} repository={repository} editable={editable}/>

        <InterfaceSummary repository={repository} mod={mod} itf={itf} active editable={editable}
                          stateChangeHandler={this.summaryStateChange}/>
        <InterfaceProxy itf={itf} auth={auth}/>
        <InterfaceHeader itf={itf} active editable={editable}
                         stateChangeHandler={this.summaryStateChange}/>

        <InterfaceMocks
          properties={this.state.properties}
          editable={editable}
          repository={repository}
          mod={mod}
          itf={this.state.itf}
          bodyOption={this.state.summaryState.bodyOption}
          requestParamsType={this.state.summaryState.requestParamsType}
          isAddMocks={this.state.isAddMocks}
        />

        <RModal
          when={this.state.moveInterfaceDialogOpen}
          onClose={e => this.setState({moveInterfaceDialogOpen: false})}
          onResolve={this.handleMoveInterfaceSubmit}
        >
          <MoveInterfaceForm title='移动接口' repository={repository} itfId={itf.id}/>
        </RModal>
      </article>
    )
  }

  handleAddMemoryProperty = (property, cb) => {
    this.handleAddMemoryProperties([property], cb)
  }
  handleAddMemoryProperties = (properties, cb) => {
    const requestParamsType = this.state.summaryState.requestParamsType
    const rpt = rptFromStr2Num(requestParamsType)

    properties.forEach(item => {
      if (item.memory === undefined) item.memory = true
      if (item.id === undefined) item.id = _.uniqueId('memory-')
      item.pos = rpt
    })
    let nextState = {properties: [...this.state.properties, ...properties]}
    this.setState(nextState, () => {
      if (cb) cb(properties)
    })
  }
  handleDeleteMemoryProperty = (property, cb) => {
    let properties = [...this.state.properties]
    let index = properties.findIndex(item => item.id === property.id)
    if (index >= 0) {
      properties.splice(index, 1)

      // 清除后代属性
      let deletedParentIds = [property.id]
      for (let index = 0; index < properties.length; index++) {
        if (deletedParentIds.indexOf(properties[index].parentId) !== -1) {
          deletedParentIds.push(properties[index].id)
          properties.splice(index--, 1)
          index = 0 // 强制从头开始查找，避免漏掉后代属性
        }
      }

      this.setState({properties}, () => {
        if (cb) cb()
      })
    }
  }
  handleChangeProperty = (property) => {
    let properties = [...this.state.properties]
    let index = properties.findIndex(item => item.id === property.id)
    if (index >= 0) {
      properties.splice(index, 1, property)
      this.setState({properties}, () => { })
    }
  }
  handleAddInterfaceMock = (e) => {
    this.setState({
      isAddMocks: true
    })
  }
  handleSaveInterface = (e) => {
    e.preventDefault()
    const {onUpdateProperties} = this.context
    onUpdateProperties(this.state.itf.id, this.state.properties, this.state.summaryState, () => {
      this.handleUnlockInterface()
    })
  }
  handleMoveInterface = (e) => {
    e.preventDefault()
    this.setState({
      moveInterfaceDialogOpen: true
    })
  }
  handleMoveInterfaceSubmit = () => {
  }
  handleLockInterface = () => {
    let {onLockInterface} = this.context
    let {itf} = this.props
    onLockInterface(itf.id)
  }
  handleUnlockInterface = () => {
    let {onUnlockInterface} = this.context
    let {itf} = this.props
    onUnlockInterface(itf.id)
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  fetchRepository,
})
const mapDispatchToProps = ({})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InterfaceEditor)
