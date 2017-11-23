const arrayToTree = (list) => {
  const parseChildren = (list, parent) => {
    list.forEach(item => {
      if (item.parentId === parent.id) {
        item.depth = parent.depth + 1
        item.children = item.children || []
        parent.children.push(item)
        parseChildren(list, item)
      }
    })
    return parent
  }
  return parseChildren(list, { id: -1, name: 'root', children: [], depth: -1 })
}
const treeToArray = (tree) => {
  const parseChildren = (parent, result) => {
    if (!parent.children) return result
    parent.children.forEach(item => {
      result.push(item)
      parseChildren(item, result)
      delete item.children
    })
    return result
  }
  return parseChildren(tree, [])
}
const treeToJson = (tree) => {
  const parse = (item, result) => {
    let rule = item.rule ? ('|' + item.rule) : ''
    let value = item.value
    switch (item.type) {
      case 'String':
        result[item.name + rule] = item.value
        break
      case 'Number': // √ BUG Number 如果没有输入初始值，会导致值变成字符串，所以需要对每种类型做特殊的初始值处理
        if (value === '') value = 1 // 如果未填初始值，则默认为 1
        let parsed = parseFloat(value) // 尝试解析初始值，如果失败，则填什么是什么（字符串）
        if (!isNaN(parsed)) value = parsed
        result[item.name + rule] = value
        break
      case 'Boolean': // √ 处理字符串 'true|false'，以及没有输入值的情况
        if (value === 'true') value = true
        if (value === 'false') value = false
        if (value === '0') value = false
        value = !!value
        result[item.name + rule] = value
        break
      case 'Function':
      case 'RegExp':
        try {
          result[item.name + rule] = eval('(' + item.value + ')') // eslint-disable-line no-eval
        } catch (e) {
          console.warn(`{ ${item.name}: ${item.value} } => ${e.message}`) // TODO 2.2 初始值异常，应该直接提示到页面上。
          result[item.name + rule] = item.value
        }
        break
      case 'Object':
        if (item.value) {
          try {
            result[item.name + rule] = eval(`(${item.value})`) // eslint-disable-line no-eval
          } catch (e) {
            result[item.name + rule] = item.value
          }
        } else {
          result[item.name + rule] = {}
          item.children.forEach(child => {
            parse(child, result[item.name + rule])
          })
        }
        break
      case 'Array':
        if (item.value) {
          try {
            result[item.name + rule] = eval(`(${item.value})`) // eslint-disable-line no-eval
          } catch (e) {
            result[item.name + rule] = item.value
          }
        } else {
          result[item.name + rule] = item.children.length ? [{}] : []
          item.children.forEach(child => {
            parse(child, result[item.name + rule][0])
          })
        }
        break
      default:
        result[item.name + rule] = item.value
    }
  }
  var result = {}
  tree.children.forEach(child => {
    parse(child, result)
  })
  return result
}

export default {
  arrayToTree,
  treeToArray,
  treeToJson: (tree) => {
    try {
      return treeToJson(tree)
    } catch (e) {
      return e.message
    }
  },
  sort: (list) => {
    return treeToArray(arrayToTree(list))
  }
}
