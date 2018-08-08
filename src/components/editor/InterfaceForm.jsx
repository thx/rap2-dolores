import React, { Component } from 'react'
import { PropTypes, connect, Link, Mock } from '../../family'
import { SmartTextarea } from '../utils'

export const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD']

export const STATUS_LIST = [200, 301, 403, 404, 500, 502, 503, 504]

// 模拟数据
const mockInterface = process.env.NODE_ENV === 'development'
  ? () => Mock.mock({
    name: '接口@CTITLE(4)',
    url: '@URL',
    'method|1': METHODS,
    description: '@CPARAGRAPH',
    repositoryId: undefined,
    moduleId: undefined
  })
  : () => ({
    name: '',
    url: '',
    method: 'GET',
    description: '',
    repositoryId: undefined,
    moduleId: undefined
  })

class InterfaceForm extends Component {
  static contextTypes = {
    rmodal: PropTypes.instanceOf(Component),
    onAddInterface: PropTypes.func.isRequired,
    onUpdateInterface: PropTypes.func.isRequired
  }
  static propTypes = {
    auth: PropTypes.object.isRequired,
    repository: PropTypes.object.isRequired,
    mod: PropTypes.object.isRequired,
    itf: PropTypes.object,
    title: PropTypes.string.isRequired
  }
  constructor (props) {
    super(props)
    let itf = this.props.itf
    this.state = itf ? { ...itf } : mockInterface()
  }
  render () {
    const { rmodal } = this.context
    return (
      <section>
        <div className='rmodal-header'>
          <span className='rmodal-title'>{this.props.title}</span>
        </div>
        <form className='form-horizontal w600' onSubmit={this.handleSubmit} >
          <div className='rmodal-body'>
            <div className='form-group row'>
              <label className='col-sm-2 control-label'>名称：</label>
              <div className='col-sm-10'>
                <input name='name' tabIndex={1} value={this.state.name} onChange={e => this.setState({ name: e.target.value })} className='form-control' placeholder='Name' spellCheck='false' autoFocus='true' required />
              </div>
            </div>
            <div className='form-group row'>
              <label className='col-sm-2 control-label'>地址：</label>
              <div className='col-sm-10'>
                <input name='name' tabIndex={2} value={this.state.url} onChange={e => this.setState({ url: e.target.value })} className='form-control' placeholder='URI' spellCheck='false' required />
              </div>
            </div>
            <div className='form-group row'>
              <label className='col-sm-2 control-label'>类型：</label>
              <div className='col-sm-10'>
                <select name='method' tabIndex={3} value={this.state.method} onChange={e => this.setState({ method: e.target.value })} className='form-control'>
                  {METHODS.map(method =>
                    <option key={method} value={method}>{method}</option>
                  )}
                </select>
              </div>
            </div>
            <div className='form-group row'>
              <label className='col-sm-2 control-label'>状态码：</label>
              <div className='col-sm-10'>
                <select name='status' tabIndex={4} value={this.state.status} onChange={e => this.setState({ status: e.target.value })} className='form-control'>
                  {STATUS_LIST.map(status =>
                    <option key={status} value={status}>{status}</option>
                  )}
                </select>
              </div>
            </div>
            <div className='form-group row'>
              <label className='col-sm-2 control-label'>简介：</label>
              <div className='col-sm-10'>
                <SmartTextarea name='description' tabIndex={5} value={this.state.description} onChange={e => this.setState({ description: e.target.value })} className='form-control' placeholder='Description' spellCheck='false' rows='5' />
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
      </section>
    )
  }
  componentDidUpdate () {
    this.context.rmodal.reposition()
  }
  handleSubmit = (e) => {
    e.preventDefault()
    let { onAddInterface, onUpdateInterface } = this.context
    let { auth, repository, mod } = this.props
    let onAddOrUpdateInterface = this.state.id ? onUpdateInterface : onAddInterface
    let itf = Object.assign({}, this.state, {
      creatorId: auth.id,
      repositoryId: repository.id,
      moduleId: mod.id,
      lockerId: this.state.locker ? this.state.locker.id : null
    })
    onAddOrUpdateInterface(itf, () => {
      let { rmodal } = this.context
      if (rmodal) rmodal.resolve()
    })
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
})
const mapDispatchToProps = ({})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InterfaceForm)
