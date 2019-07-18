import React, { Component } from 'react'
import { connect } from 'react-redux'
import { contextTypes, childContextTypes, getChildContext, CreateButton, OrganizationsTypeDropdown, SearchGroup, OrganizationListWithSpin, mapDispatchToProps } from './OrganizationListParts'
import _ from 'lodash'
import moment from 'moment'
import './Organization.css'
import { RootState } from 'actions/types'

// 我拥有和加入的团队
class JoinedOrganizationList extends Component<any, any> {
  static contextTypes = contextTypes
  static childContextTypes = childContextTypes
  getChildContext = getChildContext
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
          {/* 没有分页！ */}
        </div>
      </section>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
  joiner: state.auth,
  organizations: {
    fetching: state.ownedOrganizations.fetching || state.joinedOrganizations.fetching,
    data: _.uniqBy([...state.ownedOrganizations.data, ...state.joinedOrganizations.data], 'id')
      .sort((a, b) => {
        return moment(b.updatedAt).diff(a.updatedAt)
      }),
  },
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JoinedOrganizationList)
