import webpack from 'webpack'
import path from 'path'
import { getJacinthRoot } from '../util/path'
const withCSS = require('@zeit/next-css')
const localLoader = (loader: string) => path.join(getJacinthRoot(), 'node_modules', loader)

const localLoaderList = [
  'css-loader',
  'ignore-loader',
  'extracted-loader'
]

export default withCSS({
  //@ts-ignore
  webpack(config: webpack.Configuration, ctx: any) {
    //@ts-ignore
    const { buildId, dev, isServer, defaultLoaders, webpack } = ctx
    config.resolveLoader = {
      ...config.resolveLoader,
      alias: {
        ...config.resolveLoader?.alias,
        ...localLoaderList.reduce((acc, cur) => ({ ...acc, [cur]: localLoader(cur) }), {})
      }
    }
    console.log(getJacinthRoot())
    return config
  }
})
