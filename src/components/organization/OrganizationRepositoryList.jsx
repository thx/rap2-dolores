import React, { Component } from 'react'
import { connect } from 'react-redux'
import { contextTypes, childContextTypes, getChildContext, CreateButton, SearchGroup, mapDispatchToProps, OrganizationRepositoryListWithSpin, PaginationWithLocation } from '../repository/RepositoryListParts'
import { Spin } from '../utils'
import '../repository/Repository.css'

// 展示组件
class OrganizationRepositoryList extends Component {
  static contextTypes = contextTypes
  static propTypes = {}
  static childContextTypes = childContextTypes
  getChildContext = getChildContext.bind(this)
  render () {
    let { location, auth, organization, repositories } = this.props
    if (!organization.id) return <Spin />

    let isOwned = organization.owner.id === auth.id
    let isJoined = organization.members.find(itme => itme.id === auth.id)
    return (
      <section className='RepositoryListWrapper'>
        <div className='header'><span className='title'>{organization.name}</span></div>
        <nav className='toolbar clearfix'>
          {isOwned || isJoined
            ? <CreateButton organization={organization} />
            : null
          }
          <SearchGroup name={location.params.name} />
        </nav>
        <div className='body'>
          <OrganizationRepositoryListWithSpin name={location.params.name} repositories={repositories} />
        </div>
        <div className='footer'>
          <PaginationWithLocation calculated={repositories.pagination} />
        </div>
      </section>
    )
  }
}

// 容器组件
const mapStateToProps = (state) => ({
  auth: state.auth,
  organization: state.organization,
  repositories: state.repositories // TODO => organizationRepositories
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationRepositoryList)
