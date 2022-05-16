import { FC } from 'react'
import { UserType } from "../lib/context"

interface props {
    user: UserType & {username: string}
}

const UserProfile:FC<props> = ({ user }) => {
  return (
    <div className='box-center'>
        <img src={user?.photoURL} alt="user image" className='card-img-center' />
        <p>
            <i>@{user?.username}</i>
        </p>
        <h1>{user?.displayName}</h1>
    </div>
  )
}

export default UserProfile