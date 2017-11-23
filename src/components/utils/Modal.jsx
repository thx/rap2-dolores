// DONE 2.x 待解决 context 不完整的问题（引入 react-modal）
import React, { Component } from 'react'
import { PropTypes, render, Provider } from '../../family'
import './Modal.css'

/*
  <div className='modal-header'>
    <h4 className='modal-title'>Title</h4>
  </div>
  <div className='modal-body'>Body</div>
  <div className='modal-footer'>
    <button type='button' className='btn btn-default'>Close</button>
    <button type='button' className='btn btn-success'>Save</button>
  </div>
*/

class Modal extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }
  static propTypes = {}
  static childContextTypes = {}
  render () {
    return null
  }
  $modal: null
  $backdrop: null
  componentDidMount () {
    document.body.classList.add('modal-open')
    document.body.addEventListener('keyup', this.handleEsc)
    window.addEventListener('resize', this.rePosition)

    this.withBackdrop()
    this.withPortal(() => {
      this.rePosition()
    })
  }
  componentWillUnmount () {
    document.body.classList.remove('modal-open')
    document.body.removeEventListener('keyup', this.handleEsc)
    window.removeEventListener('resize', this.rePosition)

    document.body.removeChild(this.$modal)
    document.body.removeChild(this.$backdrop)
  }
  withPortal (callback) {
    if (!this.$modal) {
      let $modal = document.createElement('div')
      $modal.className = 'modal-portal'
      document.body.appendChild($modal)
      this.$modal = $modal
    }
    let dialog = (
      <Provider store={this.context.store}>
        <div className='Modal' ref={$dialog => { this.$dialog = $dialog }}>
          {this.props.children}
          <button type='button' className='close' onClick={e => this.props.onClose()}>
            <span className='rapfont'>&#xe74c;</span>
          </button>
        </div>
      </Provider>
    )
    render(dialog, this.$modal, callback)
  }
  withBackdrop () {
    if (!this.$backdrop) {
      let $backdrop = document.createElement('div')
      $backdrop.className = 'modal-backdrop'
      document.body.appendChild($backdrop)
      this.$backdrop = $backdrop
    }
  }
  static rePosition ($dialog) {
    let left = (document.documentElement.clientWidth - $dialog.clientWidth) / 2
    let top = (document.documentElement.clientHeight - $dialog.clientHeight) / 2
    $dialog.style.left = left + 'px'
    $dialog.style.top = top + 'px'
  }
  rePosition = () => {
    Modal.rePosition(this.$dialog)
  }
  handleEsc = (e) => {
    if (e.keyCode === 27) this.props.onClose()
  }
  // if (!this.state.visible) {
  //   if ($backdrop) document.body.removeChild($backdrop)
  //   return
  // }
  // open = (e) => {
  //   if (e) e.preventDefault()
  //   this.setState({ visible: true }, () => {
  //     this.withBackdrop()
  //     this.withPortal(() => {
  //       this.rePosition()
  //     })
  //   })
  // }
  // close = () => {
  //   this.setState({ visible: false }, () => {
  //     this.withBackdrop()
  //   })
  // }
}

export default Modal
