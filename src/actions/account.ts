// 登陆
export const login = (user: any, onResolved: any) => ({ type: 'USER_LOGIN', user, onResolved })
export const loginSucceeded = (user: any) => ({ type: 'USER_LOGIN_SUCCEEDED', user })
export const loginFailed = (message: any) => ({ type: 'USER_LOGIN_FAILED', message })

// 登出
export const logout = () => ({ type: 'USER_LOGOUT' })
export const logoutSucceeded = () => { return ({ type: 'USER_LOGOUT_SUCCEEDED' }) }
export const logoutFailed = () => ({ type: 'USER_LOGOUT_FAILED' })

// 获取登陆信息
export const fetchLoginInfo = () => ({ type: 'USER_FETCH_LOGIN_INFO' })
export const fetchLoginInfoSucceeded = (user: any) => ({ type: 'USER_FETCH_LOGIN_INFO_SUCCEEDED', user })
export const fetchLoginInfoFailed = (message: any) => ({ type: 'USER_FETCH_LOGIN_INFO_FAILED', message })

// 注册
export const addUser = (user: any, onResolved: any) => ({ type: 'USER_ADD', user, onResolved })
export const addUserSucceeded = (user: any) => ({ type: 'USER_ADD_SUCCEEDED', user })
export const addUserFailed = (message: any) => ({ type: 'USER_ADD_FAILED', message })

// 删除用户
export const deleteUser = (id: any) => ({ type: 'USER_DELETE', id })
export const deleteUserSucceeded = (id: any) => ({ type: 'USER_DELETE_SUCCEEDED', id })
export const deleteUserFailed = (id: any) => ({ type: 'USER_DELETE_FAILED', id })

// 获取用户列表
export const fetchUserCount = () => ({ type: 'USER_COUNT_FETCH' })
export const fetchUserCountSucceeded = (count: any) => ({ type: 'USER_COUNT_FETCH_SUCCEEDED', count })
export const fetchUserCountFailed = (message: any) => ({ type: 'USER_COUNT_FETCH_FAILED', message })
export const fetchUserList = ({ cursor, limit } = { cursor: '', limit: ''}) => ({ type: 'USER_LIST_FETCH', cursor, limit })
export const fetchUserListSucceeded = (users: any) => ({ type: 'USER_LIST_FETCH_SUCCEEDED', users })
export const fetchUserListFailed = (message: any) => ({ type: 'USER_LIST_FETCH_FAILED', message })

// 获取用户设置
export const fetchSetting = () => ({ type: 'SETTING_FETCH' })
export const fetchSettingSucceeded = (setting: any) => ({ type: 'SETTING_FETCH_SUCCEEDED', setting })
export const fetchSettingFailed = (message: any) => ({ type: 'SETTING_FETCH_FAILED', message })

// 修改用户设置
export const updateSetting = (setting: any) => ({ type: 'SETTING_UPDATE', setting })
export const updateSettingSucceeded = (setting: any) => ({ type: 'SETTING_UPDATE', setting })
export const updateSettingFailed = (message: any) => ({ type: 'SETTING_UPDATE', message })

// 获取用户通知
export const fetchNotificationList = () => ({ type: 'NOTIFICATION_LIST_FETCH' })
export const fetchNotificationListSucceeded = () => ({ type: 'NOTIFICATION_LIST_FETCH_SUCCEEDED' })
export const fetchNotificationListFailed = () => ({ type: 'NOTIFICATION_LIST_FETCH_Failed' })

// 阅读用户通知
export const readNotification = (id: any) => ({ type: 'NOTIFICATION_READ', id })
export const readNotificationSucceeded = (id: any) => ({ type: 'NOTIFICATION_READ_SUCCEEDED', id })
export const readNotificationFailed = (message: any) => ({ type: 'NOTIFICATION_READ_FAILED', message })

// 获取用户日志
export const fetchLogList = (
  { cursor, limit } = { cursor: '', limit: '' }
) => ({ type: 'LOG_LIST_FETCH', cursor, limit })
export const fetchLogListSucceeded = (logs: any) => ({ type: 'LOG_LIST_FETCH_SUCCEEDED', logs })
export const fetchLogListFailed = (message: any) => ({ type: 'LOG_LIST_FETCH_FAILED', message })
