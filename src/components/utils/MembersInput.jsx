import React, { Component } from 'react'
import _ from 'lodash'
import AccountService from '../../relatives/services/Account'
import './TagsInput.css'
import { GoX } from 'react-icons/lib/go'

// TODO 2.3 input 宽度自适应
// TODO 2.3 回退删除 回退选中
class MembersInput extends Component {
  constructor (props) {
    super(props)
    this.state = {
      seed: '',
      value: props.value || [], // [{ id, fullname, email }]
      options: [], // [{ id, fullname, email }]
      limit: props.limit
    }
  }
  componentWillReceiveProps (nextProps) {
    this.setState({
      value: nextProps.value || []
    })
  }
  render () {
    return (
      <div className='TagsInput clearfix' onClick={e => this.$seed && this.$seed.focus()}>
        {this.state.value.map(item =>
          <span key={item.id} className='tag'>
            <span className='label'>{item.fullname}</span>
            <span className='remove' onClick={e => this.handleRemove(item)}><GoX /></span>
          </span>
        )}
        {(!this.state.limit || this.state.value.length < this.state.limit) &&
          <div className='dropdown'>
            <input className='dropdown-input' value={this.state.seed} placeholder='名字检索' autoComplete='off'
              onChange={e => this.handleSeed(e.target.value)}
              ref={$seed => { this.$seed = $seed }} />
            {this.state.options.length ? (
              <div className='dropdown-menu' ref={$optons => { this.$optons = $optons }}>
                {this.state.options.map(item =>
                  <a key={item.id} href='' className='dropdown-item'
                    onClick={e => this.handleSelect(e, item)}>{item.fullname} {item.email}</a>
                )}
              </div>
            ) : null}
          </div>
        }
      </div>
    )
  }
  handleSeed = async (seed) => {
    this.setState({ seed: seed })
    if (!seed) {
      this.setState({ options: [] })
      return
    }
    let users = await AccountService.fetchUserList({ name: seed })
    let options = _.differenceWith(users.data, this.state.value, _.isEqual)
    this.setState({ options })
  }
  handleSelect = (e, selected) => {
    e.preventDefault()
    let nextState = { seed: '', value: [...this.state.value, selected] }
    this.setState(nextState, this.handleChange)
  }
  // √remove vs delete
  handleRemove = (removed) => {
    let nextState = { value: this.state.value.filter(item => item !== removed) }
    this.setState(nextState, this.handleChange)
  }
  // √change vs update
  handleChange = () => {
    let { onChange } = this.props
    onChange(this.state.value)
    this.$seed && this.$seed.focus()
    this.setState({
      options: []
    })
  }
}

export default MembersInput
