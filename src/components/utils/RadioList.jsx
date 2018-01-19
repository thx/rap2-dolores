import React from 'react'
import { connect } from 'react-redux'
import './RadioList.css'

/**
 *
 * @param {*} props  { label : [String], value : [String] }
 */

class RadioList extends React.Component {
  constructor (props) {
    super(props)
    this.state = { curVal: props.curVal }
  }

  handleChange (e) {
    this.setState({ curVal: e.target.value === 'true' })
    this.props.onChange(e.target.value)
  }

  render () {
    let that = this
    return (
      <div className='ctl-radio-list'>
        {
          this.props.data.map(item =>
            <label className='label' key={item.value}>
              <input className='input'type='radio' name={that.props.name} value={item.value}
                checked={this.state.curVal === item.value} onChange={e => that.handleChange(e)} />
              {item.label}
            </label>)
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({})
const mapDispatchToProps = ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RadioList)
