import React, { Component } from 'react'
import './TagsInput.css'
import { GoX } from 'react-icons/go'

class TagsInput extends Component<any, any> {
  $seed: any
  $options: any
  constructor(props: any) {
    super(props)
    this.state = {
      seed: '',
      value: props.value || [], // [{ id, label }]
      options: props.options || [], // [{ id, label }]
    }
  }
  componentWillReceiveProps(nextProps: any) {
    this.setState({
      value: nextProps.value || [],
      options: nextProps.options || [],
    })
  }
  render() {
    const { placeholder } = this.props
    return (
      <div className="TagsInput clearfix" onClick={() => this.$seed.focus()}>
        {this.state.value.map((item: any) =>
          <span key={item.id} className="tag">
            <span className="label">{item.label}</span>
            <span className="remove" onClick={() => this.handleRemove(item)}><GoX /></span>
          </span>
        )}
        <div className="dropdown">
          <input
            className="dropdown-input"
            value={this.state.seed}
            placeholder={placeholder}
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
                  {item.label}
                </button>
              )}
            </div>
          ) : null}
        </div>
      </div>
    )
  }
  handleSeed = (seed: any) => {
    const next = { seed: seed }
    this.setState(next, () => {
      const { onSeed } = this.props
      onSeed(seed)
    })
  }
  handleSelect = (e: any, selected: any) => {
    e.preventDefault()
    const next = { seed: '', value: [...this.state.value, selected] }
    this.setState(next, this.handleChange)
  }
  handleRemove = (removed: any) => {
    const next = { value: this.state.value.filter((item: any) => item !== removed) }
    this.setState(next, this.handleChange)
  }
  handleChange = () => {
    const { onChange } = this.props
    onChange(this.state.value)
    this.$seed.focus()
    this.setState({
      options: [],
    })
  }
}

export default TagsInput
