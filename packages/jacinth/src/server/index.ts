#!/usr/bin/env node
import fastify from "fastify";
import chalk from "chalk";
import { getEnv } from "../env/index";
import { logger } from "../util/logging";

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

  server.after(() => {
    server.register(require("./loader/rest").default, {
      cacheDir: env.cacheDir
    });
    server.register(require("./plugins/next"));
  });

  const address = await server.listen(env.port, env.host);
  logger.info(chalk.green(`server available at ${address}`));
  serverRunning = true;
  return serverRunning;
};
