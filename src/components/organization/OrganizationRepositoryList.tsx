import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CreateButton, SearchGroup, mapDispatchToProps, OrganizationRepositoryListWithSpin, PaginationWithLocation } from '../repository/RepositoryListParts'
import { Spin } from '../utils'
import '../repository/Repository.css'
import { RootState } from 'actions/types'

// 展示组件
class OrganizationRepositoryList extends Component<any, any> {
  render() {
    const { location, auth, organization, repositories } = this.props
    if (!organization || !organization.id) { return <Spin /> }

    const isOwned = organization.owner.id === auth.id
    const isJoined = organization.members.find((item: any) => item.id === auth.id)
    return (
      <section className="RepositoryListWrapper">
        <div className="header"><span className="title">{organization.name}</span></div>
        <nav className="toolbar clearfix">
          {isOwned || isJoined
            ? <CreateButton organization={organization} />
            : null
          }
          <SearchGroup name={location.params.name} />
        </nav>
        <div className="body">
          <OrganizationRepositoryListWithSpin name={location.params.name} repositories={repositories} />
        </div>
        <div className="footer">
          <PaginationWithLocation calculated={repositories.pagination} />
        </div>
      </section>
    )
  }
}

// 容器组件
const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
  organization: state.organization,
  repositories: state.repositories, // TODO => organizationRepositories
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationRepositoryList)
