#!/usr/bin/env node
import fastify from "fastify"
import chalk from "chalk"

const server = fastify({ })

let serverRunning=false

module.exports = async (args: any) => {
  if(!serverRunning){
    server.register(require('./plugins/next'))
    const port = parseInt(args.port || "3002")
    const host = args.host || "localhost"
    const address = await server.listen(port, host )
    console.log(chalk.green(`server available at ${address}`))
    serverRunning=true
  }
  console.log("do reloading here")

  return serverRunning
}

