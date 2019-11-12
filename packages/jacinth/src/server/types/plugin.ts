import * as http from "http";
import * as http2 from "http2";
import * as https from "https";
import fastify from "fastify";
import fp from "fastify-plugin";

export type HttpServer =
  | http.Server
  | https.Server
  | http2.Http2Server
  | http2.Http2SecureServer;
export type RawRequest = http.IncomingMessage;
export type RawResponse = http.ServerResponse;

export type TPlugin<T extends {}> = (
  app: fastify.FastifyInstance<HttpServer,RawRequest,RawResponse>,
  _opts: T,
  done: fp.nextCallback
) =>void;
