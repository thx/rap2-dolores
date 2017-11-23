import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import './RModal.css'
import { GoX } from 'react-icons/lib/go'

const customStyle = {
  overlay: {
    background: 'transparent'
  },
  content: {
    border: 'none',
    background: 'transparent'
  }
}

class RModal extends Component {
  static propTypes = {
    when: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onResolve: PropTypes.func.isRequired
  }
  static childContextTypes = {
    rmodal: PropTypes.instanceOf(RModal)
  }
  getChildContext () {
    return { rmodal: this }
  }
  render () {
    let { children, when, onClose } = this.props
    if (!when) return null
    return (
      <Modal isOpen onAfterOpen={this.reposition} contentLabel='Modal' style={customStyle}>
        <div className='RModalWrapper'>
          <div className='rmodal-backdrop' />
          <div className='RModal' ref={$rmodal => { this.$rmodal = $rmodal }}>
            {children}
            <button type='button' className='close' onClick={e => onClose()}>
              <GoX className='gofont' />
            </button>
          </div>
        </div>
      </Modal>
    )
  }
  componentDidMount () {
    // document.body.classList.add('modal-open')
    document.body.addEventListener('keyup', this.handleEsc)
    window.addEventListener('resize', this.reposition)
    this.reposition()
  }
  componentDidUpdate () {
    this.repositionTimer = null
    this.reposition()
  }
  componentWillUnmount () {
    // document.body.classList.remove('modal-open')
    document.body.removeEventListener('keyup', this.handleEsc)
    window.removeEventListener('resize', this.reposition)
  }
  static reposition ($rmodal) {
    if (!$rmodal) return
    let left = (document.documentElement.clientWidth - $rmodal.clientWidth) / 2
    let top = (document.documentElement.clientHeight - $rmodal.clientHeight) / 2
    $rmodal.style.left = left + 'px'
    $rmodal.style.top = top + 'px'
  }
  repositionTimer: null
  reposition = () => {
    if (!this.$rmodal) return
    // RModal.reposition(this.$rmodal)
    // DONE 2.2 当子组件频繁更新时，或者浏览器窗口大小频繁变化时，会频繁调用这个接口，所以需要截流。但是在第一次定位时，不能有延迟！
    // 算是一个通用的截流方案。
    if (!this.repositionTimer) {
      RModal.reposition(this.$rmodal) // 第一次调用，立即修正位置
      this.repositionTimer = setTimeout(() => {}) // 伪造一个 timer，用来识别非第一次调用
    } else {
      clearTimeout(this.repositionTimer)
      this.repositionTimer = setTimeout(() => {
        RModal.reposition(this.$rmodal)
        this.repositionTimer = null
      }, 100)
    }
  }
  handleEsc = (e) => {
    if (e.keyCode === 27) this.props.onClose()
  }
  close = () => {
    this.props.onClose()
  }
  resolve = () => {
    this.props.onClose()
    this.props.onResolve()
  }
}

export default RModal
