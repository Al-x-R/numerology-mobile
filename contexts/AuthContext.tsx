// contexts/AuthContext.tsx
import { Platform } from 'react-native';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, googleWebClientId, googleIosClientId } from '@/lib/firebase';
import {
  onAuthStateChanged,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { saveUserProfile } from '@/lib/firestore';
import { useRouter } from 'expo-router';

let GoogleSignin: any = null;
if (Platform.OS === 'ios' || Platform.OS === 'android') {
  try {
    GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
  } catch (e) {
    console.error(
      'Failed to load @react-native-google-signin/google-signin.' +
      'Is it installed and linked correctly?', e
    );
  }
} else {
  console.warn('Google Sign-In not available (web dev mode)');
}

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isLoading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (displayName: string, email: string, password: string) => Promise<void>;
  loginWithGoogle?: () => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Google Sign-In
  useEffect(() => {
    if (GoogleSignin && googleWebClientId) {
      GoogleSignin.configure({
        webClientId: googleWebClientId,
        iosClientId: googleIosClientId,
        offlineAccess: true,
      });
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      await saveUserProfile(result.user);
      router.replace('/(tabs)/pythagoras');
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithEmail = async (displayName: string ,email: string, password: string) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential.user, {
        displayName: displayName
      });

      await saveUserProfile(userCredential.user);
      router.replace('/(tabs)/pythagoras');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    if (!GoogleSignin) throw new Error('Google Sign-In not available');
    setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (!userInfo || !userInfo.data) {
        return;
      }

      const idToken = userInfo.data.idToken;
      if (!idToken) throw new Error('No idToken');

      const credential = GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(auth, credential);

      await saveUserProfile(result.user, userInfo.data.user);
      router.replace('/(tabs)/pythagoras');
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await auth.signOut();
    } finally {
      setIsLoading(false);
    }
  };

  const sendPasswordReset = async (email: string) => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isLoading: isLoading,
    loginWithEmail,
    registerWithEmail,
    logout,
    sendPasswordReset
  };

  if (GoogleSignin) {
    (value as any).loginWithGoogle = loginWithGoogle;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
