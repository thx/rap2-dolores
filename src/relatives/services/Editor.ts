import { CREDENTIALS, serve } from './constant'

export default {
  get({ project, module, page, property }: any) {
    return fetch(
      `${serve}/workspace/get?project=${project}&module=${module}&page=${page}&action={action}&property=${property}`,
      { ...CREDENTIALS },
    )
      .then(res => res.json())
      .then(json => json.data)
  },
  // 模块 Module
  fetchModuleList({ repositoryId = '', name = '' }: any = {}) {
    return fetch(`${serve}/module/list?repositoryId=${repositoryId}&name=${name}`, {
      ...CREDENTIALS,
    })
      .then(res => res.json())
      .then(json => json.data)
  },
  fetchModule(id: any) {
    return fetch(`${serve}/module/get?id=${id}`, { ...CREDENTIALS })
      .then(res => res.json())
      .then(json => json.data)
  },
  addModule(module: any) {
    return fetch(`${serve}/module/create`, {
      ...CREDENTIALS,
      method: 'POST',
      body: JSON.stringify(module),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(json => json.data)
  },
  updateModule(module: any) {
    return fetch(`${serve}/module/update`, {
      ...CREDENTIALS,
      method: 'POST',
      body: JSON.stringify(module),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(json => json.data)
  },
  moveModule(params: any) {
    return fetch(`${serve}/module/move`, {
      ...CREDENTIALS,
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(json => json.data)
  },
  deleteModule(id: any) {
    return fetch(`${serve}/module/remove?id=${id}`, { ...CREDENTIALS })
      .then(res => res.json())
      .then(json => json.data)
  },
  sortModuleList(ids: any) {
    return fetch(`${serve}/module/sort`, {
      ...CREDENTIALS,
      method: 'POST',
      body: JSON.stringify({ ids }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(json => json.data)
  },
  // 页面 Page
  fetchPageList({ module, cursor = 1, limit = 10 }: any) {
    return fetch(`${serve}/page/list?module=${module}&cursor=${cursor}&limit=${limit}`, {
      ...CREDENTIALS,
    })
      .then(res => res.json())
      .then(json => json.data)
  },
  fetchPage(id: any) {
    return fetch(`${serve}/page/get?id=${id}`, { ...CREDENTIALS })
      .then(res => res.json())
      .then(json => json.data)
  },
  addPage(page: any) {
    return fetch(`${serve}/page/create`, {
      ...CREDENTIALS,
      method: 'POST',
      body: JSON.stringify(page),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(json => json.data)
  },
  updatePage(page: any) {
    return fetch(`${serve}/page/update`, {
      ...CREDENTIALS,
      method: 'POST',
      body: JSON.stringify(page),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(json => json.data)
  },
  deletePage(id: any) {
    return fetch(`${serve}/page/remove?id=${id}`, { ...CREDENTIALS })
      .then(res => res.json())
      .then(json => json.data)
  },
  // 接口 Interface
  fetchInterfaceList({ repositoryId = '', moduleId = '', name = '' }: any = {}) {
    return fetch(
      `${serve}/interface/list?repositoryId=${repositoryId}&moduleId=${moduleId}&name=${name}`,
      { ...CREDENTIALS },
    )
      .then(res => res.json())
      .then(json => json.data)
  },
  fetchInterface(id: any) {
    return fetch(`${serve}/interface/get?id=${id}`, { ...CREDENTIALS })
      .then(res => res.json())
      .then(json => json.data)
  },
  addInterface(itf: any) {
    return fetch(`${serve}/interface/create`, {
      ...CREDENTIALS,
      method: 'POST',
      body: JSON.stringify(itf),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(json => json.data)
  },
  updateInterface(itf: any) {
    return fetch(`${serve}/interface/update`, {
      ...CREDENTIALS,
      method: 'POST',
      body: JSON.stringify(itf),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(json => json.data)
  },
  moveInterface(params: any) {
    return fetch(`${serve}/interface/move`, {
      ...CREDENTIALS,
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(json => json.data)
  },

  fetchInterfaceCount() {
    return fetch(`${serve}/interface/count`, { ...CREDENTIALS })
      .then(res => res.json())
      .then(json => json.data)
  },
  lockInterface(id: any) {
    return fetch(`${serve}/interface/lock`, {
      ...CREDENTIALS,
      method: 'POST',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(json => json.data)
  },
  unlockInterface(id: any) {
    return fetch(`${serve}/interface/unlock`, {
      ...CREDENTIALS,
      method: 'POST',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(json => json.data)
  },
  deleteInterface(id: any) {
    return fetch(`${serve}/interface/remove?id=${id}`, { ...CREDENTIALS })
      .then(res => res.json())
      .then(json => json.data)
  },
  sortInterfaceList(ids: any) {
    return fetch(`${serve}/interface/sort`, {
      ...CREDENTIALS,
      method: 'POST',
      body: JSON.stringify({ ids }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(json => json.data)
  },
  // 属性 Property
  fetchPropertyList({ repositoryId = '', moduleId = '', interfaceId = '', name = '' }: any = {}) {
    return fetch(
      `${serve}/property/list?repositoryId=${repositoryId}&moduleId=${moduleId}&interfaceId=${interfaceId}&name=${name}`,
      { ...CREDENTIALS },
    )
      .then(res => res.json())
      .then(json => json.data)
  },
  fetchProperty(id: any) {
    return fetch(`${serve}/property/get?id=${id}`, { ...CREDENTIALS })
      .then(res => res.json())
      .then(json => json.data)
  },
  addProperty(property: any) {
    return fetch(`${serve}/property/create`, {
      ...CREDENTIALS,
      method: 'POST',
      body: JSON.stringify(property),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(json => json.data)
  },
  updateProperty(property: any) {
    return fetch(`${serve}/property/update`, {
      ...CREDENTIALS,
      method: 'POST',
      body: JSON.stringify([property]),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(json => json.data)
  },
  updateProperties(itf: any, properties: any, summary: any) {
    return fetch(`${serve}/properties/update?itf=${itf}`, {
      ...CREDENTIALS,
      method: 'POST',
      body: JSON.stringify({ properties, summary }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(json => json.data)
  },
  deleteProperty(id: any) {
    return fetch(`${serve}/property/remove?id=${id}`, { ...CREDENTIALS })
      .then(res => res.json())
      .then(json => json.data)
  },
  sortPropertyList(ids: any) {
    return fetch(`${serve}/property/sort`, {
      ...CREDENTIALS,
      method: 'POST',
      body: JSON.stringify({ ids }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(json => json.data)
  },
}
