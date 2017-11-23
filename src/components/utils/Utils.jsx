import React from 'react'
import { Link, Switch, Route } from '../../family'

import PopoverExample from './PopoverExample'
import SpinExample from './SpinExample'
import SmartTextareaExample from './SmartTextareaExample'
import TagsInputExample from './TagsInputExample'
import PropertyEditor from './PropertyEditor'
import RSortableExample from './RSortableExample'
// import ModalExample from './ModalExample'
import './Utils.css'

export default () => (
  <section className='Utils'>
    <ul>
      <li><Link to='/utils/popover'>Popover</Link></li>
      <li><Link to='/utils/spin'>Spin</Link></li>
      <li><Link to='/utils/smarttextarea'>SmartTextarea</Link></li>
      <li><Link to='/utils/tagsinput'>TagsInput</Link></li>
      <li><Link to='/utils/property/editor'>PropertyEditor</Link></li>
      <li><Link to='/utils/property/modal'>Modal</Link></li>
      <li><Link to='/utils/property/rsortable'>Modal</Link></li>
    </ul>
    <Switch>
      <Route path='/utils/popover' component={PopoverExample} />
      <Route path='/utils/spin' component={SpinExample} />
      <Route path='/utils/smarttextarea' component={SmartTextareaExample} />
      <Route path='/utils/tagsinput' component={TagsInputExample} />
      <Route path='/utils/property/editor' component={PropertyEditor} />
      <Route path='/utils/rsortable' component={RSortableExample} />
    </Switch>
    {/* <Route path='/utils/property/modal' component={ModalExample} /> */}
  </section>
)
