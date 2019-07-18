import React, { useState, useContext, useEffect } from 'react'
import { moveInterface } from '../../actions/interface'
import { Button, Select, MenuItem, FormControl, RadioGroup, FormControlLabel, Radio, Theme, makeStyles } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { ModalContext } from 'components/utils/RModal'

export const OP_MOVE = 1
export const OP_COPY = 2

const useStyles = makeStyles(({ spacing }: Theme) => ({
  root: {
  },
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
    minHeight: 300,
  },
  formTitle: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: 9,
  },
  formItem: {
    marginBottom: spacing(1),
  },
  ctl: {
    marginTop: spacing(3),
  },
}))

interface Props {
  title: string
  repository: any
  itfId: number
}

// constructor(props: any) {
//   super(props)
//   const { repository } = props

//   this.state = { modId, op: OP_MOVE }
// }
export default function MoveInterfaceForm(props: Props) {
  const { repository, title, itfId } = props
  const classes = useStyles()
  let modIdInit = 0
  if (repository.modules.length > 0) {
    modIdInit = repository.modules[0].id
  }
  const [modId, setModId] = useState(modIdInit)
  const [op, setOp] = useState(OP_MOVE)

  const dispatch = useDispatch()
  const rmodal = useContext(ModalContext)

  useEffect(() => {
    rmodal && rmodal.reposition()
  }, [rmodal])

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const params = {
      modId,
      op,
      itfId,
    }
    dispatch(moveInterface(params, () => {
      rmodal && rmodal.resolve()
    }))
  }
  return (
    <section>
      <div className="rmodal-header">
        <span className="rmodal-title">{title}</span>
      </div>
      <form className="form-horizontal w600" onSubmit={handleSubmit} >
        <div className="rmodal-body">
          <div className={classes.formTitle}>选择目标模块：</div>
          <FormControl>
            <Select onChange={e => setModId(+(e.target.value as any as string))} value={modId} fullWidth={true}>
              {repository.modules.map((x: any) => <MenuItem key={x.id} value={x.id} >{x.name}</MenuItem>)}
            </Select>
          </FormControl>
          <div className={classes.formTitle}>选择目标模块：</div>
          <RadioGroup
            name="radioListOp"
            value={String(op)}
            onChange={e => {setOp(+(e.target as any).value) }}
            row={true}
          >
            <FormControlLabel value={String(OP_COPY)} control={<Radio />} label="复制" />
            <FormControlLabel value={String(OP_MOVE)} control={<Radio />} label="移动" />
          </RadioGroup>
          <div className="rmodal-footer">
            <div className="form-group row mb0">
              <label className="col-sm-2 control-label" />
              <div className="col-sm-10">
                <Button type="submit" variant="contained" color="primary" style={{ marginRight: 8 }}>提交</Button>
                <Button onClick={() => rmodal && rmodal.close()}>取消</Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section >
  )
}
