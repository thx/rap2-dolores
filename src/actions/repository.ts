import { IDefaultVal } from 'components/editor/DefaultValueModal'

export const addRepository = (repository: any, onResolved: any) => ({ type: 'REPOSITORY_ADD', repository, onResolved })
export const addRepositorySucceeded = (repository: any) => ({ type: 'REPOSITORY_ADD_SUCCEEDED', repository })
export const addRepositoryFailed = (message: any) => ({ type: 'REPOSITORY_ADD_FAILED', message })

export const importRepository = (data: any, onResolved: any) => ({ type: 'REPOSITORY_IMPORT', onResolved, data })
export const importRepositorySucceeded = () => ({ type: 'REPOSITORY_IMPORT_SUCCEEDED' })
export const importRepositoryFailed = (message: any) => ({ type: 'REPOSITORY_IMPORT_FAILED', message })

export const importSwaggerRepository = (data: any, onResolved: any) => ({ type: 'REPOSITORY_IMPORT_SWAGGER', onResolved, data })
export const importSwaggerRepositorySucceeded = () => ({ type: 'REPOSITORY_IMPORT_SUCCEEDED_SWAGGER' })
export const importSwaggerRepositoryFailed = (message: any) => ({ type: 'REPOSITORY_IMPORT_FAILED_SWAGGER', message })

export const updateRepository = (repository: any, onResolved: any) => ({ type: 'REPOSITORY_UPDATE', repository, onResolved })
export const updateRepositorySucceeded = (repository: any) => ({ type: 'REPOSITORY_UPDATE_SUCCEEDED', repository })
export const updateRepositoryFailed = (message: any) => ({ type: 'REPOSITORY_UPDATE_FAILED', message })

export const deleteRepository = (id: any) => ({ type: 'REPOSITORY_DELETE', id })
export const deleteRepositorySucceeded = (id: any) => ({ type: 'REPOSITORY_DELETE_SUCCEEDED', id })
export const deleteRepositoryFailed = (message: any) => ({ type: 'REPOSITORY_DELETE_FAILED', message })

export const fetchRepository = ({ id, repository }: any) => ({ type: 'REPOSITORY_FETCH', id, repository })
export const fetchRepositorySucceeded = (repository: any) => ({ type: 'REPOSITORY_FETCH_SUCCEEDED', repository })
export const fetchRepositoryFailed = (message: any) => ({ type: 'REPOSITORY_FETCH_FAILED', message })

export const refreshRepository = () => ({ type: 'REPOSITORY_REFRESH' })
export const repositoryLocationChange = ({ id, repository }: any) => ({ type: 'REPOSITORY_LOCATION_CHANGE', id, repository })

export const clearRepository = () => ({ type: 'REPOSITORY_CLEAR' })

export const fetchRepositoryCount = () => ({ type: 'REPOSITORY_COUNT_FETCH' })
export const fetchRepositoryCountSucceeded = (count: any) => ({ type: 'REPOSITORY_COUNT_FETCH_SUCCEEDED', count })
export const fetchRepositoryCountFailed = (message: any) => ({ type: 'REPOSITORY_COUNT_FETCH_FAILED', message })

export const fetchRepositoryList = ({ user, organization, name, cursor, limit } = { user: '', organization: '', name: '', cursor: '', limit: '' }) => ({ type: 'REPOSITORY_LIST_FETCH', user, organization, name, cursor, limit })
export const fetchRepositoryListSucceeded = (repositories: any) => ({ type: 'REPOSITORY_LIST_FETCH_SUCCEEDED', repositories })
export const fetchRepositoryListFailed = (message: any) => ({ type: 'REPOSITORY_LIST_FETCH_FAILED', message })
export const fetchOwnedRepositoryList = (
  { user, name } = { user: '', name: '' }
) => ({ type: 'OWNED_REPOSITORY_LIST_FETCH', user, name })
export const fetchOwnedRepositoryListSucceeded = (repositories: any) => ({ type: 'OWNED_REPOSITORY_LIST_FETCH_SUCCEEDED', repositories })
export const fetchOwnedRepositoryListFailed = (message: any) => ({ type: 'OWNED_REPOSITORY_LIST_FETCH_FAILED', message })

export const fetchJoinedRepositoryList = (
  { user, name } = { user: '', name: '' }
) => ({ type: 'JOINED_REPOSITORY_LIST_FETCH', user, name })
export const fetchJoinedRepositoryListSucceeded = (repositories: any) => ({ type: 'JOINED_REPOSITORY_LIST_FETCH_SUCCEEDED', repositories })
export const fetchJoinedRepositoryListFailed = (message: any) => ({ type: 'JOINED_REPOSITORY_LIST_FETCH_FAILED', message })

export const fetchDefaultVals = (id: number) => ({ type: 'DEFAULT_VALS_FETCH', payload: { id } })
export const fetchDefaultValsSucceeded = (data: IDefaultVal[]) => ({ type: 'DEFAULT_VALS_SUCCEEDED', payload: { data } })
export const fetchDefaultValsFailed = (payload: { message: string }) => ({ type: 'DEFAULT_VALS_FAILED', payload })

export type IFetchDefaultValsAction = ReturnType<typeof fetchDefaultVals>

export const updateDefaultVals = (id: number, data: IDefaultVal[]) => ({ type: 'UPDATE_DEFAULT_VALS_FETCH', payload: { id, data } })
export const updateDefaultValsSucceeded = () => ({ type: 'UPDATE_DEFAULT_VALS_SUCCEEDED' })
export const updateDefaultValsFailed = (payload: { message: string }) => ({ type: 'UPDATE_DEFAULT_VALS_FAILED', payload })

export type IUpdateDefaultValsAction = ReturnType<typeof updateDefaultVals>
