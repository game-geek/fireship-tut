import { doc, DocumentData, DocumentReference, increment, writeBatch } from 'firebase/firestore'
import { FC, useContext } from 'react'
import { useDocument } from 'react-firebase-hooks/firestore'
import { UserContext } from '../lib/context'
import { firestore } from '../lib/firebase'

interface props {
    postRef: DocumentReference<DocumentData>
}

// Allows user to heart or like a post
const HeartButton:FC<props> = ({ postRef }) => {
    const { user } = useContext(UserContext)
    if (!user) {
        throw new Error("you must be signed in")
    }
    // Listen to heart document for currently logged in user
    const heartRef = doc(postRef, "hearts", user.uid)
    const [heartDoc] = useDocument(heartRef)

    async function addHeart() {
        if (!user) return
        const uid = user.uid
        const batch = writeBatch(firestore);
        batch.update(postRef, {heartCount: increment(1)}); 
        batch.set(heartRef, { uid })
        await batch.commit();
    }

    async function removeHeart() {
        const batch = writeBatch(firestore);
        batch.update(postRef, {heartCount: increment(-1)}); 
        batch.delete(heartRef)
        await batch.commit();
    }


  return heartDoc?.exists() ? (
      <button onClick={removeHeart}>💔 Unheart</button>
  ) : (
      <button onClick={addHeart}>💗 Heart</button>
  )
}

export default HeartButton