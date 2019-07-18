const config = require('../../config').default
export const serve = config.serve
export const CREDENTIALS: any = { credentials: 'include' }
export const HEADERS = {
  JSON: { 'Content-Type': 'application/json' },
}
