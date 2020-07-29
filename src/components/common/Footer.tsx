import React from 'react'
import { connect } from 'react-redux'
import './Footer.css'
import { RootState } from 'actions/types'

const Footer = ({ counter = {} }: { counter: any }) => (
  <div className="Footer">
    {counter && counter.version}
    <ul className="friend_links">
      <li><a href="https://github.com/thx/rap2-delos" target="_blank" rel="noopener noreferrer">GitHub</a></li>
      <li><a href="http://mockjs.com/" target="_blank" rel="noopener noreferrer">Mock.js</a></li>
      <li><a href="https://thx.github.io/" target="_blank" rel="noopener noreferrer">阿里妈妈前端团队出品</a></li>
    </ul>
  </div>
)

const mapStateToProps = (state: RootState) => ({
  counter: state.counter,
})
const mapDispatchToProps = ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer)
