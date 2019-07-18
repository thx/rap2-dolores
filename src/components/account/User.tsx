import React from 'react'
import { Link } from 'react-router-dom'

const User = ({ match, id, fullname, email, onDeleteUser }: any) => (
  <tr>
    <td>{id}</td>
    <td>{fullname}</td>
    <td>{email}</td>
    <td>
      <Link to={match.url} onClick={() => onDeleteUser(id)}>X</Link>
    </td>
  </tr>
)

export default User
