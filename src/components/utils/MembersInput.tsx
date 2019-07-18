import React, { Component } from 'react'
import _ from 'lodash'
import AccountService from '../../relatives/services/Account'
import './TagsInput.css'
import { GoX } from 'react-icons/go'

// TODO 2.3 input 宽度自适应
// TODO 2.3 回退删除 回退选中
class MembersInput extends Component<any, any> {
  $seed: any
  $options: any
  constructor(props: any) {
    super(props)
    this.state = {
      seed: '',
      value: props.value || [], // [{ id, fullname, email }]
      options: [], // [{ id, fullname, email }]
      limit: props.limit,
    }
  }
  componentWillReceiveProps(nextProps: any) {
    this.setState({
      value: nextProps.value || [],
    })
  }
  render() {
    return (
      <div className="TagsInput clearfix" onClick={() => this.$seed && this.$seed.focus()}>
        {this.state.value.map((item: any) =>
          <span key={item.id} className="tag">
            <span className="label">{item.fullname}</span>
            <span className="remove" onClick={() => this.handleRemove(item)}><GoX /></span>
          </span>
        )}
        {(!this.state.limit || this.state.value.length < this.state.limit) &&
          <div className="dropdown">
            <input
              className="dropdown-input"
              value={this.state.seed}
              placeholder="花名或工号"
              autoComplete="off"
              onChange={e => this.handleSeed(e.target.value)}
              ref={$seed => { this.$seed = $seed }}
            />
            {this.state.options.length ? (
              <div className="dropdown-menu" ref={$options => { this.$options = $options }}>
                {this.state.options.map((item: any) =>
                  <button
                    key={item.id}
                    className="dropdown-item"
                    onClick={e => this.handleSelect(e, item)}
                  >
                    {item.fullname} {item.empId} {item.email}
                  </button>
                )}
              </div>
            ) : null}
          </div>
        }
      </div>
    )
  }
  handleSeed = async (seed: any) => {
    this.setState({ seed: seed })
    if (!seed) {
      this.setState({ options: [] })
      return
    }
    const users = await AccountService.fetchUserList({ name: seed })
    const options = _.differenceWith(users.data, this.state.value, _.isEqual)
    this.setState({ options })
  }
  handleSelect = (e: any, selected: any) => {
    e.preventDefault()
    const nextState = { seed: '', value: [...this.state.value, selected] }
    this.setState(nextState, this.handleChange)
  }
  // √remove vs delete
  handleRemove = (removed: any) => {
    const nextState = { value: this.state.value.filter((item: any) => item !== removed) }
    this.setState(nextState, this.handleChange)
  }
  // √change vs update
  handleChange = () => {
    const { onChange } = this.props
    onChange(this.state.value)
    this.$seed && this.$seed.focus()
    this.setState({
      options: [],
    })
  }
}

export default MembersInput
