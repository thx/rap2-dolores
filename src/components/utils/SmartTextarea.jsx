import React, { Component } from 'react'

class SmartTextarea extends Component {
  resize = () => {
    let textarea = this.textarea
    textarea.style.overflowY = 'hidden'
    textarea.style.height = 'auto'
    textarea.style.height = textarea.scrollHeight + 'px'
  }
  componentDidMount () {
    this.resize()
    this.textarea.addEventListener('input', this.resize)
  }
  componentWillUnmount () {
    this.textarea.removeEventListener('input', this.resize)
  }
  render () {
    return (
      <textarea {...this.props} ref={textarea => { this.textarea = textarea }} />
    )
  }
}

export default SmartTextarea
