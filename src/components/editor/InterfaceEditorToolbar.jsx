import React, { Component } from 'react'
import { PropTypes, connect } from '../../family'
import { GoPencil, GoGitPullRequest, GoX } from 'react-icons/lib/go'

// TODO 2.1 BUG 快速点击编辑和保存时显示的操作按钮错误
class InterfaceEditorToolbar extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    repository: PropTypes.object.isRequired,
    locker: PropTypes.object,
    editable: PropTypes.bool.isRequired
  }
  static contextTypes = {
    handleLockInterface: PropTypes.func.isRequired,
    handleUnlockInterface: PropTypes.func.isRequired,
    handleSaveInterface: PropTypes.func.isRequired
  }
  render () {
    let { handleLockInterface, handleUnlockInterface, handleSaveInterface } = this.context
    let { editable, locker, auth, repository } = this.props
    let isOwned = repository.owner.id === auth.id
    let isJoined = repository.members.find(itme => itme.id === auth.id)
    if (!isOwned && !isJoined) return null
    if (editable) {
      return (
        <div className='InterfaceEditorToolbar'>
          <button className='btn btn-success save w130' onClick={handleSaveInterface}><GoGitPullRequest /> 保存</button>
          <button className='btn btn-default cancel w130' onClick={handleUnlockInterface}><GoX /> 取消</button>
          <span className='locker-warning hide'>已经锁定当前接口！</span>
          {/* 这个提示让界面有点混乱，暂时隐藏掉 */}
          {/* .locker-success .locker-success */}
        </div>
      )
    }
    if (locker) {
      return (
        <div className='InterfaceEditorToolbar'>
          <div className='alert alert-danger'>当前接口已经被 <span className='nowrap'>{locker.fullname}</span> 锁定！</div>
        </div>
      )
    }
    return (
      <div className='InterfaceEditorToolbar'>
        <button className='btn btn-success edit w130' onClick={handleLockInterface}><GoPencil /> 编辑</button>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({})
const mapDispatchToProps = ({})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InterfaceEditorToolbar)
