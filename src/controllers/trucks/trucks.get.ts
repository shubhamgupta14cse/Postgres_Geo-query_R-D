import { Request, Response } from 'express'
const { query, validationResult } = require('express-validator')
import { TruckDao } from '../../dao/_index'

  //TODO: PUT all the validation messages into a constant/validationMessage.ts file
export const searchSchema = [
  query('lat', 'lat is Required query param').isDecimal(),
  query('lng', 'lng is Required query param').isDecimal(),
  query('cargo_weight', 'cargo_weight is Required').isInt({ gt: 0 }).withMessage('Must be an integer more than 0'),
  query('cargo_pallets', 'cargo_pallets is Required').isInt({ gt: 0 }).withMessage('Must be an integer more than 0'),
]

export function search(req: Request, res: Response) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.boom.badRequest('Validation errors', { errors: errors.array()})
  }

  return TruckDao
    .findAll(req.query)
    .then(trucks  => res.status(200).send(trucks))
    .catch((error: any) => res.boom.badRequest(error))
}
