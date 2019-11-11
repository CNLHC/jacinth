import { transformFileAsync } from '@babel/core'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { logger } from '../logging'

const write = promisify(fs.writeFile)
const exists = promisify(fs.exists)
const mkdir = promisify(fs.mkdir)




type IOpt = {
    outPath: string
}


export async function compile(source: string, opts: IOpt) {
    let output;
    try {
        output = await transformFileAsync(source, {
            presets: [
                [require("babel-preset-minify")],
                [require("@babel/preset-typescript"), {
                    module: 'commonjs'
                }],
                [require("@babel/preset-env")]
            ]
        })
    } catch (e) {
        logger.error(e.message)
    }
    finally {
        const outDir = path.dirname(opts.outPath)
        if (!await exists(outDir))
            await mkdir(outDir, { recursive: true })

        if (output)
            write(opts.outPath, output.code)
    }


}