function formatKey (key) {
  if (!key || key === '__all__') {
    return null
  }
  return `${key[0].toUpperCase()}${key.substr(1).replace(/_/gi, ' ')}`
}

export const getErrorText = (error, noKeys) => {
  noKeys = noKeys || false
  let result

  if (!error.response || !error.response.data) {
    return '' + error
  }

  let responseData = error.response.data
  if (responseData.detail) {
    responseData = responseData.detail
  }

  if (responseData.errors) {
    responseData = responseData.errors
  }

  if (responseData.detail) {
    result = responseData.detail
  } else if (responseData.non_field_errors) {
    result = responseData.non_field_errors
  } else if (Array.isArray(responseData)) {
    result = []
    responseData.forEach(error => {
      if (error.name) {
        const key = formatKey(error.name)
        result.push(`${noKeys || !key ? '' : '<b>' + key + ':</b> '}${error.message}`)
      } else {
        result.push(error)
      }
    })
  } else if (typeof (responseData) === 'object') {
    result = []
    for (let key in responseData) {
      if (responseData.hasOwnProperty(key)) {
        let value = responseData[key]
        if (Array.isArray(value)) {
          value = value.join('. ')
        }
        key = formatKey(key)
        result.push(`${noKeys || !key ? '' : '<b>' + key + ':</b> '}${value}`)
      }
    }
  } else if (typeof (responseData) === 'string') {
    result = responseData
  }

  if (result) {
    if (Array.isArray(result)) {
      result = result.join('<br>')
    }
  }

  return result || ''
}
