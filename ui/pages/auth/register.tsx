import React from 'react'
import { useForm } from 'react-hook-form'
import {object, string, number, TypeOf} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {useState} from "react"
import styles from "../../styles/Register.module.css"
import { useRouter } from 'next/router'

const createUserSchema = object({
  name: string().min(1),
  email: string().email('Please enter a valid e-mail').min(1),
  password: string().min(1),
  passwordConfirmation: string().min(1)})
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Your confirmation password must match your password',
    path: ['passwordConfirmation']
  })

export type CreateUserInput = TypeOf <typeof createUserSchema>

const register = () => {

  const {register, formState: {errors}, handleSubmit} = useForm<CreateUserInput>({resolver: zodResolver(createUserSchema)})

  const [registerErrors, setRegisterErrors] = useState(null)

  const router = useRouter()

  const onSubmit = async (input: CreateUserInput) => {
    try{
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/v1/createUser`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(input)
      })
      console.log(await res.json())
      router.push('/auth/login')
    }catch(e:any){
      setRegisterErrors(e)
    }
  }

  

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor='name'>Name</label>
        <input id='name' type='text' {...register('name')} />
        <p>{errors.name?.message}</p>
        <label htmlFor='email'>E-mail</label>
        <input id='email' type='email' {...register('email')} />
        <p>{errors.email?.message}</p>
        <label htmlFor='password'>Password</label>
        <input id='password' type='password' {...register('password')} />
        <p>{errors.password?.message}</p>
        <label htmlFor='passwordConfirmation'>Confirm Password</label>
        <input id='passwordConfirmation' type='password' {...register('passwordConfirmation')} />
        <p>{errors.passwordConfirmation?.message}</p>
        <input type='submit'/>
      </form>
    </>
  )
}

export default register