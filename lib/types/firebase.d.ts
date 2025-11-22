// types/firebase.d.ts  (или types/auth.d.ts)
import 'firebase/auth';

declare module 'firebase/auth' {
  interface User {
    birthDate?: string | null;
    isPremium?: boolean;
    photoURL?: string | null;
    displayName?: string | null;
  }
}
