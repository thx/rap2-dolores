import { RouterState } from 'connected-react-router'
import { THEME_TEMPLATE_KEY } from 'components/account/ThemeChangeOverlay'
import { POS_TYPE } from 'components/editor/InterfaceSummary'

export interface RootState {
  auth: {
    id: number
    empId: string
    fullname: string
    email: string
  }
  router: RouterState
  repository: any
  repositories: any
  organization: any
  organizations: any
  ownedRepositories: any
  ownedOrganizations: any
  joinedOrganizations: any
  joinedRepositories: any
  users: any

  counter: any
  logs: any
  loading: boolean
  message: IMessage

  userSettings: { [key: string]: string }
  userSettingsIsUpdating: boolean

  themeId: THEME_TEMPLATE_KEY
}

export interface Organization {
  id: number

  name: string

  description?: string

  logo?: string

  /** true: 公开, false: 私有 */
  visibility?: boolean

  creatorId?: number

  ownerId?: number

  memberIds?: number[]

  members?: User[]

  owner?: User

  newOwner?: User
}

export interface ImportSwagger {
  version: number
  docUrl: string
  orgId?: number
  mode: string
  repositoryId?: number
  swagger?: string
  modId?: number
}
export interface User {
  id: number
  fullname: string
  email: string
  empId: string
}

export interface INumItem {
  value: number
  label: string
}

export interface IConfig {
  serve: string
  keys: string[]
  session: {
    key: string
  }
}

export interface RepositoryFormData {
  id: number

  name: string

  description?: string

  logo?: string

  /** true: 公开, false: 私有 */
  visibility?: boolean

  creatorId?: number

  ownerId?: number

  organizationId?: number

  memberIds?: number[]

  members?: User[]

  owner?: User

  newOwner?: User

  collaborators?: Repository[]

  collaboratorIds?: string[]

  collaboratorIdstring?: string

  token?: string

  modules?: Module[]
}

export interface Repository {
  id: number

  name: string

  description: string

  logo: string

  /** true: 公开, false: 私有 */
  visibility: boolean

  creatorId: number

  ownerId: number

  organizationId: number

  organization: Organization

  memberIds: number[]

  members: User[]

  token: string

  owner: User

  collaborators: Repository[]

  modules: Module[]

  collaboratorIds: string[]

  canUserEdit?: boolean
}

export interface Module {
  id: number

  name: string

  description?: string

  repositoryid?: number

  creatorId?: number

  priority: number

  interfaces?: Interface[]

  repository?: Repository

  repositoryId?: number
}

export interface Interface {
  id: number

  name: string

  url: string

  method: string

  description?: string

  moduleId?: number

  creatorId?: number

  lockerid?: number

  locker?: User

  repositoryId?: number

  repository?: Repository

  properties?: Property[]

  status?: number
}

export type Async<T> = {
  data: T
  fetching: boolean
}
export interface Property {
  id: number | string
  name: string
  description: string
  parentId: number | string
  interfaceId: number
  moduleId: number
  repositoryId: number
  scope: 'request' | 'response'
  value: string
  memory: boolean
  pos: POS_TYPE
}
