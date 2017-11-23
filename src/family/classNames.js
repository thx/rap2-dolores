// 实现来自 https://github.com/JedWatson/classnames/blob/master/index.js
// 用法参见 https://github.com/JedWatson/classnames#usage
function classNames () {
  let classes = []
  for (let i = 0; i < arguments.length; i++) {
    let arg = arguments[i]
    if (!arg) continue

    let type = typeof arg
    if (type === 'string' || type === 'number') {
      classes.push(arg)
    } else if (Array.isArray(arg)) {
      classes.push(classNames.apply(null, arg))
    } else if (type === 'object') {
      for (let key in arg) {
        if (arg.hasOwnProperty(key) && arg[key]) {
          classes.push(key)
        }
      }
    }
  }
  return classes.join(' ')
}

export default classNames
