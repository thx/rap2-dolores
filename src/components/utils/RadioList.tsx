import React, { Component } from 'react'
import { connect } from 'react-redux'
import './RadioList.css'

/**
 *
 * @param {*} props  { label : [String], value : [String] }
 */

class RadioList extends Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = { curVal: props.curVal }
  }

  handleChange(e: any) {
    if (e.target.value !== this.state.curVal) {
      this.setState({ curVal: e.target.value })
      this.props.onChange && this.props.onChange(e.target.value)
    }
  }

  render() {
    // tslint:disable-next-line: no-this-assignment
    const that = this
    return (
      <div className="ctl-radio-list">
        {
          this.props.data.map((item: any) =>
            <label className="label mr8" key={item.value}>
              <input
                className="input"
                type="radio"
                name={that.props.name}
                value={item.value}
                disabled={that.props.disabled}
                checked={this.state.curVal + '' === item.value + ''}
                data-log={typeof this.state.curVal + '|' + typeof item.value}
                onChange={e => that.handleChange(e)}
              />
              {item.label}
            </label>)
        }
      </div>
    )
  }
}

const mapStateToProps = () => ({})
const mapDispatchToProps = ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RadioList)
