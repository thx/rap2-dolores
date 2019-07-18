// 实现来自 https://github.com/JedWatson/classnames/blob/master/index.js
// 用法参见 https://github.com/JedWatson/classnames#usage
function classNames() {
  const classes: string[] = []
  // tslint:disable-next-line: prefer-for-of
  for (let i = 0; i < arguments.length; i++) {
    const arg = arguments[i]
    if (!arg) { continue }

    const type = typeof arg
    if (type === 'string' || type === 'number') {
      classes.push(arg)
    } else if (Array.isArray(arg)) {
      classes.push(classNames.apply(null, arg as any))
    } else if (type === 'object') {
      for (const key in arg) {
        if (arg.hasOwnProperty(key) && arg[key]) {
          classes.push(key)
        }
      }
    }
  }
  return classes.join(' ')
}

export default classNames
