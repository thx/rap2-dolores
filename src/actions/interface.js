export const addInterface = (itf, onResolved) => ({ type: 'INTERFACE_ADD', interface: itf, onResolved })
export const addInterfaceSucceeded = (itf) => ({ type: 'INTERFACE_ADD_SUCCEEDED', interface: itf })
export const addInterfaceFailed = (message) => ({ type: 'INTERFACE_ADD_FAILED', message })

export const updateInterface = (itf, onResolved) => ({ type: 'INTERFACE_UPDATE', interface: itf, onResolved })
export const updateInterfaceSucceeded = (itf) => ({ type: 'INTERFACE_UPDATE_SUCCEEDED', interface: itf })
export const updateInterfaceFailed = (message) => ({ type: 'INTERFACE_UPDATE_FAILED', message })

export const deleteInterface = (id, onResolved) => ({ type: 'INTERFACE_DELETE', id, onResolved })
export const deleteInterfaceSucceeded = (id) => ({ type: 'INTERFACE_DELETE_SUCCEEDED', id })
export const deleteInterfaceFailed = (message) => ({ type: 'INTERFACE_DELETE_FAILED', message })

export const fetchInterfaceCount = () => ({ type: 'INTERFACE_COUNT_FETCH' })
export const fetchInterfaceCountSucceeded = (count) => ({ type: 'INTERFACE_COUNT_FETCH_SUCCEEDED', count })
export const fetchInterfaceCountFailed = (message) => ({ type: 'INTERFACE_COUNT_FETCH_FAILED', message })

export const lockInterface = (id, onResolved) => ({ type: 'INTERFACE_LOCK', id, onResolved })
export const lockInterfaceSucceeded = (id) => ({ type: 'INTERFACE_LOCK_SUCCEEDED', id })
export const lockInterfaceFailed = (message) => ({ type: 'INTERFACE_LOCK_FAILED', message })

export const unlockInterface = (id, onResolved) => ({ type: 'INTERFACE_UNLOCK', id, onResolved })
export const unlockInterfaceSucceeded = (itf) => ({ type: 'INTERFACE_UNLOCK_SUCCEEDED', interface: itf })
export const unlockInterfaceFailed = (message) => ({ type: 'INTERFACE_UNLOCK_FAILED', message })

export const sortInterfaceList = (ids, onResolved) => ({ type: 'INTERFACE_LIST_SORT', ids, onResolved })
export const sortInterfaceListSucceeded = (count) => ({ type: 'INTERFACE_LIST_SORT_SUCCEEDED', count })
export const sortInterfaceListFailed = (message) => ({ type: 'INTERFACE_LIST_SORT_FAILED', message })
