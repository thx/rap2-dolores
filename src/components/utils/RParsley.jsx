import { Component } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import 'parsleyjs'
import 'parsleyjs/dist/i18n/zh_cn'
import $ from 'jquery'
// import 'parsleyjs/src/parsley.css'
import './RParsley.css'

class RParsley extends Component {
  static childContextTypes = {
    rparsley: PropTypes.instanceOf(RParsley)
  }
  getChildContext () {
    return { rparsley: this }
  }
  render () {
    return this.props.children
  }
  componentDidMount () {
    this.parsley = $(findDOMNode(this)).parsley({})
  }
  validate = () => {
    this.parsley.validate()
  }
  isValid = () => {
    return this.parsley.isValid()
  }
  reset = () => {
    this.parsley.reset()
  }
}

export default RParsley
