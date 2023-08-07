const adapter = (response) => {
  return {
    statusCode: response.status,
    statusMessage: response.statusText,
    body: response.responseText,
    headers: response.responseHeaders
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
