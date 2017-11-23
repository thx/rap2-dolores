import React from 'react'
import { Link, moment } from '../../family'
import { Spin } from '../utils'

// DONE 2.3 重构 LogView
// 1. √ 旧逻辑把 targe 和 type 混在一起，各种判断看的好蛋疼
// 2. √ 部分路径删除时展示成全部删除线，应该是按需加删除线，例如 仓库/~~模块~~、仓库/模块/~~接口~~
// 3. √ 不支持『上帝之手』`log.creator`
//   1. 墨智将麦少移出群聊
//   2. 墨智邀请麦少加入群聊
// 4. √ 用户头像应该提成组件 UserAvatar，而不是混在 HTML 代码里
// 5. √ FromNow 应该提成组件
const UserAvatar = ({ user }) => (
  user
    ? <img alt={user.empId} src={`https://work.alibaba-inc.com/photo/${user.empId}.220x220.jpg`} className='Log-avatar' />
    : null
)
const UserLink = ({ user }) => (
  <Link to={`https://work.alibaba-inc.com/work/u/${user.empId}`} target='_blank' className='Log-user-link'>{user.fullname}</Link>
)
const LogUserView = ({ user }) => {
  return (
    <span className='Log-user'>
      <UserAvatar user={user} />
      <UserLink user={user} />
    </span>
  )
}
const LogTypeView = ({ type }) => {
  let typeName = {
    create: '创建了',
    update: '修改了',
    delete: '删除了',
    lock: '锁定了',
    unlock: '释放了',
    join: '加入了',
    exit: '退出了'
  }[type]
  return <span className='Log-type'>{typeName}</span>
}
const LogTargetView = ({ log }) => {
  let targetType = (log.organization && 'organization') || // 团队
    (log.repository && !log.module && !log.interface && 'repository') || // 仓库
    (log.repository && log.module && !log.interface && 'module') || // 模块
    (log.repository && log.module && log.interface && 'interface') // 接口
  switch (targetType) {
    case 'organization':
      return !log.organization.deletedAt
        ? <span className='Log-target'><Link to={`/organization/repository?organization=${log.organization.id}`}>{log.organization.name}</Link></span>
        : <s>{log.organization.name}</s>
    case 'repository':
      return !log.repository.deletedAt
        ? <span className='Log-target'><Link to={`/repository/editor?id=${log.repository.id}`}>{log.repository.name}</Link></span>
        : <s>{log.repository.name}</s>
    case 'module':
      return (
        <span className='Log-target'>
          {!log.repository.deletedAt
            ? <Link to={`/repository/editor?id=${log.repository.id}`}>{log.repository.name}</Link>
            : <s>{log.repository.name}</s>
          }
          <span className='slash'> / </span>
          {!log.module.deletedAt
            ? <Link to={`/repository/editor?id=${log.repository.id}&mod=${log.module.id}`}>{log.module.name}</Link>
            : <s>{log.module.name}</s>
          }
        </span>
      )
    case 'interface':
      return (
        <span className='Log-target'>
          {!log.repository.deletedAt
            ? <Link to={`/repository/editor?id=${log.repository.id}`}>{log.repository.name}</Link>
            : <s>{log.repository.name}</s>
          }
          <span className='slash'> / </span>
          {!log.module.deletedAt
            ? <Link to={`/repository/editor?id=${log.repository.id}&mod=${log.module.id}`}>{log.module.name}</Link>
            : <s>{log.module.name}</s>
          }
          <span className='slash'> / </span>
          {!log.interface.deletedAt
            ? <Link to={`/repository/editor?id=${log.repository.id}&mod=${log.module.id}&itf=${log.interface.id}`}>{log.interface.name}</Link>
            : <s>{log.interface.name}</s>
          }
        </span>
      )
    default:
      return undefined
  }
}
const FromNow = ({ date }) => (
  <i className='Log-fromnow'>{moment(date).fromNow()}</i>
)

const LogView = ({ log }) => {
  if (log.creator && /join|exit/.test(log.type) && log.creator.id !== log.user.id) {
    // if (log.creator.id === log.user.id) return null
    if (log.type === 'join') return <JoinLogView log={log} />
    if (log.type === 'exit') return <ExitLogView log={log} />
  }
  return (
    <div className='Log clearfix'>
      <div className='Log-body'>
        <LogUserView user={log.user} />
        <LogTypeView type={log.type} />
        <LogTargetView log={log} />
      </div>
      <div className='Log-footer'>
        <FromNow date={log.createdAt} />
      </div>
    </div>
  )
}

// DONE 2.3 支持『上帝之手』`log.creator`
// 墨智邀请麦少加入群聊
const JoinLogView = ({ log }) => {
  return (
    <div className='Log clearfix'>
      <div className='Log-body'>
        <LogUserView user={log.creator} />
        <span className='Log-type'>邀请</span>
        <UserLink user={log.user} />
        <span className='Log-type'>加入了</span>
        <LogTargetView log={log} />
      </div>
      <div className='Log-footer'>
        <FromNow date={log.createdAt} />
      </div>
    </div>
  )
}
// 墨智将麦少移出群聊
const ExitLogView = ({ log }) => {
  return (
    <div className='Log clearfix'>
      <div className='Log-body'>
        <LogUserView user={log.creator} />
        <span className='Log-type'>将</span>
        <UserLink user={log.user} />
        <span className='Log-type'>移出了</span>
        <LogTargetView log={log} />
      </div>
      <div className='Log-footer'>
        <FromNow date={log.createdAt} />
      </div>
    </div>
  )
}

const Log = ({ log }) => {  // eslint-disable-line no-unused-vars
  const userAvatar = <img alt={log.user.empId} src={`https://work.alibaba-inc.com/photo/${log.user.empId}.220x220.jpg`} className='avatar' />
  const userLink = <Link to={`https://work.alibaba-inc.com/work/u/${log.user.empId}`} target='_blank'>{log.user.fullname}</Link>
  const fromNow = <i className='fromnow'>{moment(log.updatedAt).fromNow()}</i>
  let targetName, targetLink, typeName
  if (log.organization) { // 团队
    targetName = log.organization.name
    targetLink = !log.organization.deletedAt
      ? <Link to={`/organization/repository?organization=${log.organization.id}`}>{targetName}</Link>
      : targetName
  }
  if (log.repository && !log.module && !log.interface) { // 仓库
    targetName = log.repository.name
    targetLink = !log.repository.deletedAt
      ? <Link to={`/repository/editor?id=${log.repository.id}`}>{targetName}</Link>
      : targetName
  }
  if (log.repository && log.module && !log.interface) { // 模块
    targetName = `${log.repository.name} / ${log.module.name}`
    targetLink = !log.repository.deletedAt && !log.module.deletedAt
      ? <Link to={`/repository/editor?id=${log.repository.id}&mod=${log.module.id}`}>{targetName}</Link>
      : targetName
  }
  if (log.repository && log.module && log.interface) { // 接口
    targetName = `${log.repository.name} / ${log.module.name} / ${log.interface.name}`
    targetLink = !log.repository.deletedAt && !log.module.deletedAt && !log.interface.deletedAt
      ? <Link to={`/repository/editor?id=${log.repository.id}&mod=${log.module.id}&itf=${log.interface.id}`}>{targetName}</Link>
      : targetName
  }
  switch (log.type) {
    case 'create':
      return targetLink ? <div className='Log clearfix'>
        {userAvatar} <span className='body'>{userLink} <span className='ml6 mr6'>创建了</span> {targetLink}</span> {fromNow}
      </div> : null
    case 'update':
      return targetLink ? <div className='Log clearfix'>
        {userAvatar} <span className='body'>{userLink} <span className='ml6 mr6'>修改了</span> {targetLink}</span> {fromNow}
      </div> : null
    case 'delete':
      return targetName ? <div className='Log clearfix'>
        {userAvatar} <span className='body'>{userLink} <span className='ml6 mr6'>删除了</span> <s>{targetName}</s></span> {fromNow}
      </div> : null
    case 'lock':
    case 'unlock':
      typeName = { lock: '锁定', unlock: '释放' }[log.type]
      if (!log.repository || !log.module || !log.interface) return null
      return <div className='Log clearfix'>
        {userAvatar} <span className='body'>{userLink} <span className='ml6 mr6'>{typeName}了</span> {targetLink}</span> {fromNow}
      </div>
    case 'join':
    case 'exit':
      typeName = { join: '加入', exit: '退出' }[log.type]
      return targetName ? <div className='Log clearfix'>
        {userAvatar} <span className='body'>{userLink} <span className='ml6 mr6'>{typeName}了</span> {targetLink}</span> {fromNow}
      </div> : null
    default:
      return null
      // return <p>{JSON.stringify(log)}</p>
  }
}
const LogsCard = ({ logs }) => (
  <div className='Logs card'>
    {/* DONE 2.1 不屏蔽首页 */}
    {/* DONE 2.2 √用户、√团队、√仓库的动态（简） */}
    {/* DONE 2.2 团队-仓库、团队-用户的动态 */}
    {/* <div className='card-header'>React + Redux + Router + Saga</div> */}
    {logs.fetching ? <Spin /> : (
      <div className='card-block'>
        {logs.data.map(log =>
          <LogView key={log.id} log={log} />
        )}
      </div>
    )}
  </div>
)

export default LogsCard
