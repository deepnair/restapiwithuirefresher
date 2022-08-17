import type { GetServerSideProps, GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import useSWR from 'swr'
import { string } from 'zod'
import fetcher from '../utils/fetcher'
import { CreateUserInput } from './auth/register'

interface LocalsUser{
  _id: string,
  __v: number,
  name: string,
  email: string,
  createdAt: Date,
  updatedAt: Date,
  iat: string,
  exp: number
}

const Home: NextPage<{fallbackData: LocalsUser}> = ({fallbackData}) => {
  
  const {data} = useSWR<null|LocalsUser>(`${process.env.NEXT_PUBLIC_SERVER}/api/v1/getMe`, fetcher, {fallbackData})

  return (
    <>
    {data ? <p>Welcome, {data.name}</p> : <p>Please login <Link href='/auth/login'><a>here</a></Link> to access this page. Or if you don't have an account <Link href='/auth/register'><a>click here</a></Link> to create an account.</p>}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const fallbackData = await fetcher(`${process.env.NEXT_PUBLIC_SERVER}/api/v1/getMe`, context.req.headers)

  return{
    props:{
      fallbackData
    }
  }
}


export default Home
