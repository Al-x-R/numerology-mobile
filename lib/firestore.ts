// lib/firestore.ts
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';

export const saveUserProfile = async (firebaseUser: User, userInfo: any) => {
  const userRef = doc(db, 'users', firebaseUser.uid);

  await setDoc(
    userRef,
    {
      uid: firebaseUser.uid,
      email: userInfo.email,
      displayName: userInfo.name,
      photoURL: userInfo.photo || null,
      provider: 'google',
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    },
    { merge: true }
  );
};
