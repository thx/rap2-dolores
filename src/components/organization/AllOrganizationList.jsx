import React, { Component } from 'react'
import { connect } from 'react-redux'
import { contextTypes, childContextTypes, getChildContext, CreateButton, OrganizationsTypeDropdown, SearchGroup, OrganizationListWithSpin, PaginationWithLocation, mapDispatchToProps } from './OrganizationListParts'
import './Organization.css'

// 所有团队
class JoinedOrganizationList extends Component {
  static contextTypes = contextTypes
  static childContextTypes = childContextTypes
  getChildContext = getChildContext
  render () {
    let { location, match, organizations } = this.props
    return (
      <section className='OrganizationListWrapper'>
        <nav className='toolbar clearfix'>
          <OrganizationsTypeDropdown url={match.url} />
          <SearchGroup name={location.params.name} />
          <CreateButton />
        </nav>
        <div className='body'>
          <OrganizationListWithSpin name={location.params.name} organizations={organizations} />
        </div>
        <div className='footer'>
          <PaginationWithLocation calculated={organizations.pagination} />
        </div>
      </section>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  organizations: state.organizations
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JoinedOrganizationList)
