import  program from 'commander'

program
    .version('0.1.0')
    .option('-C --chdir <path>', 'change the working dir')

program
    .command("dev")
    .description('run dev server')
    .option("-p, --port <port>", "port to listen",3002)
    .option("-h, --host <host>", "port to listen","127.0.0.1")
    .action(require('./command/dev').default)

export default ()=>{
    program.parse(process.argv);
    // console.log(111,a)
}

