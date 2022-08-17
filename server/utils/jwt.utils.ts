import jwt from "jsonwebtoken"
import config from "config"
import log from "./logger"

const privateKey = config.get<string>('privateKey')
const publicKey = config.get<string>('publicKey')

export const signJwt = (object:Object, options: jwt.SignOptions | undefined) => {
    try{
        return jwt.sign(object, privateKey, {...(options && options), algorithm: 'RS256'})
    }catch(e:any){
        log.error(e)
    }
}

export const verifyJwt = (token:string) => {
    try{
        const decoded = jwt.verify(token, publicKey)
        return{
            valid: true,
            expired: false,
            decoded
        }
    }catch(e:any){
        log.error(e)
        return{
            valid: false,
            expired: e.message === 'jwt expired',
            decoded: null
        }
    }
}