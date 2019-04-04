/**
 * Created by wangxungang on 2019/4/3.
 */
import React from 'react'
import PropTypes from 'prop-types'
import PropertyList from './PropertyList'
import './InterfaceMocks.css'

export const RequestPropertyList = (props) =>
  <PropertyList scope='request' title='请求参数' label='请求' {...props} />

export const ResponsePropertyList = (props) => (
  <PropertyList scope='response' title='响应内容' label='响应' {...props} />
)

class RequestAndResponsePropertyList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      show: props.groupId === -1
    }
  }

  toggle = () => {
    this.setState({
      show: !this.state.show
    })
  }

  render () {
    return <div
      className={`mock_group_item mock_groupId_${this.props.groupId} ${this.props.tabGroupId === this.props.groupId ? '' : 'hide'}`}>
      <p>{this.props.groupName}</p>

      <RequestPropertyList
        {...this.props}
      />
      <ResponsePropertyList
        {...this.props}
      />
    </div>
  }
}

export default class InterfaceMocks extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      newGroupId: 0,
      tabGroupId: -1
    }
  };

  static propTypes = {
    properties: PropTypes.array,
    editable: PropTypes.bool.isRequired,
    repository: PropTypes.object.isRequired,
    mod: PropTypes.object.isRequired,
    itf: PropTypes.object.isRequired,
    isAddMocks: PropTypes.bool.isRequired,

    /** optional */
    bodyOption: PropTypes.string,
    requestParamsType: PropTypes.string
  }

  getNewGroupId = (groupIdArr) => {
    // 已经分配好 newGroupId 。避免触发页面死循环渲染
    if (this.state.newGroupId) {
      return true
    }
    let _max = Math.max.apply(null, groupIdArr)
    let _newGroupId = _max < -1 ? -1 : _max + 1 || 1
    this.setState({
      newGroupId: _newGroupId,
      tabGroupId: _newGroupId
    })
    return true
  }

  tabSwitch = (groupId) => {
    this.setState({
      tabGroupId: groupId
    })
  }

  mockPropertiesMap = (properties) => {
    let _groupIdArr = []
    let _mockDoms = []
    _mockDoms = properties.map(item =>
      _groupIdArr.includes(item.groupId) ? null : _groupIdArr.push(item.groupId) &&
        <div className={`mock_groupId_${item.groupId}`} key={item.groupId}>
          <div className='header'>
            <p>{item.groupName}</p>
          </div>

          <RequestPropertyList
            {...this.props}
            groupId={item.groupId}
          />
          <ResponsePropertyList
            {...this.props}
            groupId={item.groupId}
          />
        </div>
    )

    this.getNewGroupId(_groupIdArr)

    // 首次新增模块
    _mockDoms.push(this.props.isAddMocks && !this.state.newGroupId ?
      <div className={`mock_groupId_temp`}>
        <div className='header'>
          <p>new mock group</p>
        </div>

        <RequestPropertyList
          {...this.props}
          groupId={this.state.newGroupId}
        />
        <ResponsePropertyList
          {...this.props}
          groupId={this.state.newGroupId}
        />
      </div> : null)

    return _mockDoms
  }

  componentDidMount () {
    console.log('componentDidMount')
    // this.props.isAddMocks && this.getNewGroupId(this.state._groupIdArr)
    if (this.props.isAddMocks) {
      // this.getNewGroupId(this.state._groupIdArr)
    } else {
      this.setState({
        newGroupId: 0
      })
    }
  }

  componentWillUnmount () {
  }

  render () {
    let _groupIdArr = []

    return <div className='r-interfaceMocks'>
      {
        this.props.properties.map(item => {
          console.log(_groupIdArr)
          return _groupIdArr.includes(item.groupId) ? null : _groupIdArr.push(item.groupId) &&
            <RequestAndResponsePropertyList
              key={item.groupId}
              {...this.props}
              groupId={item.groupId}
              groupName={item.groupName}
              tabGroupId={this.state.tabGroupId}
            />
        })
      }
      <ul className='nav nav-tabs' role='tablist'>
        {
          _groupIdArr.map(item =>
            <li className='nav-item' key={item}>
              <a className={`nav-link ${item === this.state.tabGroupId ? 'active' : ''}`}
                 onClick={e => this.tabSwitch(item)}
                 aria-controls={item}
                 data-toggle='tab' role='tab'
                 aria-selected='true' aria-disabled={!this.props.editable}>mock {item}</a>
            </li>)
        }
        {
          this.props.isAddMocks && !_groupIdArr.includes(this.state.newGroupId) ?
            <li className='nav-item'>
              <a className={`nav-link ${this.state.newGroupId === this.state.tabGroupId ? 'active' : ''}`}
                 onClick={e => this.tabSwitch(this.state.newGroupId)}
                 data-toggle='tab' role='tab' aria-controls={this.state.newGroupId}
                 aria-selected='true' aria-disabled={!this.props.editable}>mock {this.state.newGroupId}</a>
            </li> : null
        }
      </ul>
      {
        // 新增模块初始化无数据情况下（_groupIdArr 没有对应 id） & 保存 newGroupId
        this.props.isAddMocks && !_groupIdArr.includes(this.state.newGroupId) ? this.getNewGroupId(_groupIdArr) &&
          <div
            className={`mock_groupId_${this.state.newGroupId} ${this.state.tabGroupId === this.state.newGroupId ? '' : 'hide'}`}>
            <p>new mock group</p>

            <RequestPropertyList
              {...this.props}
              groupId={this.state.newGroupId}
            />
            <ResponsePropertyList
              {...this.props}
              groupId={this.state.newGroupId}
            />
          </div> : null
      }
    </div>
  }
}
