export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  UNPROCESSABLE = 'UNPROCESSABLE',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  INTERNAL = 'INTERNAL'
}


export class HttpError extends Error {
  status: number
  code: ErrorCode
  details?: any

  constructor(status: number, message: string, code: ErrorCode, details?: any) {
    super(message)
    this.status = status
    this.code = code
    this.details = details
  }
}

export const ValidationError = (msg = 'Validation Error', details?: any) =>
  new HttpError(400, msg, ErrorCode.VALIDATION_ERROR, details)

export const BadRequest = (msg = 'Bad Request', details?: any) =>
  new HttpError(400, msg, ErrorCode.BAD_REQUEST, details)

export const Unauthorized = (msg = 'Unauthorized', details?: any) =>
  new HttpError(401, msg, ErrorCode.UNAUTHORIZED, details)

export const Forbidden = (msg = 'Forbidden', details?: any) =>
  new HttpError(403, msg, ErrorCode.FORBIDDEN, details)

export const NotFound = (msg = 'Not Found', details?: any) =>
  new HttpError(404, msg, ErrorCode.NOT_FOUND, details)

export const Conflict = (msg = 'Conflict', details?: any) =>
  new HttpError(409, msg, ErrorCode.CONFLICT, details)

export const Unprocessable = (msg = 'Unprocessable Entity', details?: any) =>
  new HttpError(422, msg, ErrorCode.UNPROCESSABLE, details)

export const TooManyRequests = (msg = 'Too Many Requests', details?: any) =>
  new HttpError(429, msg, ErrorCode.TOO_MANY_REQUESTS, details)

export const ServerError = (msg = 'Internal Server Error', details?: any) =>
  new HttpError(500, msg, ErrorCode.INTERNAL, details)
