import {
  createSelector
} from 'reselect';
import {
  getRouter
} from './router';

const interfaceSelector = (state) => {
  const router = getRouter(state)
  const itfId = +router.location.params.itf
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
  result => result,
)