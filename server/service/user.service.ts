import { omit } from "lodash";
import { FilterQuery } from "mongoose";
import UserModel, { UserDocument, UserInput } from "../model/user.model";

export const createUser = async (userInput: UserInput) => {
    try{
        const user = await UserModel.create(userInput)
        return omit(user.toJSON(), "password")
    }catch(e:any){
        throw new Error(e)
    }
}

export const verifyPassword = async ({email, password}: {email: string, password: string}) => {
    const user = await UserModel.findOne({email})
    if(!user){
        return false
    }
    const isValid = await user.comparePassword(password)
    if(!isValid){
        return false
    }
    return omit(user.toJSON(), "password")
}

export const findUser = (query: FilterQuery<UserDocument>) => {
    return UserModel.findOne(query).lean()
}