import { Request, Response } from "express";
import { ProductInput } from "../model/product.model";
import { createProduct, findProduct, updateProduct, deleteProduct } from "../service/product.service";
import log from "../utils/logger"

interface BodyInput extends ProductInput{
    user: string 
}

interface ParamsInput{
    productId: string
}

export const createProductHandler = async (req: Request<{}, {}, ProductInput>, res: Response) => {
    try{
        const userId:string = res.locals.user._id
        if(userId){
            const product = await createProduct(req.body, userId)
            res.status(201).send(product)
        }else{
            res.status(400).send('No userId found in res.locals.user._id')
        }
    }catch(e:any){
        log.error(e)
        res.status(400).send('Create Product Failed')
    }
}

export const findProductHandler = async (req: Request<ParamsInput>, res: Response) => {
    try{
        const product = await findProduct({_id: req.params.productId})
        if(product){
            res.send(product)
        }
    }catch(e:any){
        log.error(e)
        res.status(404).send('No product with said id exists')
    }
}

export const updateProductHandler = async (req: Request<ParamsInput, {}, BodyInput>, res: Response) => {
    try{
        const product = await findProduct({_id: req.params.productId})
        if(product){
            const product = await updateProduct({_id: req.params.productId}, req.body)
            res.send(product)
        }else{
            res.status(404).send('No product with said id exists')
        }
    }catch(e:any){
        log.error(e)
        res.status(400).send('Product could not be updated')
    }
}

export const deleteProductHandler = async (req: Request<ParamsInput>, res: Response) => {
    try{
        const product = await findProduct({_id: req.params.productId})
        if(product){
            const product = await deleteProduct({_id: req.params.productId})
            res.send('Product has been deleted')
        }else{
            res.status(404).send('No product with said id exists')
        }
    }catch(e:any){
        log.error(e)
        res.status(400).send('Product could not be deleted')
    }
}