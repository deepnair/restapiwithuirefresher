import { object, string } from "zod";

const sessionInputSchema = object({
    body: object({
        email: string({
            required_error: 'You need to enter an e-mail'
        }).email('Please enter a valid e-mail'),
        password: string({
            required_error: 'You need to enter a password to login'
        })
    })
})

export default sessionInputSchema