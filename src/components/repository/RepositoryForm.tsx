import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { mock } from 'mockjs'
import { SmartTextarea, MembersInput, RParsley } from '../utils'
import { GoInfo } from 'react-icons/go'
import { RootState } from 'actions/types'
import { Button } from '@material-ui/core'
import { updateRepository, addRepository } from 'actions/repository'

// 模拟数据
// DONE 2.1 各种表单的初始值混乱，待重构
const mockRepository = process.env.NODE_ENV === 'development'
  ? () => mock({
    name: '仓库@CTITLE(6)',
    description: '@CPARAGRAPH',
    members: [],
    ownerId: undefined,
    organizationId: undefined,
    collaboratorIds: [],
  })
  : () => ({
    name: '',
    description: '',
    members: [],
    ownerId: undefined,
    organizationId: undefined,
    collaboratorIds: [],
  })

class RepositoryForm extends Component<any, any> {
  static contextTypes = {
    rmodal: PropTypes.object.isRequired,
  }
  static propTypes = {
    auth: PropTypes.object.isRequired,
    organization: PropTypes.object,
    repository: PropTypes.object,
  }
  rparsley: any
  constructor(props: any) {
    super(props)
    const { repository } = props
    this.state = repository ? {
      ...repository,
      collaboratorIds: repository.collaborators.map((item: any) => item.id),
      newOwner: repository.owner,
    } : mockRepository()
  }
  render() {
    const { rmodal } = this.context
    const { auth } = this.props
    return (
      <section className="RepositoryForm">
        <div className="rmodal-header">
          <span className="rmodal-title">{this.props.title}</span>
        </div>
        <RParsley ref={rparsley => { this.rparsley = rparsley }}>
          <form className="form-horizontal" onSubmit={this.handleSubmit} >
            <div className="rmodal-body">
              {this.state.id &&
                <div className="form-group row">
                  <label className="col-sm-2 control-label">拥有者：</label>
                  <div className="col-sm-10">
                    {this.state.owner && (this.state.owner.id === auth.id)
                      ? <MembersInput
                        value={this.state.newOwner ? [this.state.newOwner] : []}
                        limit={1}
                        onChange={(users: any) => this.setState({ newOwner: users[0] })}
                      />
                      : <div className="pt7 pl9">{this.state.owner.fullname}</div>
                    }
                  </div>
                </div>
              }
              {/* <div className='form-group row'>
                <label className='col-sm-2 control-label'>权限</label>
                <div className='col-sm-10'>
                  <RadioList data={FORM.RADIO_LIST_DATA_VISIBILITY} curVal={this.state.visibility} name='visibility'
                    onChange={visibility => this.setState({ visibility })} />
                </div>
              </div> */}
              <div className="form-group row">
                <label className="col-sm-2 control-label">名称：</label>
                <div className="col-sm-10">
                  <input
                    name="name"
                    value={this.state.name}
                    onChange={e => this.setState({ name: e.target.value })}
                    className="form-control"
                    placeholder="Name"
                    spellCheck={false}
                    autoComplete="off"
                    autoFocus={true}
                    required={true}
                    data-parsley-trigger="change keyup"
                    data-parsley-maxlength="256"
                  />{/* w280 */}
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-2 control-label">简介：</label>
                <div className="col-sm-10">
                  <SmartTextarea
                    name="description"
                    value={this.state.description}
                    onChange={(e: any) => this.setState({ description: e.target.value })}
                    className="form-control"
                    placeholder="Description"
                    spellCheck={false}
                    rows="5"
                    data-parsley-trigger="change keyup"
                    data-parsley-maxlength="1024"
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-2 control-label">成员：</label>
                <div className="col-sm-10">
                  <MembersInput value={this.state.members} onChange={(members: any) => this.setState({ members })} />
                </div>
              </div>
              <div className="form-group row">
                {/* DONE 2.1 帮助信息：仓库 ID 用逗号分隔，例如 1,2,3 */}
                <label className="col-sm-2 control-label">协同仓库：</label>
                <div className="col-sm-10">
                  {/* TODO 2.2 CollaboratorsInput */}
                  <input
                    name="name"
                    value={this.state.collaboratorIds.join(',')}
                    onChange={e => this.setState({ collaboratorIds: e.target.value.split(',') })}
                    className="form-control"
                    placeholder="Collaborator Ids"
                    spellCheck={false}
                    autoComplete="off"
                  />
                  <div className="mt6 color-9">
                    <GoInfo className="mr3" />
                    指定与哪些仓库共享接口，仓库 ID 之间用逗号分隔，例如 <code>1,2,3</code>。</div>
                </div>
              </div>
            </div>
            <div className="rmodal-footer">
              <div className="form-group row mb0">
                <label className="col-sm-2 control-label" />
                <div className="col-sm-10">
                  <Button type="submit" variant="contained" color="primary" style={{ marginRight: 8 }}>提交</Button>
                  <Button onClick={e => { e.preventDefault(); rmodal.close() }} variant="contained">取消</Button>
                </div>
              </div>
            </div>
          </form>
        </RParsley>
      </section>
    )
  }
  componentDidUpdate() {
    this.context.rmodal.reposition()
  }
  handleSubmit = (e: any) => {
    e.preventDefault()
    if (!this.rparsley.isValid()) { return }
    const { addRepository, updateRepository } = this.props
    const onAddOrUpdateRepository = this.state.id ? updateRepository : addRepository
    const { organization } = this.props
    const repository: any = {
      ...this.state,
      organizationId: organization ? organization.id : null,
      memberIds: (this.state.members || []).map((user: any) => user.id),
    }
    const { owner, newOwner } = this.state
    if (newOwner && newOwner.id !== owner.id) { repository.ownerId = newOwner.id }
    const { rmodal } = this.context
    rmodal.close()
    onAddOrUpdateRepository(repository, () => {
      if (rmodal) { rmodal.resolve() }
    })
  }
}

// 容器组件
const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
})
const mapDispatchToProps = ({
  updateRepository,
  addRepository,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RepositoryForm)
