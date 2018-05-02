import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import RadioList from '../utils/RadioList'
import './ImportRepositoryForm.css'
import { importRepository, fetchRepositoryList } from '../../actions/repository'

class ImportRepositoryForm extends Component {
  static contextTypes = {
    rmodal: PropTypes.object.isRequired
  }
  static propTypes = {
    orgId: PropTypes.number.isRequired,
    importRepository: PropTypes.func.isRequired
  }
  constructor (props) {
    super(props)
    this.state = {
      orgId: props.orgId,
      version: 1,
      docUrl: ''

    }
  }
  render () {
    const { rmodal } = this.context
    return (
      <section className='ImportRepositoryForm'>
        <div className='rmodal-header'>
          <span className='rmodal-title'>{this.props.title}</span>
        </div>
        <form className='form-horizontal' onSubmit={this.handleSubmit} >
          <div className='rmodal-body'>
            <div className='form-group row'>
              <label className='col-sm-2 control-label'>版本</label>
              <div className='col-sm-10'>
                <RadioList data={[{ 'label': 'RAP1', 'value': 1 }, { 'label': 'RAP2(开发中...)', 'value': 2 }]}
                  curVal={this.state.version} name='version' disabled />
              </div>
            </div>
            <div>
              <div className='form-group row'>
                <label className='col-sm-2 control-label'>文档URL</label>
                <div className='col-sm-10'>
                  <input name='projectId' value={this.state.docUrl} onChange={e => this.setState({ docUrl: e.target.value })}
                    className='form-control' placeholder='http://rapapi.org/workspace/myWorkspace.do?projectId=145#2548' spellCheck='false' autoFocus='true'
                    required data-parsley-maxlength='256' />
                </div>
              </div>
              <div className='form-group row mb0'>
                <label className='col-sm-2 control-label' />
                <div className='col-sm-10'>
                  <button type='submit' className='btn btn-success w140 mr20'>提交</button>
                  <Link to='' onClick={e => { e.preventDefault(); rmodal.close() }} className='mr10'>取消</Link>
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    )
  }
  componentDidUpdate () {
    this.context.rmodal.reposition()
  }
  handleSubmit = (e) => {
    e.preventDefault()
    const { docUrl, orgId } = this.state
    this.props.importRepository({ docUrl, orgId }, (res) => {
      if (res.isOk) {
        this.context.rmodal.resolve()
      } else {
        console.log(res.message)
      }
    })
  }
}

// 容器组件
const mapStateToProps = (state) => ({
})

const mapDispatchToProps = ({
  importRepository,
  fetchRepositoryList
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImportRepositoryForm)
