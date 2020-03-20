export const addModule = (module: any, onResolved: any) => ({
  type: 'MODULE_ADD',
  module,
  onResolved,
})
export const addModuleSucceeded = (module: any) => ({
  type: 'MODULE_ADD_SUCCEEDED',
  module,
})
export const addModuleFailed = (message: any) => ({
  type: 'MODULE_ADD_FAILED',
  message,
})

export const updateModule = (module: any, onResolved: any) => ({
  type: 'MODULE_UPDATE',
  module,
  onResolved,
})
export const updateModuleSucceeded = (payload: any) => ({
  type: 'MODULE_UPDATE_SUCCEEDED',
  payload,
})
export const updateModuleFailed = (message: any) => ({
  type: 'MODULE_UPDATE_FAILED',
  message,
})

export const moveModule = (params: any, onResolved: any) => ({
  type: 'MODULE_MOVE',
  params,
  onResolved,
})
export const moveModuleSucceeded = (payload: any) => ({
  type: 'MODULE_MOVE_SUCCEEDED',
  payload,
})
export const moveModuleFailed = (message: any) => ({
  type: 'MODULE_MOVE_FAILED',
  message,
})

export const deleteModule = (id: any, onResolved: any, repoId: any) => ({
  type: 'MODULE_DELETE',
  id,
  onResolved,
  repoId,
})
export const deleteModuleSucceeded = (id: any) => ({
  type: 'MODULE_DELETE_SUCCEEDED',
  id,
})
export const deleteModuleFailed = (message: any) => ({
  type: 'MODULE_DELETE_FAILED',
  message,
})

export const sortModuleList = (ids: any, onResolved: any) => ({
  type: 'MODULE_LIST_SORT',
  ids,
  onResolved,
})
export const sortModuleListSucceeded = (count: any, ids: any) => ({
  type: 'MODULE_LIST_SORT_SUCCEEDED',
  count,
  ids,
})
export const sortModuleListFailed = (message: any) => ({
  type: 'MODULE_LIST_SORT_FAILED',
  message,
})
