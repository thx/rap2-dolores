import React, { Component } from 'react'
import { PropTypes, connect, Link } from '../../family'
import { moveInterface } from '../../actions/interface'

const OP_MOVE = 1
const OP_COPY = 2

class MoveInterfaceForm extends Component {
  static contextTypes = {
    rmodal: PropTypes.instanceOf(Component),
    onAddInterface: PropTypes.func.isRequired,
    onUpdateInterface: PropTypes.func.isRequired
  }
  static propTypes = {
    title: PropTypes.string.isRequired,
    repository: PropTypes.object.isRequired,
    itfId: PropTypes.number.isRequired,
    moveInterface: PropTypes.func.isRequired
  }
  constructor (props) {
    super(props)
    const { repository } = props
    let modId = 0
    if (repository.modules.length > 0) {
      modId = repository.modules[0].id
    }
    this.state = {
      op: OP_MOVE, // 1 move, 2 copy
      modId
    }
  }
  render () {
    const { rmodal } = this.context
    const { repository } = this.props
    const { modId, op } = this.state
    return (
      <section>
        <div className='rmodal-header'>
          <span className='rmodal-title'>{this.props.title}</span>
        </div>
        <form className='form-horizontal w600' onSubmit={this.handleSubmit} >
          <div className='rmodal-body'>
            <div className='form-group row'>
              <label className='col-sm-2 control-label'>模块：</label>
              <div className='col-sm-10'>
                <select className='form-control' onChange={e => { this.setState({ modId: +e.target.value }) }}>
                  {repository.modules.map(x => <option key={x.id} value={x.id} checked={x.id === modId}>{x.name}</option>)}
                </select>
              </div>
            </div>
            <div className='form-group row'>
              <label className='col-sm-2 control-label'>选项：</label>
              <div className='col-sm-10'>
                <div className='col-sm-10'>
                  <div className='form-check'>
                    <input className='form-check-input' type='radio' name='op' id='gridRadios1' value='1' checked={op === OP_MOVE} onChange={() => { this.setState({ op: OP_MOVE }) }} />
                    <label className='form-check-label' htmlFor='gridRadios1'> 移动 </label>
                  </div>
                  <div className='form-check'>
                    <input className='form-check-input' type='radio' name='op' id='gridRadios2' value='2' checked={op === OP_COPY} onChange={() => { this.setState({ op: OP_COPY }) }} />
                    <label className='form-check-label' htmlFor='gridRadios2'> 复制 </label>
                  </div>
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
    const params = {
      modId: this.state.modId,
      op: this.state.op,
      itfId: this.props.itfId,
      repoId: this.props.repository.id
    }
    this.props.moveInterface(params, () => {
      let { rmodal } = this.context
      if (rmodal) rmodal.resolve()
    })
  }
}

const mapStateToProps = (state) => ({
})
const mapDispatchToProps = ({
  moveInterface
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MoveInterfaceForm)
