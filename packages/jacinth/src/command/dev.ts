import chokidar from 'chokidar'
import preCheck from '../util/check';
import { unsafeGetServerDir } from '../util/path';
interface IArgs {
    port: number
    hostname: string
}

export default async (args: IArgs) => {
    preCheck()
    const loadBFF = require('../server/index')
    await loadBFF(args)
    try {
        chokidar.watch(await unsafeGetServerDir(process.cwd()))
            .on('all', (event, path) => {
                console.log("reload", event, path)
                loadBFF(args)
            })
    }
    catch (e) {
        console.error("Some error occur", (e as Error).stack)
    }
}
