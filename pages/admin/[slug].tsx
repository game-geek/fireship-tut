import { doc, DocumentData, DocumentReference, serverTimestamp, updateDoc } from 'firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ChangeEvent, FC, FormEvent, useContext, useEffect, useRef, useState } from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import AuthCheck from '../../components/AuthCheck'
import ImageUploader from '../../components/ImageUploader'
import { UserContext } from '../../lib/context'
import { firestore } from '../../lib/firebase'
import styles from '../../styles/Admin.module.css';
import { PostType } from '../[username]'

interface props {

}

const AdminPostsEdit:FC<props> = ({ }) => {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  )
}

function PostManager() {
  const [preview, setPreview] = useState(false)

  const router = useRouter()
  const { slug } = router.query
  
  // @ts-ignore
    const postRef = doc(firestore, "posts", slug)
    // @ts-ignore
    const [post]: PostType | undefined | null = useDocumentData(postRef) // get the data once: useDocumentDataOnce

    

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm postRef={postRef} defaultValues={post} preview={preview} />
          </section>
          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview) }>{preview ? "Edit" : "Preview"}</button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue">Live view</button>
            </Link>
          </aside>
        </>
      )}
    </main>
  )
}

interface PostFormProps {
  postRef: DocumentReference<DocumentData>
  defaultValues: PostType
  preview: boolean
}

function PostForm({ defaultValues, postRef, preview }: PostFormProps) {
  const [content, setContent] = useState(defaultValues.content)
  const [published, setPublished] = useState(defaultValues.published)
  const [errorMessage, setErrorMessage] = useState<null | string>("")

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    updateDoc(postRef, {
      content,
      published,
      updatedAt: serverTimestamp()
    })
    toast.success("Modified Post")
  }

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value)
    if (e.target.value.length < 10) {
      setErrorMessage("too short")
    } else if (e.target.value.length > 20000){
      setErrorMessage("too long")
    } else {
      setErrorMessage(null)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>

        <ImageUploader />

        <textarea name="content" value={content} onChange={handleChange}></textarea>

         <fieldset>
           <input type="checkbox" className={styles.checkbox} name="published" checked={published} onChange={e => setPublished(e.currentTarget.checked)} />
           <label>Published</label>
         </fieldset>
         {errorMessage && <p className="text-danger">{errorMessage}</p>}

         <button type='submit' className='btn-green' disabled={errorMessage === null ? false : true}>
           Save Changes
         </button>
      </div>
    </form>
  )
}

export default AdminPostsEdit