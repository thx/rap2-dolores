import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, replace, StoreStateRouterLocationURI, PropTypes } from '../../family'
import { DialogController } from '../utils'
import { serve } from '../../relatives/services/constant'
import InterfaceForm from './InterfaceForm'
import { GoDiffAdded } from 'react-icons/go'
import SpinInline from '../utils/SpinInline'
import { getRelativeUrl } from '../../utils/URLUtils'
import './InterfaceSummary.css'
import { RootState } from 'actions/types'

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
type InterfaceSummaryProps = {
  store: object,
  [x: string]: any,
}
type InterfaceSummaryState = {
  bodyOption?: any,
  requestParamsType?: any,
  method?: any,
  status?: any,
  [x: string]: any,
}
class InterfaceSummary extends Component<InterfaceSummaryProps, InterfaceSummaryState> {
  static contextTypes = {
    onAddForeignRoomCase: PropTypes.func.isRequired,
    onDeleteInterface: PropTypes.func.isRequired,
  }
  constructor(props: any) {
    super(props)
    this.state = {
      bodyOption: BODY_OPTION.FORM_DATA,
      requestParamsType: props.itf.method === 'POST' ? REQUEST_PARAMS_TYPE.BODY_PARAMS : REQUEST_PARAMS_TYPE.QUERY_PARAMS,
    }
    this.changeMethod = this.changeMethod.bind(this)
    this.changeHandler = this.changeHandler.bind(this)
    this.switchBodyOption = this.switchBodyOption.bind(this)
    this.switchRequestParamsType = this.switchRequestParamsType.bind(this)
    this.state.requestParamsType === REQUEST_PARAMS_TYPE.BODY_PARAMS && props.stateChangeHandler(this.state)
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
  renderRoom() {
    const { itf = {}, room = {}, repository = {} } = this.props
    if (!room || !room[repository.id + '_' + itf.id] || !room[repository.id] || room[repository.id] === 'pending') {
      return
    }
    if (room[repository.id + '_' + itf.id] === 'pending') {
      return (
        <li>
          <span className="label">Room用例：</span>
          <SpinInline />
        </li>
      )
    }
    const roomData = room[repository.id + '_' + itf.id]
    const requestStatus = room['+' + repository.id + '_' + itf.id]
    return (
      <li>
        <span className="label">Room用例：</span>
        {roomData.coverage ? (
          <Link target="_blank" to={`http://room.daily.taobao.net/index.html#/design?projectId=${roomData.roomProjectId}`}>
            存在
          </Link>
        ) : (
            !requestStatus && <span>不存在</span>
          )}
        {!requestStatus && (
          <span>
            <Link to="" className="ml10" onClick={e => this.createCase(e, repository.id, itf.id, '普通')}>
              <GoDiffAdded /> 创建普通用例
            </Link>
            <Link to="" className="ml10" onClick={e => this.createCase(e, repository.id, itf.id, '边界')}>
              <GoDiffAdded /> 创建边界用例
            </Link>
          </span>
        )}
        {requestStatus === 'pending' && (
          <span>
            <span className="ml10">
              <GoDiffAdded /> 创建{this.state.name}用例{' '}
            </span>
            <SpinInline />
          </span>
        )}
        {requestStatus === 'failed' && (
          <span className="ml10">
            <GoDiffAdded />
            创建{this.state.name}用例失败
             <Link to="" className="ml10" onClick={e => this.createCase(e, repository.id, itf.id, this.state.name)}>
              {' '}
              重试
            </Link>
          </span>
        )}
        {requestStatus === 'success' && (
          <span className="ml10">
            <GoDiffAdded /> 创建{this.state.name}用例成功
            <Link target="_blank" to={`http://room.daily.taobao.net/index.html#/design?projectId=${roomData.roomProjectId}`}>
              查看
            </Link>
          </span>
        )}
      </li>
    )
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
  render() {
    const { repository = {}, mod = {}, itf = {}, editable } = this.props
    const { requestParamsType } = this.state
    if (!itf.id) { return null }
    return (
      <div className="InterfaceSummary">
        <div className="header">
          <span className="title">{itf.name}</span>

          <span className="hide">
            <DialogController content={<InterfaceForm title="修改接口" repository={repository} mod={mod} itf={itf} />} onResolved={this.handleUpdate}>
              <Link to="" onClick={e => e.preventDefault()} title="修改接口" className="edit">
                编辑
              </Link>
            </DialogController>
            <Link to="" onClick={e => this.handleDelete(e, itf)} className="delete">
              删除
            </Link>
          </span>
        </div>
        <ul className="summary">
          <li>
            <span className="label">地址：</span>
            <a href={`${serve}/app/mock/${repository.id}${getRelativeUrl(itf.url || '')}`} target="_blank" rel="noopener noreferrer">
              {itf.url}
            </a>
          </li>
          <li>
            <span className="label">类型：</span>
            {itf.method}
          </li>
          <li>
            <span className="label">状态码：</span>
            {itf.status}
          </li>
          {itf.description && (
            <li>
              <span className="label">简介：</span>
              {itf.description}
            </li>
          )}
          {this.renderRoom()}
          {editable && (
            <ul className="nav nav-tabs" role="tablist">
              <li className="nav-item" onClick={this.switchRequestParamsType(REQUEST_PARAMS_TYPE.HEADERS)}>
                <button className={`nav-link ${requestParamsType === REQUEST_PARAMS_TYPE.HEADERS ? 'active' : ''}`} role="tab" data-toggle="tab">
                  headers
                </button>
              </li>
              <li className="nav-item" onClick={this.switchRequestParamsType(REQUEST_PARAMS_TYPE.QUERY_PARAMS)}>
                <button className={`nav-link ${requestParamsType === REQUEST_PARAMS_TYPE.QUERY_PARAMS ? 'active' : ''}`} role="tab" data-toggle="tab">
                  Query Params
                </button>
              </li>
              <li className="nav-item" onClick={this.switchRequestParamsType(REQUEST_PARAMS_TYPE.BODY_PARAMS)}>
                <button className={`nav-link ${requestParamsType === REQUEST_PARAMS_TYPE.BODY_PARAMS ? 'active' : ''}`} role="tab" data-toggle="tab">
                  Body Params
                </button>
              </li>
            </ul>
          )}
        </ul>
        {editable && requestParamsType === REQUEST_PARAMS_TYPE.BODY_PARAMS ? (
          <div className="body-options">
            <div className="form-check form-check-inline" onClick={this.switchBodyOption(BODY_OPTION.FORM_DATA)}>
              <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" />
              <label className="form-check-label" htmlFor="inlineRadio1">
                form-data
              </label>
            </div>
            <div className="form-check form-check-inline" onClick={this.switchBodyOption(BODY_OPTION.FORM_URLENCODED)}>
              <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2" />
              <label className="form-check-label" htmlFor="inlineRadio2">
                x-www-form-urlencoded
              </label>
            </div>
            <div className="form-check form-check-inline" onClick={this.switchBodyOption(BODY_OPTION.RAW)}>
              <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option3" />
              <label className="form-check-label" htmlFor="inlineRadio3">
                raw
              </label>
            </div>
            <div className="form-check form-check-inline" onClick={this.switchBodyOption(BODY_OPTION.BINARY)}>
              <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio4" value="option4" />
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
        const deleteHref = this.props.active ? uri.removeSearch('itf').href() : uri.href()
        replace(deleteHref)
      })
    }
  }
  handleUpdate = () => { /** empty */ }
  createCase = (e: any, repositoryId: any, interfaceId: any, name: any) => {
    e.preventDefault()
    this.setState({ name })
    const { onAddForeignRoomCase } = this.context
    onAddForeignRoomCase({
      id: repositoryId,
      itf: interfaceId,
      name,
    })
    // itf.repositoryId
  }
}
const mapStateToProps = (state: RootState) => ({
  room: state.foreign,
})
const mapDispatchToProps = {
  replace,
}
export default connect(mapStateToProps, mapDispatchToProps)(InterfaceSummary)
