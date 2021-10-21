import React from 'react'
import { Link } from 'react-router-dom'
import { MapContainer } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet-fullscreen'

import Map from '../Workout/WorkoutDisplay/Map'
import { convert } from '../../utils/conversions'
import StaticMap from '../Common/StaticMap'
import { getDateWithTZ } from '../../utils'
import { formatWorkoutDate, getWorkoutGpxs } from '../../utils/workouts'

export default class WorkoutsList extends React.PureComponent {
  constructor(props, context) {
    super(props, context)
    this.state = {
      zoom: 13,
    }
  }

  render() {
    const { loading, sports, t, user, workouts, mapAttribution } = this.props
    const mapData = getWorkoutGpxs(workouts)
    return (
      <div className="card  workout-card">
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th scope="col" />
                <th scope="col">{t('common:Workout')}</th>
                <th scope="col">{t('workouts:Date')}</th>
                <th scope="col">{t('workouts:Distance')}</th>
                <th scope="col">{t('workouts:Duration')}</th>
                <th scope="col">{t('workouts:Ave. speed')}</th>
                <th scope="col">{t('workouts:Max. speed')}</th>
              </tr>
            </thead>
            <tbody>
              {!loading &&
                sports &&
                workouts.map((workout, idx) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <tr key={idx}>
                    <td>
                      <span className="heading-span-absolute">
                        {t('common:Sport')}
                      </span>
                      <img
                        className="workout-sport"
                        src={sports
                          .filter(s => s.id === workout.sport_id)
                          .map(s => s.img)}
                        alt="workout sport logo"
                      />
                    </td>
                    <td className="workout-title">
                      <span className="heading-span-absolute">
                        {t('common:Workout')}
                      </span>
                      <Link to={`/workouts/${workout.id}`}>
                        {workout.title}
                      </Link>
                      {workout.map && (
                        <StaticMap workout={workout} display="list" />
                      )}
                    </td>
                    <td>
                      <span className="heading-span-absolute">
                        {t('workouts:Date')}
                      </span>
                      {
                        formatWorkoutDate(
                          getDateWithTZ(workout.workout_date, user.timezone),
                          'dd/MM/yyyy HH:mm'
                        ).workout_date
                      }
                    </td>
                    <td className="text-right">
                      <span className="heading-span-absolute">
                        {t('workouts:Distance')}
                      </span>
                      {convert(workout.distance, t('common:km'))}{' '}
                      {t('common:km')}
                    </td>
                    <td className="text-right">
                      <span className="heading-span-absolute">
                        {t('workouts:Duration')}
                      </span>
                      {workout.moving}
                    </td>
                    <td className="text-right">
                      <span className="heading-span-absolute">
                        {t('workouts:Ave. speed')}
                      </span>
                      {convert(workout.ave_speed, t('common:km'))}{' '}
                      {t('common:km')}
                    </td>
                    <td className="text-right">
                      <span className="heading-span-absolute">
                        {t('workouts:Max. speed')}
                      </span>
                      {convert(workout.max_speed, t('common:km'))}{' '}
                      {t('common:km')}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div>
            {!loading && mapData && mapData.bounds.length > 0 && (
              <MapContainer
                zoom={this.state.zoom}
                bounds={mapData.bounds}
                boundsOptions={{ padding: [10, 10] }}
                whenCreated={map => {
                  L.control
                    .fullscreen({
                      fullscreenControl: true,
                    })
                    .addTo(map)
                }}
              >
                <Map
                  bounds={mapData.bounds}
                  workouts={workouts}
                  jsonData={mapData.jsonMap}
                  mapAttribution={mapAttribution}
                />
              </MapContainer>
            )}
          </div>
          {loading && <div className="loader" />}
        </div>
      </div>
    )
  }
}
