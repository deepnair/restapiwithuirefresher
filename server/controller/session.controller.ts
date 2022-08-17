import { CookieOptions, Request, Response } from "express";
import { createSession, getSessions, updateSession } from "../service/session.service";
import { verifyPassword } from "../service/user.service";
import { signJwt } from "../utils/jwt.utils";
import config from "config"

export const createSessionHandler = async (req: Request, res: Response) => {
    try{
        const user = await verifyPassword(req.body)
        let session
        if(user){
            let session = await createSession({user: user._id, agent: req.get("user-agent") || ""})
            if(session){
                const accessToken = signJwt({...user, session: session._id}, {expiresIn: config.get<string>("accessTokenTtl")})
                const refreshToken = signJwt({...user, session: session._id}, {expiresIn: config.get<string>("refreshTokenTtl")})
                const cookieOptions: CookieOptions = {
                    maxAge: 900000,
                    httpOnly: true,
                    domain: config.get<string>('domain'),
                    path: '/',
                    sameSite: config.get<boolean>('sameSite'),
                    secure: config.get<boolean>('secure')
                }
                res.cookie("accessToken", accessToken, cookieOptions)
                res.cookie("refreshToken", refreshToken, {...cookieOptions,
                maxAge: 3.516e10})
                return res.send({accessToken, refreshToken})
        }}
    }catch(e){
        res.status(400).send(e)
    }
}

export const getSessionsHandler = async (req: Request, res: Response) => {
    const user = res.locals.user._id
    const sessions = await getSessions({user: user, valid: true})
    return res.send(sessions)
}

export const logoutSessionHandler = async (req: Request, res: Response) => {
    const user = res.locals.user.session
    const newSession = await updateSession({_id: user}, {valid: false})
    return res.send({accessToken: null, refreshToken: null})
}