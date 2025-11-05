import { Response } from 'express'

export function ok<T>(res: Response, data: T, message = 'OK') {
  return res.json({ success: true, message, data })
}

export function created<T>(res: Response, data: T, message = 'Created') {
  return res.status(201).json({ success: true, message, data })
}

export function fail(res: Response, error: string, status = 400, code?: string, details?: any) {
  return res.status(status).json({
    success: false,
    error,
    code,  
    details  
  })
}