import path from 'path'

function calRuntimeEnv(p: PresetEnv): RuntimeEnv {
    const getAbsolute = (s: string[]) => path.resolve(process.cwd(), ...s)
    return {
        cacheDir: getAbsolute(p.relativeCacheDir),
        serverDir: getAbsolute(p.relativeServerDir),
        serverTsConfPath: getAbsolute(p.relativeServerTsConfPath),
    }
}

type PresetEnv = {
    port: number
    host: string
    relativeCacheDir: string[]
    relativeServerDir: string[]
    relativeServerTsConfPath: string[]
}

type RuntimeEnv = {
    cacheDir: string
    serverDir: string
    serverTsConfPath: string
}

type Env = PresetEnv & RuntimeEnv

const defaultPresetEnv: PresetEnv = {
    port: 3002,
    host: 'localhost',
    relativeCacheDir: ['.jacinth'],
    relativeServerDir: ['server'],
    relativeServerTsConfPath: ['server', 'tsconfig.json']
}

const defaultEnv: Env = {
    ...defaultPresetEnv,
    ...calRuntimeEnv(defaultPresetEnv)
}


let __env: Env | undefined = undefined;

export function initEnv(args: { [key: string]: any }) {
    Object.keys(args).forEach(key => args[key] === undefined ? delete args[key] : {})
    let tEnv: PresetEnv = {
        ...defaultPresetEnv,
        ...args
    }
    __env = { ...tEnv, ...calRuntimeEnv(tEnv) }
}

export function getEnv(): Env {
    return __env === undefined ? defaultEnv : __env
}