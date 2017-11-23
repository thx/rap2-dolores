import { CREDENTIALS, serve } from './constant'

// 团队
export default {
  fetchOrganizationCount () {
    return fetch(`${serve}/organization/count`, { ...CREDENTIALS })
      .then(res => res.json())
      .then(json => json.data)
  },
  fetchOrganizationList ({ name = '', cursor = 1, limit = 100 } = {}) {
    return fetch(`${serve}/organization/list?name=${name}&cursor=${cursor}&limit=${limit}`, { ...CREDENTIALS })
      .then(res => res.json())
      // .then(json => json.data)
  },
  fetchOwnedOrganizationList ({ name = '' } = {}) {
    return fetch(`${serve}/organization/owned?name=${name}`, { ...CREDENTIALS })
      .then(res => res.json())
      // .then(json => json.data)
  },
  fetchJoinedOrganizationList ({ name = '' } = {}) {
    return fetch(`${serve}/organization/joined?name=${name}`, { ...CREDENTIALS })
      .then(res => res.json())
      // .then(json => json.data)
  },
  fetchOrganization (id) {
    return fetch(`${serve}/organization/get?id=${id}`, { ...CREDENTIALS })
      .then(res => res.json())
      .then(json => json.data)
  },
  addOrganization (organization) {
    return fetch(`${serve}/organization/create`, {
      ...CREDENTIALS,
      method: 'POST',
      body: JSON.stringify(organization),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(json => json.data)
  },
  updateOrganization (organization) {
    return fetch(`${serve}/organization/update`, {
      ...CREDENTIALS,
      method: 'POST',
      body: JSON.stringify(organization),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(json => json.data)
  },
  deleteOrganization (id) {
    return fetch(`${serve}/organization/remove?id=${id}`, { ...CREDENTIALS })
      .then(res => res.json())
      .then(json => json.data)
  }
}
