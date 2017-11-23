import React, { Component } from 'react'
import { PropTypes, connect, replace, StoreStateRouterLocationURI, _ } from '../../family'
import InterfaceEditorToolbar from './InterfaceEditorToolbar'
import InterfaceSummary from './InterfaceSummary'
import PropertyList from './PropertyList'

export const RequestPropertyList = (props) => (
  <PropertyList scope='request' title='请求参数' label='请求' {...props} />
)
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
  getChildContext () {
    return _.pick(this, Object.keys(InterfaceEditor.childContextTypes))
    // return {
    //   handleLockInterface: this.handleLockInterface,
    //   handleUnlockInterface: this.handleUnlockInterface,
    //   handleSaveInterface: this.handleSaveInterface,
    //   handleAddMemoryProperty: this.handleAddMemoryProperty,
    //   handleAddMemoryProperties: this.handleAddMemoryProperties,
    //   handleDeleteMemoryProperty: this.handleDeleteMemoryProperty,
    //   handleChangeProperty: this.handleChangeProperty
    // }
  }
  static mapPropsToState (props) {
    let { auth, itf, properties } = props
    return {
      itf: { ...itf },
      properties: properties.map(property => ({...property})),
      editable: !!(itf.locker && (itf.locker.id === auth.id))
    }
  }
  componentDidMount () {}
  componentWillReceiveProps (nextProps) {
    if (
      nextProps.itf.id === this.state.itf.id &&
      nextProps.itf.updatedAt === this.state.itf.updatedAt
    ) return
    this.setState(InterfaceEditor.mapPropsToState(nextProps))
  }
  // Use shouldComponentUpdate() to let React know if a component's output is not affected by the current change in state or props.
  // TODO 2.2
  // shouldComponentUpdate (nextProps, nextState) {}
  constructor (props) {
    super(props)
    this.state = InterfaceEditor.mapPropsToState(props)
    // { itf: {}, properties: [] }
  }
  render () {
    let { auth, repository, mod, itf } = this.props
    let { id, locker } = this.state.itf
    if (!id) return null
    return (
      <article className='InterfaceEditor'>
        <InterfaceEditorToolbar locker={locker} auth={auth} repository={repository} editable={this.state.editable} />
        <InterfaceSummary repository={repository} mod={mod} itf={itf} active />
        <RequestPropertyList properties={this.state.properties} editable={this.state.editable}
          repository={repository} mod={mod} itf={this.state.itf} />
        <ResponsePropertyList properties={this.state.properties} editable={this.state.editable}
          repository={repository} mod={mod} itf={this.state.itf} />
      </article>
    )
  }
  handleAddMemoryProperty = (property, cb) => {
    this.handleAddMemoryProperties([property], cb)
  }
  handleAddMemoryProperties = (properties, cb) => {
    properties.forEach(item => {
      if (item.memory === undefined) item.memory = true
      if (item.id === undefined) item.id = _.uniqueId('memory-')
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
      this.setState({ properties }, () => {})
    }
  }
  handleSaveInterface = (e) => {
    e.preventDefault()
    let { onUpdateProperties } = this.context
    onUpdateProperties(this.state.itf.id, this.state.properties, () => {
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
