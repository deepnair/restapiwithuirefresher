import { number, object, string } from "zod";

const params = {
    params: object({
        productId: string({
            required_error: 'A productId is required'
        })
    })
}

const body = {
    body: object({
        name: string({
            required_error: 'Your product needs to have a name'
        }),
        image: string(),
        price: number({
            required_error: 'Your product needs a price'
        }),
        description: string({
            required_error: 'Your product needs a description'
        }).min(100, 'Your description should have atleast 100 characters')
    })
}

const updateBody = {
    body: body.body.partial()
}

export const createProductSchema = object({...body})

export const findProductSchema = object({...params})

export const updateProductSchema = object({...params, ...updateBody})

export const deleteProductSchema = object({...params})