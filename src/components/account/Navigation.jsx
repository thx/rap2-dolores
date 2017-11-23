import React from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

const Nav = ({ route, match, location }) => (
  <ul className='rap-navigation'>
    <li><NavLink to='/account/users' activeClassName='selected'>User List</NavLink></li>
    <li><NavLink to='/account/signin' activeClassName='selected'>Sign In</NavLink></li>
    <li><NavLink to='/account/signup' activeClassName='selected'>Sign Up</NavLink></li>
  </ul>
)

const mapStateToProps = (state) => ({})
const mapDispatchToProps = ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Nav)
