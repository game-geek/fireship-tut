import { FC } from 'react'
import UserProfile from "../../components/UserProfile"
import PostFeed from "../../components/PostFeed"
import { getUserWithUsername, getPostsFromUsername, postToJSON } from "../../lib/firebase"
import { DocumentData } from 'firebase/firestore'
import { UserType } from '../../lib/context'

interface QueryProps {
  query: { 
    username: string 
  }
}

export async function getServerSideProps({ query }: QueryProps) {
  const { username } = query

  const userDoc = await getUserWithUsername(username)

  // JSON serializable data
  let user = null
  let posts = null

  if (userDoc && userDoc.docs.length) {
    user = userDoc.docs[0].data()
    posts = (await getPostsFromUsername(username)).docs.map(doc => postToJSON(doc))
  }

  return {
    props: { user, posts } // will be passed to the page component as props
  }
}

export type PostType = {
  createdAt: number
  updatedAt: number
  username: string
  uid: string
  title: string
  slug: string
  published: boolean
  heartCount: number
  content: string
}
export type PostsType = PostType[]


interface props {
  user: UserType & {username: string};
  posts: PostsType
}

const UserProfilePage:FC<props> = ({ user, posts }) => {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} admin={false} />
    </main>
  )
}
export default UserProfilePage