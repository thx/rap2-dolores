import React from 'react'
import Popover from './Popover'

export default () => (
  <div>
    {['top', 'right', 'bottom', 'left'].map(placement =>
      <Popover key={placement} placement={placement} title={placement} content='Envy is the ulcer of the soul.' className='btn btn-default mr10'>Popover on {placement}</Popover>
    )}
  </div>
)
