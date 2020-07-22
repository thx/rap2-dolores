import React, { Component } from 'react'
import { connect } from 'react-redux'
import copy from 'clipboard-copy'
import { GlobalHotKeys } from 'react-hotkeys'
import { replace, StoreStateRouterLocationURI, PropTypes } from '../../family'
import { serve } from '../../relatives/services/constant'
import { METHODS, STATUS_LIST } from './InterfaceForm'
import { CopyToClipboard } from '../utils/'
import { getRelativeUrl } from '../../utils/URLUtils'
import './InterfaceSummary.css'
import { showMessage, MSG_TYPE } from 'actions/common'
import { TextField, Select, InputLabel, Input, MenuItem, FormControl, RadioGroup, FormControlLabel, Radio } from '@material-ui/core'
import Markdown from 'markdown-to-jsx'

export enum BODY_OPTION {
  FORM_DATA = 'FORM_DATA',
  FORM_URLENCODED = 'FORM_URLENCODED',
  RAW = 'RAW',
  BINARY = 'BINARY',
}

export function formatBodyOption(type: BODY_OPTION) {
  switch (type) {
    case BODY_OPTION.BINARY:
      return 'Binary'
    case BODY_OPTION.FORM_DATA:
      return 'FormData'
    case BODY_OPTION.FORM_URLENCODED:
      return 'UrlEncoded'
    case BODY_OPTION.RAW:
      return 'Raw'
    default:
      return '-'
  }
}

export const BODY_OPTION_LIST = [
  { label: 'form-data', value: BODY_OPTION.FORM_DATA },
  { label: 'x-www-form-urlencoded', value: BODY_OPTION.FORM_URLENCODED },
  { label: 'raw', value: BODY_OPTION.RAW },
  { label: 'binary', value: BODY_OPTION.BINARY },
]

/**
 * 参数类型
 */
export enum POS_TYPE {
  QUERY = 2,
  HEADER = 1,
  BODY = 3,
  PRE_REQUEST_SCRIPT = 4,
  TEST = 5
}

function url2name(itf: any) {
  // copy from http://gitlab.alibaba-inc.com/thx/magix-cli/blob/master/platform/rap.js#L306
  const method = itf.method.toLowerCase()
  const apiUrl = itf.url
  const projectId = itf.repositoryId
  const id = itf.id
  // eslint-disable-next-line
  const regExp = /^(?:https?:\/\/[^\/]+)?(\/?.+?\/?)(?:\.[^./]+)?$/
  const regExpExec = regExp.exec(apiUrl)

  if (!regExpExec) {
    return {
      ok: false,
      name: '',
      message: `\n  ✘ 您的rap接口url设置格式不正确，参考格式：/api/test.json (接口url:${apiUrl}, 项目id:${projectId}, 接口id:${id})\n`,
    }
  }

  const urlSplit = regExpExec[1].split('/')

  // 接口地址为RESTful的，清除占位符
  // api/:id/get -> api//get
  // api/bid[0-9]{4}/get -> api//get
  urlSplit.forEach((item, i) => {
    // eslint-disable-next-line
    if (/\:id/.test(item)) {
      urlSplit[i] = '$id'
      // eslint-disable-next-line
    } else if (/[\[\]\{\}]/.test(item)) {
      urlSplit[i] = '$regx'
    }
  })

  // 只去除第一个为空的值，最后一个为空保留
  // 有可能情况是接口 /api/login 以及 /api/login/ 需要同时存在
  if (urlSplit[0].trim() === '') {
    urlSplit.shift()
  }

  urlSplit.push(method)

  const urlToName = urlSplit.join('_')
  return {
    ok: true,
    name: urlToName,
    message: '',
  }
}
type InterfaceSummaryProps = {
  store: object;
  handleChangeInterface: (itf: any) => void;
  showMessage: typeof showMessage;
  [x: string]: any;
}
type InterfaceSummaryState = {
  bodyOption?: any
  method?: any
  status?: any
  posFilter: POS_TYPE
  [x: string]: any
}
class InterfaceSummary extends Component<
  InterfaceSummaryProps,
  InterfaceSummaryState
  > {
  static contextTypes = {
    onDeleteInterface: PropTypes.func.isRequired,
  }
  constructor(props: any) {
    super(props)
    this.state = {
      bodyOption: props?.itf?.bodyOption ?? BODY_OPTION.FORM_DATA,
      posFilter: props?.itf?.method === 'POST' ? POS_TYPE.BODY : POS_TYPE.QUERY,
    }
    this.changeMethod = this.changeMethod.bind(this)
    this.changeHandler = this.changeHandler.bind(this)
    this.switchBodyOption = this.switchBodyOption.bind(this)
    this.switchPos = this.switchPos.bind(this)
    this.copyModelName = this.copyModelName.bind(this)
    props.stateChangeHandler && props.stateChangeHandler(this.state)
  }
  switchBodyOption(val: BODY_OPTION) {
    this.setState({ bodyOption: val },
      () => {
        this.props.stateChangeHandler(this.state)
      }
    )
  }
  switchPos(val: POS_TYPE) {
    return () => {
      this.setState( { posFilter: val },
        () => {
          this.props.stateChangeHandler(this.state)
        }
      )
    }
  }
  changeMethod(method: any) {
    this.setState({ method })
  }
  changeStatus(status: any) {
    this.setState({ status })
  }
  changeHandler(e: any) {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }
  copyModelName() {
    const { itf = {} } = this.props
    const res = url2name(itf)
    if (!res.ok) {
      this.props.showMessage(`复制失败: ${res.message}`, MSG_TYPE.ERROR)
      return
    }
    const modelName = res.name
    copy(modelName)
      .then(() => {
        this.props.showMessage(
          `成功复制 ${modelName} 到剪贴板`,
          MSG_TYPE.SUCCESS
        )
      })
      .catch(() => {
        this.props.showMessage(`复制失败`, MSG_TYPE.ERROR)
      })
  }
  render() {
    const {
      repository = {},
      itf = {},
      editable,
      handleChangeInterface,
    } = this.props
    const { posFilter } = this.state
    const keyMap = {
      COPY_MODEL_NAME: ['ctrl+alt+c'],
    }

    const handlers = {
      COPY_MODEL_NAME: this.copyModelName,
    }

    if (!itf.id) {
      return null
    }
    return (
      <div className="InterfaceSummary">
        <GlobalHotKeys keyMap={keyMap} handlers={handlers} />
        {!editable && (
          <div className="header">
            <CopyToClipboard text={itf.name}>
              <span className="title">{itf.name}</span>
            </CopyToClipboard>
          </div>
        )}
        <ul className="summary">
          {editable ? (
            <div style={{ maxWidth: 600 }}>
              <div>
                <TextField
                  style={{ marginTop: 0 }}
                  id="name"
                  label="名称"
                  value={itf.name || ''}
                  fullWidth={true}
                  autoComplete="off"
                  onChange={e => {
                    handleChangeInterface({ name: e.target.value })
                  }}
                  margin="normal"
                />
              </div>
              <div>
                <TextField
                  id="url"
                  label="地址"
                  value={itf.url || ''}
                  fullWidth={true}
                  autoComplete="off"
                  onChange={e => {
                    handleChangeInterface({ url: e.target.value })
                  }}
                  margin="normal"
                />
              </div>
              <div>
                <div style={{ width: 90, display: 'inline-block' }}>
                  <InputLabel shrink={true} htmlFor="method-label-placeholder"> 类型 </InputLabel>
                  <Select
                    value={itf.method}
                    input={<Input name="method" id="method-label-placeholder" />}
                    onChange={e => {
                      handleChangeInterface({ method: e.target.value })
                    }}
                    displayEmpty={true}
                    name="method"
                  >
                    {METHODS.map(method => (
                      <MenuItem key={method} value={method}>
                        {method}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                <div style={{ width: 120, display: 'inline-block' }}>
                  <InputLabel shrink={true} htmlFor="status-label-placeholder" style={{ width: 100 }}> 状态码 </InputLabel>
                  <Select
                    value={itf.status}
                    input={<Input name="status" id="status-label-placeholder" />}
                    onChange={e => {
                      handleChangeInterface({ status: e.target.value })
                    }}
                    displayEmpty={true}
                    name="status"
                  >
                    {STATUS_LIST.map(status => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </div>
              <TextField
                id="description"
                label="描述（可多行, 支持Markdown）"
                value={itf.description || ''}
                fullWidth={true}
                multiline={true}
                autoComplete="off"
                rowsMax={8}
                onChange={e => {
                  handleChangeInterface({ description: e.target.value })
                }}
                margin="normal"
              />
            </div>
          ) : (
              <>
                <li>
                  <span className="mr5">
                    <span className="label">接口ID：</span>
                    {itf.id}
                  </span>
                </li>
                <li>
                  <CopyToClipboard text={itf.url} type="right">
                    <span className="mr5">
                      <span className="label">地址：</span>
                      <a
                        href={`${serve}/app/mock/${repository.id}${getRelativeUrl(itf.url || '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {itf.url}
                      </a>
                    </span>
                  </CopyToClipboard>
                </li>
                <li>
                  <span>
                    <span className="label">类型：</span>
                    <span>{itf.method}</span>
                  </span>
                </li>
                <li>
                  <span>
                    <span className="label">状态码：</span>
                    <span>{itf.status}</span>
                  </span>
                </li>
              </>
            )}
        </ul>
        {itf.description && (
          <CopyToClipboard text={itf.description}>
            <Markdown>{itf.description}</Markdown>
          </CopyToClipboard>
        )}
        {
          editable && (
            <ul className="nav nav-tabs" role="tablist">
              <li className="nav-item" onClick={this.switchPos(POS_TYPE.HEADER)} >
                <button
                  className={`nav-link ${posFilter === POS_TYPE.HEADER ? 'active' : ''}`}
                  role="tab"
                  data-toggle="tab"
                >
                  Headers
              </button>
              </li>
              <li className="nav-item" onClick={this.switchPos(POS_TYPE.QUERY)} >
                <button
                  className={`nav-link ${posFilter === POS_TYPE.QUERY ? 'active' : ''}`}
                  role="tab"
                  data-toggle="tab"
                >
                  Query Params
              </button>
              </li>
              <li className="nav-item" onClick={this.switchPos(POS_TYPE.BODY)} >
                <button
                  className={`nav-link ${posFilter === POS_TYPE.BODY ? 'active' : ''}`}
                  role="tab"
                  data-toggle="tab"
                >
                  Body Params
              </button>
              </li>
            </ul>
          )
        }
        {
          editable && posFilter === POS_TYPE.BODY ? (
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="body type"
                name="body-type"
                value={this.state.bodyOption}
                onChange={e => this.switchBodyOption(e.target.value as BODY_OPTION)}
                row={true}
              >
                {BODY_OPTION_LIST.map(x => <FormControlLabel key={x.value} value={x.value} control={<Radio />} label={x.label} />)}
              </RadioGroup>
            </FormControl>
          ) : null
        }
      </div >
    )
  }
  handleDelete = (e: any, itf: any) => {
    e.preventDefault()
    const message = '接口被删除后不可恢复！\n确认继续删除吗？'
    if (window.confirm(message)) {
      const { onDeleteInterface } = this.context
      onDeleteInterface(itf.id, () => {
        const { router, replace } = this.props
        const uri = StoreStateRouterLocationURI(router)
        const deleteHref = this.props.active
          ? uri.removeSearch('itf').href()
          : uri.href()
        replace(deleteHref)
      })
    }
  }
  handleUpdate = () => { /** empty */ }
}
const mapStateToProps = () => ({
})
const mapDispatchToProps = {
  replace,
  showMessage,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InterfaceSummary)
