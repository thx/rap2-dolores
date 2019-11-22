const arrayToTree = (list: any) => {
  const parseChildren = (list: any, parent: any) => {
    list.forEach((item: any) => {
      if (item.parentId === parent.id) {
        item.depth = parent.depth + 1
        item.children = item.children || []
        parent.children.push(item)
        parseChildren(list, item)
      }
    })
    return parent
  }
  return parseChildren(list, {
    id: -1,
    name: 'root',
    children: [],
    depth: -1,
  })
}
const treeToArray = (tree: any) => {
  const parseChildren = (parent: any, result: any) => {
    if (!parent.children) { return result }
    parent.children.forEach((item: any) => {
      result.push(item)
      parseChildren(item, result)
      delete item.children
    })
    return result
  }
  return parseChildren(tree, [])
}
const treeToJson = (tree: any) => {
  const parse = (item: any, result: any) => {
    const rule = item.rule ? ('|' + item.rule) : ''
    let value = item.value
    if (typeof value === 'string' && (value[0] === '[' || value.indexOf('function(') === 0)) {
      value = tryToCalculateValue(value)
    }
    switch (item.type) {
      case 'String':
        result[item.name + rule] = value
        break
      case 'Number': // √ BUG Number 如果没有输入初始值，会导致值变成字符串，所以需要对每种类型做特殊的初始值处理
        if (value === '') { value = 1 } // 如果未填初始值，则默认为 1
        const parsed = parseFloat(value) // 尝试解析初始值，如果失败，则填什么是什么（字符串）
        if (!isNaN(parsed)) { value = parsed }
        result[item.name + rule] = value
        break
      case 'Boolean': // √ 处理字符串 'true|false'，以及没有输入值的情况
        if (value === 'true') { value = true }
        if (value === 'false') { value = false }
        if (value === '0') { value = false }
        value = !!value
        result[item.name + rule] = value
        break
      case 'Function':
      case 'RegExp':
        try {
          // eslint-disable-next-line
          result[item.name + rule] = eval('(' + item.value + ')') // eslint-disable-line no-eval
        } catch (e) {
          console.warn(`{ ${item.name}: ${item.value} } => ${e.message}`) // TODO 2.2 初始值异常，应该直接提示到页面上。
          result[item.name + rule] = item.value
        }
        break
      case 'Object':
        if (item.value) {
          try {
            // eslint-disable-next-line
            result[item.name + rule] = eval(`(${item.value})`) // eslint-disable-line no-eval
          } catch (e) {
            result[item.name + rule] = item.value
          }
        } else {
          result[item.name + rule] = {}
          item.children.forEach((child: any) => {
            parse(child, result[item.name + rule])
          })
        }
        break
      case 'Array':
        if (item.value) {
          try {
            // eslint-disable-next-line
            result[item.name + rule] = eval(`(${item.value})`) // eslint-disable-line no-eval
          } catch (e) {
            result[item.name + rule] = item.value
          }
        } else {
          result[item.name + rule] = item.children.length ? [{}] : []
          item.children.forEach((child: any) => {
            parse(child, result[item.name + rule][0])
          })
        }
        break
      case 'Null':
          result[item.name + rule] = null
          break
      default:
        result[item.name + rule] = item.value
    }
  }

  function tryToCalculateValue(val: any) {
    try {
      // eslint-disable-next-line
      const v = eval('({ "val" :' + val + '})')
      return v.val
    } catch (ex) {
      console.error(ex)
      return val
    }
  }
  const result = {}
  tree.children.forEach((child: any) => {
    parse(child, result)
  })
  return result
}

export default {
  arrayToTree,
  treeToArray,
  treeToJson: (tree: any) => {
    try {
      return treeToJson(tree)
    } catch (e) {
      return e.message
    }
  },
  sort: (list: any) => {
    return treeToArray(arrayToTree(list))
  },
}
