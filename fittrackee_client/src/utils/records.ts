import { ITranslatedSport } from '@/types/sports'
import { TUnit } from '@/types/units'
import { IRecord, IRecordsBySports } from '@/types/workouts'
import { formatWorkoutDate, getDateWithTZ } from '@/utils/dates'
import { convertDistance, units } from '@/utils/units'

export const formatRecord = (
  record: IRecord,
  tz: string,
  useImperialUnits: boolean
): Record<string, string | number> => {
  const distanceUnitFrom: TUnit = 'km'
  const distanceUnitTo: TUnit = useImperialUnits
    ? units[distanceUnitFrom].defaultTarget
    : distanceUnitFrom
  const ascentUnitFrom: TUnit = 'm'
  const ascentUnitTo: TUnit = useImperialUnits
    ? units[ascentUnitFrom].defaultTarget
    : ascentUnitFrom
  let value
  switch (record.record_type) {
    case 'AS':
    case 'MS':
      value = `${convertDistance(
        +record.value,
        distanceUnitFrom,
        distanceUnitTo,
        2
      )} ${distanceUnitTo}/h`
      break
    case 'FD':
      value = `${convertDistance(+record.value, distanceUnitFrom, distanceUnitTo, 3)} ${distanceUnitTo}`
      break
    case 'HA':
      value = `${convertDistance(+record.value, ascentUnitFrom, ascentUnitTo, 3)} ${ascentUnitTo}`
      break
    case 'LD':
      value = record.value
      break
    default:
      throw new Error(
        `Invalid record type, expected: "AS", "FD", "HA", "LD", "MD", got: "${record.record_type}"`
      )
  }
  return {
    workout_date: formatWorkoutDate(getDateWithTZ(record.workout_date, tz))
      .workout_date,
    workout_id: record.workout_id,
    id: record.id,
    record_type: record.record_type,
    value: value,
  }
}

export const getRecordsBySports = (
  records: IRecord[],
  translatedSports: ITranslatedSport[],
  tz: string,
  useImperialUnits: boolean
): IRecordsBySports =>
  records.reduce((sportList: IRecordsBySports, record) => {
    const sport = translatedSports.find((s) => s.id === record.sport_id)
    if (sport && sport.label) {
      if (sportList[sport.translatedLabel] === void 0) {
        sportList[sport.translatedLabel] = {
          label: sport.label,
          color: sport.color,
          records: [],
        }
      }
      sportList[sport.translatedLabel].records.push(
        formatRecord(record, tz, useImperialUnits)
      )
    }
    return sportList
  }, {})
