export const addModule = (module, onResolved) => ({
  type: 'MODULE_ADD',
  module,
  onResolved
})
export const addModuleSucceeded = (module) => ({
  type: 'MODULE_ADD_SUCCEEDED',
  module
})
export const addModuleFailed = (message) => ({
  type: 'MODULE_ADD_FAILED',
  message
})

export const updateModule = (module, onResolved) => ({
  type: 'MODULE_UPDATE',
  module,
  onResolved
})
export const updateModuleSucceeded = (payload) => ({
  type: 'MODULE_UPDATE_SUCCEEDED',
  payload
})
export const updateModuleFailed = (message) => ({
  type: 'MODULE_UPDATE_FAILED',
  message
})

export const deleteModule = (id, onResolved, repoId) => ({
  type: 'MODULE_DELETE',
  id,
  onResolved,
  repoId
})
export const deleteModuleSucceeded = (id) => ({
  type: 'MODULE_DELETE_SUCCEEDED',
  id
})
export const deleteModuleFailed = (message) => ({
  type: 'MODULE_DELETE_FAILED',
  message
})

export const sortModuleList = (ids, onResolved) => ({
  type: 'MODULE_LIST_SORT',
  ids,
  onResolved
})
export const sortModuleListSucceeded = (count) => ({
  type: 'MODULE_LIST_SORT_SUCCEEDED',
  count
})
export const sortModuleListFailed = (message) => ({
  type: 'MODULE_LIST_SORT_FAILED',
  message
})