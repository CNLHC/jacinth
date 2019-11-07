import * as http from 'http';
import * as http2 from 'http2';
import * as https from 'https';


export type HttpServer =
  | http.Server
  | https.Server
  | http2.Http2Server
  | http2.Http2SecureServer;
export type RawRequest = http.IncomingMessage
export type RawResponse = http.ServerResponse
