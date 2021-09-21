import FitTrackeeGenericApi from '../fitTrackeeApi'
import FitTrackeeApi from '../fitTrackeeApi/auth'
import { history } from '../index'
import { generateIds } from '../utils'
import { getOrUpdateData, setError, updateLanguage } from './index'
import { getAppData } from './application'

const AuthError = message => ({ type: 'AUTH_ERROR', message })

const AuthErrors = messages => ({ type: 'AUTH_ERRORS', messages })

const PictureError = message => ({ type: 'PICTURE_ERROR', message })

const ProfileSuccess = profil => ({ type: 'PROFILE_SUCCESS', profil })

const ProfileError = message => ({ type: 'PROFILE_ERROR', message })

const ProfileUpdateError = message => ({
  type: 'PROFILE_UPDATE_ERROR',
  message,
})

export const logout = () => ({ type: 'LOGOUT' })

export const loadProfile = () => dispatch => {
  if (window.localStorage.getItem('authToken')) {
    return dispatch(getProfile())
  }
  return { type: 'LOGOUT' }
}

export const getProfile = () => dispatch =>
  FitTrackeeGenericApi.getData('auth/profile')
    .then(ret => {
      if (ret.status === 'success') {
        dispatch(getOrUpdateData('getData', 'sports'))
        ret.data.isAuthenticated = true
        if (ret.data.language) {
          dispatch(updateLanguage(ret.data.language))
        }
        return dispatch(ProfileSuccess(ret.data))
      }
      return dispatch(ProfileError(ret.message))
    })
    .catch(error => {
      throw error
    })

export const loginOrRegisterOrPasswordReset = (target, formData) => dispatch =>
  FitTrackeeApi.loginOrRegisterOrPasswordReset(target, formData)
    .then(ret => {
      if (ret.status === 'success') {
        if (target === 'password/reset-request') {
          return history.push({
            pathname: '/password-reset/sent',
          })
        }
        if (target === 'password/update') {
          return history.push({
            pathname: '/updated-password',
          })
        }
        if (target === 'login' || target === 'register') {
          window.localStorage.setItem('authToken', ret.auth_token)
          if (target === 'register') {
            dispatch(getAppData('config'))
          }
          return dispatch(getProfile())
        }
      }
      return dispatch(AuthError(ret.message))
    })
    .catch(error => {
      throw error
    })

const RegisterFormControl = (formData, onlyPasswords = false) => {
  const errMsg = []
  if (
    !onlyPasswords &&
    (formData.username.length < 3 || formData.username.length > 12)
  ) {
    errMsg.push('3 to 12 characters required for username.')
  }
  if (formData.password !== formData.password_conf) {
    errMsg.push("Password and password confirmation don't match.")
  }
  if (formData.password.length < 8) {
    errMsg.push('8 characters required for password.')
  }
  return errMsg
}

export const handleUserFormSubmit = (formData, formType) => dispatch => {
  if (formType === 'register' || formType === 'password/update') {
    const ret = RegisterFormControl(formData, formType === 'password/update')
    if (ret.length > 0) {
      return dispatch(AuthErrors(generateIds(ret)))
    }
  }
  return dispatch(loginOrRegisterOrPasswordReset(formType, formData))
}

export const handleProfileFormSubmit = formData => dispatch => {
  if (!formData.password === formData.password_conf) {
    return dispatch(
      ProfileUpdateError("Password and password confirmation don't match.")
    )
  }
  delete formData.id
  return FitTrackeeGenericApi.postData('auth/profile/edit', formData)
    .then(ret => {
      if (ret.status === 'success') {
        dispatch(getProfile())
        return history.push('/profile')
      }
      dispatch(ProfileUpdateError(ret.message))
    })
    .catch(error => {
      throw error
    })
}

export const uploadPicture = event => dispatch => {
  event.preventDefault()
  const form = new FormData()
  form.append('file', event.target.picture.files[0])
  event.target.reset()
  return FitTrackeeGenericApi.addDataWithFile('auth/picture', form)
    .then(ret => {
      if (ret.status === 'success') {
        return dispatch(getProfile())
      }
      const msg =
        ret.status === 413
          ? 'Error during picture update, file size exceeds max size.'
          : ret.message
      return dispatch(PictureError(msg))
    })
    .catch(error => {
      throw error
    })
}

export const deletePicture = () => dispatch =>
  FitTrackeeApi.deletePicture()
    .then(ret => {
      if (ret.status === 204) {
        return dispatch(getProfile())
      }
      return dispatch(PictureError(ret.message))
    })
    .catch(error => {
      throw error
    })

export const deleteUser =
  (username, isAdmin = false) =>
  dispatch =>
    FitTrackeeGenericApi.deleteData('users', username)
      .then(ret => {
        if (ret.status === 204) {
          dispatch(getAppData('config'))
          if (isAdmin) {
            history.push('/admin/users')
          } else {
            dispatch(logout())
            history.push('/')
          }
        } else {
          ret.json().then(r => dispatch(setError(`${r.message}`)))
        }
      })
      .catch(error => dispatch(setError(`user|${error}`)))
