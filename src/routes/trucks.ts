import { Express, Router } from 'express'
import { TruckController } from '../controllers/_index'


export function routes(app: Express) {

  app.get('/api/trucks', TruckController.TruckGet.searchSchema, TruckController.TruckGet.search)
  app.put('/api/trucks/:id', TruckController.TruckPut.updateSchema, TruckController.TruckPut.update)

}
