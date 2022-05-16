import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import Link from 'next/link'
import { FC } from 'react'
import { firestore, getUserWithUsername, postToJSON, postToJSON2 } from '../../lib/firebase'
import { useDocument, useDocumentData } from 'react-firebase-hooks/firestore';
import styles from "../../styles/Home.module.css"
import { PostType } from "./index"
import PostContext from '../../components/PostContent';
import PostContent from '../../components/PostContent';
import AuthCheck from '../../components/AuthCheck';
import HeartButton from '../../components/HeartButton';

export async function getStaticProps({ params }: { params: {username: string, slug: string} }) {
  console.log(params)
  const { username, slug } = params
  const userDoc = await getUserWithUsername(username)

  // If no user, short circuit to 404 page
  if (!userDoc) {
    return {
      notFound: true
    }
  }

  let post;
  let path;

  if (userDoc) {
    const postRef = doc(firestore, 'posts', slug)
    const vanillaPost = await getDoc(postRef)
    // If no post, short circuit to 404 page
    if (!vanillaPost.exists()) {
      return {
        notFound: true
      }
    } 
    post = postToJSON(vanillaPost)
    path = postRef.path
  }
  return {
    props: { post, path },
    revalidate: 5000 // to later activate with a function
  }
}

export async function getStaticPaths() {

  // improve my using Admin Sdk to select empty docs
  const snapshot = await getDocs(collection(firestore, "posts"))

  const paths = snapshot.docs.map(doc => {
    const { slug, username } = doc.data()
    return {
      params: { username, slug }
    }
  })

  return {
    // must be in format:
    // paths: [
    // { params: { username, slug } }
    //],
    paths,
    fallback: "blocking" // if the page does not exist -> it server sides renders the pages, then caches in the cdn
    // if you have millions of pages, it does not generate them at build time, only when request comes in
  }
}



interface props {
  path: string
  post: PostType
}

const Post:FC<props> = ({ path, post }) => {
  const postRef = doc(firestore, path)
  const [realtimePost] = useDocumentData(postRef)// useDocumentData

  const usedPost: PostType = (realtimePost ? postToJSON2(realtimePost) : undefined) || post
  
  return (
    <main className={styles.container}>
      <section>
        <PostContent post={usedPost} />
      </section>
      <aside className='card'>
        <p>
          <strong>{usedPost.heartCount || 0} 🤍</strong>
        </p>
        <AuthCheck fallback={<Link href="/enter" ><button>💗 Sign Up</button></Link>}>
          <HeartButton postRef={postRef} />
        </AuthCheck>
      </aside>
    </main>
  )
}
export default Post