import { createSelector } from 'reselect'
import { RootState } from 'actions/types'

const routerSelector = (state: RootState) => state.router

export const getRouter = createSelector(
  routerSelector,
  result => result
)
