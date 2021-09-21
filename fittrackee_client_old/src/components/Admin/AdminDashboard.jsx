import React from 'react'
import { Link } from 'react-router-dom'

import AdminStats from './AdminStats'

export default function AdminDashboard(props) {
  const { appConfig, t } = props
  return (
    <div className="card workout-card">
      <div className="card-header">
        <strong>{t('administration:Administration')}</strong>
      </div>
      <div className="card-body">
        <AdminStats />
        <br />
        <dl className="admin-items">
          <dt>
            <Link
              to={{
                pathname: '/admin/application',
              }}
            >
              {t('administration:Application')}
            </Link>
          </dt>
          <dd>
            {t(
              'administration:Update application configuration ' +
                '(maximum number of registered users, maximum files size).'
            )}
            <br />
            <strong>
              {t(
                `administration:Registration is currently ${
                  appConfig.is_registration_enabled ? 'enabled' : 'disabled'
                }.`
              )}
            </strong>
          </dd>
          <br />
          <dt>
            <Link
              to={{
                pathname: '/admin/sports',
              }}
            >
              {t('administration:Sports')}
            </Link>
          </dt>
          <dd>{t('administration:Enable/disable sports.')}</dd>
          <br />
          <dt>
            <Link
              to={{
                pathname: '/admin/users',
              }}
            >
              {t('administration:Users')}
            </Link>
          </dt>
          <dd>
            {t(
              'administration:Add/remove admin rights, ' +
                'delete user account.'
            )}
          </dd>
        </dl>
      </div>
    </div>
  )
}
