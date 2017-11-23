// 获取平台计数信息
export const fetchCounter = () => ({ type: 'ANALYTICS_COUNTER_FETCH' })
export const fetchCounterSucceeded = (counter) => ({ type: 'ANALYTICS_COUNTER_FETCH_SUCCEEDED', counter })
export const fetchCounterFailed = (message) => ({ type: 'ANALYTICS_COUNTER_FETCH_FAILED', message })

export const fetchAnalyticsRepositoriesCreated = ({ start, end } = {}) => ({ type: 'ANALYTICS_REPOSITORIES_CREATED', start, end })
export const fetchAnalyticsRepositoriesCreatedSucceeded = (analytics) => ({ type: 'ANALYTICS_REPOSITORIES_CREATED_SUCCEEDED', analytics })
export const fetchAnalyticsRepositoriesCreatedFailed = (message) => ({ type: 'ANALYTICS_REPOSITORIES_CREATED_FAILED', message })

export const fetchAnalyticsRepositoriesUpdated = ({ start, end } = {}) => ({ type: 'ANALYTICS_REPOSITORIES_UPDATED', start, end })
export const fetchAnalyticsRepositoriesUpdatedSucceeded = (analytics) => ({ type: 'ANALYTICS_REPOSITORIES_UPDATED_SUCCEEDED', analytics })
export const fetchAnalyticsRepositoriesUpdatedFailed = (message) => ({ type: 'ANALYTICS_REPOSITORIES_UPDATED_FAILED', message })

export const fetchAnalyticsUsersActivation = ({ start, end } = {}) => ({ type: 'ANALYTICS_USERS_ACTIVATION', start, end })
export const fetchAnalyticsUsersActivationSucceeded = (analytics) => ({ type: 'ANALYTICS_USERS_ACTIVATION_SUCCEEDED', analytics })
export const fetchAnalyticsUsersActivationFailed = (message) => ({ type: 'ANALYTICS_USERS_ACTIVATION_FAILED', message })

export const fetchAnalyticsRepositoriesActivation = ({ start, end } = {}) => ({ type: 'ANALYTICS_REPOSITORIES_ACTIVATION', start, end })
export const fetchAnalyticsRepositoriesActivationSucceeded = (analytics) => ({ type: 'ANALYTICS_REPOSITORIES_ACTIVATION_SUCCEEDED', analytics })
export const fetchAnalyticsRepositoriesActivationFailed = (message) => ({ type: 'ANALYTICS_REPOSITORIES_ACTIVATION_FAILED', message })
