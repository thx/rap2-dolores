/**
 * Created by xiaogang on 2019/4/1.
 *  接口代理控制组件
 */

import React from 'react'
import { PropTypes, Link } from '../../family'

import './InterfaceProxy.css'

export default class InterfaceProxyModal extends React.Component {
  constructor (props) {
    super(props)
    console.log(`----InterfaceProxyModal page----`)
    console.log(props)
    this.state = this.props.itf
    // {
    //   proxyDev: 'dev',
    //   proxyUat: 'uat',
    //   proxyProd: 'prod'
    // }
  }

  /**
   * 方便直接跨层级获取父级的函数&数据（非props层层传递函数&数据）
   * 需要明确 声明式。16.7之后有 hooks 获取方式
   */
  static contextTypes = {
    rmodal: PropTypes.instanceOf(React.Component),
    onUpdateInterface: PropTypes.func.isRequired
  }

  static propTypes = {
    itf: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired
  }

  render () {
    const {rmodal} = this.context
    return (
      <section>
        <div className='rmodal-header'>
          <span className='rmodal-title'>{this.props.title}</span>
        </div>
        <form className='form-horizontal w600' onSubmit={this.handleSubmit}>
          <div className='rmodal-body'>

            <div className='form-group row'>
              <div className='form-check col-sm-2' onClick={e => this.updateProxy('dev')}>
                <input className='form-check-input' type='radio' name='proxyRadio' value='dev'
                       checked={this.state.proxy === 'dev'} onChange={e => this.changeProxy(e.target.value)}/>
                <label className='form-check-label'>dev：</label>
              </div>
              <div className='col-sm-10'>
                <input name='name' tabIndex={1} value={this.state.proxyDev}
                       onChange={e => this.setState({proxyDev: e.target.value})} className='form-control'
                       placeholder='dev' spellCheck='false' autoFocus='true' />
              </div>
            </div>

            <div className='form-group row'>
              <div className='form-check col-sm-2' onClick={e => this.updateProxy('uat')}>
                <input className='form-check-input' type='radio' name='proxyRadio' value='uat'
                       checked={this.state.proxy === 'uat'} onChange={e => this.changeProxy(e.target.value)}/>
                <label className='form-check-label'>uat：</label>
              </div>
              <div className='col-sm-10'>
                <input name='name' tabIndex={2} value={this.state.proxyUat}
                       onChange={e => this.setState({proxyUat: e.target.value})} className='form-control'
                       placeholder='uat' spellCheck='false' />
              </div>
            </div>

            <div className='form-group row'>
              <div className='form-check col-sm-2' onClick={e => this.updateProxy('prod')}>
                <input className='form-check-input' type='radio' name='proxyRadio' value='prod'
                       checked={this.state.proxy === 'prod'} onChange={e => this.changeProxy(e.target.value)}/>
                <label className='form-check-label'>prod：</label>
              </div>
              <div className='col-sm-10'>
                <input name='name' tabIndex={2} value={this.state.proxyProd}
                       onChange={e => this.setState({proxyProd: e.target.value})} className='form-control'
                       placeholder='prod' spellCheck='false' />
              </div>
            </div>

          </div>

          <div className='rmodal-footer'>
            <div className='form-group row mb0'>
              <label className='col-sm-2 control-label'/>
              <div className='col-sm-10'>
                <button type='submit' className='btn btn-success w140 mr20'>提交</button>
                <Link to='' onClick={e => {
                  e.preventDefault()
                  rmodal.close()
                }} className='mr10'>取消</Link>
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

  updateProxy = (env, e) => {
    this.setState({
      proxy: env
    })
  }

  changeProxy = (env, e) => {
    // this.setState({
    //   proxy: env
    // })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    let {onUpdateInterface} = this.context

    onUpdateInterface(this.state, () => {
      let {rmodal} = this.context
      if (rmodal) rmodal.resolve()
    })
  }

}