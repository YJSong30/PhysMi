import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { useAuth } from '../hooks/useAuth';
import AuthFirebase from '../firebase/auth.firebase';

// define shape of context data
interface AuthContextType {
  currentUser: User | null
  loading?: boolean;

}

const authFirebase = new AuthFirebase();

// create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // callback: when auth state changes


  useEffect(() => {
    console.log("AuthProvider: Setting up auth subscriber...");

    const handleAuthStateChange = (user: User | null) => {
      console.log("Auth state changed:", user ? `User: ${user.uid}` : "No user");
      setCurrentUser(user);
      setLoading(false);
    };

    const unsubscribe = authFirebase.authSubscriber(handleAuthStateChange);

    return () => {
      console.log("AuthProvider: Cleaning up auth subscriber...");
      unsubscribe();
    };

  }, []);

  const value = {
    currentUser,
    loading,
    // add logout function here later
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )

}

export default AuthContext;

