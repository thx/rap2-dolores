import React, { Component } from 'react'
import CodeMirror from 'codemirror'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/lib/codemirror.css'
import './RCodeMirror.css'

type RCodeMirrorProps = any
type RCodeMirrorState = any
class RCodeMirror extends Component<RCodeMirrorState, RCodeMirrorProps> {
  $host: any
  cm: any
  render() {
    return (
      <textarea
        autoFocus={true}
        ref={$host => {
          this.$host = $host
        }}
      />
    )
  }
  componentDidMount() {
    const cm = CodeMirror.fromTextArea(this.$host, {
      lineNumbers: true,
      mode: { name: 'javascript', json: true },
    })
    this.cm = cm
    const { value, onChange } = this.props
    if (value) { cm.setValue(value) }
    cm.on('change', () => {
      onChange(cm.getValue())
    })
  }
}
export default RCodeMirror
