import { object, string } from "zod";

export const createUserSchema = object({
    body: object({
        name: string({
            required_error: 'Name is required'
        }),
        email: string({
            required_error: 'Email is required'
        }).email('Please enter a valid e-mail'),
        password: string({
            required_error: 'Please enter a password'
        }),
        passwordConfirmation: string({
            required_error: 'Please enter your password again'
        })
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: 'Your confirmation password must match your password',
        path: ['passwordConfirmation']
    })
})