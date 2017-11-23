import React from 'react'
import { NavLink } from 'react-router-dom'
import { GoHome, GoRepo, GoOrganization, GoPulse, GoPlug } from 'react-icons/lib/go'

export default () => (
  <ul className='nav-links'>
    <li><NavLink exact to='/' activeClassName='selected'><GoHome /> 首页</NavLink></li>
    <li><NavLink to='/repository' activeClassName='selected'><GoRepo /> 仓库</NavLink></li>
    <li><NavLink to='/organization' activeClassName='selected'><GoOrganization /> 团队</NavLink></li>
    <li><NavLink to='/api' activeClassName='selected'><GoPlug /> 接口</NavLink></li>
    <li><NavLink to='/status' activeClassName='selected'><GoPulse /> 状态</NavLink></li>
    {/* <li><NavLink to='/manage' activeClassName='selected'>管理</NavLink></li> */}
    {/* <li><NavLink to='/account' activeClassName='selected'>Users</NavLink></li>
    <li><NavLink to='/organization' activeClassName='selected'>Organization</NavLink></li>
    <li><NavLink to='/workspace' activeClassName='selected'>Workspace</NavLink></li>
    <li><NavLink to='/analytics' activeClassName='selected'>Analytics</NavLink></li>
    <li><NavLink to='/utils' activeClassName='selected'>Utils</NavLink></li> */}
  </ul>
)
