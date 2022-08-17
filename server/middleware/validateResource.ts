import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export const validateResource = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try{
        schema.parse({
            body: req.body,
            params: req.params,
            query: req.query
        })
        return next()
    }catch(e:any){
        res.status(400).send(e)
    }
}