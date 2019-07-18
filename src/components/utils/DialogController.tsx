import React, { Component } from 'react'
import Dialog from '../utils/Dialog'

type DialogControllerProps = any
type DialogControllerState = any
class DialogController extends Component<
  DialogControllerProps,
  DialogControllerState
> {
  constructor(props: any) {
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
    const { onResolved } = this.props
    if (onResolved) {
      onResolved()
      return
    }
    console.warn('警告：Dialog 的回调应该放到调用组件中！')
    const { history, location } = this.context
    history.push(location.pathname + location.search + location.hash)
  }
  render() {
    let dialog
    if (this.state.visible) {
      dialog = <Dialog onClose={this.close} content={this.props.content} />
    }
    return (
      <span>
        <span onClick={this.open}>{this.props.children}</span>
        {this.state.visible ? dialog : null}
        {this.state.visible ? <div className="dialog-backdrop" /> : null}
      </span>
    )
  }
}
export default DialogController
