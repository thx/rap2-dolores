import React, { useState, MouseEventHandler } from 'react'
import { connect, Link, replace, moment } from '../../family'
import { serve } from '../../relatives/services/constant'
import RepositoryForm from './RepositoryForm'
import {
  GoRepo,
  GoPencil,
  GoPlug,
  GoTrashcan,
  GoPerson,
  GoOrganization
} from 'react-icons/go'
import { RouterState } from 'connected-react-router'
import { RootState } from 'actions/types'
import { Card } from '@material-ui/core'
import { deleteRepository } from 'actions/repository'
// DONE 2.1 iconfont => octicons

interface Props {
  auth: any
  repository: any
  editor: any
  router: RouterState
  deleteRepository: typeof deleteRepository
  replace: typeof replace
}

function Repository(props: Props) {
  const { auth, repository, editor, router } = props
  const [open, setOpen] = useState(false)

  const handleDeleteRepository: MouseEventHandler<HTMLAnchorElement> = e => {
    e.preventDefault()
    const { repository, router, replace } = props
    const message = `仓库被删除后不可恢复，并且会删除相关的模块和接口！\n确认继续删除『#${
      repository.id
    } ${repository.name}』吗？`
    if (window.confirm(message)) {
      const { deleteRepository } = props
      deleteRepository(repository.id)
      const { pathname, hash, search } = router.location
      replace(pathname + hash + search)
    }
  }
  const { location } = router
  return (
    <Card className="Repository card">
      <div className="card-block">
        <div className="name">
          <GoRepo className="mr6 color-9" />
          <Link to={`${editor}?id=${repository.id}`}>{repository.name}</Link>
        </div>
        <div className="desc">{repository.description}</div>
        <div className="toolbar">
          <a
            href={`${serve}/app/plugin/${repository.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GoPlug />
          </a>
          {/* 编辑权限：拥有者或者成员 */}
          {repository.canUserEdit ? (
            <span className="fake-link" onClick={() => setOpen(true)}>
              <GoPencil />
            </span>
          ) : null}
          <RepositoryForm
            title="编辑仓库"
            open={open}
            onClose={() => setOpen(false)}
            repository={repository}
          />

          {/* 删除权限：个人仓库 */}
          {repository.owner.id === auth.id ? (
            <Link
              to={location.pathname + location.search}
              onClick={handleDeleteRepository}
            >
              <GoTrashcan />
            </Link>
          ) : null}
        </div>
      </div>
      <div className="card-block card-footer">
        {repository.organization ? (
          <span className="ownername">
            <GoOrganization /> {repository.organization.name}
          </span>
        ) : (
          <span className="ownername">
            <GoPerson /> {repository.owner.fullname}
          </span>
        )}
        <span className="fromnow">
          {moment(repository.updatedAt).fromNow()}更新
        </span>
      </div>
    </Card>
  )
}

// 容器组件
const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
  router: state.router,
})
const mapDispatchToProps = {
  deleteRepository,
  replace,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Repository)
