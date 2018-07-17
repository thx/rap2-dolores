export function getRelativeUrl (url) {
  if (url instanceof RegExp) {
    return url
  }
  if (!url) {
    return ''
  }
  if (url.indexOf('http://') > -1) {
    url = url.substring(url.indexOf('/', 7) + 1)
  } else if (url.indexOf('https://') > -1) {
    url = url.substring(url.indexOf('/', 8) + 1)
  }
  if (url.charAt(0) !== '/') {
    url = '/' + url
  }
  return url
}
