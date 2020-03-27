export const addInterface = (itf: any, onResolved: any) => ({
  type: 'INTERFACE_ADD',
  interface: itf,
  onResolved,
})

export const addInterfaceSucceeded = (payload: any) => ({
  type: 'INTERFACE_ADD_SUCCEEDED',
  payload,
})
export const addInterfaceFailed = (message: any) => ({
  type: 'INTERFACE_ADD_FAILED',
  message,
})

export const fetchInterface = (id: number, onResolved: any) => ({
  type: 'INTERFACE_FETCH',
  id,
  onResolved,
})

export const fetchInterfaceSucceeded = (payload: any) => ({
  type: 'INTERFACE_FETCH_SUCCEEDED',
  payload,
})
export const fetchInterfaceFailed = (message: any) => ({
  type: 'INTERFACE_FETCH_FAILED',
  message,
})

export const updateInterface = (itf: any, onResolved: any) => ({
  type: 'INTERFACE_UPDATE',
  interface: itf,
  onResolved,
})
export const updateInterfaceSucceeded = (payload: any) => ({
  type: 'INTERFACE_UPDATE_SUCCEEDED',
  payload,
})
export const updateInterfaceFailed = (message: any) => ({
  type: 'INTERFACE_UPDATE_FAILED',
  message,
})

export const moveInterface = (params: any, onResolved: any) => ({
  type: 'INTERFACE_MOVE',
  params,
  onResolved,
})
export const moveInterfaceSucceeded = () => ({
  type: 'INTERFACE_MOVE_SUCCEEDED',
})
export const moveInterfaceFailed = (message: any) => ({
  type: 'INTERFACE_MOVE_FAILED',
  message,
})

export const deleteInterface = (id: any, onResolved: any) => ({
  type: 'INTERFACE_DELETE',
  id,
  onResolved,
})
export const deleteInterfaceSucceeded = (payload: any) => ({
  type: 'INTERFACE_DELETE_SUCCEEDED',
  payload,
})
export const deleteInterfaceFailed = (message: any) => ({
  type: 'INTERFACE_DELETE_FAILED',
  message,
})

export const fetchInterfaceCount = () => ({
  type: 'INTERFACE_COUNT_FETCH',
})
export const fetchInterfaceCountSucceeded = (count: any) => ({
  type: 'INTERFACE_COUNT_FETCH_SUCCEEDED',
  count,
})
export const fetchInterfaceCountFailed = (message: any) => ({
  type: 'INTERFACE_COUNT_FETCH_FAILED',
  message,
})

export const lockInterface = (id: any, onResolved?: any) => ({
  type: 'INTERFACE_LOCK',
  id,
  onResolved,
})
export const lockInterfaceSucceeded = (itfId: any, locker: any) => ({
  type: 'INTERFACE_LOCK_SUCCEEDED',
  payload: {
    itfId,
    locker,
  },
})
export const lockInterfaceFailed = (message: any) => ({
  type: 'INTERFACE_LOCK_FAILED',
  message,
})

export const unlockInterface = (id: any, onResolved?: any) => ({
  type: 'INTERFACE_UNLOCK',
  id,
  onResolved,
})
export const unlockInterfaceSucceeded = (itfId: any) => ({
  type: 'INTERFACE_UNLOCK_SUCCEEDED',
  payload: {
    itfId,
  },
})
export const unlockInterfaceFailed = (message: any) => ({
  type: 'INTERFACE_UNLOCK_FAILED',
  message,
})

export const sortInterfaceList = (ids: any, moduleId: number, onResolved: any) => ({
  type: 'INTERFACE_LIST_SORT',
  ids,
  moduleId,
  onResolved,
})
export const sortInterfaceListSucceeded = (count: any, ids: any, moduleId: number) => ({
  type: 'INTERFACE_LIST_SORT_SUCCEEDED',
  count,
  ids,
  moduleId,
})
export const sortInterfaceListFailed = (message: any) => ({
  type: 'INTERFACE_LIST_SORT_FAILED',
  message,
})
