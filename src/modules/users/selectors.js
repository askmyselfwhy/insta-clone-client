
export const getUsers        = state => state.users.get('users')
export const getUsersLoading = state => state.users.get('getUsersLoading')
export const getUsersError   = state => state.users.get('getUsersError')

export const updateLoading   = state => state.users.get('updateLoading')

export const getCurrentUser  = state => state.users.get('currentUser')
export const getToken        = state => state.users.get('token')
export const isLogged        = state => state.users.get('token') && state.users.get('currentUser')