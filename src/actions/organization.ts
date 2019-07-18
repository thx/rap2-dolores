export const addOrganization = (organization: any, onResolved: any) => ({ type: 'ORGANIZATION_ADD', organization, onResolved })
export const addOrganizationSucceeded = (organization: any) => ({ type: 'ORGANIZATION_ADD_SUCCEEDED', organization })
export const addOrganizationFailed = (message: any) => ({ type: 'ORGANIZATION_ADD_FAILED', message })

export const updateOrganization = (organization: any, onResolved: any) => ({ type: 'ORGANIZATION_UPDATE', organization, onResolved })
export const updateOrganizationSucceeded = (organization: any) => ({ type: 'ORGANIZATION_UPDATE_SUCCEEDED', organization })
export const updateOrganizationFailed = (message: any) => ({ type: 'ORGANIZATION_UPDATE_FAILED', message })

export const deleteOrganization = (id: any, onResolved: any) => ({ type: 'ORGANIZATION_DELETE', id, onResolved })
export const deleteOrganizationSucceeded = (id: any) => ({ type: 'ORGANIZATION_DELETE_SUCCEEDED', id })
export const deleteOrganizationFailed = (message: any) => ({ type: 'ORGANIZATION_DELETE_FAILED', message })

export const fetchOrganization = ({ id, organization } = { id: '', organization: ''}) => ({ type: 'ORGANIZATION_FETCH', id, organization })
export const fetchOrganizationSucceeded = (organization: any) => ({ type: 'ORGANIZATION_FETCH_SUCCEEDED', organization })
export const fetchOrganizationFailed = (message: any) => ({ type: 'ORGANIZATION_FETCH_FAILED', message })

export const fetchOrganizationCount = () => ({ type: 'ORGANIZATION_COUNT_FETCH' })
export const fetchOrganizationCountSucceeded = (count: any) => ({ type: 'ORGANIZATION_COUNT_FETCH_SUCCEEDED', count })
export const fetchOrganizationCountFailed = (message: any) => ({ type: 'ORGANIZATION_COUNT_FETCH_FAILED', message })

export const fetchOwnedOrganizationList = ({ name } = { name: ''}) => ({ type: 'OWNED_ORGANIZATION_LIST_FETCH', name })
export const fetchOwnedOrganizationListSucceeded = (organizations: any) => ({ type: 'OWNED_ORGANIZATION_LIST_FETCH_SUCCEEDED', organizations })
export const fetchOwnedOrganizationListFailed = (message: any) => ({ type: 'OWNED_ORGANIZATION_LIST_FETCH_FAILED', message })

export const fetchJoinedOrganizationList = ({ name } = { name: ''}) => ({ type: 'JOINED_ORGANIZATION_LIST_FETCH', name })
export const fetchJoinedOrganizationListSucceeded = (organizations: any) => ({ type: 'JOINED_ORGANIZATION_LIST_FETCH_SUCCEEDED', organizations })
export const fetchJoinedOrganizationListFailed = (message: any) => ({ type: 'JOINED_ORGANIZATION_LIST_FETCH_FAILED', message })

export const fetchOrganizationList = (
  { name, cursor, limit } = { name: '', cursor: '', limit: '' }
) => ({ type: 'ORGANIZATION_LIST_FETCH', name, cursor, limit })
export const fetchOrganizationListSucceeded = (organizations: any) => ({ type: 'ORGANIZATION_LIST_FETCH_SUCCEEDED', organizations })
export const fetchOrganizationListFailed = (message: any) => ({ type: 'ORGANIZATION_LIST_FETCH_FAILED', message })
