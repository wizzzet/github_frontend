export const hexToRgb = (hex, asArray) => {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    result = {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    }
    if (asArray) {
      return [result.r, result.g, result.b]
    }
    return result
  }

  return null
}
