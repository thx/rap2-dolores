import React, { useState, MouseEventHandler } from 'react'
import {
  connect,
  Link,
  StoreStateRouterLocationURI,
  replace
} from '../../family'
import { sortInterfaceList, deleteInterface } from '../../actions/interface'
import { RSortable } from '../utils'
import InterfaceForm from './InterfaceForm'
import { GoPencil, GoTrashcan, GoLock } from 'react-icons/go'
import { getCurrentInterface } from '../../selectors/interface'
import Button from '@material-ui/core/Button'
import { useSelector, useDispatch } from 'react-redux'
import './InterfaceList.css'
import {
  Module,
  Repository,
  RootState,
  Interface,
  User
} from '../../actions/types'
import { refresh } from '../../actions/common'

interface InterfaceBaseProps {
  repository: Repository
  mod: Module
  active?: boolean
  auth?: User
  itf?: Interface
  curItf?: Interface
  deleteInterface: typeof deleteInterface
  replace?: typeof replace
}

function InterfaceBase(props: InterfaceBaseProps) {
  const { repository, mod, itf, curItf } = props
  const auth = useSelector((state: RootState) => state.auth)
  const router = useSelector((state: RootState) => state.router)
  const selectHref = StoreStateRouterLocationURI(router)
    .setSearch('itf', itf!.id.toString())
    .href()
  const isOwned = repository.owner!.id === auth.id
  const isJoined = repository.members!.find((i: any) => i.id === auth.id)
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()

  const handleDeleteInterface: MouseEventHandler<HTMLAnchorElement> = e => {
    e.preventDefault()
    const message = `接口被删除后不可恢复！\n确认继续删除『#${itf!.id} ${
      itf!.name
    }』吗？`
    if (window.confirm(message)) {
      const { deleteInterface } = props
      deleteInterface(props.itf!.id, () => {
        dispatch(refresh())
      })
      const { pathname, hash, search } = router.location
      replace(pathname + hash + search)
    }
  }

  return (
    <div className="Interface clearfix">
      <span>
        <Link
          to={selectHref}
          onClick={e => {
            if (
              curItf &&
              curItf.locker &&
              !window.confirm(
                '编辑模式下切换接口，会导致编辑中的资料丢失，是否确定切换接口？'
              )
            ) {
              e.preventDefault()
            }
          }}
        >
          <div className="name">{itf!.name}</div>
          <div className="url">{itf!.url}</div>
        </Link>
      </span>
      {isOwned || isJoined ? (
        <div className="toolbar">
          {itf!.locker ? (
            <span className="locked mr5">
              <GoLock />
            </span>
          ) : null}
          {!itf!.locker || itf!.locker.id === auth.id ? (
            <span className="fake-link" onClick={() => setOpen(true)}>
              <GoPencil />
            </span>
          ) : null}
          <InterfaceForm
            title="修改接口"
            repository={repository}
            mod={mod}
            itf={itf}
            open={open}
            onClose={() => setOpen(false)}
          />
          {!itf!.locker ? (
            <Link to="" onClick={handleDeleteInterface}>
              <GoTrashcan />
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
const mapStateToProps = (state: RootState) => ({
  curItf: getCurrentInterface(state),
  router: state.router,
})
const mapDispatchToProps = {
  replace,
  onSortInterfaceList: sortInterfaceList,
  deleteInterface,
}
const InterfaceWrap = connect(
  mapStateToProps,
  mapDispatchToProps
)(InterfaceBase)

interface InterfaceListProps {
  itfs?: Interface[]
  itf?: Interface
  curItf: Interface
  mod: Module
  repository: Repository
}
function InterfaceList(props: InterfaceListProps, context: any) {
  const [open, setOpen] = useState(false)
  const auth = useSelector((state: RootState) => state.auth)
  const { repository, itf, itfs = [], mod } = props
  const isOwned = repository.owner!.id === auth.id
  const isJoined = repository.members!.find((item: any) => item.id === auth.id)
  const handleSort = (_: any, sortable: any) => {
    const { onSortInterfaceList } = context
    onSortInterfaceList(sortable.toArray())
  }
  return (
    <article className="InterfaceList">
      {isOwned || isJoined ? (
        <div className="header">
          <Button
            variant="outlined"
            fullWidth={true}
            color="primary"
            onClick={() => setOpen(true)}
          >
            新建接口
          </Button>
          <InterfaceForm
            title="新建接口"
            repository={repository}
            mod={mod}
            open={open}
            onClose={() => setOpen(false)}
          />
        </div>
      ) : null}
      {itfs.length ? (
        <RSortable onChange={handleSort} disabled={!isOwned && !isJoined}>
          <ul className="body">
            {itfs.map((item: any) => (
              <li
                key={item.id}
                className={item.id === itf!.id ? 'active sortable' : 'sortable'}
                data-id={item.id}
              >
                <InterfaceWrap
                  repository={repository}
                  mod={mod}
                  itf={item}
                  active={item.id === itf!.id}
                  auth={auth}
                  // curItf={curItf}
                />
              </li>
            ))}
          </ul>
        </RSortable>
      ) : (
        <div className="alert alert-info">暂无接口，请新建</div>
      )}
    </article>
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InterfaceList)
