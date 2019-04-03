import React, { Component } from 'react'
import { PropTypes, Link, replace, StoreStateRouterLocationURI } from '../../family'
import { DialogController } from '../utils'
import { GoPencil,GoLink } from 'react-icons/lib/go'
import { serve } from '../../relatives/services/constant'
import InterfaceForm from './InterfaceForm'
import { getRelativeUrl } from '../../utils/URLUtils'
import './InterfaceSummary.css'

export const BODY_OPTION = {
  FORM_DATA: 'FORM_DATA',
  FORM_URLENCODED: 'FORM_URLENCODED',
  RAW: 'RAW',
  BINARY: 'BINARY'
}

export const REQUEST_PARAMS_TYPE = {
  HEADERS: 'HEADERS',
  QUERY_PARAMS: 'QUERY_PARAMS',
  BODY_PARAMS: 'BODY_PARAMS'
}

export function rptFromStr2Num(rpt) {
  let pos = 2
  if (rpt === 'HEADERS') {
    pos = 1
  } else if (rpt === 'BODY_PARAMS') {
    pos = 3
  }
  return pos
}

class InterfaceSummary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bodyOption: BODY_OPTION.FORM_DATA,
      requestParamsType: props.itf.method === 'POST' ? REQUEST_PARAMS_TYPE.BODY_PARAMS : REQUEST_PARAMS_TYPE.QUERY_PARAMS
    }
    this.changeMethod = this.changeMethod.bind(this)
    this.changeHandler = this.changeHandler.bind(this)
    this.switchBodyOptions = this.switchBodyOption.bind(this)
    this.switchRequestParamsType = this.switchRequestParamsType.bind(this)
    this.state.requestParamsType === REQUEST_PARAMS_TYPE.BODY_PARAMS && props.stateChangeHandler(this.state)
  }
  static contextTypes = {
    store: PropTypes.object.isRequired,
    onDeleteInterface: PropTypes.func.isRequired
  }
  static propTypes = {
    repository: PropTypes.object.isRequired,
    mod: PropTypes.object.isRequired,
    itf: PropTypes.object.isRequired,
    active: PropTypes.bool.isRequired,
    editable: PropTypes.bool.isRequired,
    stateChangeHandler: PropTypes.func.isRequired
  }
  componentDidUpdate() {
  }
  switchBodyOption(val) {
    return () => {
      this.setState({
        bodyOption: val
      }, () => {
        this.props.stateChangeHandler(this.state)
      })
    }
  }
  switchRequestParamsType(val) {
    return () => {
      this.setState({
        requestParamsType: val
      }, () => {
        this.props.stateChangeHandler(this.state)
      })
    }
  }

  changeMethod(method) {
    this.setState({ method })
  }

  changeStatus(status) {
    this.setState({ status })
  }

  changeHandler(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    const { repository = {}, mod = {}, itf = {}, editable } = this.props
    const { requestParamsType } = this.state
    if (!itf.id) return null

    return (
      <div className='InterfaceSummary'>
        <div className='header'>
          <span className='title'>
            {itf.name}
            <a href={`${serve}/app/mock/${repository.id}${getRelativeUrl(itf.url || '')}`} target='_blank'><GoLink /></a>
          </span>
          {/* TODO 2.2 √模板接口、√数据接口、JSONSchema 接口 */}
          {/* TODO 2.2 权限控制，被别人锁定时不能编辑和删除 */}
          {/* TODO 2.2 这里的接口编辑和右侧的编辑容易引起歧义，很难受 */}
          <span className='hide'>
            <DialogController content={<InterfaceForm title='修改接口' repository={repository} mod={mod} itf={itf} />} onResolved={this.handleUpdate}>
              <Link to='' onClick={e => e.preventDefault()} title='修改接口' className='edit'>编辑</Link>
            </DialogController>
            <Link to='' onClick={e => this.handleDelete(e, itf)} className='delete'>删除</Link>
          </span>
        </div>
        <ul className='body'>
          <li>
            <span className='label'>地址：</span>
            <a href={`${serve}/app/mock/all${getRelativeUrl(itf.url || '')}`} target='_blank'>{itf.url}</a>
          </li>
          <li><span className='label'>类型：</span>
            {itf.method}
          </li>
          <li><span className='label'>状态码：</span>
            {itf.status}
          </li>
          {itf.description &&
            <li><span className='label'>简介：</span>{itf.description}</li>
          }
          {editable &&
          <ul className='nav nav-tabs' role='tablist'>
            <li className='nav-item' onClick={this.switchRequestParamsType(REQUEST_PARAMS_TYPE.HEADERS)}>
              <a className={`nav-link ${requestParamsType === REQUEST_PARAMS_TYPE.HEADERS ? 'active' : ''}`} role='tab' data-toggle='tab'>headers</a>
            </li>
            <li className='nav-item' onClick={this.switchRequestParamsType(REQUEST_PARAMS_TYPE.QUERY_PARAMS)}>
              <a className={`nav-link ${requestParamsType === REQUEST_PARAMS_TYPE.QUERY_PARAMS ? 'active' : ''}`} role='tab' data-toggle='tab'>Query Params</a>
            </li>
            <li className='nav-item' onClick={this.switchRequestParamsType(REQUEST_PARAMS_TYPE.BODY_PARAMS)}>
              <a className={`nav-link ${requestParamsType === REQUEST_PARAMS_TYPE.BODY_PARAMS ? 'active' : ''}`} role='tab' data-toggle='tab'>Body Params</a>
            </li>
          </ul>
          }
        </ul>
        {editable && requestParamsType === REQUEST_PARAMS_TYPE.BODY_PARAMS
          ? <div className='body-options'>
            <div className='form-check form-check-inline' onClick={this.switchBodyOption(BODY_OPTION.FORM_DATA)}>
              <input className='form-check-input' type='radio' name='inlineRadioOptions' id='inlineRadio1' value='option1' />
              <label className='form-check-label' htmlFor='inlineRadio1'>form-data</label>
            </div>
            <div className='form-check form-check-inline' onClick={this.switchBodyOption(BODY_OPTION.FORM_URLENCODED)}>
              <input className='form-check-input' type='radio' name='inlineRadioOptions' id='inlineRadio2' value='option2' />
              <label className='form-check-label' htmlFor='inlineRadio2'>x-www-form-urlencoded</label>
            </div>
            <div className='form-check form-check-inline' onClick={this.switchBodyOption(BODY_OPTION.RAW)}>
              <input className='form-check-input' type='radio' name='inlineRadioOptions' id='inlineRadio3' value='option3' />
              <label className='form-check-label' htmlFor='inlineRadio3'>raw</label>
            </div>
            <div className='form-check form-check-inline' onClick={this.switchBodyOption(BODY_OPTION.BINARY)}>
              <input className='form-check-input' type='radio' name='inlineRadioOptions' id='inlineRadio4' value='option4' />
              <label className='form-check-label' htmlFor='inlineRadio4'>binary</label>
            </div>
          </div> : null
        }
      </div>
    )
  }
  handleDelete = (e, itf) => {
    e.preventDefault()
    let message = '接口被删除后不可恢复！\n确认继续删除吗？'
    if (window.confirm(message)) {
      let { onDeleteInterface } = this.context
      onDeleteInterface(itf.id, () => {
        let { store } = this.context
        let uri = StoreStateRouterLocationURI(store)
        let deleteHref = this.props.active ? uri.removeSearch('itf').href() : uri.href()
        store.dispatch(replace(deleteHref))
      })
    }
  }
  handleUpdate = () => {
  }
}

export default InterfaceSummary
