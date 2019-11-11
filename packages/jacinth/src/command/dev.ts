import chokidar from 'chokidar'
import debounce from 'debounce'
import preCheck from '../util/check';
import { initEnv, getEnv } from '../env';
import glob from 'glob'
import path from 'path'
import { compile } from '../util/build'
import { logger } from '../util/logging'
type IArgs = any
export default async (args: IArgs) => {
    preCheck()
    initEnv(args)
    const env = getEnv()
    const loadBFF: () => void = require('../server/index')
    let ServerFileSet: Set<string> = new Set()
    const ServerFilePattern = path.join(env.serverDir, '**', '*.ts')
    const gatherFile = async () => {
        return new Promise<void>((res, rej) =>
            glob(ServerFilePattern, (err, matches) => {
                if (err) {
                    rej(err)
                }
                ServerFileSet = new Set([...ServerFileSet, ...matches])
                res()
            })
        )
    }

    const buildFile = async () => {
        ServerFileSet.forEach(e => {
            logger.debug(`compile server file ${e}`)
            const fileName = path.basename(e).
                split('.').slice(0, -1).join('.')

            compile(e, {
                outPath: path.join(env.cacheDir, `${fileName}.js`)

            })

        })
    }

    await gatherFile()
    await loadBFF()
    const debouncedLoadBFF = debounce(loadBFF, 200, true)
    const debouncedGatherFile = debounce(gatherFile, 200, true)
    const debouncedBuildFile = debounce(buildFile, 200, true)



    try {
        chokidar.watch(env.cacheDir)
            .on('all', (_evt) => {
                logger.debug(`reprocess server file due to Event(${_evt})`)
                debouncedLoadBFF()
            })

        chokidar.watch(env.serverDir)
            .on('all', async (_evt, _path) => {
                logger.debug(`reprocess server file due to Event(${_evt})-${_path}`)
                debouncedGatherFile()
                debouncedBuildFile()
            })
    }
    catch (e) {
        console.error("Some error occur", (e as Error).stack)
    }
}
