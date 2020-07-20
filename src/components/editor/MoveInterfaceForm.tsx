import React, { useState, useEffect } from 'react'
import { moveInterface } from '../../actions/interface'
import { fetchOwnedRepositoryList, fetchJoinedRepositoryList } from '../../actions/repository'
import EditorService from 'relatives/services/Editor'

import { Dialog, DialogTitle, DialogContent } from '@material-ui/core'
import _ from 'lodash'
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Theme,
  makeStyles,
} from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import { Module, RootState } from 'actions/types'

export const OP_MOVE = 1
export const OP_COPY = 2

const useStyles = makeStyles(({ spacing }: Theme) => ({
  root: {},
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: spacing(2),
    flex: 1,
  },
  preview: {
    marginTop: spacing(1),
  },
  form: {
    minWidth: 500,
  },
  formTitle: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: 9,
  },
  formItem: {
    marginBottom: spacing(1),
  },
  ctl: {
    marginTop: spacing(2),
  },
  select: {
    width: spacing(20),
  },
}))

interface Props {
  title: string
  repository: any
  itfId: number
  open: boolean
  mod: Module
  onClose: () => void
}

export default function MoveInterfaceForm(props: Props) {
  const { repository, title, itfId, onClose, open, mod } = props
  const classes = useStyles()
  const [repositoryId, setRepositoryId] = useState(repository.id)
  const [modId, setModId] = useState(mod.id)
  const [op, setOp] = useState(OP_MOVE)
  const [modules, setModules] = useState(repository.modules)

  const dispatch = useDispatch()

  const repositories = useSelector((state: RootState) => {
    return _.uniqBy([...state.ownedRepositories.data, ...state.joinedRepositories.data], 'id')
  })

  useEffect(() => {
    if (!repositories.length) {
      dispatch(fetchJoinedRepositoryList())
      dispatch(fetchOwnedRepositoryList())
    }
  }, [dispatch, repositories.length])

  function onRepositoryChange(
    e: React.ChangeEvent<{
      name?: string | undefined
      value: unknown
    }>,
  ) {
    const repositoryId = e.target.value
    setRepositoryId(repositoryId)
    EditorService.fetchModuleList({
      repositoryId,
    }).then(res => {
      setModules(res)
      setModId(res[0] && res[0].id)
    })
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const params = {
      modId,
      op,
      itfId,
      repositoryId,
    }
    dispatch(
      moveInterface(params, () => {
        onClose()
      }),
    )
  }
  return (
    <Dialog open={open} onClose={(_event, reason) => reason !== 'backdropClick' && onClose()}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers={true}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <div className="rmodal-body">
            <div className={classes.formItem}>
              <div className={classes.formTitle}>选择目标仓库：</div>
              <FormControl>
                <Select
                  className={classes.select}
                  onChange={onRepositoryChange}
                  value={repositoryId}
                  fullWidth={true}
                >
                  {repositories.map((x: any) => (
                    <MenuItem key={x.id} value={x.id}>
                      {x.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className={classes.formItem}>
              <div className={classes.formTitle}>选择目标模块：</div>
              <FormControl>
                <Select
                  className={classes.select}
                  onChange={e => setModId(+((e.target.value as any) as string))}
                  value={modId}
                  fullWidth={true}
                >
                  {modules.map((x: any) => (
                    <MenuItem key={x.id} value={x.id}>
                      {x.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className={classes.formItem}>
              <div className={classes.formTitle}>操作类型：</div>
              <RadioGroup
                name="radioListOp"
                value={String(op)}
                onChange={e => {
                  setOp(+(e.target as any).value)
                }}
                row={true}
              >
                <FormControlLabel value={String(OP_MOVE)} control={<Radio />} label="移动" />
                <FormControlLabel value={String(OP_COPY)} control={<Radio />} label="复制" />
              </RadioGroup>
            </div>
            <div className={classes.ctl}>
              <Button type="submit" variant="contained" color="primary" style={{ marginRight: 8 }}>
                提交
              </Button>
              <Button onClick={() => onClose()}>取消</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
