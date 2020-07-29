import amber from '@material-ui/core/colors/amber'
import green from '@material-ui/core/colors/green'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import { withStyles, WithStyles, Theme, createStyles } from '@material-ui/core/styles'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import CloseIcon from '@material-ui/icons/Close'
import ErrorIcon from '@material-ui/icons/Error'
import InfoIcon from '@material-ui/icons/Info'
import WarningIcon from '@material-ui/icons/Warning'
import classNames from 'classnames'
import React from 'react'
import { blue } from '@material-ui/core/colors'

export enum MSG_TYPE {
  SUCCESS,
  WARNING,
  ERROR,
  INFO,
}

function getIcon(type: MSG_TYPE) {
  switch (type) {
    case MSG_TYPE.SUCCESS:
      return CheckCircleIcon
    case MSG_TYPE.WARNING:
      return WarningIcon
    case MSG_TYPE.ERROR:
      return ErrorIcon
    case MSG_TYPE.INFO:
      return InfoIcon
  }
}

const styles = (theme: Theme) => createStyles({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    color: '#ffffff',
    backgroundColor: blue[600],
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  margin: {
    margin: theme.spacing(1),
  },
  close: {
  },
})

interface Props extends WithStyles<typeof styles> {
  messageInfo: IMessage
}

interface States {
  open: boolean
  messageInfo: IMessage
}

const Message = withStyles(styles)(
  class extends React.Component<Props, States> {
    queue: IMessage[] = []

    constructor(props: Props) {
      super(props)
      this.state = {
        open: false,
        messageInfo: {
          timestamp: 0,
          type: MSG_TYPE.INFO,
          message: '',
        },
      }
    }

    componentDidUpdate(prevProps: Props) {
      if (prevProps.messageInfo.timestamp !== this.props.messageInfo.timestamp) {
        this.queue.push(this.props.messageInfo)

        if (this.state.open) {
          // immediately begin dismissing current message
          // to start showing new one
          this.setState({ open: false })
        } else {
          this.processQueue()
        }
      }
    }

    processQueue = () => {
      if (this.queue.length > 0) {
        this.setState({
          messageInfo: this.queue.shift() || { message: '', timestamp: 0, type: MSG_TYPE.INFO },
          open: true,
        })
      }
    }

    handleClose = (_event: any, reason: string) => {
      if (reason === 'clickaway') {
        return
      }
      this.setState({ open: false })
    };

    handleExited = () => {
      this.processQueue()
    }

    getClassName(type: MSG_TYPE) {
      const { classes } = this.props
      switch (type) {
        case MSG_TYPE.ERROR:
          return classes.error
        case MSG_TYPE.INFO:
          return classes.info
        case MSG_TYPE.SUCCESS:
          return classes.success
        case MSG_TYPE.WARNING:
          return classes.warning
      }
    }

    render() {
      const { classes } = this.props
      const { messageInfo } = this.state
      const { timestamp, message, type } = messageInfo
      const Icon = getIcon(type)
      const className = this.getClassName(type)
      return (
        <div>
          <Snackbar
            key={timestamp}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={this.state.open}
            autoHideDuration={2000}
            onExited={this.handleExited}
            onClose={this.handleClose}
          >
            <SnackbarContent
              className={className}
              aria-describedby="client-snackbar"
              message={
                <span id="client-snackbar" className={classes.message}>
                  <Icon className={classNames(classes.icon, classes.iconVariant)} />
                  {message}
                </span>}
              action={[
                <IconButton
                  key="close"
                  aria-label="Close"
                  color="inherit"
                  className={classes.close}
                  onClick={this.handleClose as any}
                >
                  <CloseIcon className={classes.icon} />
                </IconButton>,
              ] as any}
            />
          </Snackbar>
        </div>
      )
    }
  }
)

export default Message
