import { getDoc, doc } from 'firebase/firestore'
import { db } from './firebase.utils'

export const getWalletInfoByUserId = async (userId: string) => {
  const docRef = doc(db, 'users', userId, 'expand', 'info')
  const docSnap = await getDoc(docRef)
  return docSnap.data()
}

export const getUser = async (userId: string) => {
  const docRef = doc(db, 'users', userId)
  const docSnap = await getDoc(docRef)
  return docSnap.data()
}
