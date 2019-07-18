import React, { Component } from 'react'
import { Link, StoreStateRouterLocationURI } from '../../family'
import { GoAlert } from 'react-icons/go'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { RouterState } from 'connected-react-router'

type DuplicatedInterfacesWarningState = any
type DuplicatedInterfacesWarningProps = {
  repository: any
  router: RouterState
}
class DuplicatedInterfacesWarning extends Component<DuplicatedInterfacesWarningProps, DuplicatedInterfacesWarningState> {
  static contextTypes = {
    store: PropTypes.object,
  }

  static parseDuplicatedInterfaces(repository: any) {
    const counter: any = {}
    for (const mod of repository.modules) {
      for (const itf of mod.interfaces) {
        const key = `${itf.method} ${itf.url}`
        if (!counter[key]) { counter[key] = [] }
        counter[key] = [...counter[key], { ...itf, mod }]
      }
    }
    const duplicated: any[] = []
    for (const key in counter) {
      if (counter[key].length > 1) {
        duplicated.push(counter[key])
      }
    }
    return duplicated
  }
  static printDuplicatedInterfacesWarning(duplicated: any) {
    duplicated.forEach((interfaces: any) => {
      const key = `${interfaces[0].method} ${interfaces[0].url}`
      console.group('警告：检测到重复接口 ' + key)
      interfaces.forEach((itf: any) => {
        console.warn(`#${itf.id} ${itf.method} ${itf.url}`)
      })
      console.groupEnd()
    })
  }
  render() {
    const { repository, router } = this.props
    if (!repository) { return null }
    const duplicated = DuplicatedInterfacesWarning.parseDuplicatedInterfaces(repository)
    if (!duplicated.length) { return null }
    const uri = StoreStateRouterLocationURI(router)
      .removeSearch('page')
      .removeSearch('itf')
    return (
      <div className="DuplicatedInterfacesWarning">
        {duplicated.map((interfaces, index) => (
          <div key={index} className="alert alert-warning mb6">
            <span className="title">
              <GoAlert className="icon" />
              <span className="msg">警告：检测到重复接口</span>
              <span className="itf">
                {interfaces[0].method} {interfaces[0].url || '-'}
              </span>
            </span>
            {interfaces.map((itf: any) => (
              <Link
                key={itf.id}
                to={uri
                  .setSearch('mod', itf.mod.id)
                  .setSearch('itf', itf.id)
                  .href()}
                className="mr12"
              >
                {itf.name}
              </Link>
            ))}
          </div>
        ))}
      </div>
    )
  }
}
export default connect((state: any) => ({
  router: state.router,
}))(DuplicatedInterfacesWarning)
