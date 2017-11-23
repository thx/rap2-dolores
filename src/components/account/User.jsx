import React from 'react'
import { Link } from 'react-router-dom'

const User = ({ match, id, fullname, email, onDeleteUser }) => (
  <tr>
    <td>{id}</td>
    <td>{fullname}</td>
    <td>{email}</td>
    <td>
      <Link to={match.url} onClick={e => onDeleteUser(id)}>X</Link>
    </td>
  </tr>
)

export default User
