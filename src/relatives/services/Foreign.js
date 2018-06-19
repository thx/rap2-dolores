import { CREDENTIALS, serve } from './constant'

export default {
  getInterfaces ({id, itf}) {
    let roomProjectId
    let hostname
    let interfaces = []
    let caseMap = {}
    let roomCases = new Set()
    return fetch(`${serve}/foreign/room?repositoryId=${id}`,
      { ...CREDENTIALS }
    )
      .then(res => res.json())
      .then(json => {
        if (json.error) {
          throw new Error('接口请求失败: ' + json.error)
        }
        roomProjectId = json.data.roomProjectId
        interfaces = json.data.interfaces
        hostname = json.data.hostname
        if (itf) {
          interfaces = interfaces.filter(({id}) => id === +itf)
        }
        return requestRoom('module/moduledetail?projectId=' + roomProjectId)
      })
      .then(roomCaseBatches => {
        roomCaseBatches.reduce(
          (prev, curr) => prev.concat(curr.cases), []
        ).filter(item => !!item).forEach(theCase => {
          let anchor = document.createElement('a')
          anchor.href = theCase.path
          let { pathname } = anchor
          if (!caseMap[pathname]) {
            caseMap[pathname] = []
          }

          caseMap[pathname].push(theCase.caseId)
          roomCases.add(caseMap[pathname])
        })

        let arr = interfaces.map(function (item) {
          let {url} = item
          let newItem = {url}
          newItem.id = item.id
          newItem.cases = item.url in caseMap ? caseMap[item.url] : []
          return newItem
        })

        return {
          list: arr,
          coverage: arr.length && arr.reduce((prev, curr) => prev + (!!curr.cases.length), 0) / arr.length,
          hostname,
          roomProjectId,
          repositoryId: id,
          interfaceId: itf
        }
      })
  },
  addForeignRoomCase ({id, itf, name}) {
    let module
    let cases = []
    return fetch(`${serve}/foreign/room/params?repositoryId=${id}&interfaceId=${itf}&name=${encodeURIComponent(name)}`)
      .then(res => res.json())
      .then(json => {
        if (json.error) {
          throw new Error('接口请求失败: ' + json.error)
        }
        module = json.data.module
        cases = json.data.cases
        return requestRoom('module', module, 'post')
      })
      .then(moduleId => {
        cases.forEach(theCase => {
          theCase.moduleId = moduleId
        })
        return Promise.all(cases.map(theCase => requestRoom('case', theCase, 'post')))
      })
  }
}

async function requestRoom (path, body, method = 'get') {
  if (typeof body === 'object' && method === 'get') {
    path = path + '?' + formatKV(body)
    body = null
  }
  if (path[0] !== '/') {
    path = '/' + path
  }

  const resp = await fetch('http://room.daily.taobao.net/api' + path, {
    method: method,
    body: body && formatKV(body),
    headers: new window.Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  })
  const { status } = resp

  if (status !== 200) {
    throw new Error(`Request Failed for ${path}\nStatus Code: ${status}`)
  }

  const json = await resp.json()

  if (!json || !json.info || !json.info.ok) {
    throw new Error('Error from room remote: ' + json.info.message)
  }

  return (json && json.data && json.data.result) || json.info.message

  function formatKV (obj) {
    let str = ''
    for (let key of Object.keys(obj)) {
      str && (str += '&')
      str += key + '=' + encodeURIComponent(obj[key])
    }
    return str
  }
}
