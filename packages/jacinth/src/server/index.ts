#!/usr/bin/env node
import fastify from "fastify"
import chalk from "chalk"
import {getEnv} from '../env/index'

const server = fastify({ })

let serverRunning=false

module.exports = async () => {
  const env = getEnv()
  if(!serverRunning){
    server.register(require('./plugins/next'))
    const address = await server.listen(env.port, env.host)
    console.log(chalk.green(`server available at ${address}`))
    serverRunning=true
  }
  console.log("do reloading here")

  return serverRunning
}

