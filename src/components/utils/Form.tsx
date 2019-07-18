import React, { Component } from 'react'

// TODO 2.x 如何写高阶 Form 组件
class Form extends Component<any, any> {
  render() {
    const { children } = this.props
    return (
      <form onSubmit={this.handleSubmit}>
        {children}
      </form>
    )
  }
  handleSubmit = (event: any) => {
    event.preventDefault()
    const { onSubmit, onResolved, onRejected } = this.props
    const values: any = {};
    ([]).slice.call(event.target.elements, 0).forEach((el: any) => {
      if (el.name) { values[el.name] = el.value }
    })
    onSubmit(values)
    onResolved()
    onRejected()
  }
}
export default Form
