#!/usr/bin/env node
import fastify from "fastify"
import chalk from "chalk"
import { gatherFile } from '../util/path'
import { getEnv } from '../env/index'
import { logger } from "../util/logging"

let serverRunning = false
let server = fastify({})

module.exports = async () => {
  logger.debug("reload bff")
  const env = getEnv()
  const gatherPlugin = async () => await gatherFile(env.cacheDir, ['*.js'])
  //if there already have one instance running, kill it and get a new one 
  if (serverRunning) {
    server.close()
    server = fastify({})
  }
  const plugins = await gatherPlugin()
  plugins.forEach(e => {
    delete require.cache[require.resolve(e)]
    const mod = require(e)
    const opt = {
      prefix: "/api"
    }
    logger.debug(`register plugin at ${e}`)
    if (typeof mod === 'function')
      server.register(mod, opt)
    else if (typeof mod.default === 'function')
      server.register(mod.default, opt)
    else
      logger.error(`unknown plugin type at ${e}`)
  })
  server.register(require('./plugins/next'))
  let address;
  try {
    address = await server.listen(env.port, env.host)
  } catch (e) {
    logger.error(`server listening error ${e}`)
  }
  console.log(chalk.green(`server available at ${address}`))
  serverRunning = true
  return serverRunning
}

