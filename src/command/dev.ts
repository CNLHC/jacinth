import path from 'path'
import fs from 'fs'
import { spawn } from 'child_process'

interface IArgs {
    port: number
    hostname: string
}

export default (_args: IArgs) => {
    const NextBin = path.resolve(__dirname, path.join(...['..', '..', 'node_modules', 'next', 'dist', 'bin','next']))
    if (!fs.existsSync(NextBin)){
        throw new Error("Next.js not found")
    }
    console.log(NextBin)
    const nextHandle = spawn(NextBin)
    nextHandle.stdout.on('data',(data)=>console.log(111,data.toString()))
    nextHandle.stdout.on('message',(mes)=>console.log(222,mes))
    nextHandle.stdout.on('error',(err)=>console.log(err))
}
