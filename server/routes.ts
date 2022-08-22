import {Express, Request, Response} from 'express'
import { createUserHandler, getCurrentUser } from './controller/user.controller'
import { validateResource } from './middleware/validateResource'
import { createUserSchema } from './schema/user.schema'
import createSessionSchema from './schema/session.schema'
import { createSessionHandler, getSessionsHandler, logoutSessionHandler } from './controller/session.controller'
import requireUser from './middleware/requireUser'
import { createProductSchema, deleteProductSchema, findProductSchema, updateProductSchema } from './schema/product.schema'
import { createProductHandler, deleteProductHandler, findProductHandler, updateProductHandler } from './controller/product.controller'

const routes = (app: Express) => {
    app.route('/healthcheck').get((req: Request, res: Response) => res.sendStatus(200))

    app.route("/api/v1/createuser").post(validateResource(createUserSchema), createUserHandler)
    
    app.route('/api/v1/login').post(validateResource(createSessionSchema), createSessionHandler)
    app.route('/api/v1/getSessions').post(requireUser, getSessionsHandler)
    app.route('/api/v1/logout').patch(requireUser, logoutSessionHandler)

    app.route('/api/v1/createProduct').post([requireUser, validateResource(createProductSchema)], createProductHandler)
    app.route('/api/v1/findProduct/:productId').get(validateResource(findProductSchema), findProductHandler)
    app.route('/api/v1/updateProduct/:productId').patch([requireUser, validateResource(updateProductSchema)], updateProductHandler)
    app.route('/api/v1/deleteProduct/:productId').delete([requireUser, validateResource(deleteProductSchema)], deleteProductHandler)

    app.route('/api/v1/getMe').get(requireUser, getCurrentUser)
}

export default routes
