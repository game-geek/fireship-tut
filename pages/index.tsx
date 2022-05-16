import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { auth, firestore, postToJSON } from "../lib/firebase"
import Loader from '../components/Loader'
import toast from "react-hot-toast"
import { query, collection, where, orderBy, limit, getDocs, Timestamp, startAfter, QueryDocumentSnapshot, DocumentData, startAt, getDoc, QuerySnapshot } from "firebase/firestore"
import { useState } from 'react'
import { PostsType, PostType } from "./[username]/index"
import PostFeed from '../components/PostFeed'

// Max post to query per page
const LIMIT = 1

export async function getServerSideProps(context: any) { 
  const usersRef = collection(firestore, "posts")
  const queryRef = query(usersRef, where("published", "==", true), orderBy('createdAt', 'desc'), limit(LIMIT))
  const postsVanilla = await getDocs(queryRef)
  const posts = postsVanilla.docs.map(doc => postToJSON(doc))
  console.log("length", posts.length)
  console.log(posts)
  return {
    props: { posts }
  }
}

export default function Home(props: { posts: PostsType }) {
  const [posts, setPosts] = useState(props.posts)
  const [lastVanillaPost, setLastVanillaPost] = useState<null | DocumentData>(null)
  const [loading, setLoading] = useState(false)
  const [postsEnd, setPostsEnd] = useState(false)

  async function getMorePosts() {
    if (postsEnd) {
      // for security ...
      return
    }

    setLoading(true)

    const last = posts[posts.length - 1]

    // prepare the new lot of docs
    const usersRef = collection(firestore, "posts")
    // in case its the first time
    const docRef = query(usersRef, where("uid", "==", last.uid), limit(1))
    const queryRef = query(usersRef, where("published", "==", true), orderBy("createdAt", "desc"), 
      startAfter(lastVanillaPost ? lastVanillaPost : (await getDocs(docRef)).docs[0]), limit(LIMIT));
    
    // get the new lot of docs
    const postsVanilla = await getDocs(queryRef)
    
    // set the new docs
    // @ts-ignore
    const newPosts: PostsType = postsVanilla.docs.map(doc => doc.data())
    setPosts(posts.concat(newPosts))
    
    
    setLoading(false)

    if (newPosts.length < LIMIT) {
      setPostsEnd(true)
      // remove nex post to fetch
      setLastVanillaPost(null)
    } else {
      // set the pure reference to the last doc because the DATA IS NOT NULL and THERE IS MORE DATA TO FETCH
      setLastVanillaPost(postsVanilla.docs[postsVanilla.docs.length-1])
    }
  }

  return (
    <div className={styles.container}>
      <PostFeed admin={false} posts={posts} />
      {!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}
      
      <Loader show={loading} />

      {postsEnd && "You have reached the end!"}

    </div>
  )
}



// firebase emulators:start --export-on-exit=./emulator --import=./emulator