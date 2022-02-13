import { Request, Response, NextFunction } from 'express';
import usersService from '../services/users.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:users-controller');

class UsersMiddleWare {
    constructor() {
        this.isValidRequestBody = this.isValidRequestBody;
    }

    validateRequiredUserBodyFields = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        if (this.isValidRequestBody(req.body)) {
            next();
        } else {
            res.status(400).send({
                error: 'Missing required fields email and password',
            });
        }
    };

    async validateSameEmailDoesntExist(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const user = await usersService.getUserByEmail(req.body.email);
        if (user) {
            res.status(400).send({ error: 'User email already exists' });
        } else {
            next();
        }
    }

    async validateSameEmailBelongToSameUser(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const user = await usersService.getUserByEmail(req.body.email);
        if (user && user._id === req.params.userId) {
            next();
        } else {
            res.status(400).send({ error: `Invalid email` });
        }
    }

    validatePatchEmail = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        if (req.body.email) {
            log('Validating email', req.body.email);

            this.validateSameEmailBelongToSameUser(req, res, next);
        } else {
            next();
        }
    };

    async validateUserExists(req: Request, res: Response, next: NextFunction) {
        const user = await usersService.readById(req.params.userId);
        if (user) {
            next();
        } else {
            res.status(404).send({
                error: `User ${req.params.userId} not found`,
            });
        }
    }

    async extractUserId(req: Request, res: Response, next: NextFunction) {
        req.body.id = req.params.userId;
        next();
    }

    isValidRequestBody(reqBody: any) {
        return reqBody && reqBody.email && reqBody.password;
    }
}

export default new UsersMiddleWare();
