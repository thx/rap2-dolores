import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { mock } from 'mockjs'
import { SmartTextarea, MembersInput, RParsley } from '../utils'
import { GoInfo } from 'react-icons/lib/go'

// 模拟数据
// DONE 2.1 各种表单的初始值混乱，待重构
const mockRepository = process.env.NODE_ENV === 'development'
  ? () => mock({
    name: '仓库@CTITLE(6)',
    description: '@CPARAGRAPH',
    members: [],
    ownerId: undefined,
    organizationId: undefined,
    collaboratorIds: []
  })
  : () => ({
    name: '',
    description: '',
    members: [],
    ownerId: undefined,
    organizationId: undefined,
    collaboratorIds: []
  })

// 展示组件
// √ 自动获得焦点：组织、仓库、模块、接口、属性、导入器、注册、登陆
// TODO 2.x 支持私有仓库
// DONE 2.2 支持转移仓库
class RepositoryForm extends Component {
  static contextTypes = {
    rmodal: PropTypes.object.isRequired,
    onAddRepository: PropTypes.func.isRequired,
    onUpdateRepository: PropTypes.func.isRequired
  }
  static propTypes = {
    auth: PropTypes.object.isRequired,
    organization: PropTypes.object,
    repository: PropTypes.object
  }
  constructor (props) {
    super(props)
    let { repository } = props
    this.state = repository ? {
      ...repository,
      collaboratorIds: repository.collaborators.map(item => item.id),
      newOwner: repository.owner
    } : mockRepository()
  }
  render () {
    const { rmodal } = this.context
    let { auth } = this.props
    return (
      <section className='RepositoryForm'>
        <div className='rmodal-header'>
          <span className='rmodal-title'>{this.props.title}</span>
        </div>
        <RParsley ref={rparsley => { this.rparsley = rparsley }}>
          <form className='form-horizontal' onSubmit={this.handleSubmit} >
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
                <label className='col-sm-2 control-label'>名称：</label>
                <div className='col-sm-10'>
                  <input name='name' value={this.state.name} onChange={e => this.setState({ name: e.target.value })} className='form-control' placeholder='Name' spellCheck='false' autoComplete='off' autoFocus='true'
                    required data-parsley-trigger='change keyup' data-parsley-maxlength='256' />{/* w280 */}
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
              <div className='form-group row'>
                {/* DONE 2.1 帮助信息：仓库 ID 用逗号分隔，例如 1,2,3 */}
                <label className='col-sm-2 control-label'>协同仓库：</label>
                <div className='col-sm-10'>
                  {/* TODO 2.2 CollaboratorsInput */}
                  <input name='name' value={this.state.collaboratorIds.join(',')} onChange={e => this.setState({ collaboratorIds: e.target.value.split(',') })} className='form-control' placeholder='Collaborator Ids' spellCheck='false' autoComplete='off' />
                  <div className='mt6 color-9'>
                    <GoInfo className='mr3' />
                    指定与哪些仓库共享接口，仓库 ID 之间用逗号分隔，例如 <code>1,2,3</code>。</div>
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
  componentDidUpdate () {
    this.context.rmodal.reposition()
  }
  handleSubmit = (e) => {
    e.preventDefault()

    if (!this.rparsley.isValid()) return

    let { onAddRepository, onUpdateRepository } = this.context
    let onAddOrUpdateRepository = this.state.id ? onUpdateRepository : onAddRepository
    let { organization } = this.props
    let repository = {
      ...this.state,
      // ownerId: owner.id, // DONE 2.2 支持转移仓库
      organizationId: organization ? organization.id : null,
      memberIds: (this.state.members || []).map(user => user.id)
    }
    let { owner, newOwner } = this.state
    if (newOwner && newOwner.id !== owner.id) repository.ownerId = newOwner.id
    let { rmodal } = this.context
    rmodal.close()
    onAddOrUpdateRepository(repository, () => {
      if (rmodal) rmodal.resolve()
    })
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
)(RepositoryForm)
