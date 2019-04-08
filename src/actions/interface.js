export const addInterface = (itf, onResolved, onRejected) => ({
  type: 'INTERFACE_ADD',
  interface: itf,
  onResolved,
  onRejected
})
export const addInterfaceSucceeded = (payload) => ({
  type: 'INTERFACE_ADD_SUCCEEDED',
  payload
})
export const addInterfaceFailed = (message) => ({
  type: 'INTERFACE_ADD_FAILED',
  message
})

export const updateInterface = (itf, onResolved, onRejected) => ({
  type: 'INTERFACE_UPDATE',
  interface: itf,
  onResolved,
  onRejected
})
export const updateInterfaceSucceeded = (payload) => ({
  type: 'INTERFACE_UPDATE_SUCCEEDED',
  payload
})
export const updateInterfaceFailed = (message) => ({
  type: 'INTERFACE_UPDATE_FAILED',
  message
})

export const moveInterface = (params, onResolved) => ({
  type: 'INTERFACE_MOVE',
  params,
  onResolved
})
export const moveInterfaceSucceeded = () => ({
  type: 'INTERFACE_MOVE_SUCCEEDED'
})
export const moveInterfaceFailed = (message) => ({
  type: 'INTERFACE_MOVE_FAILED',
  message
})

export const deleteInterface = (id, onResolved) => ({
  type: 'INTERFACE_DELETE',
  id,
  onResolved
})
export const deleteInterfaceSucceeded = (payload) => ({
  type: 'INTERFACE_DELETE_SUCCEEDED',
  payload
})
export const deleteInterfaceFailed = (message) => ({
  type: 'INTERFACE_DELETE_FAILED',
  message
})

export const fetchInterfaceCount = () => ({
  type: 'INTERFACE_COUNT_FETCH'
})
export const fetchInterfaceCountSucceeded = (count) => ({
  type: 'INTERFACE_COUNT_FETCH_SUCCEEDED',
  count
})
export const fetchInterfaceCountFailed = (message) => ({
  type: 'INTERFACE_COUNT_FETCH_FAILED',
  message
})

export const lockInterface = (id, onResolved) => ({
  type: 'INTERFACE_LOCK',
  id,
  onResolved
})
export const lockInterfaceSucceeded = (itfId, locker) => ({
  type: 'INTERFACE_LOCK_SUCCEEDED',
  payload: {
    itfId,
    locker
  }
})
export const lockInterfaceFailed = (message) => ({
  type: 'INTERFACE_LOCK_FAILED',
  message
})

export const unlockInterface = (id, onResolved) => ({
  type: 'INTERFACE_UNLOCK',
  id,
  onResolved
})
export const unlockInterfaceSucceeded = (itfId) => ({
  type: 'INTERFACE_UNLOCK_SUCCEEDED',
  payload: {
    itfId
  },
})
export const unlockInterfaceFailed = (message) => ({
  type: 'INTERFACE_UNLOCK_FAILED',
  message
})

export const sortInterfaceList = (ids, onResolved) => ({
  type: 'INTERFACE_LIST_SORT',
  ids,
  onResolved
})
export const sortInterfaceListSucceeded = (count) => ({
  type: 'INTERFACE_LIST_SORT_SUCCEEDED',
  count
})
export const sortInterfaceListFailed = (message) => ({
  type: 'INTERFACE_LIST_SORT_FAILED',
  message
})