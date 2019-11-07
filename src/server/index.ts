import fastify from "fastify"


const server = fastify({
  logger: {
    level: 'debug'
  }
})



server.register(require('./plugins/next'))

const port = 3221

server .listen(port, err => {
  if (err) throw err
  console.log(`> Ready on http://localhost:${port}`)
})

