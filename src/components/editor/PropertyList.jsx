import React, { Component } from 'react'
import { PropTypes, connect, Link, replace, StoreStateRouterLocationURI } from '../../family'
import { Tree, SmartTextarea, RModal, RSortable } from '../utils'
import PropertyForm from './PropertyForm'
import Importer from './Importer'
import Previewer from './InterfacePreviewer'
import { GoMention, GoFileCode, GoEye, GoPlus, GoTrashcan, GoQuestion } from 'react-icons/lib/go'

export const RequestPropertyListPreviewer = (props) => (
  <Previewer {...props} />
)

export const ResponsePropertyListPreviewer = (props) => (
  <Previewer {...props} />
)

// DONE 2.2 请求属性有什么用？有必要吗？有，用于订制响应数据。
// DONE 2.2 如何过滤模拟 URL 中额外的请求属性？解析 URL 中的参数到请求属性列表吗？可以在响应数据中引用 配置的请求参数 和 URL 中的额外参数。
// DONE 2.2 支持对属性排序
// DONE 2.2 支持对模块排序
// DONE 2.2 支持对接口排序
// TODO 2.3 检测重复属性

class SortableTreeTableHeader extends Component {
  render () {
    let { editable } = this.props
    return (
      <div className='SortableTreeTableHeader'>
        <div className='flex-row'>
          {/* DONE 2.1 每列增加帮助 Tip */}
          {editable && <div className='th operations' />}
          <div className='th name'>名称</div>
          <div className='th type'>类型</div>
          {/* TODO 2.3 规则编辑器 */}
          <div className='th rule'>
            生成规则
            <Link to='https://github.com/nuysoft/Mock/wiki/Syntax-Specification' className='helper' target='_blank'><GoQuestion /></Link>
          </div>
          <div className='th value'>初始值</div>{/* 对象和数组也允许设置初始值 */}
          <div className='th desc'>简介</div>
        </div>
      </div>
    )
  }
}

class SortableTreeTableRow extends Component {
  render () {
    let { property, editable } = this.props
    let { handleClickCreateChildPropertyButton, handleDeleteMemoryProperty, handleChangePropertyField, handleSortProperties } = this.props
    return (
      <RSortable group={property.depth} handle='.SortableTreeTableRow' disabled={!editable} onChange={handleSortProperties}>
        <div className='RSortableWrapper'>
          {property.children.sort((a, b) => a.priority - b.priority).map(item =>
            <div key={item.id} className='SortableTreeTableRow' data-id={item.id}>
              <div className='flex-row'>
                {editable &&
                  <div className='td operations nowrap'>
                    {(item.type === 'Object' || item.type === 'Array')
                      ? <Link to='' onClick={e => { e.preventDefault(); handleClickCreateChildPropertyButton(item) }}><GoPlus className='fontsize-14 color-6' /></Link>
                      : null}
                    <Link to='' onClick={e => handleDeleteMemoryProperty(e, item)}><GoTrashcan className='fontsize-14 color-6' /></Link>
                  </div>
                }
                <div className={`td payload name depth-${item.depth} nowrap`}>
                  {!editable
                    ? <span className='nowrap'>{item.name}</span>
                    : <input value={item.name} onChange={e => handleChangePropertyField(item.id, 'name', e.target.value)} className='form-control editable' spellCheck='false' placeholder='' />
                  }
                </div>
                <div className='td payload type'>
                  {!editable
                    ? <span className='nowrap'>{item.type}</span>
                    : <select value={item.type} onChange={e => handleChangePropertyField(item.id, 'type', e.target.value)} className='form-control editable'>
                      {['String', 'Number', 'Boolean', 'Object', 'Array', 'Function', 'RegExp'].map(type =>
                        <option key={type} value={type}>{type}</option>
                      )}
                    </select>
                  }
                </div>
                <div className='td payload rule nowrap'>
                  {!editable
                    ? <span className='nowrap'>{item.rule}</span>
                    : <input value={item.rule || ''} onChange={e => handleChangePropertyField(item.id, 'rule', e.target.value)} className='form-control editable' spellCheck='false' placeholder='' />
                  }
                </div>
                <div className='td payload value'>
                  {!editable
                    ? <span>{item.value}</span>
                    : <SmartTextarea value={item.value || ''} onChange={e => handleChangePropertyField(item.id, 'value', e.target.value)} rows='1' className='form-control editable' spellCheck='false' placeholder='' />
                  }
                </div>
                <div className='td payload desc'>
                  {!editable
                    ? <span>{item.description}</span>
                    : <SmartTextarea value={item.description || ''} onChange={e => handleChangePropertyField(item.id, 'description', e.target.value)} rows='1' className='form-control editable' spellCheck='false' placeholder='' />
                  }
                </div>
              </div>
              {item.children && item.children.length ? <SortableTreeTableRow {...this.props} property={item} /> : null }
            </div>
          )}
        </div>
      </RSortable>
    )
  }
}

class SortableTreeTable extends Component {
  render () {
    let { root, editable } = this.props
    return (
      <div className={`SortableTreeTable ${editable ? 'editable' : ''}`}>
        <SortableTreeTableHeader {...this.props} />
        <SortableTreeTableRow {...this.props} property={root} />
      </div>
    )
  }
}

class PropertyList extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired,
    handleDeleteMemoryProperty: PropTypes.func.isRequired,
    handleChangeProperty: PropTypes.func.isRequired,
    onDeleteProperty: PropTypes.func.isRequired,
    onSortPropertyList: PropTypes.func.isRequired
  }
  static propTypes = {
    title: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    scope: PropTypes.string.isRequired,
    properties: PropTypes.array,
    repository: PropTypes.object.isRequired,
    mod: PropTypes.object.isRequired,
    itf: PropTypes.object.isRequired,
    editable: PropTypes.bool.isRequired
  }
  constructor (props) {
    super(props)
    this.state = {
      createProperty: false,
      createChildProperty: false,
      previewer: props.scope === 'response',
      importer: false
    }
  }
  render () {
    let { title, label, scope, properties = [], repository = {}, mod = {}, itf = {} } = this.props
    if (!itf.id) return null

    let scopedProperties = properties.map(property => ({ ...property })).filter(property => property.scope === scope)
    let { editable } = this.props // itf.locker && (itf.locker.id === auth.id)

    return (
      <section className='PropertyList'>
        <div className='header clearfix'>
          <span className='title'>{title || `${label}属性`}</span>
          {/* DONE 2.2 新建按钮暂时合并到按扭组中，单独放出来有点混乱 */}
          <div className='toolbar'>
            <div className='btn-group'>
              {editable && (
                <button type='button' className='btn btn-secondary' onClick={this.handleClickCreatePropertyButton}>
                  <GoMention /> 新建
                </button>
              )}
              {editable && (
                <button type='button' className='btn btn-secondary' onClick={this.handleClickImporterButton}>
                  <GoFileCode className='fontsize-14 color-6' /> 导入
                </button>
              )}
              <button type='button' className={`btn btn-secondary ${this.state.previewer && 'btn-success'}`} onClick={this.handleClickPreviewerButton}>
                <GoEye className='fontsize-14' /> 预览
              </button>
            </div>
          </div>
        </div>
        <div className='body'>
          <SortableTreeTable root={Tree.arrayToTree(scopedProperties)} editable={editable}
            handleClickCreateChildPropertyButton={this.handleClickCreateChildPropertyButton}
            handleDeleteMemoryProperty={this.handleDeleteMemoryProperty}
            handleChangePropertyField={this.handleChangePropertyField}
            handleSortProperties={this.handleSortProperties} />
        </div>
        <div className='footer'>
          {this.state.previewer && <Previewer scope={scope} label={label} properties={properties} itf={itf} />}
        </div>
        <RModal when={this.state.createProperty} onClose={e => this.setState({ createProperty: false })} onResolve={this.handleCreatePropertySucceeded}>
          <PropertyForm title={`新建${label}属性`} scope={scope} repository={repository} mod={mod} itf={itf} />
        </RModal>
        <RModal when={!!this.state.createChildProperty} onClose={e => this.setState({ createChildProperty: false })} onResolve={this.handleCreatePropertySucceeded}>
          <PropertyForm title={`新建${label}属性`} scope={scope} repository={repository} mod={mod} itf={itf} parent={this.state.createChildProperty} />
        </RModal>
        <RModal when={this.state.importer} onClose={e => this.setState({ importer: false })} onResolve={this.handleCreatePropertySucceeded}>
          <Importer title={`导入${label}属性`} repository={repository} mod={mod} itf={itf} scope={scope} />
        </RModal>
      </section>
    )
  }
  handleClickCreatePropertyButton = () => {
    this.setState({ createProperty: true })
  }
  handleClickCreateChildPropertyButton = (item) => {
    this.setState({ createChildProperty: item })
  }
  handleClickImporterButton = () => {
    this.setState({ importer: true })
  }
  handleClickPreviewerButton = () => {
    this.setState({ previewer: !this.state.previewer })
  }
  handleChangePropertyField = (id, key, value) => {
    let { handleChangeProperty } = this.context
    let { properties } = this.props
    let property = properties.find(property => property.id === id)
    handleChangeProperty({ ...property, [key]: value })
  }
  handleCreatePropertySucceeded = () => {
    let { store } = this.context
    let uri = StoreStateRouterLocationURI(store)
    store.dispatch(replace(uri.href()))
  }
  handleDeleteMemoryProperty = (e, property) => {
    e.preventDefault()
    let { handleDeleteMemoryProperty } = this.context
    handleDeleteMemoryProperty(property)
  }
  handleSortProperties = (e, sortable) => {
    // let { onSortPropertyList } = this.context
    // onSortPropertyList(sortable.toArray())
    let { properties } = this.props
    let ids = sortable.toArray()
    ids.forEach((id, index) => {
      let property = properties.find(item => item.id === id || item.id === +id)
      property.priority = index + 1
    })
  }
}
const mapStateToProps = (state) => ({})
const mapDispatchToProps = ({})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertyList)
