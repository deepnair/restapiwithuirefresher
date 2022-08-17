import { FilterQuery, UpdateQuery } from "mongoose";
import ProductModel, { ProductDocument, ProductInput } from "../model/product.model";

export const createProduct = async (input: ProductInput, user: string) => {
    try{
        const product = await ProductModel.create({...input, user})
        return product.toJSON()
    }catch(e:any){
        throw new Error(e)
    }
}

export const findProduct = async(query: FilterQuery<ProductDocument>) => {
    return await ProductModel.findOne(query).lean()
}

export const updateProduct = async(query: FilterQuery<ProductDocument>, update: UpdateQuery<ProductDocument>) => {
    return await ProductModel.findOneAndUpdate(query, update, {new: true})
}

export const deleteProduct = async(query: FilterQuery<ProductDocument>) => {
    return await ProductModel.deleteOne(query)
}

