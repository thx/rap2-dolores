import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import { Link } from 'react-router-dom'
import { User } from 'actions/types'
import Logo from './Logo'
import { useDispatch } from 'react-redux'
import { logout } from 'actions/account'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      width: '100%',
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    link: {
      color: '#FFFFFF',
      '&:hover': {
        color: '#FFFFFF',
      },
    },
    right: {
      float: 'right',
    },
    toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    logo: {
      marginRight: theme.spacing(2),
      display: 'inline',
    },
  })
)

interface Props {
  user: User
}

export default function MainMenu(props: Props) {
  const { user } = props
  const classes = useStyles()
  const dispatch = useDispatch()

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <div>
            <div className={classes.logo}> <Logo /> </div>
            <Link to="/" className={classes.link}><Button color="inherit"> 首页</Button></Link>
            <Link to="/repository/joined" className={classes.link}><Button color="inherit"> 仓库 </Button></Link>
            <Link to="/organization/joined" className={classes.link}><Button color="inherit"> 团队 </Button></Link>
            <Link to="/api" className={classes.link}><Button color="inherit"> 接口 </Button></Link>
            <Link to="/status" className={classes.link}><Button color="inherit"> 状态 </Button></Link>
          </div>
          <div>
            {user.id && <Button color="inherit" onClick={() => dispatch(logout())}>注销</Button>}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  )
}
