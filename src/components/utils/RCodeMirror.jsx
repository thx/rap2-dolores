import React, { Component } from 'react'
import CodeMirror from 'codemirror'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/lib/codemirror.css'
import './RCodeMirror.css'

class RCodeMirror extends Component {
  static propTypes = {}
  render () {
    return <textarea autoFocus='true' ref={$host => { this.$host = $host }} />
  }
  componentDidMount () {
    let cm = CodeMirror.fromTextArea(this.$host, {
      lineNumbers: true,
      mode: { name: 'javascript', json: true }
    })
    this.cm = cm
    let { value, onChange } = this.props
    if (value) cm.setValue(value)
    cm.on('change', () => {
      onChange(cm.getValue())
    })
  }
}

export default RCodeMirror
