import mongoose from "mongoose";

export interface ProductInput{
    name: string,
    image: string,
    price: number,
    description: string
}

export interface ProductDocument extends ProductInput, mongoose.Document{
    createdAt: Date,
    updatedAt: Date
}

const productSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
    name: {type: String, required: true},
    image: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true}
    }, {
    timestamps: true
    }
)

const ProductModel = mongoose.model<ProductDocument>("Product", productSchema)

export default ProductModel