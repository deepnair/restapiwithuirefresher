import {Request, Response} from "express"
import {UserInput} from "../model/user.model"
import { createUser } from "../service/user.service"

export const createUserHandler = async (req: Request<{}, {}, UserInput>, res: Response) => {
    try{
        const user = await createUser(req.body)
        if(user){
            res.status(201).send(user)
        }
    }catch(e:any){
        res.status(400).send(e)
    }
}

export const getCurrentUser = async (req: Request, res: Response) => {
    try{
        return res.send(res.locals.user)
    }catch(e:any){
        return res.sendStatus(400)
    }
}