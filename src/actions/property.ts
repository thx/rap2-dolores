export const addProperty = (property: any, onResolved: any) => ({
  type: 'PROPERTY_ADD',
  property,
  onResolved,
})
export const addPropertySucceeded = (property: any) => ({
  type: 'PROPERTY_ADD_SUCCEEDED',
  property,
})
export const addPropertyFailed = (message: any) => ({
  type: 'PROPERTY_ADD_FAILED',
  message,
})

export const updateProperty = (property: any, onResolved: any) => ({
  type: 'PROPERTY_UPDATE',
  property,
  onResolved,
})
export const updatePropertySucceeded = (property: any) => ({
  type: 'PROPERTY_UPDATE_SUCCEEDED',
  property,
})
export const updatePropertyFailed = (message: any) => ({
  type: 'PROPERTY_UPDATE_FAILED',
  message,
})

export const updateProperties = (itf: any, properties: any, summary: any, onResolved: any) => ({
  type: 'PROPERTIES_UPDATE',
  itf,
  properties,
  summary,
  onResolved,
})
export const updatePropertiesSucceeded = (payload: any) => ({
  type: 'PROPERTIES_UPDATE_SUCCEEDED',
  payload,
})
export const updatePropertiesFailed = (message: any) => ({
  type: 'PROPERTIES_UPDATE_FAILED',
  message,
})

export const deleteProperty = (id: any, onResolved: any) => ({
  type: 'PROPERTY_DELETE',
  id,
  onResolved,
})
export const deletePropertySucceeded = (id: any) => ({
  type: 'PROPERTY_DELETE_SUCCEEDED',
  id,
})
export const deletePropertyFailed = (message: any) => ({
  type: 'PROPERTY_DELETE_FAILED',
  message,
})

export const sortPropertyList = (ids: any, onResolved: any) => ({
  type: 'PROPERTY_LIST_SORT',
  ids,
  onResolved,
})
export const sortPropertyListSucceeded = (count: any) => ({
  type: 'PROPERTY_LIST_SORT_SUCCEEDED',
  count,
})
export const sortPropertyListFailed = (message: any) => ({
  type: 'PROPERTY_LIST_SORT_FAILED',
  message,
})
