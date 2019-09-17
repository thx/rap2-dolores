import React, { useState } from 'react'
import { moveInterface } from '../../actions/interface'
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core'
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Theme,
  makeStyles
} from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { Module } from 'actions/types'

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
}))

interface Props {
  title: string
  repository: any
  itfId: number
  open: boolean
  mod: Module
  onClose: () => void
}

// constructor(props: any) {
//   super(props)
//   const { repository } = props

//   this.state = { modId, op: OP_MOVE }
// }
export default function MoveInterfaceForm(props: Props) {
  const { repository, title, itfId, onClose, open, mod } = props
  const classes = useStyles()

  const [modId, setModId] = useState(mod.id)
  const [op, setOp] = useState(OP_MOVE)

  const dispatch = useDispatch()

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const params = {
      modId,
      op,
      itfId,
      repoId: repository.id,
    }
    dispatch(
      moveInterface(params, () => {
        onClose()
      })
    )
  }
  return (
    <Dialog
      open={open}
      onClose={(_event, reason) => reason !== 'backdropClick' && onClose()}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers={true}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <div className="rmodal-body">
            <div className={classes.formItem}>
              <div className={classes.formTitle}>选择目标模块：</div>
              <FormControl>
                <Select
                  onChange={e => setModId(+((e.target.value as any) as string))}
                  value={modId}
                  fullWidth={true}
                >
                  {repository.modules.map((x: any) => (
                    <MenuItem key={x.id} value={x.id}>
                      {x.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className={classes.formItem}>
              <div className={classes.formTitle}>选择目标模块：</div>
              <RadioGroup
                name="radioListOp"
                value={String(op)}
                onChange={e => {
                  setOp(+(e.target as any).value)
                }}
                row={true}
              >
                <FormControlLabel
                  value={String(OP_COPY)}
                  control={<Radio />}
                  label="复制"
                />
                <FormControlLabel
                  value={String(OP_MOVE)}
                  control={<Radio />}
                  label="移动"
                />
              </RadioGroup>
            </div>
            <div className={classes.ctl}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginRight: 8 }}
              >
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
