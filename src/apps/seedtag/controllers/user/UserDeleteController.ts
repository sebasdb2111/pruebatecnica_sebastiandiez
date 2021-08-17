import {Request, Response}        from 'express';
import UserCreate                 from '../../../../contexts/seedtag/users/application/UserCreate';
import * as httpStatus            from 'http-status';
import Controller                 from '../Controller';
import UserDto                    from '../../../../contexts/seedtag/users/domain/UserDto';
import UserAlreadyExistsException from '../../../../contexts/seedtag/users/domain/exceptions/UserAlreadyExistsException';

export class UserCreateController implements Controller
{
    constructor(private userCreate: UserCreate)
    {
    }

    async run(req: Request, res: Response)
    {
        const userDto: UserDto = new UserDto(
            req.body.username,
            req.body.password,
            req.body.email,
            req.body.role
        );

        try {
            const user = await this.userCreate.run(userDto);
            res.status(httpStatus.CREATED).send(user);
        }
        catch (error) {
            if (error instanceof UserAlreadyExistsException) {
                res.status(httpStatus.BAD_REQUEST).send(error.message);
            } else {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
            }
        }
    }
}
