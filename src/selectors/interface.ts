import { createSelector } from 'reselect'
import { getRouter } from './router'
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

export const getCurrentInterface = createSelector(interfaceSelector, result => result)

export const getCurrentInterfaceId = createSelector(
  state => state.repository.data,
  getRouter,
  (repository: any, router: RootState['router']) => {
    const itfId = +((router.location as any).params || (router.location as any).query).itf
    if (itfId) {
      return itfId
    }
    const modId = +((router.location as any).params || (router.location as any).query).mod
    const mod = modId ? repository?.modules?.find((m: any) => m.id === modId) : repository?.modules[0]
    return mod?.interfaces?.[0]?.id
  },
)
