import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './Dialog.css'

class Dialog extends Component {
  static childContextTypes = {
    dialog: PropTypes.instanceOf(Dialog)
  }
  constructor (props) {
    super(props)
    this.state = { visible: true }
  }
  getChildContext () {
    return {
      dialog: this
    }
  }
  open = () => {
    this.setState({ visible: true }, () => {
      this.rePosition()
    })
  }
  rePosition = () => {
    let left = (document.documentElement.clientWidth - this.related.clientWidth) / 2
    let top = (document.documentElement.clientHeight - this.related.clientHeight) / 2
    this.related.style.left = left + 'px'
    this.related.style.top = top + 'px'
  }
  handleEsc = (e) => {
    if (e.keyCode === 27) {
      this.close()
    }
  }
  close = () => {
    this.setState({ visible: false }, () => {
      this.props.onClose()
    })
  }
  componentDidMount () {
    this.open()
    document.body.classList.add('modal-open')
    document.body.addEventListener('keyup', this.handleEsc)
    window.addEventListener('resize', this.rePosition)
  }
  componentWillUnmount () {
    document.body.classList.remove('modal-open')
    document.body.removeEventListener('keyup', this.handleEsc)
    window.removeEventListener('resize', this.rePosition)
  }
  render () {
    if (!this.state.visible) return null
    return (
      <div className='dialog' ref={related => { this.related = related }}>
        <button type='button' className='dialog-close' onClick={this.close}>
          <span className='rapfont'>&#xe74c;</span>
        </button>
        <div className='dialog-content'>
          {this.props.content || this.props.children}
          {/*
            <div className="dialog-header">
              <h4 className="dialog-title">Title</h4>
            </div>
            <div className="dialog-body">Body</div>
            <div className="dialog-footer">
              <button type="button" className="btn btn-default">Close</button>
              <button type="button" className="btn btn-success">Save</button>
            </div>
          */}
        </div>
      </div>
    )
  }
}

export default Dialog
