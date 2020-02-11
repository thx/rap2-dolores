import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import config from '../../config'
import { Button, createStyles, makeStyles, List, ListItem, InputLabel, Input, FormControl, InputAdornment, IconButton, Paper } from '@material-ui/core'
import { green } from '@material-ui/core/colors'
import EmailIcon from '@material-ui/icons/Email'
import CodeIcon from '@material-ui/icons/Code'
import Refresh from '@material-ui/icons/Refresh'
import { findpwd } from 'actions/account'
import { showMessage, MSG_TYPE } from 'actions/common'
import { push } from 'connected-react-router'

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

export default function FindpwdForm() {
  const [email, setEmail] = useState('')
  const [captchaId, setCaptchaId] = useState(Date.now())
  const [captcha, setCaptcha] = useState('')
  const classes = useStyles()
  const dispatch = useDispatch()
  const handleSubmit = (e?: any) => {
    e && e.preventDefault()
    if (!email || !captcha) {
      dispatch(showMessage(`请输入Email、验证码`, MSG_TYPE.WARNING))
    } else {
      dispatch(
        findpwd({ email, captcha }, () => {
          dispatch(showMessage(`发送成功，请登录您的邮箱按提示重置密码`, MSG_TYPE.SUCCESS))
        })
      )
    }
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.container}>
        <List>
          <ListItem>
            <h2>发送重设密码邮件</h2>
          </ListItem>
          <ListItem>
            <FormControl fullWidth={true}>
              <InputLabel htmlFor="email">邮箱</InputLabel>
              <Input
                tabIndex={0}
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                autoFocus={true}
                required={true}
                endAdornment={
                  <InputAdornment position="end" tabIndex={100}>
                    <IconButton>
                      <EmailIcon />
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
              <Button variant="contained" color="primary" tabIndex={3} onClick={handleSubmit}>发送</Button>
            </div>
          </ListItem>
        </List>
      </Paper>
    </div>
  )
}
