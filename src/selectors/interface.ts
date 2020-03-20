import {
  createSelector
} from 'reselect'
import {
  getRouter
} from './router'
import { RootState } from 'actions/types'

const interfaceSelector = (state: RootState) => {
  const router = getRouter(state)
  const itfId = +((router.location as any).params || (router.location as any).query).itf
  if (itfId > 0) {
    for (const mod of state.repository.data.modules) {
      for (const itf of mod.interfaces) {
        if (itf.id === itfId) {
          return itf
        }
      }
    }
  }
  return null
}

export const getCurrentInterface = createSelector(
  interfaceSelector,
  result => result
)
