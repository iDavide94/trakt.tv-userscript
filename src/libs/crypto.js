export const randomBytes = (length) => {
  const randomBytesArray = new Uint8Array(length)
  window.crypto.getRandomValues(randomBytesArray)

  randomBytesArray.toString = () =>
    Array.prototype.map
      .call(randomBytesArray, (byte) => ('0' + byte.toString(16)).slice(-2))
      .join('')

  return randomBytesArray
}
