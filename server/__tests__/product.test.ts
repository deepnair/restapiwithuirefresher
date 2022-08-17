import {MongoMemoryServer} from "mongodb-memory-server"
import mongoose from "mongoose"
import supertest from "supertest"
import { createProduct } from "../service/product.service"
import { signJwt } from "../utils/jwt.utils"
import createServer from "../utils/server"

//Things to test
//Get Product Route
    //If product doesn't exist expect status 404
    //If product exists expect productPayload
//Create product route
    //If user isn't logged in, say not authorized
    //If user is logged in, and product created, return created productPayload

const app = createServer()

const userId = new mongoose.Types.ObjectId().toString()

const userPayload = {
    _id: userId,
    name: "Person",
    password: "personhasanicepassword",
    email: "person@gmail.com"
}

const productPayload = {
    name: 'The product',
    price: 100,
    description: 'This product is the product that will be used to stand in for the test. The description needs to be so long as there is a minimum of 100 characters in the schema of the create product. Therefore this long description has to pass that criteria.',
    image: 'theproduct.jpg'
}



describe('product', () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create()
        await mongoose.connect(mongoServer.getUri())
    })
    afterAll(async() => {
        await mongoose.disconnect()
        await mongoose.connection.close()
    })
    describe('get product route', () => {
        describe('if the product doesn\'t exist', () => {
            it('should have a status of 404', async() => {
                const productId = 'product123'

                const {statusCode} = await supertest(app).get(`/api/v1/findProduct/${productId}`)

                expect(statusCode).toBe(404)
            })
        })
        describe('if the product exists', () => {
            it('should return a status of 200 and return the product', async() => {
                const product = await createProduct(productPayload, userId)

                const productIdentity = String(product._id)
                const {statusCode, body} = await supertest(app).get(`/api/v1/findProduct/${productIdentity}`)

                expect(statusCode).toBe(200)

  
                expect(body).toStrictEqual({...product,
                _id: productIdentity,
                user: String(product.user),
                createdAt: expect.any(String),
                updatedAt: expect.any(String)
                })
            })
        })
    })
    describe('create product route', () => {
        describe('if not logged in and you create a product', () => {
            it('should expect a status 401', async() => {
                const {statusCode} = await supertest(app).post('/api/v1/createProduct')
                .send(productPayload)

                expect(statusCode).toBe(401)
            })
        })
        describe('if you\'re logged in and create a product', () => {
            it('should expect a status 201, and return the body', async() => {
                const accessToken = signJwt(userPayload, {expiresIn: "15m"})

                const {statusCode, body} = await supertest(app).post('/api/v1/createProduct')
                .set("Authorization", `Bearer ${accessToken}`)
                .send(productPayload)

                expect(statusCode).toBe(201)

                expect(body).toStrictEqual({
                    ...productPayload,
                    user: String(userId),
                    __v: 0,
                    _id: expect.any(String),
                    updatedAt: expect.any(String),
                    createdAt: expect.any(String)
                })
            })
        })
    })
})