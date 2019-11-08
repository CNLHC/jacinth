#!/usr/bin/env node
import fastify from "fastify"

const server = fastify({
  logger: {
    level: 'debug'
  }
})



server.register(require('./plugins/next'))

module.exports = (args: any) => {
  const port = parseInt(args.port || "3002")
  const host = args.host || "localhost"
  server.listen(port, host, (err, address) => {
    if (err) throw err
    console.log(`> Ready on ${address}`)
  })
}

