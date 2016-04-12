import update from 'react-addons-update'

import Auth0Manager from '../../common/user/Auth0Manager'
import UserPermissions from '../../common/user/UserPermissions'

const user = (state = {
  auth0: new Auth0Manager(DT_CONFIG.auth0),
  isCheckingLogin: true,
  token: null,
  profile: null,
  permissions: null
}, action) => {
  switch (action.type) {
    case 'CHECKING_EXISTING_LOGIN':
      return update(state, { isCheckingLogin: { $set: true }})
    case 'NO_EXISTING_LOGIN':
      return update(state, { isCheckingLogin: { $set: false }})
    case 'USER_LOGGED_IN':
      return update(state, {
        isCheckingLogin: { $set: false },
        token: { $set: action.token },
        profile: { $set: action.profile },
        permissions: { $set: new UserPermissions(action.profile.app_metadata.datatools)}
      })
    case 'USER_LOGGED_OUT':
      console.log('USER_LOGGED_OUT');
      return update(state, {
        isCheckingLogin: { $set: false },
        token: { $set: null },
        profile: { $set: null },
        permissions: { $set: null}
      })
    case 'CREATED_PUBLIC_USER':
      return update(state, { profile: { $set: action.profile }})
    default:
      return state
  }
}

export default user