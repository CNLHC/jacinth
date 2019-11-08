import path from 'path'
import fs from 'fs'
const getDir = async (cwd: string, ingredients: string[]) => {
    const dir = path.resolve(cwd, path.join(...ingredients))
    return new Promise<string | undefined>((res) => {
        fs.exists(dir, (exists) => res(exists ? dir : undefined))
    })

}

export const getPagesDir = async (cwd: string) => await getDir(cwd, ['src', 'pages'])
export const getServerDir = async (cwd: string) => await getDir(cwd, ['server'])

export const unsafeGetPagesDir = async (cwd: string) =>
    (await getPagesDir(cwd)) as string

export const unsafeGetServerDir = async (cwd: string) =>
    (await getServerDir(cwd)) as string




