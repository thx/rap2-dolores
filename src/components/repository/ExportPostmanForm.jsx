import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { RParsley } from '../utils'
import config from '../../config'

class ExportPostmanForm extends Component {
  static contextTypes = {
    rmodal: PropTypes.object.isRequired
  }
  static propTypes = {
    repoId: PropTypes.number
  }
  render () {
    const { rmodal } = this.context
    const { repoId } = this.props
    return (
      <section className='RepositoryForm'>
        <div className='rmodal-header'>
          <span className='rmodal-title'>{this.props.title}</span>
        </div>
        <RParsley ref={rparsley => { this.rparsley = rparsley }}>
          <form className='form-horizontal' onSubmit={() => false} >
            <div className='rmodal-body'>
              <div>
                请在Postman中点击导入（Import），选择从链接导入（Import From Link），输入如下链接即可。
              </div>
              <div className='alert alert-info' role='alert' style={{ margin: '8px 0' }}> {config.serve}/postman/export?id={repoId} </div>
            </div>
            <div className='rmodal-footer'>
              <div className='form-group row mb0'>
                <label className='col-sm-2 control-label' />
                <div className='col-sm-10'>
                  <button onClick={e => { e.preventDefault(); rmodal.close() }} className='mr10 btn btn-secondary'>关闭</button>
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

export default ExportPostmanForm
