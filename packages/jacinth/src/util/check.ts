import { getPagesDir, getServerDir } from "./path";
import chalk from "chalk";

export default function preCheck(){
    const cwd = process.cwd()

    getPagesDir(cwd).then(e=>{
        if(!e){
            console.error(chalk.red("can not find pages dir"))
            process.exit(1)
        }
    })

    getServerDir(cwd).then(e=>{
        if(!e){
            console.error(chalk.red("can not find server dir"))
            process.exit(1)
        }
    })
}