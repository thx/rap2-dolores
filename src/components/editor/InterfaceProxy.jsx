/**
 * Created by xiaogang on 2019/4/1.
 *  接口代理控制组件
 */

import React from 'react'
import { PropTypes } from '../../family'

import './InterfaceProxy.css'

export default class InterfaceProxy extends React.Component {
  constructor (props) {
    super(props)
    console.log(`----InterfaceProxy page----`)
    console.log(props)
    this.state = {}
  }

  static propTypes = {
    repository: PropTypes.object.isRequired,
    // active: PropTypes.bool.isRequired,
    editable: PropTypes.bool.isRequired,
    // stateChangeHandler: PropTypes.func.isRequired
  }

  InterfaceProxyRadioChange = () => {

  }

  render () {
    const { repository, editable } = this.props
    return (
      <div className='InterfaceProxy'>
        <div className='header'>请求转发</div>
        <div className='input-groups'>
          <div className='input-group'>
            <div className='input-group-prepend'>
              <div className='input-group-text'>
                <input type='radio' aria-label='InterfaceProxyRadioDev' name='InterfaceProxyRadio' defaultChecked
                       disabled={!editable} />
              </div>
              <span className='input-group-text' id='proxyDev'>开发环境:</span>
            </div>
            <input type='text' className='form-control'
                   aria-label='InterfaceProxyRadioDev'
                   value={'172.18.18.80:3000/'}
                   onChange={this.InterfaceProxyRadioChange}
            />
          </div>
          <div className='input-group'>
            <div className='input-group-prepend'>
              <div className='input-group-text'>
                <input type='radio' aria-label='InterfaceProxyRadioUat' name='InterfaceProxyRadio'
                       disabled={!editable} />
              </div>
              <span className='input-group-text' id='proxyUat'>测试环境:</span>
            </div>
            <input type='text' className='form-control'
                   aria-label='InterfaceProxyRadioUat'
                   value={'172.18.18.80:3000/'}
                   onChange={this.InterfaceProxyRadioChange}
            />
          </div>
          <div className='input-group'>
            <div className='input-group-prepend'>
              <div className='input-group-text'>
                <input type='radio' aria-label='InterfaceProxyRadioProd' name='InterfaceProxyRadio'
                       disabled={!editable} />
              </div>
              <span className='input-group-text' id='proxyProd'>生产环境:</span>
            </div>
            <input type='text' className='form-control'
                   aria-label='InterfaceProxyRadioProd'
                   onChange={this.InterfaceProxyRadioChange}
            />
          </div>
        </div>
      </div>
    )
  }

}