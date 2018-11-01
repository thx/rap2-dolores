// 登陆
export const login = (user, onResolved) => ({ type: 'USER_LOGIN', user, onResolved })
export const loginSucceeded = (user) => ({ type: 'USER_LOGIN_SUCCEEDED', user })
export const loginFailed = (message) => ({ type: 'USER_LOGIN_FAILED', message })

// 重置
export const reset = (email, password, onResolved) => ({ type: 'USER_RESET', email, password, onResolved })
export const resetSucceeded = () => ({ type: 'USER_RESET_SUCCEEDED' })
export const resetFailed = (message) => ({ type: 'USER_RESET_FAILED', message })

// 登出
export const logout = () => ({ type: 'USER_LOGOUT' })
export const logoutSucceeded = () => ({ type: 'USER_LOGOUT_SUCCEEDED' })
export const logoutFailed = () => ({ type: 'USER_LOGOUT_FAILED' })

// 获取登陆信息
export const fetchLoginInfo = () => ({ type: 'USER_FETCH_LOGIN_INFO' })
export const fetchLoginInfoSucceeded = (user) => ({ type: 'USER_FETCH_LOGIN_INFO_SUCCEEDED', user })
export const fetchLoginInfoFailed = (message) => ({ type: 'USER_FETCH_LOGIN_INFO_FAILED', message })

// 注册
export const addUser = (user, onResolved) => ({ type: 'USER_ADD', user, onResolved })
export const addUserSucceeded = (user) => ({ type: 'USER_ADD_SUCCEEDED', user })
export const addUserFailed = (message) => ({ type: 'USER_ADD_FAILED', message })

// 更新
export const updateUser = (user, onResolved) => ({ type: 'USER_UPDATE', user, onResolved })
export const updateUserSucceeded = (user) => ({ type: 'USER_UPDATE_SUCCEEDED', user })
export const updateUserFailed = (message) => ({ type: 'USER_UPDATE_FAILED', message })

// 删除用户
export const deleteUser = (id) => ({ type: 'USER_DELETE', id })
export const deleteUserSucceeded = (id) => ({ type: 'USER_DELETE_SUCCEEDED', id })
export const deleteUserFailed = (id) => ({ type: 'USER_DELETE_FAILED', id })

// 获取用户列表
export const fetchUserCount = () => ({ type: 'USER_COUNT_FETCH' })
export const fetchUserCountSucceeded = (count) => ({ type: 'USER_COUNT_FETCH_SUCCEEDED', count })
export const fetchUserCountFailed = (message) => ({ type: 'USER_COUNT_FETCH_FAILED', message })
export const fetchUserList = ({ cursor, limit } = {}) => ({ type: 'USER_LIST_FETCH', cursor, limit })
export const fetchUserListSucceeded = (users) => ({ type: 'USER_LIST_FETCH_SUCCEEDED', users })
export const fetchUserListFailed = (message) => ({ type: 'USER_LIST_FETCH_FAILED', message })

// 获取用户设置
export const fetchSetting = () => ({ type: 'SETTING_FETCH' })
export const fetchSettingSucceeded = (setting) => ({ type: 'SETTING_FETCH_SUCCEEDED', setting })
export const fetchSettingFailed = (message) => ({ type: 'SETTING_FETCH_FAILED', message })

// 修改用户设置
export const updateSetting = (setting) => ({ type: 'SETTING_UPDATE', setting })
export const updateSettingSucceeded = (setting) => ({ type: 'SETTING_UPDATE', setting })
export const updateSettingFailed = (message) => ({ type: 'SETTING_UPDATE', message })

// 获取用户通知
export const fetchNotificationList = () => ({ type: 'NOTIFICATION_LIST_FETCH' })
export const fetchNotificationListSucceeded = () => ({ type: 'NOTIFICATION_LIST_FETCH_SUCCEEDED' })
export const fetchNotificationListFailed = () => ({ type: 'NOTIFICATION_LIST_FETCH_Failed' })

// 阅读用户通知
export const readNotification = (id) => ({ type: 'NOTIFICATION_READ', id })
export const readNotificationSucceeded = (id) => ({ type: 'NOTIFICATION_READ_SUCCEEDED', id })
export const readNotificationFailed = (message) => ({ type: 'NOTIFICATION_READ_FAILED', message })

// 获取用户日志
export const fetchLogList = ({ cursor, limit } = {}) => ({ type: 'LOG_LIST_FETCH', cursor, limit })
export const fetchLogListSucceeded = (logs) => ({ type: 'LOG_LIST_FETCH_SUCCEEDED', logs })
export const fetchLogListFailed = (message) => ({ type: 'LOG_LIST_FETCH_FAILED', message })
