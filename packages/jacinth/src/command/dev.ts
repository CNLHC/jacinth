import chokidar from 'chokidar'
import debounce from 'debounce'
import preCheck from '../util/check';
import { initEnv, getEnv } from '../env';
import path from 'path'
import { compile } from '../util/build'
import { logger } from '../util/logging'
import { gatherFile as gF } from '../util/path'

type IArgs = any
export default async (args: IArgs) => {
    preCheck()
    initEnv(args)
    const env = getEnv()
    const loadBFF: () => void = require('../server/index')
    let ServerFileSet: Set<string> = new Set()
    const gatherFile = async () => {
        const res = await gF(env.serverDir, ['**', '*.ts'])
        ServerFileSet = new Set([...res])
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

    try {
        chokidar.watch(env.cacheDir)
            .on('change', debounce((_evt) => {
                loadBFF()
            }, 200, true))

        chokidar.watch(env.serverDir)
            .on('all', debounce((_evt, _path) => {
                logger.debug(`reprocess server file due to Event(${_evt})-${_path}`)
                gatherFile()
                buildFile()
            }, 200, true))
    }
    catch (e) {
        console.error("Some error occur", (e as Error).stack)
    }
}
