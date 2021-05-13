import * as express from 'express'
import * as winston from 'winston'
import * as boom from 'express-boom'
import * as morgan from 'morgan'
import * as cors from 'cors'
import { json, urlencoded } from 'body-parser'
import { Express } from 'express'
import * as routes from './routes/_index'
import { PORT, HOST } from './env'

export class Server {

  private app: Express

  constructor() {
    this.app = express()

    // Express middleware
    this.app.use(cors({
      optionsSuccessStatus: 200
    }))
    this.app.use(urlencoded({
      extended: true
    }))
    this.app.use(json())
    this.app.use(boom())
    this.app.use(morgan('combined'))
    this.app.listen(PORT, () => {
      winston.log('info', `--> Server successfully started at URL: http://${HOST}:${PORT}`)
    })
    routes.initRoutes(this.app)
  }

  getApp() {
    return this.app
  }
}

new Server()
