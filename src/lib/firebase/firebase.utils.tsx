import { initializeApp } from 'firebase/app'
import {
  getAuth,
  TwitterAuthProvider,
  linkWithPopup,
  onAuthStateChanged,
} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'
import { FIREBASE_TOKEN } from '@/contants/localstorage'
import { localStorage } from '@/lib/store'

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
export const firebaseapp = initializeApp(firebaseConfig)
const provider = new TwitterAuthProvider()

export const functions = getFunctions(firebaseapp)
export const db = getFirestore()
export const auth = getAuth(firebaseapp)

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    user.getIdToken().then((accessToken) => {
      localStorage.set(FIREBASE_TOKEN, accessToken)
    })
  }
})

export const _linkWithPopup = () => {
  return linkWithPopup(auth.currentUser!, provider)
}
export const handleSignOut = () => auth.signOut()
