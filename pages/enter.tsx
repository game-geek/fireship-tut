import { ChangeEvent, FC, FormEvent, useCallback, useEffect, useState } from 'react'
import { auth, firestore, googleAuthProvider } from "../lib/firebase"
import { GoogleAuthProvider, signInWithPopup }from "firebase/auth"
import { useContext } from "react"
import { UserContext } from '../lib/context';
// npm i lodash.debounce
// npm i --save-dev @types/lodash.debounce
import debounce from "lodash.debounce"
import GoogleLogo from "../public/google.png"
import Image from 'next/image'
import { useUserData } from '../lib/hooks';
import { doc, getDoc, writeBatch } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import styles from '../styles/Home.module.css'
// npm i lodash.kebabcase
// npm i --save-dev @types/lodash.kebabcase
import kebabCase from "lodash.kebabcase"

interface props {

}

const Enter:FC<props> = ({ }) => {
  const { user, username } = useContext(UserContext)

  // 1. user signed out <SignInButton />
  // 2. user signed in, but is missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />
  return (
    <div className={styles.container}>
      {user ? 
        !username ? <UsernameForm /> : <SignOutButton />
        :
        <SignInButton />
      }
    </div>
  )
}

// sign in with google button
function SignInButton() {

  const signInWithGoogle = async() => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider)
    } catch(err) {
      if (err instanceof Error) {
        console.log(err.message)
      }
    }
  }

  return (
    <button className='btn-google' onClick={signInWithGoogle}>
      <Image src={GoogleLogo} width="50" height="50" /> Sign in with Google
    </button>
  )
}

// sign out button
function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>
}

function UsernameForm() {
  const [formValue, setFormValue] = useState("")
  const [isValid, setIsValid] = useState(false)
  const [loading, setLoading] = useState(false)

  const { user, username } = useContext(UserContext)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (user?.uid) {
      // Create refs for both documents
      const userDoc = doc(firestore, "users", user.uid)
      const usernameDoc = doc(firestore, "usernames", formValue)
      
      // commit both docs together as a batch write
      const batch = writeBatch(firestore); 
      batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName })
      batch.set(usernameDoc, { uid: user.uid });

      await batch.commit();
    }

  }

  useEffect(() => {
    console.log(formValue)
    checkUsername(formValue)
  }, [formValue])

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    // force form value typed in form to match correct format
    const val = e.target.value.toLowerCase()
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val)
      setLoading(false)
      setIsValid(false)
    }

    if (re.test(val)) {
      setFormValue(val)
      setLoading(true)
      setIsValid(false)
    }
  }
  // hit the database for username match after each debouce change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(
      debounce( async (username: string) => {
        if (username.length >= 3) {
          const ref = doc(firestore, "usernames", username)
          const d = await getDoc(ref)
          console.log("Firestore read executed !")
          setIsValid(!d.exists())
          setLoading(false)
        }
      }, 500),
     [])

  return (
    <div>
        {!username && (
        <section>
          <h3>Choose Username</h3>
          <form onSubmit={onSubmit}>
            <input name="username" placeholder='username' value={formValue} onChange={onChange} />
            <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
            <button type='submit' className="btn-green" disabled={!isValid}>Submit</button>
            <h3>Debug State</h3>
            <div>
              Username: {formValue}
              <br />
              Loading: {loading.toString()}
              <br />
              Username Valid: {isValid.toString()}
            </div>
          </form>
        </section>
      )}
    </div>
  )
}


function UsernameMessage({ username, isValid, loading }: {username: string, isValid: boolean, loading: boolean}) {
  if (loading) {
    return <p>Cheking...</p>
  } else if (isValid) {
      return <p className='text-success'>{username} is available!</p>
  } else if (username) { //  && !isValid
      return <p className='text-danger'>That username is taken!</p>
  } else {
    return <p></p>
  }
}



export default Enter
