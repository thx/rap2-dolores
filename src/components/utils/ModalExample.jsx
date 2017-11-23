import React, { Component } from 'react'
import { PropTypes, connect } from '../../family'
import Modal from './Modal'
import './Utils.css'

class ModalContent extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }
  static propTypes = {
    auth: PropTypes.object.isRequired
  }
  render () {
    return (
      <div style={{ width: '400px', height: '400px' }}>
        {JSON.stringify(this.props.auth)}
      </div>
    )
  }
}
const mapStateToProps = (state) => ({
  auth: state.auth
})
const mapDispatchToProps = ({})

let ModalContentContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalContent)

class ModalExample extends Component {
  static contextTypes = {}
  constructor (props) {
    super(props)
    this.state = { visible: false }
  }
  render () {
    let visible = this.state.visible
    return (
      <div>
        <button onClick={e => this.setState({ visible: !visible })}>Trigger</button>
        {visible &&
          <Modal onClose={e => this.setState({ visible: false })}>
            <ModalContentContainer />
            <ModalContentContainer />
            <ModalContentContainer />
          </Modal>
        }
      </div>
    )
  }
}

export default ModalExample
