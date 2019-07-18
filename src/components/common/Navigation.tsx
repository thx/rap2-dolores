import React from 'react'
import { NavLink } from 'react-router-dom'
import { GoHome, GoRepo, GoOrganization, GoPulse, GoPlug } from 'react-icons/go'

export default () => (
  <ul className="nav-links">
    <li><NavLink exact={true} to="/" activeClassName="selected"><GoHome /> 首页</NavLink></li>
    <li><NavLink to="/repository" activeClassName="selected"><GoRepo /> 仓库</NavLink></li>
    <li><NavLink to="/organization" activeClassName="selected"><GoOrganization /> 团队</NavLink></li>
    <li><NavLink to="/api" activeClassName="selected"><GoPlug /> 接口</NavLink></li>
    <li><NavLink to="/status" activeClassName="selected"><GoPulse /> 状态</NavLink></li>
  </ul>
)
