const log = (logger: any, request: any, response?: any) => {
  const httpCall = `${request.method().toUpperCase()} ${request.url()}`
  const direction = response ? '<-' : '->'
  const isError = response && !response.success()
  const errorLabel = isError ? '(ERROR) ' : ''
  const extra = response ? ` status=${response.status()} '${response.rawData()}'` : ''
  if (isError) {
    logger.error(`${direction} ${errorLabel}${httpCall}${extra}`)
  } else {
    logger.info(`${direction} ${errorLabel}${httpCall}${extra}`)
  }

  return response || request
}

/**
 * Log all requests and responses.
 */
export function getLoggerMiddleware(logger: any) {
  const LoggerMiddleware = () => ({
    prepareRequest(next: any) {
      return next().then((request: any) => log(logger, request))
    },

    response(next: any) {
      return next()
        .then((response: any) => log(logger, response.request(), response))
        .catch((response: any) => {
          log(logger, response.request(), response)
          throw response
        })
    },
  })
  return LoggerMiddleware
}
