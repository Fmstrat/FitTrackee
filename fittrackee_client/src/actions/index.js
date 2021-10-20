import i18next from 'i18next'

import FitTrackeeApi from '../fitTrackeeApi/index'
import { history } from '../index'

export const emptyMessages = () => ({
  type: 'CLEAN_ALL_MESSAGES',
})

export const setData = (target, data) => ({
  type: 'SET_DATA',
  data,
  target,
})

export const setPaginatedData = (target, data, pagination) => ({
  type: 'SET_PAGINATED_DATA',
  data,
  pagination,
  target,
})

export const setError = message => ({
  type: 'SET_ERROR',
  message,
})

export const setLanguage = language => ({
  type: 'SET_LANGUAGE',
  language,
})

export const setLoading = loading => ({
  type: 'SET_LOADING',
  loading,
})

export const updateSportsData = data => ({
  type: 'UPDATE_SPORT_DATA',
  data,
})

export const updateUsersData = data => ({
  type: 'UPDATE_USER_DATA',
  data,
})

export const setGpx = gpxContent => ({
  type: 'SET_GPX',
  gpxContent,
})

export const getOrUpdateData =
  (action, target, data, canDispatch = true) =>
  dispatch => {
    dispatch(setLoading(true))
    if (data && data.id && target !== 'workouts' && isNaN(data.id)) {
      dispatch(setLoading(false))
      return dispatch(setError(`${target}|Incorrect id`))
    }
    dispatch(emptyMessages())
    // console.log('a')
    // console.log(action)
    // console.log(target)
    // console.log(data)
    return FitTrackeeApi[action](target, data)
      .then(ret => {
        if (ret.status === 'success') {
          if (canDispatch) {
            if (target === 'users' && action === 'getData') {
              return dispatch(
                setPaginatedData(target, ret.data, ret.pagination)
              )
            }
            if (target === 'workouts') {
              return { target: target, data: ret.data }
            }
            dispatch(setData(target, ret.data))
          } else if (action === 'updateData' && target === 'sports') {
            dispatch(updateSportsData(ret.data.sports[0]))
          } else if (action === 'updateData' && target === 'users') {
            dispatch(updateUsersData(ret.data.users[0]))
          }
        } else {
          dispatch(setError(`${target}|${ret.message || ret.status}`))
        }
        dispatch(setLoading(false))
      })
      .then(async w => {
        if (w) {
          // for (let i = 0; i < w.data.workouts.length; i++) {
          //   if (w.data.workouts[i].with_gpx) {
          //     await new Promise((resolve, reject) => {
          //       FitTrackeeApi.getData(`workouts/${w.data.workouts[i].id}/gpx`)
          //         .then(ret => {
          //           if (ret.status === 'success') {
          //             w.data.workouts[i].gpx = ret.data.gpx
          //           } else {
          //             dispatch(setError(`workouts|${ret.message}`))
          //             reject()
          //           }
          //           resolve()
          //         })
          //         .catch(error => dispatch(setError(`workouts|${error}`)))
          //     })
          //   }
          // }
          let awaits = []
          // console.log('a')
          for (let i = 0; i < w.data.workouts.length; i++) {
            if (w.data.workouts[i].with_gpx) {
              awaits.push(
                FitTrackeeApi.getData(`workouts/${w.data.workouts[i].id}/gpx`)
                  .then(ret => {
                    // console.log(`b ${i}`)
                    if (ret.status === 'success') {
                      w.data.workouts[i].gpx = ret.data.gpx
                    } else {
                      dispatch(setError(`workouts|${ret.message}`))
                    }
                  })
                  .catch(error => dispatch(setError(`workouts|${error}`)))
              )
            }
          }
          // console.log('c')
          await Promise.all(awaits)
          // console.log('d')
          // console.log(w.data)
          dispatch(setData(w.target, w.data))
          dispatch(setLoading(false))
        }
      })
      .catch(error => {
        dispatch(setLoading(false))
        dispatch(setError(`${target}|${error}`))
      })
  }

export const addData = (target, data) => dispatch =>
  FitTrackeeApi.addData(target, data)
    .then(ret => {
      if (ret.status === 'created') {
        history.push(`/admin/${target}`)
      } else {
        dispatch(setError(`${target}|${ret.status}`))
      }
    })
    .catch(error => dispatch(setError(`${target}|${error}`)))

export const deleteData = (target, id) => dispatch => {
  if (isNaN(id)) {
    return dispatch(setError(target, `${target}|Incorrect id`))
  }
  return FitTrackeeApi.deleteData(target, id)
    .then(ret => {
      if (ret.status === 204) {
        history.push(`/admin/${target}`)
      } else {
        dispatch(setError(`${target}|${ret.message || ret.status}`))
      }
    })
    .catch(error => dispatch(setError(`${target}|${error}`)))
}

export const updateLanguage = language => dispatch => {
  i18next.changeLanguage(language).then(dispatch(setLanguage(language)))
}
