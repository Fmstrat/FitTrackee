import React from 'react'
import { GeoJSON, Marker, Tooltip, TileLayer, useMap } from 'react-leaflet'
import hash from 'object-hash'

import { apiUrl } from '../../../utils'
import i18n from '../../../i18n.js'

export default function Map({
  bounds,
  workouts,
  coordinates,
  jsonData,
  mapAttribution,
}) {
  const map = useMap()
  map.fitBounds(bounds)
  return (
    <>
      <TileLayer
        // eslint-disable-next-line max-len
        attribution={mapAttribution}
        url={`${apiUrl}workouts/map_tile/{s}/{z}/{x}/{y}.png`}
      />
      <GeoJSON
        // hash as a key to force re-rendering
        key={hash(jsonData)}
        data={jsonData}
      />
      {coordinates && coordinates.latitude && (
        <Marker position={[coordinates.latitude, coordinates.longitude]} />
      )}
      {workouts &&
        workouts.map(workout => (
          <Marker
            key={workout.id}
            position={[workout.bounds[0], workout.bounds[1]]}
          >
            <Tooltip direction="auto" opacity="100" permanent>
              <b>{workout.title}</b>
              <br />
              <i className="fa fa-road fa-xs fa-color" />{' '}
              {workout.distance.toFixed(2)} {i18n.t('common:km')}{' '}
              <i className="fa fa-arrow-circle-up fa-xs fa-color" />{' '}
              {workout.ascent.toFixed(2)} {i18n.t('common:m')}
            </Tooltip>
          </Marker>
        ))}
    </>
  )
}
