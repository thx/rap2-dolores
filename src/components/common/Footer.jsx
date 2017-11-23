import React from 'react'
import { connect } from 'react-redux'
import './Footer.css'

const Footer = ({ counter = {} }) => (
  <div className='Footer'>
    v{counter.version}
    {/* <span className='ml10 mr10 color-c'>|</span>
    {counter.users} 人正在使用 RAP
    <span className='ml10 mr10 color-c'>|</span>
    今日 Mock 服务被调用 {counter.mock} 次 */}
    <ul className='friend_links'>
      <li><a href='http://rap.alibaba-inc.com/' target='_blank' rel='noopener noreferrer'>RAP0.x</a></li>
      <li><a href='http://mockjs.com/' target='_blank' rel='noopener noreferrer'>Mock.js</a></li>
      <li><a href='https://thx.github.io/' target='_blank' rel='noopener noreferrer'>THX</a></li>
      <li><a href='https://fe.alimama.net/thx/30/' target='_blank' rel='noopener noreferrer'>MMFE</a></li>
    </ul>
  </div>
)

const mapStateToProps = (state) => ({
  counter: state.counter
})
const mapDispatchToProps = ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer)
