import * as PropertyAction from '../actions/property'
import * as PropertyEffects from './effects/property'
import * as InterfaceAction from '../actions/interface'
import * as InterfaceEffects from './effects/interface'
import * as ModuleAction from '../actions/module'
import * as ModuleEffects from './effects/module'
import * as RepositoryAction from '../actions/repository'
import * as RepositoryEffects from './effects/repository'

export default {
  reducers: {
    repository(state = {
      data: {},
      fetching: false
    }, action) {
      let modules, itfId, locker, properties, itf, mod
      switch (action.type) {
        case RepositoryAction.fetchRepository().type:
          return {
            data: { ...state.data
            },
            fetching: true
          }
        case RepositoryAction.fetchRepositorySucceeded().type:
          return {
            data: action.repository,
            fetching: false
          }
        case RepositoryAction.fetchRepositoryFailed().type:
        case RepositoryAction.clearRepository().type:
          return {
            data: {},
            fetching: false
          }
        case InterfaceAction.lockInterfaceSucceeded().type:
          modules = state.data.modules
          itfId = action.payload.itfId
          locker = action.payload.locker
          return {
            ...state,
            data: {
              ...state.data,
              modules: modules.map(mod => ({
                ...mod,
                interfaces: mod.interfaces.map(itf => {
                  if (itf.id !== itfId) return itf
                  return {
                    ...itf,
                    lockerId: locker.id,
                    locker,
                    updatedAt: new Date(),
                  }
                })
              }))
            }
          }
        case InterfaceAction.unlockInterfaceSucceeded().type:
          modules = state.data.modules
          itfId = action.payload.itfId
          return {
            ...state,
            data: {
              ...state.data,
              modules: modules.map(mod => ({
                ...mod,
                interfaces: mod.interfaces.map(itf => {
                  if (itf.id !== itfId) return itf
                  return {
                    ...itf,
                    lockerId: null,
                    locker: null,
                    updatedAt: new Date(),
                  }
                })
              }))
            }
          }
        case PropertyAction.updatePropertiesSucceeded().type:
          modules = state.data.modules
          itfId = action.payload.itfId
          properties = action.payload.properties
          return {
            ...state,
            data: {
              ...state.data,
              modules: modules.map(mod => ({
                ...mod,
                interfaces: mod.interfaces.map(itf => {
                  if (itf.id !== itfId) return itf
                  return {
                    ...itf,
                    properties,
                    updatedAt: new Date(),
                  }
                })
              }))
            }
          }
        case InterfaceAction.updateInterfaceSucceeded().type:
          modules = state.data.modules
          itf = action.payload.itf
          return {
            ...state,
            data: {
              ...state.data,
              modules: modules.map(mod => ({
                ...mod,
                interfaces: mod.interfaces.map(x => {
                  if (x.id !== itf.id) return x
                  return {
                    ...itf,
                    locker: x.locker,
                    properties: x.properties,
                  }
                })
              }))
            }
          }

        case InterfaceAction.deleteInterfaceSucceeded().type:
          modules = state.data.modules
          itfId = action.payload.id
          return {
            ...state,
            data: {
              ...state.data,
              modules: modules.map(mod => ({
                ...mod,
                interfaces: mod.interfaces.filter(x => x.id !== itfId),
              }))
            }
          }

        case InterfaceAction.addInterfaceSucceeded().type:
          modules = state.data.modules
          itf = action.payload.itf
          return {
            ...state,
            data: {
              ...state.data,
              modules: modules.map(mod => mod.id === itf.moduleId ? ({
                ...mod,
                interfaces: [...mod.interfaces, itf],
              }) : mod)
            }
          }
        case ModuleAction.updateModuleSucceeded().type:
          modules = state.data.modules
          mod = action.payload
          return {
            ...state,
            data: {
              ...state.data,
              modules: modules.map(x => x.id === mod.id ? ({
                ...x,
                name: mod.name,
                description: mod.description,
              }) : x)
            }
          }
        default:
          return state
      }
    },
    ownedRepositories(state = {
      data: [],
      pagination: {
        total: 0,
        cursor: 1,
        limit: 100
      },
      fetching: false
    }, action) {
      switch (action.type) {
        case RepositoryAction.fetchOwnedRepositoryList().type:
          return {
            data: [...state.data],
            pagination: { ...state.pagination
            },
            fetching: true
          }
        case RepositoryAction.fetchOwnedRepositoryListSucceeded().type:
          return {
            data: action.repositories.data,
            pagination: { ...state.pagination,
              ...action.repositories.pagination
            },
            fetching: false
          }
        case RepositoryAction.fetchOwnedRepositoryListFailed().type:
          return {
            data: [],
            pagination: { ...state.pagination
            },
            fetching: false
          }
        default:
          return state
      }
    },
    joinedRepositories(state = {
      data: [],
      pagination: {
        total: 0,
        cursor: 1,
        limit: 100
      },
      fetching: false
    }, action) {
      switch (action.type) {
        case RepositoryAction.fetchJoinedRepositoryList().type:
          return {
            data: [...state.data],
            pagination: { ...state.pagination
            },
            fetching: true
          }
        case RepositoryAction.fetchJoinedRepositoryListSucceeded().type:
          return {
            data: action.repositories.data,
            pagination: { ...state.pagination,
              ...action.repositories.pagination
            },
            fetching: false
          }
        case RepositoryAction.fetchJoinedRepositoryListFailed().type:
          return {
            data: [],
            pagination: { ...state.pagination
            },
            fetching: false
          }
        default:
          return state
      }
    },
    repositories(state = {
      data: [],
      pagination: {
        total: 0,
        limit: 10
      },
      fetching: false
    }, action) {
      switch (action.type) {
        case '...':
          return state
        case 'REPOSITORIES_ADD_SUCCEEDED':
          return {
            data: [...state.data, action.repository],
            pagination: state.pagination,
            fetching: state.fetching
          }
        case 'REPOSITORY_COUNT_FETCH_SUCCEEDED':
          return {
            data: [...state.data],
            pagination: { ...state.pagination,
              total: action.count
            },
            fetching: state.fetching
          }
        case RepositoryAction.fetchRepositoryList().type:
          return {
            data: [...state.data],
            pagination: { ...state.pagination
            },
            fetching: true
          }
        case RepositoryAction.fetchRepositoryListSucceeded().type:
          return {
            data: action.repositories.data,
            pagination: action.repositories.pagination,
            fetching: false
          }
        case RepositoryAction.fetchRepositoryListFailed().type:
          return {
            data: [],
            pagination: { ...state.pagination
            },
            fetching: false
          }
        default:
          return state
      }
    },
    interfaces(state = {
      data: [],
      pagination: {
        total: 0,
        limit: 10
      }
    }, action) {
      switch (action.type) {
        case 'INTERFACE_COUNT_FETCH_SUCCEEDED':
          return {
            data: [...state.data],
            pagination: { ...state.pagination,
              total: action.count
            }
          }
        default:
          return state
      }
    },
    dashboard(state = {
      my: [],
      joined: []
    }, action) {
      switch (action.type) {
        case '...':
          return state
        case 'MY_REPOSITORY_LIST_FETCH_SUCCEEDED':
          return {
            my: action.repositories,
            joined: state.joined
          }
        case 'JOINED_REPOSITORY_LIST_FETCH_SUCCEEDED':
          return {
            my: state.my,
            joined: action.repositories
          }
        default:
          return state
      }
    }
  },
  sagas: {
    [RepositoryAction.addRepository().type]: RepositoryEffects.addRepository,
    [RepositoryAction.deleteRepository().type]: RepositoryEffects.deleteRepository,
    [RepositoryAction.updateRepository().type]: RepositoryEffects.updateRepository,

    [RepositoryAction.fetchRepository().type]: RepositoryEffects.fetchRepository,
    [RepositoryAction.fetchRepositoryCount().type]: RepositoryEffects.fetchRepositoryCount,
    [RepositoryAction.fetchRepositoryList().type]: RepositoryEffects.fetchRepositoryList,

    [RepositoryAction.importRepository().type]: RepositoryEffects.importRepository,

    [RepositoryAction.fetchOwnedRepositoryList().type]: RepositoryEffects.fetchOwnedRepositoryList,
    [RepositoryAction.fetchJoinedRepositoryList().type]: RepositoryEffects.fetchJoinedRepositoryList,

    [InterfaceAction.fetchInterfaceCount().type]: InterfaceEffects.fetchInterfaceCount,
    [InterfaceAction.sortInterfaceList().type]: InterfaceEffects.sortInterfaceList,
    [ModuleAction.sortModuleList().type]: ModuleEffects.sortModuleList,
    [PropertyAction.sortPropertyList().type]: PropertyEffects.sortPropertyList
  },
  listeners: {
    '/repository': [RepositoryAction.fetchOwnedRepositoryList, RepositoryAction.fetchJoinedRepositoryList],
    '/repository/joined': [RepositoryAction.fetchOwnedRepositoryList, RepositoryAction.fetchJoinedRepositoryList],
    '/repository/all': [RepositoryAction.fetchRepositoryList],
    '/repository/tester': [RepositoryAction.fetchRepository],
    '/repository/checker': [RepositoryAction.fetchRepository],
    '/organization/repository': [RepositoryAction.fetchRepositoryList],
    '/organization/repository/editor': [RepositoryAction.fetchRepository]
  }
}