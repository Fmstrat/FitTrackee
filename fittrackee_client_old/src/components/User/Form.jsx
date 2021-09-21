import React from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

import { history } from '../../index'

export default function Form(props) {
  const { t } = useTranslation()
  const pageTitle = `user:${props.formType
    .charAt(0)
    .toUpperCase()}${props.formType.slice(1)}`
  return (
    <div>
      <Helmet>
        <title>FitTrackee - {t(`user:${props.formType}`)}</title>
      </Helmet>
      <h1 className="page-title">{t(pageTitle)}</h1>
      <div className="container">
        <div className="row">
          <div className="col-md-3" />
          <div className="col-md-6">
            <br />
            {props.formType === 'register' && !props.isRegistrationAllowed ? (
              <div className="card">
                <div className="card-body">Registration is disabled.</div>
                <div className="card-body">
                  <button
                    type="submit"
                    className="btn btn-secondary btn-lg btn-block"
                    onClick={() => history.go(-1)}
                  >
                    Back
                  </button>
                </div>
              </div>
            ) : (
              <>
                <form
                  onSubmit={event =>
                    props.handleUserFormSubmit(event, props.formType)
                  }
                >
                  {props.formType === 'register' && (
                    <div className="form-group">
                      <input
                        className="form-control input-lg"
                        name="username"
                        placeholder={t('user:Enter a username')}
                        required
                        type="text"
                        value={props.userForm.username}
                        onChange={props.onHandleFormChange}
                      />
                    </div>
                  )}
                  {props.formType !== 'password reset' && (
                    <div className="form-group">
                      <input
                        className="form-control input-lg"
                        name="email"
                        placeholder={t('user:Enter an email address')}
                        required
                        type="email"
                        value={props.userForm.email}
                        onChange={props.onHandleFormChange}
                      />
                    </div>
                  )}
                  {props.formType !== 'reset your password' && (
                    <>
                      <div className="form-group">
                        <input
                          className="form-control input-lg"
                          name="password"
                          placeholder={t('user:Enter a password')}
                          required
                          type="password"
                          value={props.userForm.password}
                          onChange={props.onHandleFormChange}
                        />
                      </div>
                      {props.formType !== 'login' && (
                        <div className="form-group">
                          <input
                            className="form-control input-lg"
                            name="password_conf"
                            placeholder={t(
                              'user:Enter the password confirmation'
                            )}
                            required
                            type="password"
                            value={props.userForm.password_conf}
                            onChange={props.onHandleFormChange}
                          />
                        </div>
                      )}
                    </>
                  )}
                  <input
                    type="submit"
                    className="btn btn-primary btn-lg btn-block"
                    value={t('Submit')}
                  />
                </form>
                <p className="password-forget">
                  {props.formType === 'login' && (
                    <Link
                      to={{
                        pathname: '/password-reset/request',
                      }}
                    >
                      {t('user:Forgot password?')}
                    </Link>
                  )}
                </p>
              </>
            )}
          </div>
          <div className="col-md-3" />
        </div>
      </div>
    </div>
  )
}
