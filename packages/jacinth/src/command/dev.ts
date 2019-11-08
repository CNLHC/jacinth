interface IArgs {
    port: number
    hostname: string
}

export default (args: IArgs) => {
    try {
        require('../server/index')(args)
    }
    catch (e) {
        console.error("Some error occur", (e as Error).stack)
    }
}
