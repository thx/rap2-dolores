import React from 'react'
import { Link } from '../../family'
import { Spin } from '../utils'
import { Card } from '@material-ui/core'

const JoinedRepositoriesCard = ({ repositories }: any) => (
  <Card>
    <div className="card-header">我加入的仓库</div>
    {repositories.fetching ? <Spin /> : (
      <div className="card-block">
        {repositories.data.slice(0, 10).map((repository: any) =>
          <p key={repository.id}><JoinedRepositoryLink repository={repository} /></p>
        )}
        {repositories.data.length === 0 ? <span>-</span> : null}
        {repositories.data.length > 10
          ? <Link to="/repository/joined">{'=>'} 查看全部 {repositories.data.length} 个仓库</Link>
          : null
        }
      </div>)
    }
  </Card>
)
const JoinedRepositoryLink = ({ repository }: any) => (
  <Link to={`/repository/editor?id=${repository.id}`}>
    <span>{repository.organization ? repository.organization.name : repository.owner.fullname}</span>
    <span> / </span>
    <span>{repository.name}</span>
  </Link>
)

export default JoinedRepositoriesCard
