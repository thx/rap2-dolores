import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Link } from 'react-router-dom'
import { User } from 'actions/types'
import Logo from './Logo'
import { push } from '../../family'
import { useDispatch } from 'react-redux'
import { logout } from 'actions/account'

const options = [{
  key: 'myAccount',
  text: '我的账户',
}, {
  key: 'preferences',
  text: '偏好设置',
}, {
  key: 'logout',
  text: '注销',
}]

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
      '& :not(.logo)': {
        fontSize: '1.2rem',
      },
    },
    links: {
      display: 'flex',
      alignItems: 'center',
    },
    logo: {
      display: 'block',
      marginRight: theme.spacing(2),
      padding: `${theme.spacing(1.5)}px  0 ${theme.spacing(1.5)}px 0`,
    },
    accountName: {
      color: '#FFFFFF',
    },
  }),
)

function AccountButton({ user }: { user: User }) {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLButtonElement>(null)
  const classes = useStyles()
  const dispatch = useDispatch()


  const handleMenuItemClick = (_event: React.MouseEvent<HTMLLIElement, MouseEvent>, key: string) => {
    if (key === 'logout') {
      dispatch(logout())
    } else if (key === 'preferences') {
      dispatch(push('/preferences'))
    } else if (key === 'myAccount') {
      dispatch(push('/account/myAccount'))
    }
    setOpen(false)
  }

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {

    if (anchorRef && anchorRef.current && event.target instanceof Node && anchorRef.current.contains(event.target)) {
      return
    }

    setOpen(false)
  }

  return (
    <div>
      <Button
        color="inherit"
        aria-haspopup="true"
        aria-label="账户"
        onClick={handleToggle}
        ref={anchorRef}
      >
        <span className={`mr1 ${classes.accountName} guide-3`}>
          {user.fullname}
          <ExpandMoreIcon fontSize="small" style={{ color: '#FFFFFF' }} />
        </span>
      </Button>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition={true}>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu">
                  {options.map(({ key, text }) => (
                    <MenuItem
                      key={key}
                      onClick={event => handleMenuItemClick(event, key)}
                    >
                      {text}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  )
}


interface Props {
  user: User
}

export default function MainMenu(props: Props) {
  const { user } = props
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar} variant="dense">
          <div className={classes.links}>
            <Link to="/" className={classes.logo}><Logo /> </Link>
            <Link to="/" className={classes.link}><Button color="inherit"> 首页 </Button></Link>
            <Link to="/repository/joined" className={classes.link}><Button color="inherit"> 仓库 </Button></Link>
            <Link to="/organization/joined" className={classes.link}><Button color="inherit"> 团队 </Button></Link>
            <Link to="/api" className={classes.link}><Button color="inherit"> 接口 </Button></Link>
            <Link to="/status" className={classes.link}><Button color="inherit"> 状态 </Button></Link>
            <Link to="/about" className={classes.link}><Button color="inherit"> 关于 </Button></Link>
          </div>
          <AccountButton user={user} />
        </Toolbar>
      </AppBar>
    </div>
  )
}
