import { CREDENTIALS, serve } from './constant'

// 仓库
export default {
  fetchRepositoryCount ({ organization, cursor = 1, limit = 10 } = {}) {
    return fetch(`${serve}/repository/count?organization=${organization || ''}`, { ...CREDENTIALS })
      .then(res => res.json())
      .then(json => json.data)
  },
  fetchRepositoryList ({ user = '', organization = '', name = '', cursor = 1, limit = 100 } = {}) {
    return fetch(`${serve}/repository/list?user=${user}&organization=${organization}&name=${name}&cursor=${cursor}&limit=${limit}`, { ...CREDENTIALS })
      .then(res => res.json())
      // .then(json => json.data)
  },
  fetchOwnedRepositoryList ({ user = '', name = '' } = {}) {
    return fetch(`${serve}/repository/owned?user=${user}&name=${name}`, { ...CREDENTIALS })
      .then(res => res.json())
      // .then(json => json.data)
  },
  fetchJoinedRepositoryList ({ user = '', name = '' } = {}) {
    return fetch(`${serve}/repository/joined?user=${user}&name=${name}`, { ...CREDENTIALS })
      .then(res => res.json())
      // .then(json => json.data)
  },
  fetchRepository (id) {
    return fetch(`${serve}/repository/get?id=${id}`, { ...CREDENTIALS })
      .then(res => res.json())
      .then(json => json.data)
  },
  addRepository (repository) {
    return fetch(`${serve}/repository/create`, {
      ...CREDENTIALS,
      method: 'POST',
      body: JSON.stringify(repository),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(json => json.data)
  },
  updateRepository (repository) {
    return fetch(`${serve}/repository/update`, {
      ...CREDENTIALS,
      method: 'POST',
      body: JSON.stringify(repository),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(json => json.data)
  },
  importRepository (data) {
    return fetch(`${serve}/repository/import`, {
      ...CREDENTIALS,
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
  },
  deleteRepository (id) {
    return fetch(`${serve}/repository/remove?id=${id}`, { ...CREDENTIALS })
      .then(res => res.json())
      .then(json => json.data)
  }
}
