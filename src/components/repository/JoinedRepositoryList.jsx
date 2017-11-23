import React, { Component } from 'react'
import { connect } from 'react-redux'
import { contextTypes, childContextTypes, getChildContext, CreateButton, RepositoriesTypeDropdown, SearchGroup, mapDispatchToProps, RepositoryListWithSpin, PaginationWithLocation } from './RepositoryListParts'
import _ from 'lodash'
import moment from 'moment'
import './Repository.css'

// 我拥有和加入的仓库
class JoinedRepositoryList extends Component {
  static contextTypes = contextTypes
  static propTypes = {}
  static childContextTypes = childContextTypes
  getChildContext = getChildContext.bind(this)
  render () {
    let { location, match, auth, repositories, create } = this.props
    return (
      <section className='RepositoryListWrapper'>
        <nav className='toolbar clearfix'>
          {(!location.params.user || +location.params.user === auth.id) ? <RepositoriesTypeDropdown url={match.url} /> : null}
          <SearchGroup name={location.params.name} />
          {(!location.params.user || +location.params.user === auth.id) ? <CreateButton owner={auth} create={create} callback='/repository/joined' /> : null}
        </nav>
        <div className='body'>
          <RepositoryListWithSpin name={location.params.name} repositories={repositories} />
        </div>
        <div className='footer'>
          <PaginationWithLocation calculated={repositories.pagination} />
        </div>
      </section>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  repositories: {
    fetching: state.ownedRepositories.fetching || state.joinedRepositories.fetching,
    data: _.uniqBy([...state.ownedRepositories.data, ...state.joinedRepositories.data], 'id')
      .sort((a, b) => {
        return moment(b.updatedAt).diff(a.updatedAt)
      })
  }
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JoinedRepositoryList)
