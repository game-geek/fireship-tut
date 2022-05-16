import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, collection, query, where, limit, getDocs, orderBy, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { getAuth, connectAuthEmulator, GoogleAuthProvider  } from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { PostType } from "../pages/[username]";

const firebaseConfig = {
    apiKey: "AIzaSyCjBNOQT2Uo2CwY2CN-04PmZcJSoZce4jE",
    authDomain: "nextjs-85811.firebaseapp.com",
    projectId: "nextjs-85811",
    storageBucket: "nextjs-85811.appspot.com",
    messagingSenderId: "845795845655",
    appId: "1:845795845655:web:93498c5e8e48966c3f1e52"
  };

// Initialize firebase
let app: any;
if (!getApps().length) {
  // firebase.initializeApp(firebaseConfig);
  app = initializeApp(firebaseConfig);
} else {
  console.log("re-render-firebase")
  app = getApp() // returns the default app -> getApp("name of app") returns specified app -> getApps() returns a list of apps
}

// Initialize Cloud Firestore and get a reference to the service
const firestore = getFirestore(app);
// connectFirestoreEmulator(firestore, 'localhost', 8080);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
// connectAuthEmulator(auth, "http://localhost:9099");
const googleAuthProvider = new GoogleAuthProvider()

// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage(app);
// connectStorageEmulator(storage, "localhost", 9199);

// Helper functions

/*
* Gets a users/{uid} document with username
* @param  {string} username
*/
export async function getUserWithUsername(username: string) {
  const usersRef = collection(firestore, "users")
  const queryRef = query(usersRef, where("username", "==", username), limit(1))
  const userDoc = await getDocs(queryRef);
  return userDoc
}
export async function getPostsFromUsername(username: string, LIMIT: number = 5) {
  const usersRef = collection(firestore, "posts")
  const queryRef = query(usersRef, 
    where("published", "==", true), where("username", "==", username), 
    orderBy('createdAt', 'desc'), limit(5))
  const userDocs = await getDocs(queryRef);
  return userDocs
}
export function postToJSON(doc: QueryDocumentSnapshot<DocumentData> | DocumentData){
  const data = doc.data()
  return {
    ...data,
    createdAt: data.createdAt.toDate().getMilliseconds(),
    updatedAt: data.updatedAt.toDate().getMilliseconds()
  }
}

export function postToJSON2(data: any){
  if (!data) return false
  return {
    ...data,
    createdAt: data.createdAt.toDate().getMilliseconds(),
    updatedAt: data.updatedAt.toDate().getMilliseconds()
  }
}


export {firestore, auth, storage, googleAuthProvider}