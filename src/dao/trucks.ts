import * as uuid from 'uuid'
import { QueryTypes } from 'sequelize'
import { Truck, TruckInstance, TruckAttributes } from '../models/truck'
import db from '../models/_index'
import { DISTANCE_RANGE } from '../env'

export function findAll({ lat, lng, cargo_weight, cargo_pallets }: any): Promise<any> {
  return db.query(`
    SELECT *, ROUND(earth_distance(ll_to_earth(:lat, :lng), ll_to_earth(lat, lng))::NUMERIC, 2) AS distance
    FROM
      (
        SELECT *
        FROM
         trucks
        WHERE
         (max_weight - curr_weight) >= :cargo_weight
         AND (max_pallets - curr_pallets) >= :cargo_pallets
      ) AS filtered_trucks
    WHERE
      earth_box(ll_to_earth (:lat, :lng), (:range * 1000)) @> ll_to_earth (lat, lng)
      AND earth_distance(ll_to_earth (:lat, :lng), ll_to_earth (lat, lng)) < (:range * 1000)
    ORDER BY
      distance`,
    {
      replacements: { lat, lng, cargo_weight, cargo_pallets, range: DISTANCE_RANGE },
      type: QueryTypes.SELECT
    })
}

export function findById(id: number, paranoid?: boolean): Promise<TruckInstance> {
  return Truck
    .findByPk(id, { paranoid })
}

export function update(id: number, truckData: TruckAttributes): Promise<TruckAttributes> {
  const option = {
    where: {
      id
    },
    returning: true,
    paranoid: false
  }
  return findById(id)
    .then((truck: TruckInstance | null) => {
      if (!truck) {
        throw new Error(`Truck with id:${id} not Found`)
      }
      return truck
        .update(truckData, option)
    })
}
