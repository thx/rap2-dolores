import React, { Component } from 'react'
import { PropTypes, Link, StoreStateRouterLocationURI, URI } from '../../family'

class Highlight extends Component {
  static replace = (clip, seed) => {
    if (!seed) return clip
    let rseed = new RegExp(seed, 'ig')
    return ('' + clip).replace(rseed, (matched) =>
      `<span class='highlight'>${matched}</span>`
    )
  }
  render () {
    let { clip, seed } = this.props
    let highlighted = { __html: Highlight.replace(clip, seed) }
    return (
      <span {...this.props} dangerouslySetInnerHTML={highlighted} />
    )
  }
}

class DropdownMenu extends Component {
  static filter = (respository, seed) => {
    let nextRespository = { ...respository, modules: [] }
    let counter = 0
    respository.modules.forEach(mod => {
      let nextModule = { ...mod, interfaces: [] }
      let matchModule = nextModule.name.indexOf(seed) !== -1
      if (matchModule) {
        counter++
        nextRespository.modules.push(nextModule)
      }

      mod.interfaces.forEach(itf => {
        let nextInterface = { ...itf, properties: [] }
        let matchInterface = nextInterface.name.indexOf(seed) !== -1 || nextInterface.url.indexOf(seed) !== -1 || nextInterface.method === seed
        if (matchInterface) {
          counter++
          if (!matchModule) {
            matchModule = true
            nextRespository.modules.push(nextModule)
          }
          nextModule.interfaces.push(nextInterface)
        }

        itf.properties.forEach(property => {
          let nextProperty = { ...property }
          let matchProperty = nextProperty.name.indexOf(seed) !== -1
          if (matchProperty) {
            counter++
            if (!matchModule) {
              matchModule = true
              nextRespository.modules.push(nextModule)
            }
            if (!matchInterface) {
              matchInterface = true
              nextModule.interfaces.push(nextInterface)
            }
            nextInterface.properties.push(nextProperty)
          }
        })
      })
    })
    return { nextRespository, counter }
  }
  static highlight = (clip, seed) => {
    if (!seed) return clip
    let rseed = new RegExp(seed, 'ig')
    return ('' + clip).replace(rseed, (matched) =>
      `<span class='highlight'>${matched}</span>`
    )
  }
  static contextTypes = {
    store: PropTypes.object
  }
  render () {
    let { repository, seed, onSelect } = this.props
    let uri = StoreStateRouterLocationURI(this.context.store).removeSearch('mod').removeSearch('itf')
    let { nextRespository, counter } = DropdownMenu.filter(repository, seed)
    if (counter === 0) return null
    return (
      <div className='dropdown-menu'>
        {nextRespository.modules.map((mod, index, modules) =>
          <div key={`mod-${mod.id}`}>
            <Link to={URI(uri).setSearch({ mod: mod.id }).href()} onClick={onSelect} className='dropdown-item dropdown-item-module'>
              <span className='label'>模块</span>
              <Highlight className='dropdown-item-clip' clip={mod.name} seed={seed} />
            </Link>
            {mod.interfaces.map(itf =>
              <div key={`itf-${itf.id}`} >
                <Link to={URI(uri).setSearch({ mod: itf.moduleId }).setSearch({ itf: itf.id }).href()} onClick={onSelect} className='dropdown-item dropdown-item-interface'>
                  <span className='label'>接口</span>
                  <Highlight className='dropdown-item-clip' clip={itf.name} seed={seed} />
                  <Highlight className='dropdown-item-clip' clip={itf.method} seed={seed} />
                  <Highlight className='dropdown-item-clip' clip={itf.url} seed={seed} />
                </Link>
                {itf.properties.map(property =>
                  <Link key={`property-${property.id}`} to={URI(uri).setSearch({ mod: property.moduleId }).setSearch({ itf: property.interfaceId }).href()} onClick={onSelect} className='dropdown-item dropdown-item-property'>
                    <span className='label'>属性</span>
                    <Highlight className='dropdown-item-clip' clip={property.name} seed={seed} />
                  </Link>
                )}
              </div>
            )}
            {index < modules.length - 1 && <div className='dropdown-divider' />}
          </div>
        )}
      </div>
    )
  }
}

// TODO 2.2 自动隐藏，高阶组件
class RepositorySearcher extends Component {
  constructor (props) {
    super(props)
    this.state = { seed: '' }
  }
  render () {
    let { repository } = this.props
    return (
      <div className='RepositorySearcher dropdown'>
        <input value={this.state.seed} onChange={e => { this.setState({ seed: e.target.value }) }} className='dropdown-input form-control' placeholder='工作区搜索' />
        {this.state.seed && <DropdownMenu repository={repository} seed={this.state.seed} onSelect={this.clearSeed} />}
      </div>
    )
  }
  clearSeed = (e) => {
    this.setState({ seed: '' })
  }
}

export default RepositorySearcher
