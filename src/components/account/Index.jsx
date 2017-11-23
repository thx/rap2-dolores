import React from 'react'
import { connect } from 'react-redux'
import { renderRoutes } from 'react-router-config'

const Account = ({ route, match, location }) => (
  <article>
    {route && renderRoutes(route.routes)}
  </article>
)

const mapStateToProps = (state) => ({})
const mapDispatchToProps = ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Account)
