import { createSelector } from "reselect";

const routerSelector = state => state.router

export const getRouter = createSelector(
  routerSelector,
  result => result,
)