import React, { Component } from 'react'
import { connect } from 'react-redux'
import {  CreateButton, RepositoriesTypeDropdown, SearchGroup, mapDispatchToProps, RepositoryListWithSpin, PaginationWithLocation } from './RepositoryListParts'
import _ from 'lodash'
import moment from 'moment'
import './Repository.css'
import { RootState } from 'actions/types'

class JoinedRepositoryList extends Component<any, any> {
  render() {
    const { location, match, auth, repositories } = this.props
    return (
      <section className="RepositoryListWrapper">
        <nav className="toolbar clearfix">
          {(!location.params.user || +location.params.user === auth.id) ? <RepositoriesTypeDropdown url={match.url} /> : null}
          <SearchGroup name={location.params.name} />
          {(!location.params.user || +location.params.user === auth.id) ?
            <CreateButton callback="/repository/joined" /> : null}
        </nav>
        <div className="body">
          <RepositoryListWithSpin name={location.params.name} repositories={repositories} />
        </div>
        <div className="footer">
          <PaginationWithLocation calculated={repositories.pagination} />
        </div>
      </section>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
  repositories: {
    fetching: state.ownedRepositories.fetching || state.joinedRepositories.fetching,
    data: _.uniqBy([...state.ownedRepositories.data, ...state.joinedRepositories.data], 'id')
      .sort((a, b) => {
        return moment(b.updatedAt).diff(a.updatedAt)
      }),
  },
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JoinedRepositoryList)
