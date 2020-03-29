import React from 'react'
import { TransitionProps } from '@material-ui/core/transitions'
import Slide from '@material-ui/core/Slide'

export const SlideUp = React.forwardRef(
  (
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
  ) => {
    return <Slide direction="up" ref={ref} {...props} />
  },
)
