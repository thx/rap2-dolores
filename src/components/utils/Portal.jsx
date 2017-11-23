import React, { Component } from 'react'
import { render } from 'react-dom'

// TODO 2.x http://stackoverflow.com/questions/28802179/how-to-create-a-react-modalwhich-is-append-to-body-with-transitions

let PORTAL_ID = 1
class Portal extends Component {
  render () { return null }
  $portal: null
  componentDidMount () {
    let id = 'Portal-' + PORTAL_ID++
    let $portal = document.getElementById(id)
    if (!$portal) {
      $portal = document.createElement('div')
      $portal.id = id
      document.body.appendChild($portal)
    }
    this.$portal = $portal
    this.componentDidUpdate()
  }
  componentWillUnmount () {
    document.body.removeChild(this.$portal)
  }
  componentDidUpdate () {
    render(<div {...this.props}>{this.props.children}</div>, this.$portal)
  }
}

export default Portal
