import mongoose from "mongoose"
import config from "config"
import bcrypt from "bcrypt"

export interface UserInput{
    name: string,
    email: string,
    password: string,
}

export interface UserDocument extends UserInput, mongoose.Document{
    createdAt: Date,
    updatedAt: Date,
    comparePassword: (candidatePassword: string) => Promise<Boolean>
}

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
}, {
    timestamps: true
})

userSchema.pre("save", async function(next){
    const user = this as UserDocument
    if(!user.isModified("password")){
        return next()
    }
    const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"))

    const hashed = bcrypt.hashSync(user.password, salt)

    user.password = hashed

    return next()
})

userSchema.methods.comparePassword = function(candidatePassword: string){
    const user = this as UserDocument
    return bcrypt.compare(candidatePassword, user.password).catch((e) => false)
}

const UserModel = mongoose.model<UserDocument>("User", userSchema)

export default UserModel