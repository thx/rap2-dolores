import { CREDENTIALS, serve } from './constant'

export default {
  // 获取平台计数信息
  fetchCounter () {
    return fetch(`${serve}/app/counter`, { ...CREDENTIALS })
      .then(res => res.json())
      .then(json => json.data)
  },
  fetchRepositoriesCreated () {
    return fetch(`${serve}/app/analytics/repositories/created`, { ...CREDENTIALS })
      .then(res => res.json())
      .then(json => json.data)
  },
  fetchRepositoriesUpdated () {
    return fetch(`${serve}/app/analytics/repositories/updated`, { ...CREDENTIALS })
      .then(res => res.json())
      .then(json => json.data)
  },
  fetchUsersActivation () {
    return fetch(`${serve}/app/analytics/users/activation`, { ...CREDENTIALS })
      .then(res => res.json())
      .then(json => json.data)
  },
  fetchRepositoriesActivation () {
    return fetch(`${serve}/app/analytics/repositories/activation`, { ...CREDENTIALS })
      .then(res => res.json())
      .then(json => json.data)
  }
}
