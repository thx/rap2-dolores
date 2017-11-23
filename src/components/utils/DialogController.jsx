import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Dialog from '../utils/Dialog'

class DialogController extends Component {
  static contextTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    match: PropTypes.object
  }
  static childContextTypes = {
    controller: PropTypes.instanceOf(DialogController)
  }
  getChildContext () {
    return {
      controller: this
    }
  }
  constructor (props) {
    super(props)
    this.state = { visible: false }
  }
  open = () => {
    this.setState({ visible: true })
  }
  close = () => {
    this.setState({ visible: false })
  }
  resolve = () => {
    let { onResolved } = this.props
    if (onResolved) {
      onResolved()
      return
    }
    console.warn('警告：Dialog 的回调应该放到调用组件中！')
    let { history, location } = this.context
    history.push(location.pathname + location.search + location.hash)
  }
  render () {
    let dialog
    if (this.state.visible) {
      dialog = <Dialog onClose={this.close} content={this.props.content} />
    }
    return (
      <span>
        <span onClick={this.open}>{this.props.children}</span>
        {this.state.visible ? dialog : null}
        {this.state.visible ? <div className='dialog-backdrop' /> : null}
      </span>
    )
  }
}

export default DialogController
