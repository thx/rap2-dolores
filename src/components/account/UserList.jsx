import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Pagination from '../utils/Pagination'
import { addUser, deleteUser, fetchUserList } from '../../actions/account'
import './UserList.css'

// 展示组件
const UserList = ({ history, match, location, users, onAddUser, onDeleteUser, onFetchUserList, tmpl = {} }) => (
  <section className='UserList'>
    <div className='header'>
      <span className='title'>用户管理</span>
    </div>
    <nav className='toolbar clearfix'>
      {/* <div className='float-left'>
        <Link to='/account/register' className='btn btn-success w140'><span className=''>&#xe654;</span>注册用户</Link>
      </div>
      <div className='float-right'>
        <button onClick={e => onFetchUserList(location.params)} className='btn btn-default'>R</button>
      </div> */}
    </nav>
    <div className='body'>
      <table className='table'>
        <thead>
          <tr>
            <th>姓名</th>
            <th>邮箱</th>
            <th className='w100'>操作</th>
          </tr>
        </thead>
        <tbody>
          {users.data.map(user =>
            <tr key={user.id}>
              <td>
                <Link to={`/repository?user=${user.id}`}>#{user.id} {user.fullname}</Link>
              </td>
              <td>{user.email}</td>
              <td>
                <span style={{ cursor: 'not-allowed' }}>
                  <Link to={match.url} onClick={e => onDeleteUser(user.id)} className='operation disabled'>删除</Link>
                </span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    <div className='footer'>
      <Pagination location={location} calculated={users.pagination} />
    </div>
  </section>
)

// 容器组件
const mapStateToProps = (state) => ({
  users: state.users
})
const mapDispatchToProps = ({
  onAddUser: addUser,
  onDeleteUser: deleteUser,
  onFetchUserList: fetchUserList
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserList)
