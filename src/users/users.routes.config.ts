import { CommonRoutesConfig } from '../common/common.routes.config';
import UsersController from './controllers/users.controller';
import UsersMiddleWare from './middleware/users.middleware';
import { Application, Request, Response, NextFunction } from 'express';

export class UsersRoutes extends CommonRoutesConfig {
    constructor(app: Application) {
        super(app, 'UsersRoute');
    }

    configureRoutes(): Application {
        this.app
            .route('/users')
            .get(UsersController.listUsers)
            .post(
                UsersMiddleWare.validateRequiredUserBodyFields,
                UsersMiddleWare.validateSameEmailDoesntExist,
                UsersController.createUser
            );

        this.app.param(`userId`, UsersMiddleWare.extractUserId);
        this.app
            .route('/users/:userId')
            .all(UsersMiddleWare.validateUserExists)
            .get(UsersController.getUserById)
            .delete(UsersController.removeUser);

        this.app.put(`/users/:userId`, [
            UsersMiddleWare.validateRequiredUserBodyFields,
            UsersMiddleWare.validateSameEmailBelongToSameUser,
            UsersController.put,
        ]);

        this.app.patch('/users/:userId', [
            UsersMiddleWare.validatePatchEmail,
            UsersController.patch,
        ]);

        return this.app;
    }
}
