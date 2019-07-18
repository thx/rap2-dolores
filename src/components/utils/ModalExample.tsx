import React, { Component } from 'react'
import { PropTypes, connect } from '../../family'
import Modal from './Modal'
import './Utils.css'
import { RootState } from 'actions/types'

class ModalContent extends Component<any, any> {
  static contextTypes = {
    store: PropTypes.object.isRequired,
  }
  static propTypes = {
    auth: PropTypes.object.isRequired,
  }
  render() {
    return (
      <div style={{ width: '400px', height: '400px' }}>
        {JSON.stringify(this.props.auth)}
      </div>
    )
  }
}
const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
})
const mapDispatchToProps = ({})

const ModalContentContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalContent)

class ModalExample extends Component<any, any> {
  static contextTypes = {}
  constructor(props: any) {
    super(props)
    this.state = { visible: false }
  }
  render() {
    const visible = this.state.visible
    return (
      <div>
        <button onClick={() => this.setState({ visible: !visible })}>Trigger</button>
        {visible &&
          <Modal onClose={() => this.setState({ visible: false })}>
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
