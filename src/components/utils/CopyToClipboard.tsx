import copy from 'clipboard-copy'
import * as React from 'react'
import Tooltip from 'rc-tooltip'
import { withSnackbar, WithSnackbarProps } from 'notistack'

import 'rc-tooltip/assets/bootstrap.css'
import './CopyToClipboard.sass'

type Props = {
  children: React.ReactElement<any>
  text: string
} & WithSnackbarProps

interface OwnState {
  showTooltip: boolean
}

class CopyToClipboard extends React.Component<Props, OwnState> {
  public state: OwnState = { showTooltip: false }

  public render() {
    return (
      <Tooltip
        placement="right"
        overlay={
          <div
            style={{ cursor: 'pointer', color: '#fff', padding: '8px 10px' }}
            onClick={() => this.onCopy(this.props.text)}
          >
            复制
          </div>
        }
        mouseLeaveDelay={0.4}
        mouseEnterDelay={0.4}
        visible={this.state.showTooltip}
        onVisibleChange={this.handleVisibleChange}
      >
        {this.props.children}
      </Tooltip>
    )
  }

  private onCopy = (content: string) => {
    copy(content).then(() => {
      const maxLength = 30
      const cutContent = content.length > maxLength ? content.substr(0, maxLength) + '...' : content
      this.props.enqueueSnackbar(`成功复制 ${cutContent} 到剪贴板`, {
        variant: 'success',
        autoHideDuration: 1000,
      })
    }).catch(() => {
      this.props.enqueueSnackbar(`复制失败`, {
        variant: 'error',
        autoHideDuration: 1000,
      })
    })
    this.setState({ showTooltip: false })
  };

  private handleVisibleChange = (visible: boolean) => {
    this.setState({showTooltip: visible})
  }
}

export default withSnackbar<Props>(CopyToClipboard)
