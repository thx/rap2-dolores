export const addProperty = (property, onResolved) => ({ type: 'PROPERTY_ADD', property, onResolved })
export const addPropertySucceeded = (property) => ({ type: 'PROPERTY_ADD_SUCCEEDED', property })
export const addPropertyFailed = (message) => ({ type: 'PROPERTY_ADD_FAILED', message })

export const updateProperty = (property, onResolved) => ({ type: 'PROPERTY_UPDATE', property, onResolved })
export const updatePropertySucceeded = (property) => ({ type: 'PROPERTY_UPDATE_SUCCEEDED', property })
export const updatePropertyFailed = (message) => ({ type: 'PROPERTY_UPDATE_FAILED', message })

export const updateProperties = (itf, properties, onResolved) => ({ type: 'PROPERTIES_UPDATE', itf, properties, onResolved })
export const updatePropertiesSucceeded = (properties) => ({ type: 'PROPERTIES_UPDATE_SUCCEEDED', properties })
export const updatePropertiesFailed = (message) => ({ type: 'PROPERTIES_UPDATE_FAILED', message })

export const deleteProperty = (id, onResolved) => ({ type: 'PROPERTY_DELETE', id, onResolved })
export const deletePropertySucceeded = (id) => ({ type: 'PROPERTY_DELETE_SUCCEEDED', id })
export const deletePropertyFailed = (message) => ({ type: 'PROPERTY_DELETE_FAILED', message })

export const sortPropertyList = (ids, onResolved) => ({ type: 'PROPERTY_LIST_SORT', ids, onResolved })
export const sortPropertyListSucceeded = (count) => ({ type: 'PROPERTY_LIST_SORT_SUCCEEDED', count })
export const sortPropertyListFailed = (message) => ({ type: 'PROPERTY_LIST_SORT_FAILED', message })
