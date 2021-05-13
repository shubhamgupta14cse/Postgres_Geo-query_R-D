import { Model, Optional, STRING, UUID, INTEGER, DOUBLE } from 'sequelize'
import db from './_index'

export interface TruckAttributes {
  id?: number
  license_no: string
  max_weight: number
  curr_weight: number
  max_pallets: number
  curr_pallets: number
  lat: number
  lng: number
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}

interface TruckCreationAttributes extends Optional<TruckAttributes, 'id'> {}

export interface TruckInstance
  extends Model<TruckAttributes, TruckCreationAttributes>,
    TruckAttributes {}

export const Truck = db.define<TruckInstance>('trucks',
  {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    license_no: {
      type: STRING,
      allowNull: false
    },
    max_weight: {
      type: INTEGER,
      allowNull: false
    },
    curr_weight: {
      type: INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        limitMax(value) {
          if (Number(value) > Number(this.max_weight)) {
            throw new Error('curr_weight cannot be more than max_weight')
          }
        }
      }
    },
    max_pallets: {
      type: INTEGER,
      allowNull: false
    },
    curr_pallets: {
      type: INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        limitMax(value) {
          if (Number(value) > Number(this.max_pallets)) {
            throw new Error('curr_pallets cannot be more than max_pallets')
          }
        }
      }
    },
    lat: {
      type: DOUBLE,
      allowNull: false
    },
    lng: {
      type: DOUBLE,
      allowNull: false
    }
  }, {
    deletedAt: 'deleted_at',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    timestamps: true,
  }
)
