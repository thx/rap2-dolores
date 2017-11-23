export const addOrganization = (organization, onResolved) => ({ type: 'ORGANIZATION_ADD', organization, onResolved })
export const addOrganizationSucceeded = (organization) => ({ type: 'ORGANIZATION_ADD_SUCCEEDED', organization })
export const addOrganizationFailed = (message) => ({ type: 'ORGANIZATION_ADD_FAILED', message })

export const updateOrganization = (organization, onResolved) => ({ type: 'ORGANIZATION_UPDATE', organization, onResolved })
export const updateOrganizationSucceeded = (organization) => ({ type: 'ORGANIZATION_UPDATE_SUCCEEDED', organization })
export const updateOrganizationFailed = (message) => ({ type: 'ORGANIZATION_UPDATE_FAILED', message })

export const deleteOrganization = (id, onResolved) => ({ type: 'ORGANIZATION_DELETE', id, onResolved })
export const deleteOrganizationSucceeded = (id) => ({ type: 'ORGANIZATION_DELETE_SUCCEEDED', id })
export const deleteOrganizationFailed = (message) => ({ type: 'ORGANIZATION_DELETE_FAILED', message })

export const fetchOrganization = ({ id, organization } = {}) => ({ type: 'ORGANIZATION_FETCH', id, organization })
export const fetchOrganizationSucceeded = (organization) => ({ type: 'ORGANIZATION_FETCH_SUCCEEDED', organization })
export const fetchOrganizationFailed = (message) => ({ type: 'ORGANIZATION_FETCH_FAILED', message })

export const fetchOrganizationCount = () => ({ type: 'ORGANIZATION_COUNT_FETCH' })
export const fetchOrganizationCountSucceeded = (count) => ({ type: 'ORGANIZATION_COUNT_FETCH_SUCCEEDED', count })
export const fetchOrganizationCountFailed = (message) => ({ type: 'ORGANIZATION_COUNT_FETCH_FAILED', message })

export const fetchOwnedOrganizationList = ({ name } = {}) => ({ type: 'OWNED_ORGANIZATION_LIST_FETCH', name })
export const fetchOwnedOrganizationListSucceeded = (organizations) => ({ type: 'OWNED_ORGANIZATION_LIST_FETCH_SUCCEEDED', organizations })
export const fetchOwnedOrganizationListFailed = (message) => ({ type: 'OWNED_ORGANIZATION_LIST_FETCH_FAILED', message })

export const fetchJoinedOrganizationList = ({ name } = {}) => ({ type: 'JOINED_ORGANIZATION_LIST_FETCH', name })
export const fetchJoinedOrganizationListSucceeded = (organizations) => ({ type: 'JOINED_ORGANIZATION_LIST_FETCH_SUCCEEDED', organizations })
export const fetchJoinedOrganizationListFailed = (message) => ({ type: 'JOINED_ORGANIZATION_LIST_FETCH_FAILED', message })

export const fetchOrganizationList = ({ name, cursor, limit } = {}) => ({ type: 'ORGANIZATION_LIST_FETCH', name, cursor, limit })
export const fetchOrganizationListSucceeded = (organizations) => ({ type: 'ORGANIZATION_LIST_FETCH_SUCCEEDED', organizations })
export const fetchOrganizationListFailed = (message) => ({ type: 'ORGANIZATION_LIST_FETCH_FAILED', message })
