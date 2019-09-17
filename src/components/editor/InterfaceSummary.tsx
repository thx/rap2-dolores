import React, { Component } from 'react'
import { connect } from 'react-redux'
import copy from 'clipboard-copy'
import { GlobalHotKeys } from 'react-hotkeys'
import {
  replace,
  StoreStateRouterLocationURI,
  PropTypes
} from '../../family'
import { serve } from '../../relatives/services/constant'
import { METHODS, STATUS_LIST } from './InterfaceForm'
import { CopyToClipboard } from '../utils/'
import { getRelativeUrl } from '../../utils/URLUtils'
import './InterfaceSummary.css'
import { RootState } from 'actions/types'
import { showMessage, MSG_TYPE } from 'actions/common'
import {
  TextField,
  Select,
  FormControl,
  InputLabel,
  Input,
  MenuItem
} from '@material-ui/core'

export const BODY_OPTION = {
  FORM_DATA: 'FORM_DATA',
  FORM_URLENCODED: 'FORM_URLENCODED',
  RAW: 'RAW',
  BINARY: 'BINARY',
}
export const REQUEST_PARAMS_TYPE = {
  HEADERS: 'HEADERS',
  QUERY_PARAMS: 'QUERY_PARAMS',
  BODY_PARAMS: 'BODY_PARAMS',
}
export function rptFromStr2Num(rpt: any) {
  let pos = 2
  if (rpt === 'HEADERS') {
    pos = 1
  } else if (rpt === 'BODY_PARAMS') {
    pos = 3
  }
  return pos
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
  bodyOption?: any;
  requestParamsType?: any;
  method?: any;
  status?: any;
  [x: string]: any;
}
class InterfaceSummary extends Component<
  InterfaceSummaryProps,
  InterfaceSummaryState
> {
  static contextTypes = {
    // onAddForeignRoomCase: PropTypes.func.isRequired,
    onDeleteInterface: PropTypes.func.isRequired,
  }
  constructor(props: any) {
    super(props)
    this.state = {
      bodyOption: BODY_OPTION.FORM_DATA,
      requestParamsType:
        props.itf.method === 'POST'
          ? REQUEST_PARAMS_TYPE.BODY_PARAMS
          : REQUEST_PARAMS_TYPE.QUERY_PARAMS,
    }
    this.changeMethod = this.changeMethod.bind(this)
    this.changeHandler = this.changeHandler.bind(this)
    this.switchBodyOption = this.switchBodyOption.bind(this)
    this.switchRequestParamsType = this.switchRequestParamsType.bind(this)
    this.copyModelName = this.copyModelName.bind(this)
    this.state.requestParamsType === REQUEST_PARAMS_TYPE.BODY_PARAMS &&
      props.stateChangeHandler(this.state)
  }
  switchBodyOption(val: any) {
    return () => {
      this.setState(
        {
          bodyOption: val,
        },
        () => {
          this.props.stateChangeHandler(this.state)
        }
      )
    }
  }
  switchRequestParamsType(val: any) {
    return () => {
      this.setState(
        {
          requestParamsType: val,
        },
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
    const { requestParamsType } = this.state
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
            <>
              <li style={{ width: '50%' }}>
                <TextField
                  style={{ marginTop: 0 }}
                  id="name"
                  label="名称"
                  value={itf.name}
                  fullWidth={true}
                  autoComplete="off"
                  onChange={e => {
                    handleChangeInterface({ name: e.target.value })
                  }}
                  margin="normal"
                />
              </li>
              <li style={{ width: '50%' }}>
                <TextField
                  id="url"
                  label="地址"
                  value={itf.url}
                  fullWidth={true}
                  autoComplete="off"
                  onChange={e => {
                    handleChangeInterface({ url: e.target.value })
                  }}
                  margin="normal"
                />
              </li>
              <li style={{ marginTop: 24 }}>
                <FormControl>
                  <InputLabel shrink={true} htmlFor="method-label-placeholder">
                    类型
                  </InputLabel>
                  <Select
                    value={itf.method}
                    input={
                      <Input name="method" id="method-label-placeholder" />
                    }
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
                </FormControl>
                <FormControl style={{ marginLeft: 20 }}>
                  <InputLabel shrink={true} htmlFor="status-label-placeholder">
                    状态码
                  </InputLabel>
                  <Select
                    value={itf.status}
                    input={
                      <Input name="status" id="status-label-placeholder" />
                    }
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
                </FormControl>
              </li>
              <li style={{ width: '50%' }}>
                <TextField
                  id="description"
                  label="描述（可多行）"
                  value={itf.description}
                  fullWidth={true}
                  multiline={true}
                  autoComplete="off"
                  onChange={e => {
                    handleChangeInterface({ description: e.target.value })
                  }}
                  margin="normal"
                />
              </li>
            </>
          ) : (
            <>
              <li>
                <CopyToClipboard text={itf.url}>
                  <span>
                    <span className="label">地址：</span>
                    <a
                      href={`${serve}/app/mock/${repository.id}${getRelativeUrl(
                        itf.url || ''
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {itf.url}
                    </a>
                  </span>
                </CopyToClipboard>
              </li>
              <li>
                <CopyToClipboard text={itf.method}>
                  <span>
                    <span className="label">类型：</span>
                    <span>{itf.method}</span>
                  </span>
                </CopyToClipboard>
              </li>
              <li>
                <CopyToClipboard text={itf.status}>
                  <span>
                    <span className="label">状态码：</span>
                    <span>{itf.status}</span>
                  </span>
                </CopyToClipboard>
              </li>
              {itf.description && (
                <li>
                  <CopyToClipboard text={itf.description}>
                    <span>
                      <span className="label">简介：</span>
                      <span>{itf.description}</span>
                    </span>
                  </CopyToClipboard>
                </li>
              )}
            </>
          )}
        </ul>
        {editable && (
          <ul className="nav nav-tabs" role="tablist">
            <li
              className="nav-item"
              onClick={this.switchRequestParamsType(
                REQUEST_PARAMS_TYPE.HEADERS
              )}
            >
              <button
                className={`nav-link ${
                  requestParamsType === REQUEST_PARAMS_TYPE.HEADERS
                    ? 'active'
                    : ''
                }`}
                role="tab"
                data-toggle="tab"
              >
                headers
              </button>
            </li>
            <li
              className="nav-item"
              onClick={this.switchRequestParamsType(
                REQUEST_PARAMS_TYPE.QUERY_PARAMS
              )}
            >
              <button
                className={`nav-link ${
                  requestParamsType === REQUEST_PARAMS_TYPE.QUERY_PARAMS
                    ? 'active'
                    : ''
                }`}
                role="tab"
                data-toggle="tab"
              >
                Query Params
              </button>
            </li>
            <li
              className="nav-item"
              onClick={this.switchRequestParamsType(
                REQUEST_PARAMS_TYPE.BODY_PARAMS
              )}
            >
              <button
                className={`nav-link ${
                  requestParamsType === REQUEST_PARAMS_TYPE.BODY_PARAMS
                    ? 'active'
                    : ''
                }`}
                role="tab"
                data-toggle="tab"
              >
                Body Params
              </button>
            </li>
          </ul>
        )}
        {editable && requestParamsType === REQUEST_PARAMS_TYPE.BODY_PARAMS ? (
          <div className="body-options">
            <div
              className="form-check"
              onClick={this.switchBodyOption(BODY_OPTION.FORM_DATA)}
            >
              <input
                className="form-check-input"
                type="radio"
                name="inlineRadioOptions"
                id="inlineRadio1"
                value="option1"
              />
              <label className="form-check-label" htmlFor="inlineRadio1">
                form-data
              </label>
            </div>
            <div
              className="form-check"
              onClick={this.switchBodyOption(BODY_OPTION.FORM_URLENCODED)}
            >
              <input
                className="form-check-input"
                type="radio"
                name="inlineRadioOptions"
                id="inlineRadio2"
                value="option2"
              />
              <label className="form-check-label" htmlFor="inlineRadio2">
                x-www-form-urlencoded
              </label>
            </div>
            <div
              className="form-check"
              onClick={this.switchBodyOption(BODY_OPTION.RAW)}
            >
              <input
                className="form-check-input"
                type="radio"
                name="inlineRadioOptions"
                id="inlineRadio3"
                value="option3"
              />
              <label className="form-check-label" htmlFor="inlineRadio3">
                raw
              </label>
            </div>
            <div
              className="form-check"
              onClick={this.switchBodyOption(BODY_OPTION.BINARY)}
            >
              <input
                className="form-check-input"
                type="radio"
                name="inlineRadioOptions"
                id="inlineRadio4"
                value="option4"
              />
              <label className="form-check-label" htmlFor="inlineRadio4">
                binary
              </label>
            </div>
          </div>
        ) : null}
      </div>
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
  // createCase = (e: any, repositoryId: any, interfaceId: any, name: any) => {
  //   e.preventDefault()
  //   this.setState({ name })
  //   const { onAddForeignRoomCase } = this.context
  //   onAddForeignRoomCase({
  //     id: repositoryId,
  //     itf: interfaceId,
  //     name,
  //   })
  //   // itf.repositoryId
  // }
}
const mapStateToProps = (state: RootState) => ({
  room: state.foreign,
})
const mapDispatchToProps = {
  replace,
  showMessage,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InterfaceSummary)
