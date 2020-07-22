import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core'
import { doUpdateAccount } from 'actions/account'


function EditMyAccountDialog({ handleClose }: { handleClose: (isOk: boolean) => void }) {
  const [pwd, setPwd] = useState('')
  const [name, setName] = useState('')
  const dispatch = useDispatch()

  const onSubmit = () => {
    dispatch(doUpdateAccount({ fullname: name, password: pwd }, isOk => {
      if (isOk) {
        handleClose(true)
      }
    }))
  }
  return (
    <Dialog open={true} onClose={() => handleClose(false)} style={{ width: 600 }}>
      <DialogTitle>修改资料</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus={true}
          margin="dense"
          label="修改密码"
          type="password"
          fullWidth={true}
          placeholder="不修改留空即可"
          onChange={e => setPwd(e.target.value)}
          value={pwd}
        />
        <TextField
          autoFocus={true}
          margin="dense"
          label="修改昵称"
          fullWidth={true}
          placeholder="不修改留空即可"
          onChange={e => setName(e.target.value)}
          value={name}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(false)} color="secondary">
          取消
        </Button>
        <Button
          color="primary"
          onClick={onSubmit}
        >
          确认
      </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditMyAccountDialog
