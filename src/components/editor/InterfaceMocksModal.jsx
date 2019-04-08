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
    //   mockGroupId: '-1',
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
    groupIds: PropTypes.arrayOf(PropTypes.number).isRequired,
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
            {
              this.props.groupIds.map(item =>
                <div className='form-group row' key={item}>
                  <div className='form-check col-sm-3' onClick={e => this.updateProxy(item)}>
                    <input className='form-check-input' type='radio' name='mockRadio' value={item}
                           checked={this.state.mockGroupId === item} onChange={e => this.changeProxy(e.target.value)}/>
                    <label className='form-check-label'>边界（{item}）：</label>
                  </div>
                  <div className='col-sm-9'>
                    {item}
                  </div>
                </div>
              )
            }
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

  updateProxy = (groupId, e) => {
    this.setState({
      mockGroupId: groupId
    })
  }

  changeProxy = (groupId, e) => {
    // this.setState({
    //   mockGroupId: groupId
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