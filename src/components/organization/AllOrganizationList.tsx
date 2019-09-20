import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CreateButton, OrganizationsTypeDropdown, SearchGroup, OrganizationListWithSpin, PaginationWithLocation, mapDispatchToProps } from './OrganizationListParts'
import './Organization.css'
import { RootState } from 'actions/types'

// 所有团队
class JoinedOrganizationList extends Component<any, any> {
  render() {
    const { location, match, organizations } = this.props
    return (
      <section className="OrganizationListWrapper">
        <nav className="toolbar clearfix">
          <OrganizationsTypeDropdown url={match.url} />
          <SearchGroup name={location.params.name} />
          <CreateButton />
        </nav>
        <div className="body">
          <OrganizationListWithSpin name={location.params.name} organizations={organizations} />
        </div>
        <div className="footer">
          <PaginationWithLocation calculated={organizations.pagination} />
        </div>
      </section>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
  organizations: state.organizations,
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JoinedOrganizationList)
