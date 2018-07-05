import React, { Component } from 'react'
import { PropTypes, connect, replace, StoreStateRouterLocationURI, _ } from '../../family'
import InterfaceEditorToolbar from './InterfaceEditorToolbar'
import InterfaceSummary, { BODY_OPTION, REQUEST_PARAMS_TYPE, rptFromStr2Num } from './InterfaceSummary'
import PropertyList from './PropertyList'

export const RequestPropertyList = (props) => {
  return <PropertyList scope='request' title='请求参数' label='请求' {...props} />
}
export const ResponsePropertyList = (props) => (
  <PropertyList scope='response' title='响应内容' label='响应' {...props} />
)

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
    handleAddMemoryProperty: PropTypes.func.isRequired,
    handleAddMemoryProperties: PropTypes.func.isRequired,
    handleDeleteMemoryProperty: PropTypes.func.isRequired,
    handleChangeProperty: PropTypes.func.isRequired
  }
  constructor (props) {
    super(props)
    this.state = {
      ...InterfaceEditor.mapPropsToState(props),
      summaryState: {
        bodyOption: BODY_OPTION.FORM_DATA,
        requestParamsType: REQUEST_PARAMS_TYPE.QUERY_PARAMS
      }
    }
    this.summaryStateChange = this.summaryStateChange.bind(this)
    // { itf: {}, properties: [] }
  }
  getChildContext () {
    return _.pick(this, Object.keys(InterfaceEditor.childContextTypes))
  }
  static mapPropsToState (prevProps, prevStates) {
    let { auth, itf, properties } = prevProps
    return {
      ...prevStates,
      itf,
      properties: properties.map(property => ({ ...property })),
      editable: !!(itf.locker && (itf.locker.id === auth.id))
    }
  }
  componentDidMount () { }
  summaryStateChange (summaryState) {
    this.setState({ summaryState })
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
    const { auth, repository, mod, itf } = this.props
    const { editable } = this.state
    const { id, locker } = this.state.itf
    if (!id) return null
    return (
      <article className='InterfaceEditor'>
        <InterfaceEditorToolbar locker={locker} auth={auth} repository={repository} editable={editable} />
        <InterfaceSummary repository={repository} mod={mod} itf={itf} active editable={editable} stateChangeHandler={this.summaryStateChange} />
        <RequestPropertyList
          properties={this.state.properties}
          editable={editable}
          repository={repository}
          mod={mod}
          itf={this.state.itf}
          bodyOption={this.state.summaryState.bodyOption}
          requestParamsType={this.state.summaryState.requestParamsType}
        />
        <ResponsePropertyList properties={this.state.properties} editable={editable}
          repository={repository} mod={mod} itf={this.state.itf} />
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
    let nextState = { properties: [...this.state.properties, ...properties] }
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

      this.setState({ properties }, () => {
        if (cb) cb()
      })
    }
  }
  handleChangeProperty = (property) => {
    let properties = [...this.state.properties]
    let index = properties.findIndex(item => item.id === property.id)
    if (index >= 0) {
      properties.splice(index, 1, property)
      this.setState({ properties }, () => { })
    }
  }
  handleSaveInterface = (e) => {
    e.preventDefault()
    const { onUpdateProperties } = this.context
    onUpdateProperties(this.state.itf.id, this.state.properties, this.state.summaryState, () => {
      this.handleUnlockInterface()
    })
  }
  handleLockInterface = () => {
    let { onLockInterface } = this.context
    let { itf } = this.props
    onLockInterface(itf.id, () => {
      let { store } = this.context
      let uri = StoreStateRouterLocationURI(store)
      store.dispatch(replace(uri.href()))
    })
  }
  handleUnlockInterface = () => {
    let { onUnlockInterface } = this.context
    let { itf } = this.props
    onUnlockInterface(itf.id, () => {
      let { store } = this.context
      let uri = StoreStateRouterLocationURI(store)
      store.dispatch(replace(uri.href()))
    })
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
})
const mapDispatchToProps = ({})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InterfaceEditor)
