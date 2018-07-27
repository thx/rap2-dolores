import React, { Component } from 'react'
import { connect, PropTypes, Link, replace, moment } from '../../family'
import { RModal } from '../utils'
import { serve } from '../../relatives/services/constant'
import RepositoryForm from './RepositoryForm'
import { GoRepo, GoPencil, GoPlug, GoTrashcan, GoPerson, GoOrganization } from 'react-icons/lib/go'
// DONE 2.1 iconfont => octicons

class Repository extends Component {
  static contextTypes = {
    store: PropTypes.object,
    location: PropTypes.object,
    onDeleteRepository: PropTypes.func
  }
  constructor (props) {
    super(props)
    this.state = { update: false }
  }
  render () {
    let { location } = this.context
    let { auth, repository, editor } = this.props
    return (
      <div className='Repository card'>
        <div className='card-block'>
          <div className='name'>
            <GoRepo className='mr6 color-9' />
            <Link to={`${editor}?id=${repository.id}`}>{repository.name}</Link>
          </div>
          <div className='desc'>
            {repository.description}
          </div>
          {/* TODO 2.x 成员列表参考 ProductHunt，仓库成员不怎么重要，暂时不现实 */}
          {/* <div className='members'>
            {repository.members.map(user =>
              <img key={user.id} alt={user.id} title={user.fullname} src={`https://work.alibaba-inc.com/photo/${user.id}.220x220.jpg`} className='avatar' />
            )}
          </div> */}
          <div className='toolbar'>
            <a href={`${serve}/app/plugin/${repository.id}`} target='_blank'><GoPlug /></a>
            {/* 编辑权限：拥有者或者成员 */}
            {repository.owner.id === auth.id || repository.members.find(itme => itme.id === auth.id)
              ? <span className='fake-link' onClick={e => this.setState({ update: true })}><GoPencil /></span>
              : null
            }
            <RModal when={this.state.update} onClose={e => this.setState({ update: false })} onResolve={this.handleUpdateRepository}>
              <RepositoryForm title='编辑仓库' repository={repository} />
            </RModal>
            {/* 删除权限：个人仓库 */}
            {repository.owner.id === auth.id
              ? <Link to={location.pathname + location.search} onClick={this.handleDeleteRepository}><GoTrashcan /></Link>
              : null
            }
          </div>
        </div>
        <div className='card-block card-footer'>
          {repository.organization
            ? <span className='ownername'><GoOrganization /> {repository.organization.name}</span>
            : <span className='ownername'><GoPerson /> {repository.owner.fullname}</span>
          }
          <span className='fromnow'>{moment(repository.updatedAt).fromNow()}更新</span>
        </div>
      </div>
    )
  }
  handleDeleteRepository = (e) => {
    e.preventDefault()
    let { repository } = this.props
    let message = `仓库被删除后不可恢复，并且会删除相关的模块和接口！\n确认继续删除『#${repository.id} ${repository.name}』吗？`
    if (window.confirm(message)) {
      let { onDeleteRepository } = this.context
      onDeleteRepository(repository.id)

      let { store, location: { pathname, hash, search } } = this.context
      store.dispatch(replace(pathname + hash + search))
    }
  }
  handleUpdateRepository = (e) => {
  }
}

// 容器组件
const mapStateToProps = (state) => ({
  auth: state.auth
})
const mapDispatchToProps = ({})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Repository)
