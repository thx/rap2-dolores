import { CREDENTIALS, serve, HEADERS } from './constant'

export default {
  // 获取登陆信息
  fetchLoginInfo() {
    return fetch(`${serve}/account/info`, {
      ...CREDENTIALS,
    })
      .then(res => res.json())
      .then(json => json.data)
  },

  // 注册用户
  addUser(user: any) {
    return fetch(`${serve}/account/register`, {
      ...CREDENTIALS,
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(json => json.data)
  },
  // 重置用户
  resetUser(email: string, password: string) {
    return fetch(`${serve}/account/reset`, {
      ...CREDENTIALS,
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(json => json.data)
  },
  // 修改密码
  updateUser(user: any) {
    return fetch(`${serve}/account/update`, {
      ...CREDENTIALS,
      method: 'POST',
      body: JSON.stringify(user),
      headers: HEADERS.JSON,
    })
      .then(res => res.json())
      .then(json => json.data)
  },
  // 用户登陆
  login({
    email,
    password,
    captcha,
  }: {
    email: string;
    password: string;
    captcha: string;
  }) {
    return fetch(`${serve}/account/login`, {
      ...CREDENTIALS,
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        captcha,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(json => json.data)
  },
  // 用户退出
  logout() {
    return fetch(`${serve}/account/logout`, {
      ...CREDENTIALS,
    })
      .then(res => res.json())
      .then(json => json.data)
  },
  // 获取用户总数
  fetchUserCount() {
    return fetch(`${serve}/account/count`, { ...CREDENTIALS })
      .then(res => res.json())
      .then(json => json.data)
  },
  // 获取用户列表
  fetchUserList({
    name = '',
    cursor = 1,
    limit = 100,
  }: { name?: string; cursor?: number; limit?: number } = {}) {
    return fetch(
      `${serve}/account/list?name=${name}&cursor=${cursor}&limit=${limit}`,
      {
        ...CREDENTIALS,
      }
    ).then(res => res.json())
    // .then(json => json.data)
  },
  // 根据 id 删除指定用户
  deleteUser(id: number) {
    return fetch(`${serve}/account/remove?id=${id}`, {
      ...CREDENTIALS,
    })
      .then(res => res.json())
      .then(json => json.data)
  },
  // 获取用户列表
  fetchLogList({ cursor = 1, limit = 100 }: { cursor: number; limit: number }) {
    return fetch(`${serve}/account/logger?cursor=${cursor}&limit=${limit}`, {
      ...CREDENTIALS,
    }).then(res => res.json())
    // .then(json => json.data)
  },
  // 发送重置密码激活邮件
  findpwd({
    email,
    captcha,
  }: {
    email: string;
    captcha: string;
  }) {
    return fetch(`${serve}/account/findpwd`, {
      ...CREDENTIALS,
      method: 'POST',
      body: JSON.stringify({
        email,
        captcha,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(json => json.data)
  },
  // 通过邮件链接重置密码
  resetpwd({
    email,
    code,
    token,
    password,
    captcha,
  }: {
    email: string;
    code: string;
    token: string;
    password: string;
    captcha: string;
  }) {
    return fetch(`${serve}/account/findpwd/reset`, {
      ...CREDENTIALS,
      method: `POST`,
      body: JSON.stringify({
        code,
        email,
        captcha,
        token,
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(json => json.data)
  },
}
