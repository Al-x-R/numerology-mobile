// lib/firestore.ts
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';

export const saveUserProfile = async (firebaseUser: User, userInfo?: any) => {
  const userRef = doc(db, 'users', firebaseUser.uid);
  const isGoogleProvider = firebaseUser.providerData.some(p => p.providerId === 'google.com');

  const userData = {
    uid: firebaseUser.uid,
    email: firebaseUser.email,

    isPremium: false,
    provider: isGoogleProvider ? 'google' : 'email',

    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  };

  if (isGoogleProvider && userInfo) {
    Object.assign(userData, {
      displayName: userInfo.name || firebaseUser.displayName,
      photoURL: userInfo.photo || firebaseUser.photoURL || null,
    });
  } else {
    Object.assign(userData, {
      displayName: firebaseUser.displayName || firebaseUser.email,
      photoURL: firebaseUser.photoURL || null,
    });
  }

  await setDoc(
    userRef,
    userData,
    { merge: true }
  );
};
