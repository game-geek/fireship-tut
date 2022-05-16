import Link from 'next/link'
import { FC, ReactChild, ReactChildren, useContext } from 'react'
import { UserContext } from '../lib/context'

interface props {
    children: ReactChild | ReactChild[] | ReactChildren | ReactChildren[];
    fallback?: JSX.Element
}

const AuthCheck:FC<props> = ({ children, fallback }) => {
    const { username } = useContext(UserContext)

  return (
    <>
        {username ? children : fallback || <Link href="/enter">You must be signed in</Link> }
    </>
  )
}

export default AuthCheck