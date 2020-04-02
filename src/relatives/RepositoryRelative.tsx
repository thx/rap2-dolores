import * as PropertyAction from '../actions/property'
import * as PropertyEffects from './effects/property'
import * as InterfaceAction from '../actions/interface'
import * as InterfaceEffects from './effects/interface'
import * as ModuleAction from '../actions/module'
import * as ModuleEffects from './effects/module'
import * as RepositoryAction from '../actions/repository'
import * as RepositoryEffects from './effects/repository'
import _ from 'lodash'
export default {
  reducers: {
    repository(
      state: any = {
        data: {
          modules: [],
        },
        fetching: false,
      },
      action: any
    ) {
      let modules, itfId: any, locker: any, properties: any, itf: any, mod: any
      switch (action.type) {
        case RepositoryAction.fetchRepository({
          id: undefined,
          repository: undefined,
        }).type:
          return {
            data: {
              ...state.data,
            },
            fetching: true,
          }
        case RepositoryAction.fetchRepositorySucceeded({}).type:
          return {
            data: action.repository,
            fetching: false,
          }
        case RepositoryAction.fetchRepositoryFailed('').type:
        case RepositoryAction.clearRepository().type:
          return {
            data: {},
            fetching: false,
          }
        case InterfaceAction.lockInterfaceSucceeded(undefined, undefined).type:
          modules = state.data.modules
          itfId = action.payload.itfId
          locker = action.payload.locker
          return {
            ...state,
            data: {
              ...state.data,
              modules: modules.map((mod: any) => ({
                ...mod,
                interfaces: mod.interfaces.map((itf: any) => {
                  if (itf.id !== itfId) {
                    return itf
                  }
                  return {
                    ...itf,
                    lockerId: locker.id,
                    locker,
                    updatedAt: new Date(),
                  }
                }),
              })),
            },
          }
        case 'INTERFACE_FETCH_SUCCEEDED': {
          modules = state.data.modules
          const fetchedItf = _.omit(action.payload, ['requestProperties', 'responseProperties'])
          return {
            ...state,
            data: {
              ...state.data,
              modules: modules.map((mod: any) => ({
                ...mod,
                interfaces: mod.interfaces.map((itf: any) => {
                  if (itf.id !== fetchedItf.id) {
                    return itf
                  }
                  return {
                    ...itf,
                    ...fetchedItf,
                  }
                }),
              })),
            },
          }
        }
        case InterfaceAction.unlockInterfaceSucceeded(undefined).type:
          modules = state.data.modules
          itfId = action.payload.itfId
          return {
            ...state,
            data: {
              ...state.data,
              modules: modules.map((mod: any) => ({
                ...mod,
                interfaces: mod.interfaces.map((itf: any) => {
                  if (itf.id !== itfId) {
                    return itf
                  }
                  return {
                    ...itf,
                    lockerId: null,
                    locker: null,
                    updatedAt: new Date(),
                  }
                }),
              })),
            },
          }
        case PropertyAction.updatePropertiesSucceeded(undefined).type:
          modules = state.data.modules
          itfId = action.payload.itfId
          properties = action.payload.properties
          return {
            ...state,
            data: {
              ...state.data,
              modules: modules.map((mod: any) => ({
                ...mod,
                interfaces: mod.interfaces.map((itf: any) => {
                  if (itf.id !== itfId) {
                    return itf
                  }
                  return {
                    ...itf,
                    properties,
                    updatedAt: new Date(),
                  }
                }),
              })),
            },
          }
        case InterfaceAction.updateInterfaceSucceeded(undefined).type:
          modules = state.data.modules
          itf = action.payload.itf
          return {
            ...state,
            data: {
              ...state.data,
              modules: modules.map((mod: any) => ({
                ...mod,
                interfaces: mod.interfaces.map((x: any) => {
                  if (x.id !== itf.id) {
                    return x
                  }
                  return {
                    ...itf,
                    locker: x.locker,
                    properties: x.properties,
                  }
                }),
              })),
            },
          }
        case InterfaceAction.deleteInterfaceSucceeded(undefined).type:
          modules = state.data.modules
          itfId = action.payload.id
          return {
            ...state,
            data: {
              ...state.data,
              modules: modules.map((mod: any) => ({
                ...mod,
                interfaces: mod.interfaces.filter((x: any) => x.id !== itfId),
              })),
            },
          }
        case InterfaceAction.addInterfaceSucceeded(undefined).type:
          modules = state.data.modules
          itf = action.payload.itf
          return {
            ...state,
            data: {
              ...state.data,
              modules: modules.map((mod: any) =>
                mod.id === itf.moduleId
                  ? {
                      ...mod,
                      interfaces: [...mod.interfaces, itf],
                    }
                  : mod,
              ),
            },
          }
        case ModuleAction.updateModuleSucceeded(undefined).type:
          modules = state.data.modules
          mod = action.payload
          return {
            ...state,
            data: {
              ...state.data,
              modules: modules.map((x: any) =>
                x.id === mod.id
                  ? {
                      ...x,
                      name: mod.name,
                      description: mod.description,
                    }
                  : x,
              ),
            },
          }
        case 'INTERFACE_LIST_SORT_SUCCEEDED': {
          const modules = state.data.modules
          const iftIds = action.ids
          const itfIdsMap: any = {}
          iftIds.forEach((id: number, index: number) => {
            itfIdsMap[id] = index
          })
          const moduleId = action.moduleId
          return {
            ...state,
            data: {
              ...state.data,
              modules: modules.map((mod: any) =>
                mod.id === moduleId
                  ? {
                      ...mod,
                      interfaces: [...mod.interfaces].sort(
                        (a: any, b: any) => itfIdsMap[a.id] - itfIdsMap[b.id],
                      ),
                    }
                  : mod,
              ),
            },
          }
        }
        case 'MODULE_LIST_SORT_SUCCEEDED': {
          const modules = state.data.modules
          const moduleIds = action.ids
          const moduleIdsMap: any = {}
          moduleIds.forEach((id: number, index: number) => {
            moduleIdsMap[id] = index
          })
          return {
            ...state,
            data: {
              ...state.data,
              modules: [...modules].sort(
                (a: any, b: any) => moduleIdsMap[a.id] - moduleIdsMap[b.id],
              ),
            },
          }
        }
        default:
          return state
      }
    },
    ownedRepositories(
      state: any = {
        data: [],
        pagination: {
          total: 0,
          cursor: 1,
          limit: 100,
        },
        fetching: false,
      },
      action: any
    ) {
      switch (action.type) {
        case RepositoryAction.fetchOwnedRepositoryList().type:
          return {
            data: [...state.data],
            pagination: {
              ...state.pagination,
            },
            fetching: true,
          }
        case RepositoryAction.fetchOwnedRepositoryListSucceeded(undefined).type:
          return {
            data: action.repositories.data,
            pagination: {
              ...state.pagination,
              ...action.repositories.pagination,
            },
            fetching: false,
          }
        case RepositoryAction.fetchOwnedRepositoryListFailed(undefined).type:
          return {
            data: [],
            pagination: {
              ...state.pagination,
            },
            fetching: false,
          }
        default:
          return state
      }
    },
    joinedRepositories(
      state: any = {
        data: [],
        pagination: {
          total: 0,
          cursor: 1,
          limit: 100,
        },
        fetching: false,
      },
      action: any
    ) {
      switch (action.type) {
        case RepositoryAction.fetchJoinedRepositoryList().type:
          return {
            data: [...state.data],
            pagination: {
              ...state.pagination,
            },
            fetching: true,
          }
        case RepositoryAction.fetchJoinedRepositoryListSucceeded(undefined)
          .type:
          return {
            data: action.repositories.data,
            pagination: {
              ...state.pagination,
              ...action.repositories.pagination,
            },
            fetching: false,
          }
        case RepositoryAction.fetchJoinedRepositoryListFailed(undefined).type:
          return {
            data: [],
            pagination: {
              ...state.pagination,
            },
            fetching: false,
          }
        default:
          return state
      }
    },
    repositories(
      state: any = {
        data: [],
        pagination: {
          total: 0,
          limit: 10,
        },
        fetching: false,
      },
      action: any
    ) {
      switch (action.type) {
        case '...':
          return state
        case 'REPOSITORIES_ADD_SUCCEEDED':
          return {
            data: [...state.data, action.repository],
            pagination: state.pagination,
            fetching: state.fetching,
          }
        case 'REPOSITORY_COUNT_FETCH_SUCCEEDED':
          return {
            data: [...state.data],
            pagination: {
              ...state.pagination,
              total: action.count,
            },
            fetching: state.fetching,
          }
        case RepositoryAction.fetchRepositoryList().type:
          return {
            data: [...state.data],
            pagination: {
              ...state.pagination,
            },
            fetching: true,
          }
        case RepositoryAction.fetchRepositoryListSucceeded(undefined).type:
          return {
            data: action.repositories.data,
            pagination: action.repositories.pagination,
            fetching: false,
          }
        case RepositoryAction.fetchRepositoryListFailed(undefined).type:
          return {
            data: [],
            pagination: {
              ...state.pagination,
            },
            fetching: false,
          }
        default:
          return state
      }
    },
    interfaces(
      state: any = {
        data: [],
        pagination: {
          total: 0,
          limit: 10,
        },
      },
      action: any
    ) {
      switch (action.type) {
        case 'INTERFACE_COUNT_FETCH_SUCCEEDED':
          return {
            data: [...state.data],
            pagination: {
              ...state.pagination,
              total: action.count,
            },
          }
        default:
          return state
      }
    },
    dashboard(
      state: any = {
        my: [],
        joined: [],
      },
      action: any
    ) {
      switch (action.type) {
        case '...':
          return state
        case 'MY_REPOSITORY_LIST_FETCH_SUCCEEDED':
          return {
            my: action.repositories,
            joined: state.joined,
          }
        case 'JOINED_REPOSITORY_LIST_FETCH_SUCCEEDED':
          return {
            my: state.my,
            joined: action.repositories,
          }
        default:
          return state
      }
    },
    defaultVals(state: any = [], action: any) {
      switch (action.type) {
        case 'DEFAULT_VALS_SUCCEEDED':
          return action.payload.data
      }
      return state
    },
  },
  sagas: {
    [RepositoryAction.addRepository(undefined, undefined).type]:
      RepositoryEffects.addRepository,
    [RepositoryAction.deleteRepository(undefined).type]:
      RepositoryEffects.deleteRepository,
    [RepositoryAction.updateRepository(undefined, undefined).type]:
      RepositoryEffects.updateRepository,
    [RepositoryAction.fetchRepository({ id: undefined, repository: undefined })
      .type]: RepositoryEffects.fetchRepository,
    REPOSITORY_LOCATION_CHANGE:
      RepositoryEffects.handleRepositoryLocationChange,
    REPOSITORY_REFRESH:
      RepositoryEffects.refreshRepository,
    [RepositoryAction.fetchRepositoryCount().type]:
      RepositoryEffects.fetchRepositoryCount,
    [RepositoryAction.fetchRepositoryList().type]:
      RepositoryEffects.fetchRepositoryList,
    [RepositoryAction.importRepository(undefined, undefined).type]:
      RepositoryEffects.importRepository,
    [RepositoryAction.importSwaggerRepository(undefined, undefined).type]:
      RepositoryEffects.importSwaggerRepository,
    [RepositoryAction.fetchOwnedRepositoryList().type]:
      RepositoryEffects.fetchOwnedRepositoryList,
    [RepositoryAction.fetchJoinedRepositoryList().type]:
      RepositoryEffects.fetchJoinedRepositoryList,
    [RepositoryAction.fetchDefaultVals(0).type]:
      RepositoryEffects.fetchDefaultVals,
    [RepositoryAction.updateDefaultVals(0, []).type]:
      RepositoryEffects.updateDefaultVals,
    [ModuleAction.sortModuleList(undefined, undefined).type]:
      ModuleEffects.sortModuleList,
    [InterfaceAction.fetchInterfaceCount().type]:
      InterfaceEffects.fetchInterfaceCount,
    INTERFACE_LIST_SORT:
      InterfaceEffects.sortInterfaceList,
    [PropertyAction.sortPropertyList(undefined, undefined).type]:
      PropertyEffects.sortPropertyList,
  },
  listeners: {
    '/repository': [
      RepositoryAction.fetchOwnedRepositoryList,
      RepositoryAction.fetchJoinedRepositoryList,
    ],
    '/repository/joined': [
      RepositoryAction.fetchOwnedRepositoryList,
      RepositoryAction.fetchJoinedRepositoryList,
    ],
    '/repository/editor': [
      // REPOSITORY_LOCATION_CHANGE 判断了如果是当前 repo 的模块或接口切换就不重新获取
      // 如果 repo 的 id 发生变化再进行 repo 的重新拉取
      RepositoryAction.repositoryLocationChange,
    ],
    '/organization/repository/editor': [
      // REPOSITORY_LOCATION_CHANGE 判断了如果是当前 repo 的模块或接口切换就不重新获取
      // 如果 repo 的 id 发生变化再进行 repo 的重新拉取
      RepositoryAction.repositoryLocationChange,
    ],
    '/repository/all': [RepositoryAction.fetchRepositoryList],
    '/repository/tester': [RepositoryAction.fetchRepository],
    '/repository/checker': [RepositoryAction.fetchRepository],
    '/organization/repository': [RepositoryAction.fetchRepositoryList],
  },
}
