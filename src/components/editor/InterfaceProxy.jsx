/**
 * Created by xiaogang on 2019/4/1.
 *  接口代理控制组件
 */

import React from 'react'
import { PropTypes } from '../../family'
import { RModal } from '../utils'
import { GoPencil } from 'react-icons/lib/go'

import InterfaceProxyModal from './InterfaceProxyModal'
import './InterfaceProxy.css'

export default class InterfaceProxy extends React.Component {
  constructor (props) {
    super(props)
    console.log(`----InterfaceProxy page----`)
    console.log(props)
    this.state = {
      update: false
    }
  }

  static propTypes = {
    itf: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
  }

  render () {
    const {itf, auth} = this.props

    const _proxy = {
      dev: 'proxyDev',
      uat: 'proxyUat',
      prod: 'proxyProd'
    }
    let proxy = itf && itf.proxy
    // 查看权限由父级统一控制
    // let isOwned = repository.owner.id === auth.id
    // let isJoined = repository.members.find(item => item.id === auth.id)
    return (
      <div className='InterfaceProxy'>
        <div className='header'>请求转发
          {/* 没有人锁定 或者 锁定者是自己时可以编辑 */}
          {!itf.locker || itf.locker.id === auth.id
            ? <span className='fake-link' onClick={e => this.setState({update: true})}><GoPencil/></span>
            : null
          }
        </div>
        <p>当前环境（{proxy}）：{itf[_proxy[proxy]] || 'http://172.18.18.80:3000/'}</p>
        <RModal when={this.state.update} onClose={e => this.setState({update: false})}
                onResolve={e => this.updateInterfaceHandle(e)}>
          <InterfaceProxyModal title='更新转发' itf={itf}/>
        </RModal>
      </div>
    )
  }

  updateInterfaceHandle = (e) => {

  }

}