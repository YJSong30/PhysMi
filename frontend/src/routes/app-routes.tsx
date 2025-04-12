import React, { useEffect, useState } from 'react'
import AuthFirebase from '../firebase/auth.firebase'
import { User } from 'firebase/auth'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Dashboard from '../pages/dashboard-page'
import AuthPage from '../pages/auth-page'

const authFirebase = new AuthFirebase()

function AppRoutes() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("Setting up auth listener...")

    // callback: when auth state changes
    const handleAuthStateChange = (user: User | null) => {
      console.log("Auth state changed:", user ? `User: ${user.uid}` : "No user");
      setCurrentUser(user);
      setLoading(false);
    };

    // store returned unsubscribe function 
    const unsubscribe = authFirebase.authSubscriber(handleAuthStateChange);

    // cleanup function
    return () => {
      console.log("cleaning up auth listener...");
      unsubscribe();
    }

    // loading indicator?

  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={currentUser ? <Dashboard /> : <AuthPage />} />
      </Routes>
    </Router>

  );

}

export default AppRoutes