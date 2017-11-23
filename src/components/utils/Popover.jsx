import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import './Popover.css'

// 烦恼：没有 jQuery .offset() 处理定位好麻烦
const [TOP, BOTTOM, LEFT, RIGHT, CENTER] = ['top', 'bottom', 'left', 'right', 'center']
class Popover extends Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: false,
      placement: props.placement || BOTTOM,
      align: props.align || CENTER,
      width: props.width
      // title: this.props.title,
      // content: this.props.content
    }
  }
  show = () => {
    clearTimeout(this.timer)
    this.setState({ visible: true }, () => {
      this.reposition()
    })
  }
  hide = () => {
    this.timer = setTimeout(() => {
      this.setState({ visible: false })
    }, 100)
  }
  fixRect (rect) {
    let html = document.documentElement
    let top = rect.top + window.pageYOffset - html.clientTop
    let left = rect.left + window.pageXOffset - html.clientLeft
    return {
      top,
      right: left + rect.width,
      bottom: top + rect.height,
      left,
      width: rect.width,
      height: rect.height
    }
  }
  replacement (elem, related) {
    let elemRect = this.fixRect(elem.getBoundingClientRect())
    let relatedRect = this.fixRect(related.getBoundingClientRect())
    let top, left
    let diff = {
      top: elemRect.height / 2 - relatedRect.height / 2,
      left: elemRect.width / 2 - relatedRect.width / 2
    }
    switch (this.state.placement) {
      case TOP: // 上方，水平局中
        top = elemRect.top - relatedRect.height
        left = elemRect.left + diff.left
        break
      case BOTTOM: // 下方，水平局中
        top = elem.offsetHeight // elemRect.top + elem.offsetHeight
        left = diff.left // elemRect.left + diff.left
        break
      case LEFT: // 左侧，垂直局中
        left = elemRect.left - relatedRect.width
        top = elemRect.top + diff.top
        break
      case RIGHT: // 右侧，垂直局中
        left = elemRect.left + elemRect.width
        top = elemRect.top + diff.top
        break
      default:
    }
    return {top, left}
  }
  realign (elem, related, offset) {
    let elemRect = this.fixRect(elem.getBoundingClientRect())
    let relatedRect = this.fixRect(related.getBoundingClientRect())
    switch (this.state.align) {
      case TOP: // 上边框对齐
        offset.top = 0 // elemRect.top
        break
      case BOTTOM: // 下边框对齐
        offset.top = elemRect.height // elemRect.bottom - relatedRect.height
        break
      case LEFT: // 左边框对齐
        offset.left = 0 // elemRect.let
        break
      case RIGHT: // 右边框对齐
        offset.left = elemRect.width - relatedRect.width // elemRect.right - relatedRect.width
        break
      case CENTER: // 默认水平居中和垂直居中
        break
      default:
    }
    return offset
  }
  reposition () {
    let elem = ReactDOM.findDOMNode(this)
    let related = this.related
    let offset = this.replacement(elem, related)
    offset = this.realign(elem, related, offset)
    offset.top += parseFloat(window.getComputedStyle(related).marginTop)
    offset.left += parseFloat(window.getComputedStyle(related).marginLeft)
    related.style.top = offset.top + 'px'
    related.style.left = offset.left + 'px'
  }
  componentDidMount () {
    if (this.state.visible) this.reposition()
  }
  render () {
    let popover
    if (this.state.visible) {
      popover = (
        <div className={`popover ${this.state.placement}`} style={{ width: this.props.width }}ref={related => { this.related = related }}>
          <div className='arrow' />
          <div className='popover-title'>{this.props.title}</div>
          <div className='popover-content'>{this.props.content}</div>
        </div>
      )
    }
    return (
      <span className={`Popover ${this.props.className || ''}`} onMouseOver={this.show} onMouseOut={this.hide}>
        {this.props.children}
        {popover}
      </span>
    )
  }
}

export default Popover
