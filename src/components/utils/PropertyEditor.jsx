/*
  ### Mock 模板编辑器
  1. 属性名
  2. 类型
    * String
    * Number
    * Boolean
    * Function
    * RegExp
    * Object
    * Array
  3. 生成规则
  4. 初始值
*/

import React, { Component } from 'react'
import { mock } from 'mockjs'
import './PropertyEditor.css'

const TYPES = ['String', 'Number', 'Boolean', 'Object', 'Array', 'Function', 'RegExp']
const fixValue = ({type, rule, value}) => {
  switch (type) {
    case 'String':
      return value
    case 'Number':
      try { // eslint-disable-next-line
        return eval(`(${value})`) 
      } catch (e) {
        return 1
      }
    case 'Boolean':
      try { // eslint-disable-next-line
        return eval(`(${value})`) 
      } catch (e) {
        return true
      }
    case 'Function':
    case 'RegExp':
      try { // eslint-disable-next-line
        return eval(`(${value})`) 
      } catch (e) {
        console.warn(type, value)
      }
      break
    case 'Object':
      return {}
    case 'Array':
      return []
    default:
      return value
  }
}

class StringRuleEditor extends Component {
  constructor (props) {
    super(props)
    this.state = { rule: '', count: 1, min: 3, max: 7, value: '' }
  }
  get () {
    switch (this.state.rule) {
      case '':
        return { [`name`]: `${this.state.value}` }
      case '|count':
        return { [`name|${this.state.count}`]: `${this.state.value}` }
      case '|min-max':
        return { [`name|${this.state.min}-${this.state.max}`]: `${this.state.value}` }
      default:
        console.warn('错误的生成规则')
    }
  }
  render () {
    return (
      <section className='RuleEditor'>
        <table className='table'>
          <thead>
            <tr>
              <td>-</td>
              <td>生成规则</td>
              <td>-</td>
              <td>初始值</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>字符串</td>
              <td>
                <select value={this.state.rule} onChange={e => this.setState({ rule: e.target.value })} className='rule'>
                  <option value=''>固定值</option>
                  <option value='|count'>重复固定次数</option>
                  <option value='|min-max'>重复随机次数</option>
                </select>
              </td>
              <td>
                {this.state.rule === '|count' &&
                  <span>
                    <span>重复</span>
                    <input value={this.state.count} onChange={e => this.setState({ count: e.target.value })} className='count' />
                    <span>次</span>
                  </span>
                }
                {this.state.rule === '|min-max' &&
                  <span>
                    <span>重复次数</span>
                    <div>大于等于 <input value={this.state.min} onChange={e => this.setState({ min: e.target.value })} className='min' /></div>
                    <div>小于等于 <input value={this.state.max} onChange={e => this.setState({ max: e.target.value })} className='max' /></div>
                  </span>
                }
              </td>
              <td>
                <input value={this.state.value} onChange={e => this.setState({ value: e.target.value })} className='value' />
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    )
  }
  componentDidUpdate () {
  }
  onChange = () => {
  }
}

class IntegerRuleEditor extends Component {
  constructor (props) {
    super(props)
    this.state = {
      type: '',
      count: 1,
      min: 3,
      max: 7,
      value: ''
    }
  }
  get () {
    switch (this.state.type) {
      case '':
        return { [`name`]: this.state.value }
      case '|min-max':
        return { [`name|${this.state.min}-${this.state.max}`]: 1 }
      default:
        console.warn('错误的生成规则')
    }
  }
  render () {
    return (
      <section className='RuleEditor'>
        <span>整数</span>
        <select value={this.state.type} onChange={e => this.setState({ type: e.target.value })} className='type'>
          <option value=''>固定值</option>
          <option value='|min-max'>随机值</option>
        </select>
        <div>
          {this.state.type === ''
            ? <span>
              <input value={this.state.value} onChange={e => this.setState({ value: e.target.value })} className='value' />
            </span>
            : null}
          {this.state.type === '|min-max'
            ? <span>
              <span>大于等于</span>
              <input value={this.state.min} onChange={e => this.setState({ min: e.target.value })} className='min' />
              <span>，小于等于</span>
              <input value={this.state.max} onChange={e => this.setState({ max: e.target.value })} className='max' />
            </span>
            : null}
        </div>
      </section>
    )
  }
  componentDidUpdate () {
    let template = this.get()
    console.log(template, '=>', mock(template))
  }
  onChange = () => {
    console.log(this.get())
  }
}
class FloatRuleEditor extends Component {
  constructor (props) {
    super(props)
    this.state = {
      type: '',
      count: 1,
      min: 3,
      max: 7,
      dmin: 3,
      dmax: 7,
      value: ''
    }
  }
  get () {
    switch (this.state.type) {
      case '':
        return { [`name`]: +this.state.value }
      case '|min-max.dmin-dmax':
        return { [`name|${this.state.min}-${this.state.max}.${this.state.dmin}-${this.state.dmax}`]: 1 }
      default:
        console.warn('错误的生成规则')
    }
  }
  render () {
    return (
      <section className='RuleEditor'>
        <span>浮点数</span>
        <select value={this.state.type} onChange={e => this.setState({ type: e.target.value })} className='type'>
          <option value=''>固定值</option>
          <option value='|min-max.dmin-dmax'>随机值</option>
        </select>
        <div>
          {this.state.type === ''
            ? <span>
              <input value={this.state.value} onChange={e => this.setState({ value: e.target.value })} className='value' />
            </span>
            : null}
          {this.state.type === '|min-max.dmin-dmax'
            ? <span>
              <span>整数部分</span>
              <span>大于等于</span>
              <input value={this.state.min} onChange={e => this.setState({ min: e.target.value })} className='min' />
              <span>，小于等于</span>
              <input value={this.state.max} onChange={e => this.setState({ max: e.target.value })} className='max' />
              <span>，小数部分保留</span>
              <input value={this.state.dmin} onChange={e => this.setState({ dmin: e.target.value })} className='min' />
              <span>到</span>
              <input value={this.state.dmax} onChange={e => this.setState({ dmax: e.target.value })} className='max' />
              <span>位</span>
            </span>
            : null}
        </div>
      </section>
    )
  }
  componentDidUpdate () {
    let template = this.get()
    console.log(template, '=>', mock(template))
  }
  onChange = () => {
    console.log(this.get())
  }
}

class PropertyEditor extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: 'name',
      type: 'String',
      rule: '',
      value: ''
    }
  }
  render () {
    let template = {
      [`${this.state.name}|${this.state.rule}`]: fixValue(this.state)
    }
    let data = mock(template)
    return (
      <div className='row'>
        <div className='col-12'>
          <StringRuleEditor />
          <IntegerRuleEditor />
          <FloatRuleEditor />
          <hr />
        </div>
        <div className='col-6'>
          <div className='form-group'>
            <label className='control-label'>属性名：</label>
            <input type='text' value={this.state.name} onChange={e => this.setState({ name: e.target.value })} className='form-control' />
          </div>
          <div className='form-group'>
            <label className='control-label'>类型：</label>
            <select name='type' value={this.state.type} onChange={e => this.setState({ type: e.target.value })} className='form-control'>
              {TYPES.map(type =>
                <option key={type} value={type}>{type}</option>
              )}
            </select>
          </div>
          <div className='form-group'>
            <label className='control-label'>生成规则：</label>
            <input type='text' value={this.state.rule} onChange={e => this.setState({ rule: e.target.value })} className='form-control' />
          </div>
          <div className='form-group'>
            <label className='control-label'>初始值：</label>
            <input type='text' value={this.state.value} onChange={e => this.setState({ value: e.target.value })} className='form-control' />
          </div>
        </div>
        <div className='col-6'>
          <pre>{JSON.stringify(template, null, 2)}</pre>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      </div>
    )
  }
}

export default PropertyEditor
