import webpack from 'webpack'
import path from 'path'
import { getJacinthRoot } from '../util/path'
const withCSS = require('@zeit/next-css')

export default withCSS({
  //@ts-ignore
  webpack(config:webpack.Configuration, ctx: any) {
    //@ts-ignore
    const { buildId, dev, isServer, defaultLoaders, webpack } = ctx
    config.resolveLoader={
      ...config.resolveLoader,
      alias:{
        ...config.resolveLoader?.alias,
        'css-loader':path.join(getJacinthRoot(),'node_modules','css-loader'),
        'ignore-loader':path.join(getJacinthRoot(),'node_modules','ignore-loader'),
      }
    }
    console.log(getJacinthRoot())
    return config
  }
})
