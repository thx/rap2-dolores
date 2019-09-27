import { RouterState } from 'connected-react-router'

export interface RootState {
  auth: any
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

export interface User {
  id: number
  fullname: string
  email: string
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
export interface Repository {
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
}

export interface Module {
  id: number

  name: string

  description?: string

  repositoryid?: number

  creatorId?: number

  priority: number

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

  status?: number
}
