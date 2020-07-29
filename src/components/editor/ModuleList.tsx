import React, { useState } from 'react'
import { connect, Link, replace, StoreStateRouterLocationURI } from '../../family'
import { RSortable } from '../utils'
import ModuleForm from './ModuleForm'
import { useSelector, useDispatch } from 'react-redux'
import { GoPackage } from 'react-icons/go'
import { deleteModule, sortModuleList } from '../../actions/module'
import { Module, Repository, RootState, User } from '../../actions/types'
import { makeStyles, Theme } from '@material-ui/core'

interface ModuleBaseProps {
  repository: Repository
  mod: Module
  active?: boolean
  auth?: User
  deleteModule: typeof deleteModule
  replace?: typeof replace
}
function ModuleBase(props: ModuleBaseProps) {
  const { mod } = props
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

const useStyles = makeStyles(({ palette }: Theme) => ({
  li: {
    borderColor: `${palette.primary.main} #e1e4e8 transparent #e1e4e8 !important`,
  },
}))

function ModuleList(props: ModuleListProps) {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const auth = useSelector((state: RootState) => state.auth)
  const { repository, mods = [], mod } = props
  const classes = useStyles()
  const handleSort = (_: any, sortable: any) => {
    dispatch(sortModuleList(sortable.toArray(), () => {
      /** empty */
    }))
  }
  return (
    <RSortable onChange={handleSort} disabled={!repository.canUserEdit}>
      <ul className="ModuleList clearfix">
        {mods.map((item: any) => (
          <li
            key={item.id}
            className={`${item.id === mod!.id ? 'active ' + classes.li : ''} sortable `}
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
        {repository.canUserEdit ? (
          <li>
            <span onClick={() => setOpen(true)} className="g-link">
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
