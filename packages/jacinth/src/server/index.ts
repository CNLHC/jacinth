#!/usr/bin/env node
import fastify from "fastify";
import chalk from "chalk";
import { getEnv } from "../env/index";
import { logger } from "../util/logging";
import pluginLoader from "./loader/plugin";
import restLoader from "./loader/rest";

let serverRunning = false;
let server = fastify({});

module.exports = async () => {
  logger.debug("reload bff");
  const env = getEnv();
  //if there already have one instance running, kill it and get a new one
  if (serverRunning) {
    server.close();
    server = fastify({});
  }

  server.register(pluginLoader, { cacheDir: env.pluginCacheDir });

  server.after(() => {
    server.register(restLoader, { cacheDir: env.RESTCacheDir });
    server.register(require("./plugins/next"));
  });

  const address = await server.listen(env.port, env.host);
  logger.info(chalk.green(`server available at ${address}`));
  serverRunning = true;
  return serverRunning;
};
