import React from 'react'

export default ({ location }: any) => (
  <div className="p100 fontsize-16 text-center">
    <span>No match for <code>{location.pathname}</code></span>
  </div>
)
