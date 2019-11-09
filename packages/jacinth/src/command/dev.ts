import chokidar from 'chokidar'
import preCheck from '../util/check';
import { getTscPath } from '../util/path';
import { unwrap } from '../util/fp'
import { spawn } from 'child_process'
import chalk from 'chalk';
import { initEnv ,getEnv } from '../env';
type IArgs = any
export default async (args: IArgs) => {
    preCheck()
    initEnv(args)
    const env = getEnv()
    const cwd = process.cwd()
    const tscPath = unwrap(await getTscPath(cwd))
    const loadBFF = require('../server/index')

    await loadBFF()

    try {
        console.log(env)
        const tscwatcher = spawn(tscPath, ['--watch', '--outDir', env.cacheDir , '--project', env.serverTsConfPath])

        tscwatcher.stdout.on('data',
            (chunk) => console.error(chalk.red(`[Server-Tsc]`), chunk.toString()))

        tscwatcher.stderr.on('data',
            (chunk) => console.error(chalk.red(`[Server-Tsc]`), chunk.toString()))

        chokidar.watch(env.cacheDir)
            .on('all', (event, path) => {
                console.log("reload", event, path)
                loadBFF(args)
            })
    }
    catch (e) {
        console.error("Some error occur", (e as Error).stack)
    }
}
