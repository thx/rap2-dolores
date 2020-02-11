import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import config from '../../config'
import { Button, createStyles, makeStyles, List, ListItem, InputLabel, Input, FormControl, InputAdornment, IconButton, Paper } from '@material-ui/core'
import { green } from '@material-ui/core/colors'
import Visibility from '@material-ui/icons/Visibility'
import Refresh from '@material-ui/icons/Refresh'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import { resetpwd } from 'actions/account'
import { showMessage, MSG_TYPE } from 'actions/common'
import CodeIcon from '@material-ui/icons/Code'
import { getRouter } from 'selectors/router'
import { push } from 'connected-react-router'
import URI from 'urijs'

const { serve } = config

const useStyles = makeStyles(() => createStyles({
  root: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    overflow: 'hidden',
    backgroundSize: 'cover',
  },
  container: {
    width: 350,
    margin: 'auto',
    marginTop: 150,
    opacity: 0.85,
  },
  ctl: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  captchaWrapper: {
    cursor: 'pointer',
  },
  captcha: {
    width: 108,
    height: 36,
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  buttonWrapper: {
    position: 'relative',
  },
}))

export default function ResetpwdForm() {
  const [captchaId, setCaptchaId] = useState(Date.now())
  const [captcha, setCaptcha] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const classes = useStyles()
  const dispatch = useDispatch()
  const router = useSelector(getRouter)
  const { pathname, hash, search } = router.location
  const uri = URI(pathname + hash + search)
  const email = uri.search(true).email
  const code = uri.search(true).code
  const token = uri.search(true).token

  const handleSubmit = (e?: any) => {
    e && e.preventDefault()
    if (!password) {
      dispatch(showMessage(`请输入密码`, MSG_TYPE.WARNING))
    } else if (password.length < 6) {
      dispatch(showMessage(`密码长度过短，请输入六位以上密码`, MSG_TYPE.WARNING))
    } else {
      dispatch(
        resetpwd({ email, code, token, password, captcha }, () => {
          dispatch(showMessage(`密码重置成功，请重新登录`, MSG_TYPE.SUCCESS))
          dispatch(push('/'))
        })
      )
    }
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.container}>
        <List>
        <ListItem>
            <h2>为您的账号重置密码</h2>
          </ListItem>
          <ListItem>
          {email}
          </ListItem>
          <ListItem>
            <FormControl fullWidth={true}>
              <InputLabel htmlFor="password">重置密码</InputLabel>
              <Input
                tabIndex={1}
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                autoComplete="current-password"
                onChange={e => setPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end" tabIndex={101}>
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>}
              />
            </FormControl>
          </ListItem>
          <ListItem>
            <FormControl fullWidth={true}>
              <InputLabel htmlFor="captcha">验证码</InputLabel>
              <Input
                tabIndex={2}
                name="captcha"
                value={captcha}
                autoComplete="off"
                onKeyDown={e => e.keyCode === 13 && handleSubmit()}
                onChange={e => setCaptcha(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton>
                      <CodeIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </ListItem>
          <ListItem className={classes.ctl}>
            <div className={classes.captchaWrapper} onClick={() => setCaptchaId(Date.now())}>
              <img src={`${serve}/captcha?t=${captchaId}`} className={classes.captcha} alt="captcha" />
              <Refresh />
            </div>
            <div className={classes.buttonWrapper}>
              <Button variant="outlined" color="default" style={{ marginRight: 8 }} onClick={() => dispatch(push('/account/login'))}>取消</Button>
              <Button variant="contained" color="primary" tabIndex={3} onClick={handleSubmit}>重置密码</Button>
            </div>
          </ListItem>
        </List>
      </Paper>
    </div>
  )
}
