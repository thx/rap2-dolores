import React from 'react'
import { connect } from 'react-redux'
import { renderRoutes } from 'react-router-config'

const Account = ({ route }: any) => (
  <article>
    {route && renderRoutes(route.routes)}
  </article>
)

const mapDispatchToProps = ({})

export default connect(
  null,
  mapDispatchToProps
)(Account)
