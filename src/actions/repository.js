export const addRepository = (repository, onResolved) => ({ type: 'REPOSITORY_ADD', repository, onResolved })
export const addRepositorySucceeded = (repository) => ({ type: 'REPOSITORY_ADD_SUCCEEDED', repository })
export const addRepositoryFailed = (message) => ({ type: 'REPOSITORY_ADD_FAILED', message })

export const importRepository = (data, onResolved) => ({ type: 'REPOSITORY_IMPORT', onResolved, data })
export const importRepositorySucceeded = () => ({ type: 'REPOSITORY_IMPORT_SUCCEEDED' })
export const importRepositoryFailed = (message) => ({ type: 'REPOSITORY_IMPORT_FAILED', message })

export const updateRepository = (repository, onResolved) => ({ type: 'REPOSITORY_UPDATE', repository, onResolved })
export const updateRepositorySucceeded = (repository) => ({ type: 'REPOSITORY_UPDATE_SUCCEEDED', repository })
export const updateRepositoryFailed = (message) => ({ type: 'REPOSITORY_UPDATE_FAILED', message })

export const deleteRepository = (id) => ({ type: 'REPOSITORY_DELETE', id })
export const deleteRepositorySucceeded = (id) => ({ type: 'REPOSITORY_DELETE_SUCCEEDED', id })
export const deleteRepositoryFailed = (message) => ({ type: 'REPOSITORY_DELETE_FAILED', message })

export const fetchRepository = ({ id, repository } = {}) => ({ type: 'REPOSITORY_FETCH', id, repository })
export const fetchRepositorySucceeded = (repository) => ({ type: 'REPOSITORY_FETCH_SUCCEEDED', repository })
export const fetchRepositoryFailed = (message) => ({ type: 'REPOSITORY_FETCH_FAILED', message })

export const clearRepository = () => ({ type: 'REPOSITORY_CLEAR' })

export const fetchRepositoryCount = () => ({ type: 'REPOSITORY_COUNT_FETCH' })
export const fetchRepositoryCountSucceeded = (count) => ({ type: 'REPOSITORY_COUNT_FETCH_SUCCEEDED', count })
export const fetchRepositoryCountFailed = (message) => ({ type: 'REPOSITORY_COUNT_FETCH_FAILED', message })

export const fetchRepositoryList = ({ user, organization, name, cursor, limit } = {}) => ({ type: 'REPOSITORY_LIST_FETCH', user, organization, name, cursor, limit })
export const fetchRepositoryListSucceeded = (repositories) => ({ type: 'REPOSITORY_LIST_FETCH_SUCCEEDED', repositories })
export const fetchRepositoryListFailed = (message) => ({ type: 'REPOSITORY_LIST_FETCH_FAILED', message })

export const fetchOwnedRepositoryList = ({ user, name } = {}) => ({ type: 'OWNED_REPOSITORY_LIST_FETCH', user, name })
export const fetchOwnedRepositoryListSucceeded = (repositories) => ({ type: 'OWNED_REPOSITORY_LIST_FETCH_SUCCEEDED', repositories })
export const fetchOwnedRepositoryListFailed = (message) => ({ type: 'OWNED_REPOSITORY_LIST_FETCH_FAILED', message })

export const fetchJoinedRepositoryList = ({ user, name } = {}) => ({ type: 'JOINED_REPOSITORY_LIST_FETCH', user, name })
export const fetchJoinedRepositoryListSucceeded = (repositories) => ({ type: 'JOINED_REPOSITORY_LIST_FETCH_SUCCEEDED', repositories })
export const fetchJoinedRepositoryListFailed = (message) => ({ type: 'JOINED_REPOSITORY_LIST_FETCH_FAILED', message })
