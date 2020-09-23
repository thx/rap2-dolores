import React, { useState, useEffect } from 'react'
import { moveModule } from '../../actions/module'
import { fetchOwnedRepositoryList, fetchJoinedRepositoryList } from '../../actions/repository'

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

import { SlideUp } from 'components/common/Transition'

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
  open: boolean
  mod: Module
  onClose: () => void
}

export default function MoveModuleForm(props: Props) {
  const { repository, title, onClose, open, mod } = props
  const modId = mod.id
  const classes = useStyles()
  const [repositoryId, setRepositoryId] = useState(repository.id)
  const [op, setOp] = useState(OP_MOVE)
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
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const params = {
      modId,
      op,
      repositoryId,
    }
    dispatch(
      moveModule(params, () => {
        onClose()
      }),
    )
  }
  return (
    <Dialog open={open} onClose={(_event, reason) => reason !== 'backdropClick' && onClose()} TransitionComponent={SlideUp}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers={true}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <div className="rmodal-body">
            <div style={{ color: '#CC0000', fontSize: 16, marginBottom: 8 }}>请注意这里是移动模块，整个模块哦，不是移动接口。别搞错啦！！！</div>
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
