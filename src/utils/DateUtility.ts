import moment, { Moment } from 'moment'

const formatDate = (d: Date | string | Moment) => `${moment(d).format('YYYY-MM-DD')}`
const formatTime = (d: Date | string | Moment) => `${moment(d).format('HH:mm')}`
const formatDateTime = (d: Date | string | Moment) => `${formatDate(d)} ${formatTime(d)}`

/** 时间转分钟，例如 2:30 -》 150分钟 */
export const parseTimeToMinutes = (str?: string) => {
  const strArr = str?.split(':')
  if (strArr?.length === 1) {
    return parseInt(strArr[0], 10) * 60
  } else if (strArr?.length === 2) {
    const [m, s] = strArr
    return parseInt(m, 10) * 60 + parseInt(s, 10)
  } else {
    return 0
  }
}

/** 分钟转时间，例如 150分钟 -》 2小时30分钟 */
export const parseMinutesToTime = (minutes?: number) => {
  if (!minutes) {
    return '-'
  }
  return `${Math.floor(minutes / 60)}小时${minutes % 60}分钟`
}

export default {
  formatDate, formatTime, formatDateTime,
}
