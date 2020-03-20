import React, { useState, MouseEventHandler } from 'react'
import { connect, Link, replace, StoreStateRouterLocationURI } from '../../family'
import {  RSortable } from '../utils'
import ModuleForm from './ModuleForm'
import { useSelector, useDispatch } from 'react-redux'
import { GoPackage } from 'react-icons/go'
import { deleteModule, sortModuleList } from '../../actions/module'
import { Module, Repository, RootState, User } from '../../actions/types'

interface ModuleBaseProps {
  repository: Repository
  mod: Module
  active?: boolean
  auth?: User
  deleteModule: typeof deleteModule
  replace?: typeof replace
}
function ModuleBase(props: ModuleBaseProps) {
  const { mod} = props
  const router = useSelector((state: RootState) => state.router)
  const uri = StoreStateRouterLocationURI(router).removeSearch('itf')
  const selectHref = uri.setSearch('mod', mod!.id.toString()).href()

  return (
    <div className="Module clearfix">
      <Link to={selectHref} className="name">
        {mod.name}
      </Link>
    </div>
  )
}

const mapStateToModuleBaseProps = (state: any) => ({
  router: state.router,
})
const mapDispatchToModuleBaseProps = ({
  deleteModule,
  replace,
})

const ModuleWrap = connect(mapStateToModuleBaseProps, mapDispatchToModuleBaseProps)(ModuleBase)

interface ModuleListProps {
  mods?: Module[]
  mod?: Module
  repository: Repository
}
function ModuleList(props: ModuleListProps) {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const auth = useSelector((state: RootState) => state.auth)
  const { repository, mods = [], mod } = props
  const isOwned = repository.owner!.id === auth.id
  const isJoined = repository.members!.find((item: any) => item.id === auth.id)
  const handleSort = (_: any, sortable: any) => {
    dispatch(sortModuleList(sortable.toArray(), () => {
      /** empty */
    }))
  }
  return (
    <RSortable onChange={handleSort} disabled={!isOwned && !isJoined}>
      <ul className="ModuleList clearfix">
        {mods.map((item: any) => (
          <li
            key={item.id}
            className={item.id === mod!.id ? 'active sortable' : 'sortable'}
            data-id={item.id}
          >
            <ModuleWrap
              key={item.id}
              mod={item}
              active={item.id === mod!.id}
              repository={repository}
              auth={auth}
            />
          </li>
        ))}
        {/* 编辑权限：拥有者或者成员 */}
        {isOwned || isJoined ? (
          <li>
            <span className="fake-link" onClick={() => setOpen(true)}>
              <GoPackage className="fontsize-14" /> 新建模块
            </span>
            <ModuleForm
              title="新建模块"
              repository={repository}
              open={open}
              onClose={() => setOpen(false)}
            />
          </li>
        ) : null}
      </ul>
    </RSortable>
  )
}
const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
  router: state.router,
})
const mapDispatchToProps = ({
  replace,
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModuleList)
