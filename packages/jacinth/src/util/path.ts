import path from 'path'
import fs from 'fs'
const getPath = async (cwd: string, ingredients: string[]) => {
    const dir = path.resolve(cwd, path.join(...ingredients))
    return new Promise<string | undefined>((res) => {
        fs.exists(dir, (exists) => res(exists ? dir : undefined))
    })

}

export const getPagesDir = async (cwd: string) => await getPath(cwd, ['src', 'pages'])
export const getServerDir = async (cwd: string) => await getPath(cwd, ['server'])
export const getTscPath = async (cwd: string) => await getPath(cwd,['node_modules','.bin','tsc'])


export const unsafeGetPagesDir = async (cwd: string) =>
    (await getPagesDir(cwd)) as string

export const unsafeGetServerDir = async (cwd: string) =>
    (await getServerDir(cwd)) as string






