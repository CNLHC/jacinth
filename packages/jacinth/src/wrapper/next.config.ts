import { Configuration } from 'webpack'

export default {
  //@ts-ignore
  webpack(config: Configuration, ctx: any) {
    //@ts-ignore
    const { buildId, dev, isServer, defaultLoaders, webpack } = ctx
    return config
  }
}
