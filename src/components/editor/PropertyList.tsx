import React, { Component, PureComponent } from 'react'
import { PropTypes, Link } from '../../family'
import { Tree, SmartTextarea, RModal, RSortable, CopyToClipboard } from '../utils'
import { TYPES } from '../../utils/consts'
import PropertyForm from './PropertyForm'
import Importer from './Importer'
import Previewer from './InterfacePreviewer'
import { GoPlus, GoTrashcan, GoQuestion, GoChevronDown, GoChevronRight } from 'react-icons/go'
import './PropertyList.css'
import { ButtonGroup, Button, Checkbox, Tooltip } from '@material-ui/core'
import classNames from 'classnames'
import _ from 'lodash'
import Mock from 'mockjs'
import JSON5 from 'json5'
import { elementInViewport } from 'utils/ElementInViewport'
import { POS_TYPE, BODY_OPTION, formatBodyOption } from './InterfaceSummary'

const mockProperty =
  process.env.NODE_ENV === 'development'
    ? () =>
      Mock.mock({
        'scope|1': ['request', 'response'],
        name: '@WORD(6)',
        'type|1': ['String', 'Number', 'Boolean'],
        'value|1': ['@INT', '@FLOAT', '@TITLE', '@NAME'],
        description: '@CSENTENCE',
        parentId: -1,
        interfaceId: '@NATURAL',
        moduleId: '@NATURAL',
        repositoryId: '@NATURAL',
      })
    : () => ({
      scope: 'response',
      name: '',
      type: 'String',
      value: '',
      description: '',
      parentId: -1,
      interfaceId: undefined,
      moduleId: undefined,
      repositoryId: undefined,
    })

export const RequestPropertyListPreviewer = (props: any) => (
  <Previewer {...props} />
)

export const ResponsePropertyListPreviewer = (props: any) => (
  <Previewer {...props} />
)

/** Object Null 不需要 value */
function isNoValueType(type: string) {
  return ['Object', 'Null'].indexOf(type) > -1
}

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
          <div className="th operations">
            <Link
              to=""
              onClick={e => {
                e.preventDefault()
                handleClickCreatePropertyButton()
              }}
            >
              {editable && <GoPlus className="fontsize-14 color-6" />}
            </Link>
          </div>
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

// const PropertyArrow = (props: { property: any }) => {}

const getFormattedValue = (itf: any) => {
  if (
    (itf.type === 'Array' || itf.type === 'Object' || itf.type === 'String') &&
    itf.value
  ) {
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
interface SortableTreeTableRowState {
  property: {
    children: any[];
    [k: string]: any;
  }
  interfaceId: number
  childrenAdded: boolean
  childrenExpandingIdList: number[]
}
interface SortableTreeTableRowProps {
  /** 当前层级是不是展开 */
  isExpanding: boolean
  interfaceId: number
  [k: string]: any
}
class SortableTreeTableRow extends Component<SortableTreeTableRowProps, SortableTreeTableRowState> {
  static displayName = 'SortableTreeTableRow'
  static whyDidYouRender = true
  focusNameInput: HTMLInputElement | undefined = undefined
  constructor(props: SortableTreeTableRowProps) {
    super(props)
    this.state = {
      property: { children: [] },
      childrenAdded: false,
      childrenExpandingIdList: [],
      interfaceId: -1,
    }
  }
  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    return {
      interfaceId: nextProps.interfaceId,
      property: nextProps.property,
      childrenAdded: nextProps.property.children.length > prevState.property.children.length,
      childrenExpandingIdList:
        nextProps.interfaceId !== prevState.interfaceId
          ? nextProps.property.children.map((item: any) => item.id)
          : prevState.childrenExpandingIdList,
    }
  }
  componentDidMount() {
    this.focusInput()
  }
  componentDidUpdate() {
    this.focusInput()
  }
  focusInput() {
    if (this.focusNameInput && this.state.childrenAdded) {
      this.focusNameInput.focus()
      if (!elementInViewport(this.focusNameInput)) {
        this.focusNameInput.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest',
        })
      }
    }
  }
  render() {
    const {
      property,
      isExpanding,
      interfaceId,
      editable,
      handleClickCreateChildPropertyButton,
      highlightId,
      handleDeleteMemoryProperty,
      handleChangeProperty,
      handleChangePropertyField,
      handleSortProperties,
      bodyOption,
    } = this.props
    return (
      isExpanding && (
        <RSortable
          group={property.depth}
          handle=".SortableTreeTableRow"
          disabled={!editable}
          onChange={handleSortProperties}
        >
          <div className={`RSortableWrapper depth${property.depth}`}>
            {property.children
              .sort((a: any, b: any) => a.priority - b.priority)
              .map((item: any) => {
                const childrenIsExpanding = this.state.childrenExpandingIdList.includes(item.id)
                return (
                  <div key={item.id} className="SortableTreeTableRow" data-id={item.id}>
                    <div
                      className={classNames('flex-row', {
                        highlight: item.id === highlightId,
                      })}
                    >
                      <div className="td operations nowrap">
                        {(item.type === 'Object' || item.type === 'Array') &&
                          item.children &&
                          item.children.length ? (
                            <Link
                              to=""
                              onClick={e => {
                                e.preventDefault()
                                this.setState(prev => ({
                                  ...prev,
                                  childrenExpandingIdList: childrenIsExpanding
                                    ? prev.childrenExpandingIdList.filter(id => id !== item.id)
                                    : [...prev.childrenExpandingIdList, item.id],
                                }))
                              }}
                            >
                              {childrenIsExpanding ? (
                                <GoChevronDown className="fontsize-14 color-6" />
                              ) : (
                                  <GoChevronRight className="fontsize-14 color-6" />
                                )}
                            </Link>
                          ) : null}
                        {editable && (
                          <>
                            {item.type === 'Object' || item.type === 'Array' ? (
                              <Link
                                to=""
                                onClick={e => {
                                  e.preventDefault()
                                  handleClickCreateChildPropertyButton(item)
                                  this.setState(prev => ({
                                    ...prev,
                                    childrenExpandingIdList: _.uniq([
                                      ...prev.childrenExpandingIdList,
                                      item.id,
                                    ]),
                                  }))
                                }}
                              >
                                <GoPlus className="fontsize-14 color-6" />
                              </Link>
                            ) : null}
                            <Link to="" onClick={e => handleDeleteMemoryProperty(e, item)}>
                              <GoTrashcan className="fontsize-14 color-6" />
                            </Link>
                          </>
                        )}
                      </div>
                      <div className={`td payload name depth-${item.depth} nowrap`}>
                        {!editable ? (
                          <>
                            <CopyToClipboard text={item.name} type="right">
                              <span className="name-wrapper nowrap">
                                {item.pos === POS_TYPE.BODY && item.scope === 'request' ? (
                                  <Tooltip title={formatBodyOption(bodyOption ?? BODY_OPTION.RAW)}>
                                    <span>{item.name}</span>
                                  </Tooltip>
                                ) : item.name}
                              </span>
                            </CopyToClipboard>
                            {item.scope === 'request' && item.depth === 0 ? (
                              <div style={{ margin: '1px 0 0 3px' }}>
                                <PropertyLabel pos={item.pos} />
                              </div>
                            ) : null}
                          </>
                        ) : (
                            <input
                              ref={(input: HTMLInputElement) => {
                                if (item.id === highlightId) {
                                  this.focusNameInput = input
                                }
                              }}
                              value={item.name}
                              onChange={e => {
                                handleChangePropertyField(item.id, 'name', e.target.value)
                              }}
                              onKeyPress={e => {
                                if (e.ctrlKey === true && e.charCode === 13) {
                                  // auto fill by name
                                  // TODO: 
                                }
                              }}
                              className="form-control editable"
                              spellCheck={false}
                              placeholder=""
                            />
                          )}
                      </div>
                      <div className={`td payload required type depth-${item.depth} nowrap`}>
                        <Checkbox
                          checked={!!item.required}
                          disabled={!editable}
                          onChange={e =>
                            handleChangePropertyField(item.id, 'required', e.target.checked)
                          }
                          color="primary"
                          inputProps={{
                            'aria-label': '必选',
                          }}
                        />
                      </div>

                      <div className="td payload type">
                        {!editable ? (
                          <CopyToClipboard text={item.type}>
                            <span className="nowrap">{item.type}</span>
                          </CopyToClipboard>
                        ) : (
                            <select
                              value={item.type}
                              onChange={e => {
                                const type = e.target.value
                                if (isNoValueType(type)) {
                                  handleChangeProperty(item.id, {
                                    value: '',
                                    type,
                                  })
                                } else {
                                  handleChangeProperty(item.id, { type })
                                }
                              }}
                              className="form-control editable"
                            >
                              {TYPES.map(type => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                          )}
                      </div>
                      <div className="td payload rule nowrap">
                        {!editable ? (
                          <span className="nowrap">{item.rule}</span>
                        ) : (
                            <input
                              value={item.rule || ''}
                              onChange={e =>
                                handleChangePropertyField(item.id, 'rule', e.target.value)
                              }
                              className="form-control editable"
                              spellCheck={false}
                              placeholder=""
                            />
                          )}
                      </div>
                      <div className="td payload value">
                        {!editable ? (
                          <CopyToClipboard text={item.value}>
                            <span className="value-container">{getFormattedValue(item)}</span>
                          </CopyToClipboard>
                        ) : (
                            <SmartTextarea
                              value={item.value || ''}
                              onChange={(e: any) =>
                                handleChangePropertyField(item.id, 'value', e.target.value)
                              }
                              disabled={isNoValueType(item.type) && !item.value}
                              rows="1"
                              className="form-control editable"
                              spellCheck={false}
                              placeholder=""
                            />
                          )}
                      </div>
                      <div className="td payload desc">
                        {!editable ? (
                          <CopyToClipboard text={item.description}>
                            <span>{item.description}</span>
                          </CopyToClipboard>
                        ) : (
                            <SmartTextarea
                              value={item.description || ''}
                              onChange={(e: any) =>
                                handleChangePropertyField(item.id, 'description', e.target.value)
                              }
                              rows="1"
                              className="form-control editable"
                              spellCheck={false}
                              placeholder=""
                            />
                          )}
                      </div>
                    </div>
                    {item.children && item.children.length ? (
                      <SortableTreeTableRow
                        editable={editable}
                        highlightId={highlightId}
                        interfaceId={interfaceId}
                        handleClickCreateChildPropertyButton={handleClickCreateChildPropertyButton}
                        handleDeleteMemoryProperty={handleDeleteMemoryProperty}
                        handleChangeProperty={handleChangeProperty}
                        handleChangePropertyField={handleChangePropertyField}
                        handleSortProperties={handleSortProperties}
                        property={item}
                        bodyOption={bodyOption}
                        isExpanding={childrenIsExpanding}
                      />
                    ) : null}
                  </div>
                )
              })}
          </div>
        </RSortable>
      )
    )
  }
}

class SortableTreeTable extends Component<any, any> {
  render() {
    const {
      root,
      editable,
      highlightId,
      interfaceId,
      handleClickCreateChildPropertyButton,
      handleDeleteMemoryProperty,
      handleChangeProperty,
      handleChangePropertyField,
      handleSortProperties,
      bodyOption,
    } = this.props
    return (
      <div className={`SortableTreeTable ${editable ? 'editable' : ''}`}>
        <SortableTreeTableHeader {...this.props} />
        <SortableTreeTableRow
          editable={editable}
          highlightId={highlightId}
          handleClickCreateChildPropertyButton={handleClickCreateChildPropertyButton}
          handleDeleteMemoryProperty={handleDeleteMemoryProperty}
          handleChangeProperty={handleChangeProperty}
          handleChangePropertyField={handleChangePropertyField}
          handleSortProperties={handleSortProperties}
          interfaceId={interfaceId}
          property={root}
          isExpanding={true}
          bodyOption={bodyOption}
        />
      </div>
    )
  }
}

class PropertyList extends PureComponent<any, any> {

  static propTypes = {
    title: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    scope: PropTypes.string.isRequired,
    properties: PropTypes.array,
    auth: PropTypes.object.isRequired,
    repository: PropTypes.object.isRequired,
    mod: PropTypes.object.isRequired,
    interfaceId: PropTypes.number.isRequired,
    editable: PropTypes.bool.isRequired,
    /** optional */
    bodyOption: PropTypes.string,
    posFilter: PropTypes.number,
  }
  static contextTypes = {
    handleAddMemoryProperty: PropTypes.func.isRequired,
  }
  constructor(props: any) {
    super(props)
    this.state = {
      highlightId: undefined,
      createProperty: false,
      createChildProperty: false,
      previewer: props.scope === 'response',
      importer: false,
    }
  }
  render() {
    const {
      title,
      label,
      scope,
      properties = [],
      repository = {},
      mod = {},
      interfaceId,
      bodyOption,
      posFilter,
    } = this.props
    if (!interfaceId) {
      return null
    }
    const { editable } = this.props // itf.locker && (itf.locker.id === auth.id)
    let scopedProperties = properties
      .map((property: any) => ({ ...property }))
      .filter((property: any) => property.scope === scope)
    if (scope === 'request' && editable) {
      scopedProperties = scopedProperties.filter((s: any) => s.pos === posFilter)
    }

    return (
      <section className="PropertyList">
        <div className="header clearfix">
          <span className="title">{title || `${label}属性`}</span>
          <div className="toolbar">
            <ButtonGroup size="small" color="primary">
              {editable && [
                <Button key={1} onClick={this.handleClickCreatePropertyButton}>
                  新建
                </Button>,
                <Button key={2} onClick={this.handleClickImporterButton}>
                  导入
                </Button>,
              ]}
              <Button
                className={this.state.previewer ? 'checked-button' : ''}
                onClick={this.handleClickPreviewerButton}
              >
                预览
              </Button>
            </ButtonGroup>
          </div>
        </div>
        <div className="body">
          <SortableTreeTable
            root={Tree.arrayToTree(scopedProperties)}
            bodyOption={bodyOption}
            editable={editable}
            highlightId={this.state.highlightId}
            interfaceId={interfaceId}
            handleClickCreateChildPropertyButton={this.handleClickCreateChildPropertyButton}
            handleDeleteMemoryProperty={this.handleDeleteMemoryProperty}
            handleChangePropertyField={this.handleChangePropertyField}
            handleChangeProperty={this.handleChangeProperty}
            handleSortProperties={this.handleSortProperties}
            handleClickCreatePropertyButton={this.handleClickCreatePropertyButton}
          />
        </div>
        <div className="footer">
          {this.state.previewer && (
            <Previewer
              scope={scope}
              label={label}
              properties={properties}
              interfaceId={interfaceId}
            />
          )}
        </div>
        <RModal
          when={this.state.createProperty}
          onClose={() => this.setState({ createProperty: false })}
          onResolve={this.handleCreatePropertySucceeded}
        >
          <PropertyForm
            title={`新建${label}属性`}
            scope={scope}
            repository={repository}
            mod={mod}
            interfaceId={interfaceId}
          />
        </RModal>
        <RModal
          when={!!this.state.createChildProperty}
          onClose={() => this.setState({ createChildProperty: false })}
          onResolve={this.handleCreatePropertySucceeded}
        >
          <PropertyForm
            title={`新建${label}属性`}
            scope={scope}
            repository={repository}
            mod={mod}
            interfaceId={interfaceId}
            parent={this.state.createChildProperty}
          />
        </RModal>
        <RModal
          when={this.state.importer}
          onClose={() => this.setState({ importer: false })}
          onResolve={this.handleCreatePropertySucceeded}
        >
          <Importer
            title={`导入${label}属性`}
            repository={repository}
            mod={mod}
            interfaceId={interfaceId}
            scope={scope}
            pos={posFilter}
          />
        </RModal>
      </section>
    )
  }
  handleClickCreatePropertyButton = () => {
    this.handleClickCreateChildPropertyButton()
  }
  handleClickCreateChildPropertyButton = (parent: any = { id: -1 }) => {
    const { handleAddMemoryProperty } = this.context
    const { auth, scope, repository = {}, mod = {}, interfaceId } = this.props
    const childId = _.uniqueId('memory-')
    const child = {
      ...mockProperty(),
      id: childId,
      creatorId: auth.id,
      repositoryId: repository.id,
      moduleId: mod.id,
      interfaceId,
      scope,
      parentId: parent.id,
      pos: scope === 'request' ? this.props.posFilter : undefined,
    }
    this.setState({
      highlightId: childId,
    })
    handleAddMemoryProperty(child, () => {
      /** empty */
    })
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
  handleChangeProperty = (id: any, value: any) => {
    const { handleChangeProperty } = this.props
    const { properties } = this.props
    const property = properties.find((property: any) => property.id === id)
    handleChangeProperty({ ...property, ...value })
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
