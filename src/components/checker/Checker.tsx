import React, { Component } from 'react'
// eslint-disable-next-line
import { connect, Link } from '../../family'
import { Spin } from '../utils'
import { serve } from '../../relatives/services/constant'
import Mock from 'mockjs'
import './Checker.css'
import { RootState } from 'actions/types'
type CheckerProps = {
  store: object;
  repository: any;
}
type CheckerState = {
  result?: any;
  itf?: any;
  mod: any;
  target: any
}
class Checker extends Component<CheckerProps, CheckerState> {
  constructor(props: any) {
    super(props)
    this.state = {
      mod: null,
      itf: null,
      target: serve,
    }
  }
  render() {
    let { repository } = this.props
    if (repository.fetching) { return <Spin /> }
    repository = repository.data
    const mod = this.state.mod || repository.modules[0]
    const itf = this.state.itf || mod.interfaces[0]
    return (
      <section className="Checker">
        <div className="card-mods clearfix">
          <span className="card-title">模块：</span>
          {repository.modules.map((item: any) => (
            <Link key={item.id} to="" onClick={e => this.switchMod(e, item)} className={item.id === mod.id ? 'active' : ''}>
              {item.name}
            </Link>
          ))}
        </div>
        <div className="card-itfs clearfix">
          <span className="card-title">接口：</span>
          {mod.interfaces.map((item: any) => (
            <Link key={item.id} to="" onClick={e => this.switchItf(e, item)} className={item.id === itf.id ? 'active' : ''}>
              {item.name}
            </Link>
          ))}
        </div>
        <div>
          <input value={this.state.target} onChange={e => this.setState({ target: e.target.value })} className="form-control" />
        </div>
        <div className="card-result">
          <div className="card-title">{`${serve}/app/mock/data/${itf.id}`}</div>
          <pre>{JSON.stringify(this.state.result, null, 2)}</pre>
        </div>
      </section>
    )
  }
  componentWillReceiveProps(nextProps: any) {
    let { repository } = nextProps
    repository = repository.data
    if (!repository.id) { return }
    const mod = this.state.mod || repository.modules[0]
    const itf = this.state.itf || mod.interfaces[0]
    fetch(`${serve}/app/mock/data/${itf.id}`)
      .then(res => res.json())
      .then(json => {
        this.setState({ result: json })
      })
  }
  switchMod = (e: any, mod: any) => {
    e.preventDefault()
    this.setState({ mod })
  };
  switchItf = (e: any, itf: any) => {
    e.preventDefault()
    this.setState({ itf }, () => {
      this.handleRequest()
    })
  };
  handleRequest = () => {
    const { repositoryId, method, url } = this.state.itf
    const target = `${this.state.target}/app/mock/${repositoryId}/${method}/${url}`
    const proxy = `${serve}/proxy?target=${target}`
    const requests = [fetch(`${serve}/app/mock/schema/${this.state.itf.id}`).then(res => res.json()), fetch(proxy).then(res => res.json())]
    Promise.all(requests).then(([schema, data]) => {
      const { Diff, Assert } = Mock.valid as any
      const nextMatch = Assert.match
      Assert.match = (type: any, path: any, actual: any, expected: any, result: any, message: any) => {
        // eslint-disable-next-line
        if (typeof expected === 'string') { expected = eval('(' + expected + ')') }
        nextMatch(type, path, actual, expected, result, message)
      }
      const result = Diff.diff(schema, data)
      for (const i of result) {
        console.warn(Assert.message(i))
      }
    })
  };
}
// 容器组件
const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
  repository: state.repository,
})
const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(Checker)
