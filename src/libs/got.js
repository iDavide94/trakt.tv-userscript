const parseHeaders = (headers) => {
  return headers.split('\r\n').reduce((accumulator, header) => {
    const [key, value] = header.split(': ')
    if (key && value) accumulator[key.toLowerCase()] = value.trim()
    return accumulator
  }, {})
}

const adapter = (response) => {
  return {
    statusCode: response.status,
    statusMessage: response.statusText,
    body: response.responseText,
    headers: parseHeaders(response.responseHeaders)
  }
}

const got = (req) => {
  return new Promise((resolve, reject) => {
    GM.xmlHttpRequest({
      method: req.method,
      url: req.url,
      headers: req.headers,
      data: req.body,
      onload: (response) => {
        if (response.readyState === 4 && response.status === 200) {
          resolve(adapter(response))
        } else {
          reject(adapter(response))
        }
      },
      onerror: (error) => reject(adapter(error)),
      ontimeout: (error) => reject(adapter(error))
    })
  })
}

export default got
