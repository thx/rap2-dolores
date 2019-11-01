import copy from 'clipboard-copy'
import * as React from 'react'
import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap.css'
import FileCopy from '@material-ui/icons/FileCopyTwoTone'
import { withSnackbar, WithSnackbarProps } from 'notistack'

import './CopyToClipboard.css'

type Props = {
  children: React.ReactElement<any>;
  text: string;
  type?: 'hover' | 'right';
} & WithSnackbarProps

interface OwnState {
  showTooltip: boolean
}

class CopyToClipboard extends React.Component<Props, OwnState> {
  public state: OwnState = { showTooltip: false }

  public render() {
    const { type = 'hover', text } = this.props
    return type === 'hover' ? (
      <Tooltip
        placement="right"
        overlay={
          <div
            style={{ cursor: 'pointer', color: '#fff', padding: '8px 10px' }}
            onClick={() => this.onCopy(text)}
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
    ) : (
      <>
        {this.props.children}
        <span className="copy-link edit" onClick={() => this.onCopy(text)} title="复制名称">
          <FileCopy fontSize="small"/>
        </span>
      </>
    )
  }

  private onCopy = (content: string) => {
    copy(content)
      .then(() => {
        const maxLength = 30
        const cutContent =
          content.length > maxLength
            ? content.substr(0, maxLength) + '...'
            : content
        this.props.enqueueSnackbar(`成功复制 ${cutContent} 到剪贴板`, {
          variant: 'success',
          autoHideDuration: 1000,
        })
      })
      .catch(() => {
        this.props.enqueueSnackbar(`复制失败`, {
          variant: 'error',
          autoHideDuration: 1000,
        })
      })
    this.setState({ showTooltip: false })
  };

  private handleVisibleChange = (visible: boolean) => {
    this.setState({ showTooltip: visible })
  };
}

export default withSnackbar<Props>(CopyToClipboard)
