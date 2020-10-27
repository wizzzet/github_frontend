import { date } from 'quasar'
import config from '../config'
import formatDistance from 'date-fns/formatDistance'

export const absUrl = value => {
  return `${config.apiHost}${value}`
}

export const currencyFormat = (amount, currency) => {
  amount = intComma(amount, true)
  if (!currency) {
    return amount
  }
  let result = ''
  if (amount && amount[0] === '-') {
    result += '-'
    amount = amount.substr(1)
  }
  result += currency.short_code || currency
  result += amount
  return result
}

export const formatDate = (dt, format) => {
  if (!dt) {
    dt = Date.now()
  } else {
    if (typeof (dt) === 'number') {
      dt = new Date(dt * 1000)
    }
  }

  if (!format) {
    format = 'MM/DD/YY, HH:mm'
  }
  return date.formatDate(dt, format)
}

export const formatDateDistance = (dt, baseDate) => {
  if (!dt) {
    dt = Date.now()
  } else {
    if (typeof (dt) === 'number') {
      dt = new Date(dt * 1000)
    }
  }

  if (!baseDate) {
    baseDate = new Date()
  }

  return formatDistance(dt, baseDate, { includeSeconds: true })
}

export const intComma = (value, removeZeros) => {
  // remove float zeros, if necessary
  if (typeof (removeZeros) !== 'undefined' && removeZeros) {
    value = parseFloat(value)
    if (value % 1 === 0) {
      value = parseInt(value)
    }
  }

  value += ''
  let x = value.split('.')
  let x1 = x[0]
  let x2 =
    x.length > 1 ? '.' + x[1] : ''
  let rgx = /(\d+)(\d{3})/

  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1 $2')
  }
  return x1 + x2
}

export const personCardRoute = value => {
  const name = `${value.content_type.name}-card`
  return { name, params: { id: value.id } }
}

export const personName = value => {
  return [value.first_name, value.last_name].filter(part => !!part).join(' ')
}

export const phone = value => {
  value = '' + value
  if (value.indexOf('tel:') === 0) {
    value = value.split('tel:')[1]
  }
  return value.replace(/[^\d]/g, '')
}

export const phoneUrl = value => 'tel:+' + phone(value)

export default {
  absUrl,
  currencyFormat,
  formatDate,
  formatDateDistance,
  intComma,
  personCardRoute,
  personName,
  phone,
  phoneUrl
}
