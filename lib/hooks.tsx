import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
// easy way to listen to the current user in firebase
import { useAuthState } from "react-firebase-hooks/auth";
import { UserType } from "./context";
import { auth, firestore } from "./firebase";


export function useUserData() {
    const [firebaseUser] = useAuthState(auth)
    const [username, setUsername] = useState(null)
    // Fireship skips this and uses firebaseUser as user (i dont do it that way because i want to know everything that is in the user)
    const [user, setUser] = useState<UserType>(null)
  
    useEffect(() => {
      // turn off realtime subscription
      let unsubscribe;
  
      if (firebaseUser) {
        const ref = doc(firestore, "users", firebaseUser.uid);
          unsubscribe = onSnapshot(ref, (doc) => {
            setUsername(doc.data()?.username)
            // fireship skips this
            setUser({photoURL: String(firebaseUser.photoURL), uid: firebaseUser.uid, displayName: String(firebaseUser.displayName)})
            console.log("logged in", firebaseUser)
      });
      } else {
        setUsername(null)
        // fireship skips this
        setUser(null) 
      }
  
      return unsubscribe
    }, [firebaseUser])

    return { user, username }
}