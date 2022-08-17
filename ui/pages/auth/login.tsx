import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import {string, TypeOf, object} from "zod"
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import styles from "../../styles/Register.module.css"

const createSessionSchema = object({
  email: string({
      required_error: 'You need to enter an e-mail'
  }).email('Please enter a valid e-mail'),
  password: string({
      required_error: 'You need to enter a password to login'
  })
})

type CreateSessionInput = TypeOf<typeof createSessionSchema>

const login = () => {

  const {register, formState: {errors}, handleSubmit} = useForm<CreateSessionInput>({resolver: zodResolver(createSessionSchema)})

  const router = useRouter()

  const [loginErrors, setLoginErrors] = useState(null)

  const onSubmit = async(input: CreateSessionInput) => {
    try{
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/v1/login`, {
        headers: {
          'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(input),
        credentials: 'include'
      })
      console.log(await res.json())
      router.push('/')
    }catch(e:any){
      setLoginErrors(e)
    }
  }

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor='email'>E-mail</label>
        <input id='email' type='email' {...register('email')} />
        <p>{errors.email?.message}</p>
        <label htmlFor='password'>Password</label>
        <input id='password' type='password' {...register('password')} />
        <p>{errors.password?.message}</p>
        <input type='submit'/>
      </form>
    </>
  )
}

export default login