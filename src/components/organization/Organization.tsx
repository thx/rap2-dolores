import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Popover } from '../utils'
import OrganizationForm from './OrganizationForm'
import { GoOrganization } from 'react-icons/go'
import { useSelector } from 'react-redux'
import { RootState, Organization } from '../../actions/types'
import { handleDelete, handleExit, handleJoin } from './OrganizationListParts'

function avatar(user: any) {
  return `https://work.alibaba-inc.com/photo/${user.empId}.220x220.jpg`
}

interface Props {
  organization: Organization
}

function OrganizationBlock(props: Props) {
  const { organization } = props
  const auth = useSelector((state: RootState) => state.auth)
  const [update, setUpdate] = useState(false)
  const owned = organization.owner && organization.owner.id === auth.id
  const joined = organization.members!.find(user => user.id === auth.id)
  const selfHelpJoin = false // DONE 2.1 不允许自助加入团队
  return (
    <section className="Organization card">
      <div className="card-block">
        <div className="header clearfix">
          <span className="title">
            <GoOrganization className="mr6 color-9" />
            <Link to={`/organization/repository?organization=${organization.id}`} >{organization.name}</Link>
          </span>
          <span className="toolbar">
            {owned || joined ? ( // 拥有或已加入
              <span className="fake-link operation mr5" onClick={() => setUpdate(true)}>编辑</span>
            ) : null}
            <OrganizationForm organization={organization} open={update} onClose={() => setUpdate(false)} />
            {owned ? ( // 拥有
              <Link to="" onClick={e => handleDelete(e, organization)} className="operation mr5">删除</Link>
            ) : null}
            {!owned && joined ? ( // 不拥有，已加入
              <Link to="" onClick={e => handleExit(e, organization)} className="operation mr5">退出</Link>
            ) : null}
            {!owned && !joined && selfHelpJoin ? ( // 不拥有，未加入
              <Link to="" onClick={e => handleJoin(e, organization)} className="operation mr5">加入</Link>
            ) : null}
          </span>
        </div>
        <div className="body">
          <div className="desc">{organization.description}</div>
          <div className="members">
            <Popover content={`${organization.owner!.fullname} ${organization.owner!.id}`}>
              <img alt={organization.owner!.fullname} src={avatar(organization.owner)} className="avatar owner" />
            </Popover>
            {organization.members!.map(user =>
              <Popover key={user.id} content={`${user.fullname} ${user.id}`}>
                <img alt={user.fullname} title={user.fullname} src={avatar(user)} className="avatar" />
              </Popover>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default OrganizationBlock
