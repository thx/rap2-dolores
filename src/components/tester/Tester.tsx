import React, { Component } from 'react'
import { PropTypes, connect, Link, Mock, URI, StoreStateRouterLocationURI } from '../../family'
import { Spin, Tree } from '../utils'
import { serve } from '../../relatives/services/constant'
import './Tester.css'
import { RootState } from 'actions/types'

class Tester extends Component<any, any> {
  static contextTypes = {
    store: PropTypes.object.isRequired,
  }
  static propTypes = {
    repository: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  }
  constructor(props: any) {
    super(props)
    this.state = {
      requestData: {},
      template: null,
      schema: null,
      data: null,
      target: serve,
    }
  }
  render() {
    const { store } = this.context
    const { location: { params } }: any = this.props
    let { repository } = this.props
    if (!repository.fetching && !repository.data) { return <div className="p100 fontsize-40 text-center">404</div> }

    repository = repository.data
    if (!repository.id) { return <Spin /> } // // DONE 2.2 每次获取仓库都显示加载动画不合理，应该只在初始加载时显示动画。

    const mod = repository && repository.modules && repository.modules.length
      ? (repository.modules.find((item: any) => item.id === +params.mod) || repository.modules[0]) : {}
    const itf = mod.interfaces && mod.interfaces.length
      ? (mod.interfaces.find((item: any) => item.id === +params.itf) || mod.interfaces[0]) : {}
    // let properties = itf.properties || []

    const { requestData } = this.state
    const requestURI = URI(`${serve}/app/mock/data/${itf.id}`)
    for (const key in requestData) {
      if (requestData[key] === '') { requestURI.removeSearch(key) } else { requestURI.setSearch(key, requestData[key]) }
    }
    const uri = StoreStateRouterLocationURI(store).removeSearch('itf')
    return (
      <section className="Tester">
        <div className="header">
          <div className="card-mods clearfix">
            <div className="card-title">模块：</div>
            <ul className="clearfix">
              {repository.modules.map((item: any) =>
                <li key={item.id} className={item.id === mod.id ? 'active' : ''}>
                  <Link to={uri.setSearch('mod', item.id).href()}>{item.name}</Link>
                </li>
              )}
            </ul>
          </div>
          <div className="card-itfs clearfix">
            <div className="card-title">接口：</div>
            <ul className="clearfix">
              {mod.interfaces.map((item: any) =>
                <li key={item.id} className={item.id === itf.id ? 'active' : ''}>
                  <Link to={uri.setSearch('mod', mod.id).setSearch('itf', item.id).href()} onClick={() => this.switchItf(item)}>{item.name}</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="body">
          <div className="card-props clearfix">
            <form onSubmit={e => { e.preventDefault(); this.handleRequest(itf) }}>
              <div className="mb6 ml6 font-bold">业务系统：</div>
              <input value={this.state.target} onChange={e => this.setState({ target: e.target.value })} className="form-control" />
              <ul className="fields clearfix">
                {Object.keys(requestData).map(key =>
                  <li key={key} className="filed">
                    <div className="label">{key}</div>
                    <input value={requestData[key]} onChange={e => this.updateRequestData(e, key, e.target.value)} className="form-control" />
                  </li>
                )}
              </ul>
              <button className="btn btn-success" type="submit">Submit</button>
            </form>
          </div>
          <div className="card-result">
            <div className="card-title">
              <Link to={requestURI.href()} target="_blank" rel="noopener noreferrer">{decodeURI(requestURI.href())}</Link>
            </div>
            <div>
              <pre>{JSON.stringify(this.state.data, null, 2)}</pre>
            </div>
          </div>
        </div>
      </section>
    )
  }
  switchMod = () => {
    // this.setState({ mod })
  }
  switchItf = (itf: any) => {
    const requestProperties = itf.properties.map((property: any) => ({ ...property })).filter((property: any) => property.scope === 'request')
    const requestTemplate = Tree.treeToJson(Tree.arrayToTree(requestProperties))
    const requestData = Mock.mock(requestTemplate)
    this.setState({ requestData }, () => {
      this.handleRequest(itf)
    })
  }
  handleRequest = (itf: any) => {
    const requests = [
      fetch(`${serve}/app/mock/template/${itf.id}`).then(res => res.json()),
      fetch(`${serve}/app/mock/schema/${itf.id}`).then(res => res.json()),
    ]

    const { requestData } = this.state
    const uri = URI(`${serve}/app/mock/data/${itf.id}`)
    for (const key in requestData) {
      if (requestData[key] === '') { uri.removeSearch(key) } else { uri.setSearch(key, requestData[key]) }
    }
    requests.push(
      fetch(uri.toString()).then(res => res.json())
    )

    const { repositoryId, method, url } = itf
    const target = `${this.state.target}/app/mock/${repositoryId}/${method}/${url}`
    const proxy = `${serve}/proxy?target=${target}`
    requests.push(
      fetch(proxy).then(res => res.json())
    )

    Promise.all(requests).then(([template, schema, data, target]) => {
      this.setState({ template, schema, data })

      const { Diff, Assert } = Mock.valid
      const nextMatch = Assert.match
      Assert.match = (type: any, path: any, actual: any, expected: any, result: any, message: any) => {
        if (typeof expected === 'string') { expected = eval('(' + expected + ')') } // eslint-disable-line no-eval
        nextMatch(type, path, actual, expected, result, message)
      }
      const result = Diff.diff(schema, target)
      for (const item of result) {
        console.warn(Assert.message(item))
      }
    })
  }
  updateRequestData = (_: any, key: string, value: any) => {
    this.setState({
      requestData: { ...this.state.requestData, [key]: value },
    })
  }
}
// 容器组件
const mapStateToProps = (state: RootState) => ({
  repository: state.repository,
})
const mapDispatchToProps = ({})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tester)
