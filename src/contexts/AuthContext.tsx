import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { apiFetch } from '../lib/api';

interface User {
  id?: string | number;
  nickname: string;
  email?: string;
  phone?: string;
  avatar?: string;
  [key: string]: any;
}

type AuthMode = 'login' | 'register';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loginWithGoogle: () => Promise<void>;
  loginWithPassword: (account: string, password: string) => Promise<void>;
  registerWithPassword: (payload: { nickname: string; email?: string; phone?: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authMode: AuthMode;
  openAuthModal: (mode?: AuthMode) => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const TOKEN_STORAGE_KEY = 'token';
const USER_STORAGE_KEY = 'careerai_user';

const getErrorMessage = (error: any, fallback: string) => {
  if (error?.message) return error.message;
  return fallback;
};

const saveSession = (nextToken: string, nextUser: User) => {
  localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
};

const clearSession = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
};

const loadFirebaseAuthModules = async () => {
  const [{ auth, db }, authModule, firestoreModule] = await Promise.all([
    import('../lib/firebase'),
    import('firebase/auth'),
    import('firebase/firestore'),
  ]);

  return {
    auth,
    db,
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
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  useEffect(() => {
    let isMounted = true;
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (!storedToken) return;

    setToken(storedToken);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }

    apiFetch('/api/proxy/users/profile')
      .then((response) => {
        if (!isMounted) return;
        const profile = response.data;
        if (profile) {
          setUser(profile);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
        }
      })
      .catch((error) => {
        if (!isMounted) return;
        console.warn('Stored session refresh failed:', error);
        clearSession();
        setToken(null);
        setUser(null);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const openAuthModal = (mode: AuthMode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const applyBackendSession = (response: any) => {
    const nextToken = response.data?.token;
    const nextUser = response.data?.user;
    if (!nextToken || !nextUser) {
      throw new Error('登录响应缺少 token 或用户信息');
    }

    saveSession(nextToken, nextUser);
    setToken(nextToken);
    setUser(nextUser);
    closeAuthModal();
  };

  const loginWithPassword = async (account: string, password: string) => {
    try {
      const response = await apiFetch('/api/proxy/users/web-login', {
        method: 'POST',
        body: JSON.stringify({ account, password }),
      });
      applyBackendSession(response);
    } catch (error: any) {
      throw new Error(getErrorMessage(error, '登录失败，请检查账号和密码'));
    }
  };

  const registerWithPassword = async (payload: { nickname: string; email?: string; phone?: string; password: string }) => {
    try {
      const response = await apiFetch('/api/proxy/users/web-register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      applyBackendSession(response);
    } catch (error: any) {
      throw new Error(getErrorMessage(error, '注册失败，请稍后重试'));
    }
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
    provider.setCustomParameters({ prompt: 'select_account' });

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

      const firebaseToken = await firebaseUser.getIdToken();
      const firebaseProfile = {
        id: firebaseUser.uid,
        nickname: firebaseUser.displayName || 'User',
        email: firebaseUser.email || '',
        avatar: firebaseUser.photoURL || '',
      };
      saveSession(firebaseToken, firebaseProfile);
      setToken(firebaseToken);
      setUser(firebaseProfile);
      closeAuthModal();
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      clearSession();
      setToken(null);
      setUser(null);
      const { auth, signOut } = await loadFirebaseAuthModules();
      await signOut(auth).catch(() => undefined);
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loginWithGoogle,
      loginWithPassword,
      registerWithPassword,
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
