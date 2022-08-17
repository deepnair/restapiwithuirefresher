import SessionModel from "../model/session.model"
import { FilterQuery, UpdateQuery } from "mongoose"
import { SessionDocument } from "../model/session.model"
import { signJwt, verifyJwt } from "../utils/jwt.utils"
import { get } from "lodash"
import { findUser } from "./user.service"
import config from "config"

export const createSession = async ({user, agent}: {user: string, agent: string}) => {
    try{
        const session = await SessionModel.create({user, agent})
        return session.toJSON()
    }catch(e:any){
        throw new Error(e)
    }
}

export const getSessions = async (query: FilterQuery<SessionDocument>) => {
    return SessionModel.find(query).lean()
}

export const updateSession = async (query: FilterQuery<SessionDocument>, update: UpdateQuery<SessionDocument>) => {
    return SessionModel.findOneAndUpdate(query, update, {new: true})
}

export const reIssueAccessToken = async (refreshToken: string) => {
    const {decoded} = verifyJwt(refreshToken)
    if(!decoded || !get(decoded, "session")){
        return false
    }
    const session = await SessionModel.findById(get(decoded, "session"))
    if(!session || !session.valid){
        return false
    }
    const user = await findUser({_id: session.user})
    if(!user){
        return false
    }
    const newAccessToken = signJwt({...user, session: session._id}, {expiresIn: config.get<string>("accessTokenTtl")})
    return newAccessToken
}