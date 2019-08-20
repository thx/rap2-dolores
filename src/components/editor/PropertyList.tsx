import React, { Component } from 'react'
import { PropTypes, Link } from '../../family'
import { Tree, SmartTextarea, RModal, RSortable, CopyToClipboard } from '../utils'
import PropertyForm from './PropertyForm'
import Importer from './Importer'
import Previewer from './InterfacePreviewer'
import { GoPlus, GoTrashcan, GoQuestion } from 'react-icons/go'
import { rptFromStr2Num } from './InterfaceSummary'
import './PropertyList.css'
import { ButtonGroup, Button, Checkbox } from '@material-ui/core'
import JSON5 from 'json5'

export const RequestPropertyListPreviewer = (props: any) => (
  <Previewer {...props} />
)

export const ResponsePropertyListPreviewer = (props: any) => (
  <Previewer {...props} />
)

// DONE 2.2 请求属性有什么用？有必要吗？有，用于订制响应数据。
// DONE 2.2 如何过滤模拟 URL 中额外的请求属性？解析 URL 中的参数到请求属性列表吗？可以在响应数据中引用 配置的请求参数 和 URL 中的额外参数。
// DONE 2.2 支持对属性排序
// DONE 2.2 支持对模块排序
// DONE 2.2 支持对接口排序
// TODO 2.3 检测重复属性

class SortableTreeTableHeader extends Component<any, any> {
  render() {
    const { editable, handleClickCreatePropertyButton } = this.props
    return (
      <div className="SortableTreeTableHeader">
        <div className="flex-row">
          {/* DONE 2.1 每列增加帮助 Tip */}
          {editable && (
            <div className="th operations">
              <Link
                to=""
                onClick={e => {
                  e.preventDefault()
                  handleClickCreatePropertyButton()
                }}
              >
                <GoPlus className="fontsize-14 color-6" />
              </Link>
            </div>
          )}
          <div className="th name">名称</div>
          <div className="th type">必选</div>
          <div className="th type">类型</div>
          {/* TODO 2.3 规则编辑器 */}
          <div className="th rule">
            生成规则
            <a
              href="https://github.com/nuysoft/Mock/wiki/Syntax-Specification"
              rel="noopener noreferrer"
              className="helper"
              target="_blank"
            >
              <GoQuestion />
            </a>
          </div>
          <div className="th value">初始值</div>
          {/* 对象和数组也允许设置初始值 */}
          <div className="th desc">简介</div>
        </div>
      </div>
    )
  }
}

const PropertyLabel = (props: any) => {
  const { pos } = props
  if (pos === 1) {
    return <span className="badge badge-danger">HEAD</span>
  } else if (pos === 3) {
    return <span className="badge badge-primary">BODY</span>
  } else {
    return <span className="badge badge-secondary">QUERY</span>
  }
}

const getFormattedValue = (itf: any) => {
  if ((itf.type === 'Array' || itf.type === 'Object' || itf.type === 'String') && itf.value) {
    try {
      const formatted = JSON.stringify(JSON5.parse(itf.value), undefined, 2)
      return formatted
    } catch (error) {
      return itf.value || ''
    }
  } else {
    return itf.value || ''
  }
}

class SortableTreeTableRow extends Component<any, any> {
  render() {
    const { property, editable } = this.props
    const { handleClickCreateChildPropertyButton, handleDeleteMemoryProperty, handleChangePropertyField, handleSortProperties } = this.props
    return (
      <RSortable group={property.depth} handle=".SortableTreeTableRow" disabled={!editable} onChange={handleSortProperties}>
        <div className={`RSortableWrapper depth${property.depth}`}>
          {property.children.sort((a: any, b: any) => a.priority - b.priority).map((item: any) =>
            <div key={item.id} className="SortableTreeTableRow" data-id={item.id}>
              <div className="flex-row">
                {editable &&
                  <div className="td operations nowrap">
                    {(item.type === 'Object' || item.type === 'Array')
                      ? <Link
                        to=""
                        onClick={e => { e.preventDefault(); handleClickCreateChildPropertyButton(item) }}
                      >
                        <GoPlus className="fontsize-14 color-6" />
                      </Link>
                      : null}
                    <Link to="" onClick={e => handleDeleteMemoryProperty(e, item)}><GoTrashcan className="fontsize-14 color-6" /></Link>
                  </div>
                }
                <div className={`td payload name depth-${item.depth} nowrap`}>
                  {!editable
                    ?
                    <>
                      <CopyToClipboard text={item.name}><span className="nowrap">{item.name}</span></CopyToClipboard>
                      {item.scope === 'request' && item.depth === 0 ?
                        <div style={{ float: 'right' }}><PropertyLabel pos={item.pos} /></div> : null}
                    </>
                    : <input
                      value={item.name}
                      onChange={e => handleChangePropertyField(item.id, 'name', e.target.value)}
                      className="form-control editable"
                      spellCheck={false}
                      placeholder=""
                    />
                  }
                </div>
                <div className={`td payload required type depth-${item.depth} nowrap`}>
                  <Checkbox
                    checked={!!item.required}
                    disabled={!editable}
                    onChange={e =>
                      handleChangePropertyField(
                        item.id,
                        'required',
                        e.target.checked
                      )
                    }
                    color="primary"
                    inputProps={{
                      'aria-label': '必选',
                    }}
                  />
                </div>

                <div className="td payload type">
                  {!editable
                    ? <CopyToClipboard text={item.type.toLowerCase()}><span className="nowrap">{item.type}</span></CopyToClipboard>
                    : <select
                      value={item.type}
                      onChange={e => handleChangePropertyField(item.id, 'type', e.target.value)}
                      className="form-control editable"
                    >
                      {['String', 'Number', 'Boolean', 'Object', 'Array', 'Function', 'RegExp'].map(type =>
                        <option key={type} value={type}>{type}</option>
                      )}
                    </select>
                  }
                </div>
                <div className="td payload rule nowrap">
                  {!editable
                    ? <span className="nowrap">{item.rule}</span>
                    : <input
                      value={item.rule || ''}
                      onChange={e => handleChangePropertyField(item.id, 'rule', e.target.value)}
                      className="form-control editable"
                      spellCheck={false}
                      placeholder=""
                    />
                  }
                </div>
                <div className="td payload value">
                  {!editable
                    ? <CopyToClipboard text={item.value}><span className="value-container">{getFormattedValue(item)}</span></CopyToClipboard>
                    : <SmartTextarea
                      value={item.value || ''}
                      onChange={(e: any) => handleChangePropertyField(item.id, 'value', e.target.value)}
                      rows="1"
                      className="form-control editable"
                      spellCheck={false}
                      placeholder=""
                    />
                  }
                </div>
                <div className="td payload desc">
                  {!editable
                    ? <CopyToClipboard text={item.description}><span>{item.description}</span></CopyToClipboard>
                    : <SmartTextarea
                      value={item.description || ''}
                      onChange={(e: any) => handleChangePropertyField(item.id, 'description', e.target.value)}
                      rows="1"
                      className="form-control editable"
                      spellCheck={false}
                      placeholder=""
                    />
                  }
                </div>
              </div>
              {item.children && item.children.length ? <SortableTreeTableRow {...this.props} property={item} /> : null}
            </div>
          )}
        </div>
      </RSortable>
    )
  }
}

class SortableTreeTable extends Component<any, any> {
  render() {
    const { root, editable } = this.props
    return (
      <div className={`SortableTreeTable ${editable ? 'editable' : ''}`}>
        <SortableTreeTableHeader {...this.props} />
        <SortableTreeTableRow {...this.props} property={root} />
      </div>
    )
  }
}

class PropertyList extends Component<any, any> {
  static propTypes = {
    title: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    scope: PropTypes.string.isRequired,
    properties: PropTypes.array,
    repository: PropTypes.object.isRequired,
    mod: PropTypes.object.isRequired,
    itf: PropTypes.object.isRequired,
    editable: PropTypes.bool.isRequired,

    /** optional */
    bodyOption: PropTypes.string,
    requestParamsType: PropTypes.string,
  }
  constructor(props: any) {
    super(props)
    this.state = {
      createProperty: false,
      createChildProperty: false,
      previewer: props.scope === 'response',
      importer: false,
    }
  }
  render() {
    const { title, label, scope, properties = [], repository = {}, mod = {}, itf = {} } = this.props
    if (!itf.id) { return null }
    const { editable, requestParamsType } = this.props // itf.locker && (itf.locker.id === auth.id)
    const pos = rptFromStr2Num(requestParamsType)
    let scopedProperties = properties.map((property: any) => ({ ...property })).filter((property: any) => property.scope === scope)
    if (scope === 'request' && editable) {
      scopedProperties = scopedProperties.filter((s: any) => s.pos === pos)
    }

    return (
      <section className="PropertyList">
        <div className="header clearfix">
          <span className="title">{title || `${label}属性`}</span>
          <div className="toolbar">
            <ButtonGroup size="small" color="primary">
              {editable && [
                <Button key={1} onClick={this.handleClickCreatePropertyButton}>新建</Button>,
                <Button key={2} onClick={this.handleClickImporterButton}>导入</Button>,
              ]}
              <Button className={this.state.previewer ? 'checked-button' : ''} onClick={this.handleClickPreviewerButton}>
                预览
              </Button>
            </ButtonGroup>
          </div>
        </div>
        <div className="body">
          <SortableTreeTable
            root={Tree.arrayToTree(scopedProperties)}
            editable={editable}
            handleClickCreateChildPropertyButton={this.handleClickCreateChildPropertyButton}
            handleDeleteMemoryProperty={this.handleDeleteMemoryProperty}
            handleChangePropertyField={this.handleChangePropertyField}
            handleSortProperties={this.handleSortProperties}
            handleClickCreatePropertyButton={this.handleClickCreatePropertyButton}
          />
        </div>
        <div className="footer">
          {this.state.previewer && <Previewer scope={scope} label={label} properties={properties} itf={itf} />}
        </div>
        <RModal
          when={this.state.createProperty}
          onClose={() => this.setState({ createProperty: false })}
          onResolve={this.handleCreatePropertySucceeded}
        >
          <PropertyForm title={`新建${label}属性`} scope={scope} repository={repository} mod={mod} itf={itf} />
        </RModal>
        <RModal
          when={!!this.state.createChildProperty}
          onClose={() => this.setState({ createChildProperty: false })}
          onResolve={this.handleCreatePropertySucceeded}
        >
          <PropertyForm title={`新建${label}属性`} scope={scope} repository={repository} mod={mod} itf={itf} parent={this.state.createChildProperty} />
        </RModal>
        <RModal when={this.state.importer} onClose={() => this.setState({ importer: false })} onResolve={this.handleCreatePropertySucceeded}>
          <Importer title={`导入${label}属性`} repository={repository} mod={mod} itf={itf} scope={scope} />
        </RModal>
      </section>
    )
  }
  handleClickCreatePropertyButton = () => {
    this.setState({ createProperty: true })
  }
  handleClickCreateChildPropertyButton = (item: any) => {
    this.setState({ createChildProperty: item })
  }
  handleClickImporterButton = () => {
    this.setState({ importer: true })
  }
  handleClickPreviewerButton = () => {
    this.setState({ previewer: !this.state.previewer })
  }
  handleChangePropertyField = (id: any, key: any, value: any) => {
    const { handleChangeProperty } = this.props
    const { properties } = this.props
    const property = properties.find((property: any) => property.id === id)
    handleChangeProperty({ ...property, [key]: value })
  }
  handleCreatePropertySucceeded = () => {
    /** empty */
  }
  handleDeleteMemoryProperty = (e: any, property: any) => {
    e.preventDefault()
    const { handleDeleteMemoryProperty } = this.props
    handleDeleteMemoryProperty(property)
  }
  handleSortProperties = (_: any, sortable: any) => {
    const { properties } = this.props
    const ids = sortable.toArray()
    ids.forEach((id: any, index: any) => {
      const property = properties.find((item: any) => item.id === id || item.id === +id)
      property.priority = index + 1
    })
  }
}

export default PropertyList
