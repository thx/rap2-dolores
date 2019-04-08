/**
 * Created by wangxungang on 2019/4/3.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { RModal } from '../utils'
import { GoPencil, GoPlus } from 'react-icons/lib/go'
import PropertyList from './PropertyList'

import InterfaceMocksModal from './InterfaceMocksModal'
import './InterfaceMocks.css'

export const RequestPropertyList = (props) =>
  <PropertyList scope='request' title='请求参数' label='请求' {...props} />

export const ResponsePropertyList = (props) => (
  <PropertyList scope='response' title='响应内容' label='响应' {...props} />
)

export const RequestAndResponsePropertyList = (props) =>
  <div className={`mock_group_item mock_groupId_${props.groupId} ${props.tabGroupId === props.groupId ? '' : 'hide'}`}>
    <p>groupName : {props.groupName}</p>

    <RequestPropertyList
      {...props}
    />
    <ResponsePropertyList
      {...props}
    />
  </div>

export default class InterfaceMocks extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      // newGroupId: 0,
      update: false,
      tabGroupId: -1,
      groupIds: [],
      _propGroup: {}
    }
  };

  static propTypes = {
    properties: PropTypes.array,
    editable: PropTypes.bool.isRequired,
    repository: PropTypes.object.isRequired,
    mod: PropTypes.object.isRequired,
    itf: PropTypes.object.isRequired,

    /** optional */
    bodyOption: PropTypes.string,
    requestParamsType: PropTypes.string
  }

  getNewGroupId = (groupIdArr) => {
    let _max = Math.max.apply(null, groupIdArr)
    let _newGroupId = _max < -1 ? -1 : _max + 1 || 1
    return _newGroupId
  }

  tabSwitch = (groupId) => {
    this.setState({
      tabGroupId: groupId
    })
  }

  addMockModule = () => {
    if (!this.props.editable) {
      return
    }
    let _newGroupId = this.getNewGroupId(this.state.groupIds)
    this.setState({
      tabGroupId: _newGroupId,
      groupIds: [...this.state.groupIds, _newGroupId]
    })
  }

  updateHandleMocks = (e) => {

  }

  mockPropertiesMap = (properties = this.props.properties) => {
    let _groupIds = []
    let _propGroup = {}

    for (let item of properties) {
      if (!_groupIds.includes(item.groupId)) {
        _groupIds.push(item.groupId)
        _propGroup[item.groupId] = []
      }
      _propGroup[item.groupId].push(item)
    }

    this.setState({
      groupIds: _groupIds,
      propertiesGroup: _propGroup
    })
  }

  componentDidMount () {
    console.log('componentDidMount')
    this.mockPropertiesMap()
  }

  componentWillUnmount () {
  }

  render () {
    return <div className='r-interfaceMocks'>
      <div className='header'>
        mocks 边界
        <span className='fake-link' onClick={e => this.setState({update: true})}><GoPencil/></span>
        <button type='button' onClick={e => this.addMockModule(e)}
                className={`btn btn-success float-right ${this.props.editable ? '' : 'hide'}`}>
          <GoPlus/> 新增
        </button>
      </div>
      <p>当前 mock（{this.props.itf.mockGroupId}） ：default mock</p>
      <RModal when={this.state.update}
              onClose={e => this.setState({update: false})}
              onResolve={e => this.updateHandleMocks(e)}>
        <InterfaceMocksModal itf={this.props.itf} groupIds={this.state.groupIds} title='更新边界'/>
      </RModal>
      <ul className='nav nav-tabs' role='tablist'>
        {
          this.state.groupIds.map(item =>
            <li className='nav-item' key={item}>
              <a className={`nav-link ${item === this.state.tabGroupId ? 'active' : ''}`}
                 onClick={e => this.tabSwitch(item)}
                 aria-controls={item}
                 data-toggle='tab' role='tab'
                 aria-selected='true' aria-disabled={!this.props.editable}>mock {item}</a>
            </li>)
        }
      </ul>
      <div className='mockModules'>
        {
          this.state.groupIds.map(item =>
            <RequestAndResponsePropertyList
              key={item}
              {...this.props}
              groupId={item}
              groupName={item}
              tabGroupId={this.state.tabGroupId}
            />
          )
        }
      </div>
    </div>
  }
}
