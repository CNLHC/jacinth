import next from 'next'
import fastify from 'fastify'
import fp from 'fastify-plugin';
import conf from '../../wrapper/next.config'

import { HttpServer, RawRequest, RawResponse } from '../types/plugin'

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({
     dev ,
     conf,
     dir:'/home/liuhanchi/MegaVII/fasteval_next/'
})

const NextSSR = fp<
    HttpServer,
    RawRequest,
    RawResponse,
    undefined
>(
    async function <
        Server extends HttpServer,
        Request extends RawRequest,
        Response extends RawResponse
    >(
        app: fastify.FastifyInstance<Server, Request, Response>,
        _opts: undefined,
        done: fp.nextCallback
    ) {
        await nextApp.prepare()
        const nextHandler = nextApp.getRequestHandler()
        if (dev) {
            app.get('/_next/*', (req, reply) => {
                return nextHandler(req.req, reply.res).then(() => {
                    reply.sent = true
                })
            })
        }
        app.all('/*', (req, reply) => {
            return nextHandler(req.req, reply.res).then(() => {
                reply.sent = true
            })
        })
        done()
    }
)

module.exports=NextSSR