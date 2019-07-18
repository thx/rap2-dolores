import React, { Component } from 'react'
import './Dialog.css'
type DialogProps = any
type DialogState = any
class Dialog extends Component<DialogProps, DialogState> {
  related: any
  constructor(props: any) {
    super(props)
    this.state = { visible: true }
  }
  getChildContext() {
    return {
      dialog: this,
    }
  }
  open = () => {
    this.setState({ visible: true }, () => {
      this.rePosition()
    })
  };
  rePosition = () => {
    const left = (document.documentElement.clientWidth - this.related.clientWidth) / 2
    const top =
      (document.documentElement.clientHeight - this.related.clientHeight) / 2
    this.related.style.left = left + 'px'
    this.related.style.top = top + 'px'
  };
  handleEsc = (e: any) => {
    if (e.keyCode === 27) {
      this.close()
    }
  };
  close = () => {
    this.setState({ visible: false }, () => {
      this.props.onClse()
    })
  };
  componentDidMount() {
    this.open()
    document.body.classList.add('modal-open')
    document.body.addEventListener('keyup', this.handleEsc)
    window.addEventListener('resize', this.rePosition)
  }
  componentWillUnmount() {
    document.body.classList.remove('modal-open')
    document.body.removeEventListener('keyup', this.handleEsc)
    window.removeEventListener('resize', this.rePosition)
  }
  render() {
    if (!this.state.visible) { return null }
    return (
      <div
        className="dialog"
        ref={related => {
          this.related = related
        }}
      >
        <button type="button" className="dialog-close" onClick={this.close}>
          <span className="rapfont">&#xe74c;</span>
        </button>
        <div className="dialog-content">
          {this.props.content || this.props.children}
        </div>
      </div>
    )
  }
}
export default Dialog
