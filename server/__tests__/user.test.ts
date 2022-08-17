//TESTS TO BE DONE
//If name, password, passwordconfirmation don't match, expect status 400
//If all are valid, expect status 201 and userPayload
//If function throws an error, expect status 400
//If email, password are valid on login, expect accessToken, refreshToken

import createServer from "../utils/server"
import mongoose from "mongoose"
import * as UserService from "../service/user.service"
import * as SessionService from "../service/session.service"
import supertest from "supertest"

const app = createServer()

const userId = new mongoose.Types.ObjectId().toString()

const newUserInput = {
    name: 'Person',
    email: 'person@gmail.com',
    password: 'personalPassword',
    passwordConfirmation: 'personalPassword'
}

const newUserPayload = {
    _id: userId,
    name: newUserInput.name,
    email: newUserInput.email
}

const newSessionPayload = {
    user: userId,
    _id: new mongoose.Types.ObjectId().toString(),
    agent: 'Jest testing client'
}

const loginInput = {
    email: newUserInput.email,
    password: newUserInput.password
}


describe('user', () => {
    describe('Create user route', () => {
        describe('If name, email, password, confirmation password are valid', () => {
            it('should expect status 201 and userPayload', async () => {
                const createUserServiceMock = jest.spyOn(UserService, "createUser")

                //@ts-ignore
                .mockReturnValueOnce(newUserPayload)

                const {statusCode, body} = await supertest(app).post('/api/v1/createUser')
                .send(newUserInput)

                expect(statusCode).toBe(201)

                expect(body).toStrictEqual(newUserPayload)

                expect(createUserServiceMock).toHaveBeenCalledWith(newUserInput)
            })
        })
        describe('If password and confirmation password don\'t match', () => {
            it('should expect status 400', async() => {
                const createUserServiceMock = jest.spyOn(UserService, "createUser")
                //@ts-ignore
                .mockReturnValueOnce(newUserPayload)

                const {statusCode} = await supertest(app).post('/api/v1/createUser')
                .send({...newUserInput, passwordConfirmation: 'notPersonalPassword'})

                expect(statusCode).toBe(400)

                expect(createUserServiceMock).not.toHaveBeenCalled
            })
        })
        describe('If create user service throws an error', () => {
            it('should expect 400, and service should be called', async() => {
                const errorMessage = 'There was an error'
                
                const createUserServiceMock = jest.spyOn(UserService, "createUser")
                //@ts-ignore
                .mockRejectedValueOnce(errorMessage)

                const {statusCode} = await supertest(app).post('/api/v1/createUser')
                .send(newUserInput)

                expect(statusCode).toBe(400)

                expect(createUserServiceMock).toHaveBeenCalledWith(newUserInput)
            })
        })
    })
})

describe('session', () => {
    describe('create session route', () => {
        describe('if email, password are valid', () => {
            it('should expect status 200 and accessToken and refreshToken', async() => {
                const mockVerifyPassword = jest.spyOn(UserService, "verifyPassword")
                //@ts-ignore
                .mockReturnValueOnce(newUserPayload)

                const mockCreateSessionService = jest.spyOn(SessionService, "createSession")
                //@ts-ignore
                .mockReturnValueOnce(newSessionPayload)

                const {statusCode, body} = await supertest(app).post('/api/v1/login')
                .send(loginInput)
                console.log(body)
                expect(statusCode).toBe(200)

                expect(body).toStrictEqual({
                    accessToken: expect.any(String),
                    refreshToken: expect.any(String)
                })
            })
        })
    })
})