import express from "express"
import connectDb from "./utils/connect"
import config from "config"
import log from "./utils/logger"
import createServer from "./utils/server"

const app = createServer()

const port = config.get<number>("port")

const start = async() => {
    try{
        await connectDb()
        app.listen(port, () => {
            log.info(`App is listening on port: ${port}`)
        })
    }catch(e:any){
        log.error(e)
    }
}

start()
