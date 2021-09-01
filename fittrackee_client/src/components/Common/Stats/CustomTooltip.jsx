import React from 'react'

import { formatDuration } from '../../../utils/stats'

const formatValue = (displayedData, value) =>
  displayedData === 'duration'
    ? formatDuration(value, true)
    : ['distance', 'ascent', 'descent'].includes(displayedData)
    ? value.toFixed(2)
    : value

/**
 * @return {null}
 */
export default function CustomTooltip(props) {
  const { active } = props
  if (active) {
    const { displayedData, payload, label } = props
    let total = 0
    payload.map(p => (total += p.value))
    return (
      <div className="custom-tooltip">
        <p className="custom-tooltip-label">{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.fill }}>
            {p.name}: {formatValue(displayedData, p.value)} {p.unit}
          </p>
        ))}
        {payload.length > 0 && (
          <p>Total: {formatValue(displayedData, total)}</p>
        )}
      </div>
    )
  }
  return null
}
