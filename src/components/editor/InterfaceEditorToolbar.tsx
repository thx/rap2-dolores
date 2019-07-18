import React from 'react'
import { Button, makeStyles, Theme, createStyles } from '@material-ui/core'
import LoadingButton from '../common/LoadingButton'
import Create from '@material-ui/icons/Create'
import KeyboardTab from '@material-ui/icons/KeyboardTab'
import Save from '@material-ui/icons/Save'
import Cancel from '@material-ui/icons/Cancel'
import { useSelector } from 'react-redux'
import { RootState } from 'actions/types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
    leftIcon: {
      marginRight: theme.spacing(1),
    },
    rightIcon: {
      marginLeft: theme.spacing(1),
    },
    iconSmall: {
      fontSize: 20,
    },
  })
)

interface Props {
  auth: any,
  repository: any,
  locker?: any,
  editable: boolean,
  itfId: number,
  moveInterface: any
  handleSaveInterface: any
  handleUnlockInterface: any
  handleMoveInterface: any
  handleLockInterface: any
}

function InterfaceEditorToolbar(props: Props) {
  const { editable, locker, auth, repository, handleLockInterface, handleMoveInterface,
    handleSaveInterface, handleUnlockInterface } = props
  const isOwned = repository.owner.id === auth.id
  const isJoined = repository.members.find((item: any) => item.id === auth.id)
  const loading = useSelector((state: RootState) => state.loading)

  const classes = useStyles()
  if (!isOwned && !isJoined) { return null }
  if (editable) {
    return (
      <div className="InterfaceEditorToolbar">
        <LoadingButton className={classes.button} onClick={handleSaveInterface} variant="contained" color="primary" disabled={loading} label="保存">
          <Save className={classes.rightIcon} />
        </LoadingButton>
        <Button className={classes.button} onClick={handleUnlockInterface} variant="contained">
          取消
          <Cancel className={classes.rightIcon} />
        </Button>
        <span className="locker-warning hide">已经锁定当前接口！</span>
      </div>
    )
  }
  if (locker) {
    return (
      <div className="InterfaceEditorToolbar">
        <div className="alert alert-danger">当前接口已经被 <span className="nowrap">{locker.fullname}</span> 锁定！</div>
      </div>
    )
  }
  return (
    <div className="InterfaceEditorToolbar">
      <Button className={classes.button} onClick={handleMoveInterface} variant="contained">
        移动 / 复制
        <KeyboardTab className={classes.rightIcon} />
      </Button>
      <LoadingButton className={classes.button} onClick={handleLockInterface} variant="contained" color="primary" disabled={loading} label="编辑">
        <Create className={classes.rightIcon} />
      </LoadingButton>
    </div>
  )
}

export default InterfaceEditorToolbar
