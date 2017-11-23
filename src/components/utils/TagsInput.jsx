import React, { Component } from 'react'
import './TagsInput.css'
import { GoX } from 'react-icons/lib/go'

class TagsInput extends Component {
  constructor (props) {
    super(props)
    this.state = {
      seed: '',
      value: props.value || [], // [{ id, label }]
      options: props.options || [] // [{ id, label }]
    }
  }
  componentWillReceiveProps (nextProps) {
    this.setState({
      value: nextProps.value || [],
      options: nextProps.options || []
    })
  }
  render () {
    let { placeholder } = this.props
    return (
      <div className='TagsInput clearfix' onClick={e => this.$seed.focus()}>
        {this.state.value.map(item =>
          <span key={item.id} className='tag'>
            <span className='label'>{item.label}</span>
            <span className='remove' onClick={e => this.handleRemove(item)}><GoX /></span>
          </span>
        )}
        <div className='dropdown'>
          <input className='dropdown-input' value={this.state.seed} placeholder={placeholder} autoComplete='off'
            onChange={e => this.handleSeed(e.target.value)}
            ref={$seed => { this.$seed = $seed }} />
          {this.state.options.length ? (
            <div className='dropdown-menu' ref={$optons => { this.$optons = $optons }}>
              {this.state.options.map(item =>
                <a key={item.id} href='' className='dropdown-item'
                  onClick={e => this.handleSelect(e, item)}>{item.label}</a>
              )}
            </div>
          ) : null}
        </div>
      </div>
    )
  }
  handleSeed = (seed) => {
    let next = { seed: seed }
    this.setState(next, () => {
      let { onSeed } = this.props
      onSeed(seed)
    })
  }
  handleSelect = (e, selected) => {
    e.preventDefault()
    let next = { seed: '', value: [...this.state.value, selected] }
    this.setState(next, this.handleChange)
  }
  handleRemove = (removed) => {
    let next = { value: this.state.value.filter(item => item !== removed) }
    this.setState(next, this.handleChange)
  }
  handleChange = () => {
    let { onChange } = this.props
    onChange(this.state.value)
    this.$seed.focus()
    this.setState({
      options: []
    })
  }
}

export default TagsInput
