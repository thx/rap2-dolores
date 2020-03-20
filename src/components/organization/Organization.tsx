import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import OrganizationForm from './OrganizationForm'
import { GoOrganization, GoPencil, GoSignOut, GoSignIn, GoTrashcan } from 'react-icons/go'
import { useSelector } from 'react-redux'
import { RootState, Organization } from '../../actions/types'
import { useHandleDelete, useHandleExit, useHandleJoin } from './OrganizationListParts'
import { Card } from '@material-ui/core'

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
  const handleDelete = useHandleDelete()
  const handleExit = useHandleExit()
  const handleJoin = useHandleJoin()
  return (
    <Card className="Organization card">
      <div className="card-block">
        <div className="name">
          <GoOrganization className="mr6 color-9" />
          <Link to={`/organization/repository?organization=${organization.id}`}>
            {organization.name}
          </Link>
        </div>
        <div className="desc">{organization.description}</div>
        <div className="members">
          <img
            alt={organization.owner!.fullname}
            src={avatar(organization.owner)}
            className="avatar owner"
          />
          <span>{organization.owner!.fullname}</span>
        </div>
        <div className="toolbar">
          {owned || joined ? ( // 拥有或已加入
            <span
              className="fake-link"
              onClick={() => setUpdate(true)}
            >
              <GoPencil />
            </span>
          ) : null}
          <OrganizationForm
            organization={organization}
            open={update}
            onClose={() => setUpdate(false)}
          />
          {owned ? ( // 拥有
            <span
              className="fake-link"
              onClick={e => {
                e.preventDefault()
                handleDelete(organization)
              }}
            >
              <GoTrashcan/>
            </span>
          ) : null}
          {!owned && joined ? ( // 不拥有，已加入
            <span
              className="fake-link"
              onClick={e => {
                e.preventDefault()
                handleExit(organization)
              }}
            >
              <GoSignOut />
            </span>
          ) : null}
          {!owned && !joined && selfHelpJoin ? ( // 不拥有，未加入
            <span
              className="fake-link"
              onClick={e => {
                e.preventDefault()
                handleJoin(organization)
              }}
            >
              <GoSignIn />
            </span>
          ) : null}
        </div>
      </div>
    </Card>
  )
}

export default OrganizationBlock
