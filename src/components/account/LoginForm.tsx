import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import config from '../../config'
import { Button, createStyles, makeStyles, List, ListItem, InputLabel, Input, FormControl, InputAdornment, IconButton, Paper } from '@material-ui/core'
import Logo from 'components/layout/Logo'
import { green } from '@material-ui/core/colors'
import { getBGImageUrl } from 'utils/ImageUtils'
import PhoneIcon from '@material-ui/icons/PhoneIphone'
import CodeIcon from '@material-ui/icons/Code'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import Refresh from '@material-ui/icons/Refresh'
import { login } from 'actions/account'
import URI from 'urijs'
import { showMessage, MSG_TYPE } from 'actions/common'
import { push } from 'connected-react-router'
import { getRouter } from 'selectors/router'
import { Link } from '../../family'

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
  ctlend: {
    display: 'flex',
    justifyContent: 'flex-end',
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

export default function LoginForm() {
  const [bg] = useState(getBGImageUrl())
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [captchaId, setCaptchaId] = useState(Date.now())
  const [captcha, setCaptcha] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const classes = useStyles()
  const dispatch = useDispatch()
  const router = useSelector(getRouter)
  const { pathname, hash, search } = router.location
  const handleSubmit = (e?: any) => {
    e && e.preventDefault()
    if (!email || !password || !captcha) {
      dispatch(showMessage(`请输入账号、密码、验证码`, MSG_TYPE.WARNING))
    } else {
      dispatch(
        login({ email, password, captcha }, () => {
          const uri = URI(pathname + hash + search)
          const original = uri.search(true).original as string
          if (original) {
            dispatch(push(decodeURIComponent(original)))
          } else {
            dispatch(push('/'))
          }
        })
      )
    }
  }

  return (
    <div className={classes.root} style={{ background: bg }}>
      <Paper className={classes.container}>
        <List>
          <ListItem>
            <Logo color="#3f51b5" />
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
                      <PhoneIcon />
                    </IconButton>
                  </InputAdornment>}
              />
            </FormControl>
          </ListItem>
          <ListItem>
            <FormControl fullWidth={true}>
              <InputLabel htmlFor="password">密码</InputLabel>
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
              <Button variant="outlined" color="default" style={{ marginRight: 8 }} onClick={() => dispatch(push('/account/register'))}>注册</Button>
              <Button variant="contained" color="primary" tabIndex={3} onClick={handleSubmit}>登录</Button>
            </div>
          </ListItem>
          <ListItem className={classes.ctlend}>
            <Link to="#" onClick={() => dispatch(push('/account/findpwd'))} className="operation ">忘记密码？</Link>
          </ListItem>
        </List>
      </Paper>
    </div>
  )
}
