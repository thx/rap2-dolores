import React, { Component } from 'react'
import { PropTypes, Link, StoreStateRouterLocationURI, URI } from '../../family'
import { GoAlert } from 'react-icons/lib/go'

class DuplicatedInterfacesWarning extends Component {
  static propTypes = {
    repository: PropTypes.object.isRequired
  }
  static contextTypes = {
    store: PropTypes.object.isRequired
  }
  static parseDuplicatedInterfaces (repository) {
    let counter = {}
    for (let mod of repository.modules) {
      for (let itf of mod.interfaces) {
        let key = `${itf.method} ${itf.url}`
        if (!counter[key]) counter[key] = []
        counter[key] = [...counter[key], { ...itf, mod }]
      }
    }
    let duplicated = []
    for (let key in counter) {
      if (counter[key].length > 1) {
        duplicated.push(counter[key])
      }
    }
    return duplicated
  }
  static printDuplicatedInterfacesWarning (duplicated) {
    duplicated.forEach(interfaces => {
      let key = `${interfaces[0].method} ${interfaces[0].url}`
      console.group('警告：检测到重复接口 ' + key)
      interfaces.forEach(itf => {
        console.warn(`#${itf.id} ${itf.method} ${itf.url}`)
      })
      console.groupEnd('警告：检测到重复接口 ' + key)
    })
  }
  render () {
    let { store } = this.context
    let { repository } = this.props
    if (!repository) return null
    let duplicated = DuplicatedInterfacesWarning.parseDuplicatedInterfaces(repository)
    if (!duplicated.length) return null
    let uri = StoreStateRouterLocationURI(store).removeSearch('page').removeSearch('itf')
    return (
      <div className='DuplicatedInterfacesWarning'>
        {duplicated.map((interfaces, index) =>
          <div key={index} className='alert alert-warning mb6'>
            <span className='title'>
              <GoAlert className='icon' />
              <span className='msg'>警告：检测到重复接口</span>
              <span className='itf'>{interfaces[0].method} {interfaces[0].url || '-'}</span>
            </span>
            {interfaces.map(itf =>
              <Link key={itf.id} to={URI(uri).setSearch('mod', itf.mod.id).setSearch('itf', itf.id).href()} className='mr12'>{itf.name}</Link>
            )}
          </div>
        )}
      </div>
    )
  }
}

export default DuplicatedInterfacesWarning
