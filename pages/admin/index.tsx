import { addDoc, collection, doc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, where } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { FC, FormEvent, useContext, useState } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'
import AuthCheck from '../../components/AuthCheck'
import Metatags from "../../components/MetaTags"
import PostFeed from '../../components/PostFeed'
import { UserContext } from '../../lib/context'
import { auth, firestore, getPostsFromUsername } from '../../lib/firebase'
import { PostsType, PostType } from '../[username]'
import kebabCase from "lodash.kebabcase"
import styles from '../../styles/Admin.module.css';
import toast from 'react-hot-toast'
import React from 'react'
// npm i react-hook-form

interface props {

}

const AdminPostsPage:FC<props> = ({ }) => {


  return (
    <main>
      <Metatags title='admin page' />
      <AuthCheck>
        <h1>Admin posts</h1>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  )
}

async function temp(ref: any) {
  return await getDocs(ref)
}

function PostList() {
  const { username } = useContext(UserContext)
  const ref = collection(firestore, 'posts')
  const queryRef = query(ref, where("username", "==", username), orderBy('createdAt', 'desc'))
  
  const [value, loading, error] = useCollection(queryRef);
  return (
    <>
      {value && (
        <>
          <h1>Manage your Posts</h1>
          {/*@ts-ignore*/}
          <PostFeed posts={value.docs.map(doc => doc.data())} admin />
        </>
      )}
    </>
)
}
function CreateNewPost() {
 const router = useRouter()
 const { username, user } = useContext(UserContext)
 const [title, setTitle] = useState('')

 // Ensure slug is URL safe
 const slug = encodeURI(kebabCase(title))

 // Validate length
 const isValid = title.length > 3 && title.length < 100

 // Create a new post in firestore
 const createPost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const uid = user?.uid
    const ref = doc(firestore, "posts", slug)

    // Tip: give all fields a default value here 
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: "# hello world!",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0
    }

    await setDoc(ref, data)

    toast.success("Post created!")

    // Imperative navigation after doc is set
    router.push(`/admin/${slug}`)
 }

  return (
    <form onSubmit={createPost}>
      <input
       type="text"
       value={title}
       onChange={e => setTitle(e.target.value)} 
       placeholder="My Awesome Article!"
       className={styles.input}
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create new post
      </button>
    </form>
  )
}

export default AdminPostsPage