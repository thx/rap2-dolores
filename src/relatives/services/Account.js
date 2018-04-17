import { CREDENTIALS, serve, HEADERS } from './constant'

export default {
  // 获取登陆信息
  fetchLoginInfo () {
    return fetch(`${serve}/account/info`, { ...CREDENTIALS })
      .then(res => res.json())
      .then(json => json.data)
  },

  // 注册用户
  addUser (user) {
    return fetch(`${serve}/account/register`, {
      ...CREDENTIALS,
      method: 'POST',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(json => json.data)
  },
  // 修改密码
  updateUser (user) {
    return fetch(`${serve}/account/update`, {
      ...CREDENTIALS,
      method: 'POST',
      body: JSON.stringify(user),
      headers: HEADERS.JSON
    })
      .then(res => res.json())
      .then(json => json.data)
  },
  // 用户登陆
  login ({ email, password, captcha }) {
    return fetch(`${serve}/account/login`, {
      ...CREDENTIALS,
      method: 'POST',
      body: JSON.stringify({ email, password, captcha }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(json => json.data)
  },
  // 用户退出
  logout () {
    return fetch(`${serve}/account/logout`, { ...CREDENTIALS })
      .then(res => res.json())
      .then(json => json.data)
  },
  // 获取用户总数
  fetchUserCount () {
    return fetch(`${serve}/account/count`)
      .then(res => res.json())
      .then(json => json.data)
  },
  // 获取用户列表
  fetchUserList ({ name = '', cursor = 1, limit = 100 } = {}) {
    return fetch(`${serve}/account/list?name=${name}&cursor=${cursor}&limit=${limit}`)
      .then(res => res.json())
      // .then(json => json.data)
  },
  // 根据 id 删除指定用户
  deleteUser (id) {
    return fetch(`${serve}/account/remove?id=${id}`)
      .then(res => res.json())
      .then(json => json.data)
  },
  // 获取用户列表
  fetchLogList ({ cursor = 1, limit = 100 } = {}) {
    return fetch(`${serve}/account/logger?cursor=${cursor}&limit=${limit}`, { ...CREDENTIALS })
      .then(res => res.json())
      // .then(json => json.data)
  }
}
