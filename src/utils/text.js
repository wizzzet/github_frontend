export const makeEnding = (count, first, second, third) => {
  count = parseInt(count)
  let asStr = '' + count
  let lastSymbol = parseInt(asStr.substr(asStr.length - 1, 1))

  let ending = first
  if (isNaN(lastSymbol)) {
  } else if (count > 4 && count < 21) {
    ending = first
  } else if (lastSymbol > 1 && lastSymbol < 5) {
    ending = second
  } else if (lastSymbol === 1) {
    ending = third
  }

  return ending
}
