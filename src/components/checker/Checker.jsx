import React, { Component } from 'react'
import { PropTypes, connect, Link } from '../../family'
import { Spin } from '../utils'
import { serve } from '../../relatives/services/constant'
import Mock from 'mockjs'
import './Checker.css'

class Checker extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }
  static propTypes = {
    repository: PropTypes.object.isRequired
  }
  constructor (props) {
    super(props)
    this.state = {
      mod: null,
      itf: null,
      target: serve
    }
  }
  render () {
    let { repository } = this.props
    if (repository.fetching) return <Spin />

    repository = repository.data
    let mod = this.state.mod || repository.modules[0]
    let itf = this.state.itf || mod.interfaces[0]
    return (
      <section className='Checker'>
        <div className='card-mods clearfix'>
          <span className='card-title'>模块：</span>
          {repository.modules.map(item =>
            <Link key={item.id} to='' onClick={e => this.switchMod(e, item)} className={item.id === mod.id ? 'active' : ''}>{item.name}</Link>
          )}
        </div>
        <div className='card-itfs clearfix'>
          <span className='card-title'>接口：</span>
          {mod.interfaces.map(item =>
            <Link key={item.id} to='' onClick={e => this.switchItf(e, item)} className={item.id === itf.id ? 'active' : ''}>{item.name}</Link>
          )}
        </div>
        <div>
          <input value={this.state.target} onChange={e => this.setState({ target: e.target.value })} className='form-control' />
        </div>
        <div className='card-result'>
          <div className='card-title'>{`${serve}/app/mock/data/${itf.id}`}</div>
          <pre>{JSON.stringify(this.state.result, null, 2)}</pre>
        </div>
      </section>
    )
  }
  componentWillReceiveProps (nextProps) {
    let { repository } = nextProps
    repository = repository.data
    if (!repository.id) return
    let mod = this.state.mod || repository.modules[0]
    let itf = this.state.itf || mod.interfaces[0]
    fetch(`${serve}/app/mock/data/${itf.id}`)
      .then(res => res.json())
      .then(json => {
        this.setState({ result: json })
      })
  }
  switchMod = (e, mod) => {
    e.preventDefault()
    this.setState({ mod })
  }
  switchItf = (e, itf) => {
    e.preventDefault()
    this.setState({ itf }, () => {
      this.handleRequest()
    })
  }
  handleRequest = () => {
    let { repositoryId, method, url } = this.state.itf
    let target = `${this.state.target}/app/mock/${repositoryId}/${method}/${url}`
    let proxy = `${serve}/proxy?target=${target}`
    let requests = [
      fetch(`${serve}/app/mock/schema/${this.state.itf.id}`).then(res => res.json()),
      fetch(proxy).then(res => res.json())
    ]
    Promise.all(requests).then(([schema, data]) => {
      let { Diff, Assert } = Mock.valid
      let nextMatch = Assert.match
      Assert.match = function (type, path, actual, expected, result, message) {
        if (typeof expected === 'string') expected = eval('(' + expected + ')') // eslint-disable-line no-eval
        nextMatch(type, path, actual, expected, result, message)
      }
      var result = Diff.diff(schema, data)
      for (var i = 0; i < result.length; i++) {
        console.warn(Assert.message(result[i]))
      }
    })
  }
}
// 容器组件
const mapStateToProps = (state) => ({
  auth: state.auth,
  repository: state.repository
})
const mapDispatchToProps = ({})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Checker)
