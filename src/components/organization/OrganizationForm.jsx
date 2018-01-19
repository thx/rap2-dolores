import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Mock from 'mockjs'
import { SmartTextarea, MembersInput, RParsley } from '../utils'
import RadioList from '../utils/RadioList'
import { FORM } from '../../family/UIConst'

// 模拟数据
const mockOrganization = process.env.NODE_ENV === 'development'
  ? () => Mock.mock({
    name: '团队@CTITLE(5)',
    description: '@CPARAGRAPH',
    logo: '@URL',
    ownerId: undefined,
    members: []
  })
  : () => ({
    name: '',
    description: '',
    logo: '',
    ownerId: undefined,
    members: []
  })

// 展示组件
// TODO 2.x 支持私有组织
// TODO 2.x 支持转移组织
class OrganizationForm extends Component {
  static contextTypes = {
    rmodal: PropTypes.object.isRequired,
    onAddOrganization: PropTypes.func.isRequired,
    onUpdateOrganization: PropTypes.func.isRequired
  }
  static propTypes = {
    auth: PropTypes.object.isRequired,
    organization: PropTypes.object
  }
  constructor (props) {
    super(props)
    let { organization } = props
    this.state = organization ? {
      ...organization,
      // members: organization.members.map(user => user.id).join(',')
      members: organization.members.filter(user => !!user),
      newOwner: organization.owner
    } : mockOrganization()
  }
  render () {
    const { rmodal } = this.context
    let { auth } = this.props
    return (
      <section>
        <div className='rmodal-header'>
          <span className='rmodal-title'>{this.props.title}</span>
        </div>
        <RParsley ref={rparsley => { this.rparsley = rparsley }}>
          <form className='form-horizontal w600' onSubmit={this.handleSubmit} >
            <div className='rmodal-body'>
              {this.state.id &&
                <div className='form-group row'>
                  <label className='col-sm-2 control-label'>拥有者：</label>
                  <div className='col-sm-10'>
                    {this.state.owner && (this.state.owner.id === auth.id)
                      ? <MembersInput value={this.state.newOwner ? [this.state.newOwner] : []} limit={1} onChange={users => this.setState({ newOwner: users[0] })} />
                      : <div className='pt7 pl9'>{this.state.owner.fullname}</div>
                    }
                  </div>
                </div>
              }
              <div className='form-group row'>
                <label className='col-sm-2 control-label'>权限</label>
                <div className='col-sm-10'>
                  <RadioList data={FORM.RADIO_LIST_DATA_VISIBILITY} curVal={this.state.visibility} name='visibility'
                    onChange={visibility => this.setState({ visibility })} />
                </div>
              </div>
              <div className='form-group row'>
                <label className='col-sm-2 control-label'>名称：</label>
                <div className='col-sm-10'>
                  <input name='name' value={this.state.name} onChange={e => this.setState({ name: e.target.value })} className='form-control' placeholder='Name' spellCheck='false' autoFocus='true'
                    required data-parsley-trigger='change keyup' data-parsley-maxlength='256' />
                </div>
              </div>
              <div className='form-group row'>
                <label className='col-sm-2 control-label'>简介：</label>
                <div className='col-sm-10'>
                  <SmartTextarea name='description' value={this.state.description} onChange={e => this.setState({ description: e.target.value })} className='form-control' placeholder='Description' spellCheck='false' rows='5'
                    data-parsley-trigger='change keyup' data-parsley-maxlength='1024' />
                </div>
              </div>
              <div className='form-group row'>
                <label className='col-sm-2 control-label'>成员：</label>
                <div className='col-sm-10'>
                  <MembersInput value={this.state.members} onChange={members => this.setState({ members })} />
                </div>
              </div>
            </div>
            <div className='rmodal-footer'>
              <div className='form-group row mb0'>
                <label className='col-sm-2 control-label' />
                <div className='col-sm-10'>
                  <button type='submit' className='btn btn-success w140 mr20'>提交</button>
                  <Link to='' onClick={e => { e.preventDefault(); rmodal.close() }} className='mr10'>取消</Link>
                </div>
              </div>
            </div>
          </form>
        </RParsley>
      </section>
    )
  }
  handleSubmit = (e) => {
    e.preventDefault()
    let { onAddOrganization, onUpdateOrganization } = this.context
    let onAddOrUpdateOrganization = this.state.id ? onUpdateOrganization : onAddOrganization
    let organization = {
      ...this.state,
      // owner: auth.id, // 支持转移组织
      memberIds: (this.state.members || []).map(user => user.id)
    }
    let { owner, newOwner } = this.state
    if (newOwner && newOwner.id !== owner.id) organization.ownerId = newOwner.id
    onAddOrUpdateOrganization(organization, () => {
      let { rmodal } = this.context
      if (rmodal) rmodal.resolve()
    })
    // √ 编辑团队可能会变更 creator 和 owner，同时在前端和后端修复，X 前端在 constructor 中修正，√ 后端过滤 creator 和 owner
  }
}

// 容器组件
const mapStateToProps = (state) => ({
  auth: state.auth
})
const mapDispatchToProps = ({})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationForm)
