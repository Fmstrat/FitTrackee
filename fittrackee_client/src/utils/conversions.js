export const convert = (value, format) => {
  let ret = value
  if (format === 'mi') {
    ret = (ret * 0.62137119223733).toFixed(2)
  } else if (format === 'ft') {
    ret = (ret * 3.280839895).toFixed(2)
  }
  return parseFloat(ret)
}
