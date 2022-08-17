import config from "config"
import mongoose from "mongoose"
import log from "./logger"

const url = config.get<string>("mongo_uri")
log.info(url)

const connectDb = async() => {
    try{
        await mongoose.connect(url)
        log.info('Database has been connected')
    }catch(e:any){
        log.error(`Database failed to connect due to ${e}`)
    }
} 

export default connectDb