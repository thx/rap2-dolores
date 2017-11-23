import React from 'react'
import { connect, Link } from '../../family'
import { Spin } from '../utils'
import OwnedRepositoriesCard from './OwnedRepositoriesCard'
import JoinedRepositoriesCard from './JoinedRepositoriesCard'
import LogsCard from './LogsCard'
import './Home.css'
import { GoRepo } from 'react-icons/lib/go'

const Maiden = () => (
  <div className='Maiden'>
    <Link to='/repository/joined/create' className=' btn btn-lg btn-success'><GoRepo /> 新建仓库</Link>
  </div>
)

// 展示组件
const Home = ({ auth, owned, joined, logs }) => {
  if (owned.fetching || joined.fetching || logs.fetching) return <Spin />

  if (!owned.data.length && !joined.data.length) {
    return (
      <div className='Home'>
        <Maiden />
      </div>
    )
  }
  return (
    <div className='Home'>
      <div className='row'>
        <div className='col-12 col-sm-8 col-md-8 col-lg-8'>
          <LogsCard logs={logs} />
        </div>
        <div className='col-12 col-sm-4 col-md-4 col-lg-4'>
          <OwnedRepositoriesCard repositories={owned} />
          <JoinedRepositoriesCard repositories={joined} />
        </div>
      </div>
    </div>
  )
}

// 容器组件
const mapStateToProps = (state) => ({
  auth: state.auth,
  owned: state.ownedRepositories,
  joined: state.joinedRepositories,
  logs: state.logs
})
const mapDispatchToProps = ({})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
