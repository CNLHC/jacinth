import chokidar from 'chokidar'
import preCheck from '../util/check';
import { getTscPath, getServerDir } from '../util/path';
import { unwrap } from '../util/fp'
import { spawn } from 'child_process'
import path from 'path'
import chalk from 'chalk';
interface IArgs {
    port: number
    hostname: string
}

export default async (args: IArgs) => {
    preCheck()
    const cwd = process.cwd()
    const tscPath = unwrap(await getTscPath(cwd))
    const serverDir = unwrap(await getServerDir(cwd))
    const serverBuildPath = path.resolve(process.cwd(), '.jacinth', 'build')
    const serverConf = path.resolve(serverDir, 'tsconfig.json')
    const loadBFF = require('../server/index')

    await loadBFF(args)
    try {
        const tscwatcher = spawn(tscPath, ['--watch', '--outDir',serverBuildPath, '--project', serverConf])

        tscwatcher.stdout.on('data',
            (chunk) => console.error(chalk.red(`[Server-Tsc]`), chunk.toString()))

        tscwatcher.stderr.on('data',
            (chunk) => console.error(chalk.red(`[Server-Tsc]`), chunk.toString()))

        chokidar.watch(serverBuildPath)
            .on('all', (event, path) => {
                console.log("reload", event, path)
                loadBFF(args)
            })
    }
    catch (e) {
        console.error("Some error occur", (e as Error).stack)
    }
}
