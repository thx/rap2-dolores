import React, { Component } from 'react'

// TODO 2.x 如何写高阶 Form 组件
class Form extends Component {
  render () {
    let { children } = this.props
    return (
      <form onSubmit={this.handleSubmit}>
        {children}
      </form>
    )
  }
  handleSubmit = (event) => {
    event.preventDefault()
    let { onSubmit, onResolved, onRejected } = this.props
    var values = {};
    ([]).slice.call(event.target.elements, 0).forEach(el => {
      if (el.name) values[el.name] = el.value
    })
    onSubmit(values)
    onResolved()
    onRejected()
  }
}
export default Form
