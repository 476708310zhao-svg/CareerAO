import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface User {
  id?: string;
  nickname: string;
  email?: string;
  phone?: string;
  avatar?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const loadFirebaseAuthModules = async () => {
  const [{ auth, db }, authModule, firestoreModule] = await Promise.all([
    import('../lib/firebase'),
    import('firebase/auth'),
    import('firebase/firestore'),
  ]);

  return {
    auth,
    db,
    onAuthStateChanged: authModule.onAuthStateChanged,
    GoogleAuthProvider: authModule.GoogleAuthProvider,
    signInWithPopup: authModule.signInWithPopup,
    signOut: authModule.signOut,
    doc: firestoreModule.doc,
    getDoc: firestoreModule.getDoc,
    setDoc: firestoreModule.setDoc,
    serverTimestamp: firestoreModule.serverTimestamp,
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

    loadFirebaseAuthModules()
      .then(({ auth, db, onAuthStateChanged, doc, getDoc }) => {
        if (!isMounted) return;

        unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (!isMounted) return;

          if (!firebaseUser) {
            setToken(null);
            setUser(null);
            return;
          }

          setToken(await firebaseUser.getIdToken());

          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          if (!isMounted) return;

          if (userSnap.exists()) {
            setUser({ id: firebaseUser.uid, ...userSnap.data() } as User);
            return;
          }

          setUser({
            id: firebaseUser.uid,
            nickname: firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            avatar: firebaseUser.photoURL || '',
          });
        });
      })
      .catch((error) => {
        if (!isMounted) return;

        console.error('Auth initialization error:', error);
        setToken(null);
        setUser(null);
      });

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, []);

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const loginWithGoogle = async () => {
    const {
      auth,
      db,
      GoogleAuthProvider,
      signInWithPopup,
      doc,
      getDoc,
      setDoc,
      serverTimestamp,
    } = await loadFirebaseAuthModules();

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
    });

    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: firebaseUser.email,
          nickname: firebaseUser.displayName || 'User',
          role: 'user',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      closeAuthModal();
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { auth, signOut } = await loadFirebaseAuthModules();
      await signOut(auth);
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loginWithGoogle,
      logout,
      isAuthenticated: !!token,
      isAuthModalOpen,
      authMode,
      openAuthModal,
      closeAuthModal,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
