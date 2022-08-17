import { NextFunction, Request, Response } from "express";
import { get, random } from "lodash";
import config from "config";
import { reIssueAccessToken } from "../service/session.service";
import { verifyJwt } from "../utils/jwt.utils";

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = get(req, "cookies.accessToken") || get(req, "headers.authorization", "").replace(/Bearer\s/, "")
    const refreshToken = get(req, "cookies.refreshToken") || get(req, "headers.x-refresh", "")

    if(!accessToken){
        return next()
    }

    const {decoded, expired} = verifyJwt(accessToken)

    if(decoded){
        res.locals.user = decoded
        return next()
    }

    if(refreshToken && expired){
        const accessToken = await reIssueAccessToken(refreshToken)
        if(accessToken){
            res.cookie("accessToken", accessToken, {
                maxAge: 900000,
                httpOnly: true,
                domain: config.get<string>('domain'),
                path: '/',
                sameSite: config.get<boolean>('sameSite'),
                secure: config.get<boolean>('secure')
            })
            res.setHeader('x-access-token', accessToken)
            const {decoded} = verifyJwt(accessToken)
            res.locals.user = decoded
            return next()
        }
    }

    return next()

}

export default deserializeUser