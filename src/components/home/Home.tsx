import React from 'react'
import { Link } from '../../family'
import { connect } from 'react-redux'
import { Spin } from '../utils'
import OwnedRepositoriesCard from './OwnedRepositoriesCard'
import JoinedRepositoriesCard from './JoinedRepositoriesCard'
import LogsCard from './LogsCard'
import './Home.css'
import { GoRepo } from 'react-icons/go'
import { RootState } from 'actions/types'

const Maiden = () => (
  <div className="Maiden">
    <Link to="/repository/joined/create" className=" btn btn-lg btn-success"><GoRepo /> 新建仓库</Link>
  </div>
)

// 展示组件
const Home = ({ owned, joined, logs }: any) => {
  if (owned.fetching || joined.fetching || logs.fetching) { return <Spin /> }

  if (!owned.data.length && !joined.data.length) {
    return (
      <div className="Home">
        <Maiden />
      </div>
    )
  }
  return (
    <div className="Home">
      <div className="row">
        <div className="distribute-2-3 pl15 pr15">
          <LogsCard logs={logs} />
        </div>
        <div className="distribute-1-3 pl15 pl15">
          <OwnedRepositoriesCard repositories={owned} />
          <div style={{ marginTop: 8 }}>
            <JoinedRepositoriesCard repositories={joined} />
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
  owned: state.ownedRepositories,
  joined: state.joinedRepositories,
  logs: state.logs,
})
const mapDispatchToProps = ({})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
