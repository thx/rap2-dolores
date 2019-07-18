import React, { Component } from 'react'
import { connect } from 'react-redux'
import { RepositoriesTypeDropdown, SearchGroup, mapDispatchToProps, RepositoryListWithSpin, PaginationWithLocation } from './RepositoryListParts'
import './Repository.css'
import { RootState } from 'actions/types'

// 全部仓库
class AllRepositoryList extends Component<any, any> {
  render() {
    const { location, match, repositories } = this.props
    return (
      <section className="RepositoryListWrapper">
        <nav className="toolbar clearfix">
          <RepositoriesTypeDropdown url={match.url} />
          <SearchGroup name={location.params.name} />
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
  joiner: state.auth,
  repositories: state.repositories,
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllRepositoryList)
