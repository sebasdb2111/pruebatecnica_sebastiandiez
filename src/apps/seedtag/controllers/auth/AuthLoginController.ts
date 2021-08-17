import {Request, Response}         from 'express';
import AuthLogin                   from '../../../../contexts/seedtag/auth/application/AuthLogin';
import * as httpStatus             from 'http-status';
import Controller                  from '../Controller';
import AuthLoginDto                from '../../../../contexts/seedtag/auth/domain/dto/AuthLoginDto';
import PasswordIsNotValidException from '../../../../contexts/seedtag/auth/domain/exceptions/PasswordIsNotValidException';


export class AuthLoginController implements Controller
{
    constructor(private authLogin: AuthLogin)
    {
    }

    async run(req: Request, res: Response)
    {
        const authLoginDto: AuthLoginDto = new AuthLoginDto(
            req.body.username,
            req.body.password,
        );

        try {
            const token = await this.authLogin.run(authLoginDto);
            res.status(httpStatus.ACCEPTED).send(token);
        }
        catch (e) {
            if (e instanceof PasswordIsNotValidException) {
                res.status(httpStatus.UNAUTHORIZED).send(e.message);
            } else {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json(e);
            }
        }
    }
}
