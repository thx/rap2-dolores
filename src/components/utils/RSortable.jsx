import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import Sortable from 'sortablejs'
import './RSortable.css'

class RSortable extends Component {
  render () {
    return this.props.children
  }
  $sortable = null
  componentDidMount () {
    let { onChange } = this.props
    let $sortable = Sortable.create(findDOMNode(this), {
      handle: '.sortable',
      animation: 150,
      onEnd: (e) => {
        if (onChange) onChange(e, $sortable)
      },
      ...this.props
    })
    this.$sortable = $sortable
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.disabled !== undefined) {
      this.$sortable.option('disabled', nextProps.disabled)
    }
  }
}

export class RSortableHandle extends Component {
  render () {
    return <div className='sortable'>
      {this.props.children}
    </div>
  }
}

export default RSortable
