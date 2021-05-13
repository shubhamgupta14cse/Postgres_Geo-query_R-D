import { Request, Response } from 'express'
import { body, validationResult, param } from 'express-validator'
import { TruckDao } from '../../dao/_index'

  //TODO: PUT all the validation messages into a constant/validationMessage.ts file
export const updateSchema = [
  param('id').isInt({ gt: 0 }).withMessage('Must be a integer more than 0'),
  body('license_no', 'license_no is required').optional(),
  body('lat', 'lat should be double precision').optional().isDecimal(),
  body('lng', 'lng should be double precision').optional().isDecimal(),
  body('max_weight').optional().isInt({ gt: 0 }).withMessage('Must be integer more than 0'),
  body('curr_weight').optional().isInt({ gt: 0 }).withMessage('Must be integer more than 0'),
  body('max_pallets').optional().isInt({ gt: 0 }).withMessage('Must be integer more than 0'),
  body('curr_pallets').optional().isInt({ gt: 0 }).withMessage('Must be integer more than 0'),
]

export function update(req: Request, res: Response) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.boom.badRequest('Validation errors', { errors: errors.array()})
  }

  const { id } = req.params
  return TruckDao.update(Number(id), req.body)
    .then(truck => res.status(200).send(truck))
    .catch((error: any) => res.boom.badRequest(error))
}
