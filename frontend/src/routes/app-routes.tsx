import React, { useEffect, useState } from 'react'
import AuthFirebase from '../firebase/auth.firebase'
import { User } from 'firebase/auth'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Dashboard from '../pages/dashboard-page'
import AuthPage from '../pages/auth-page'
import { useAuth } from '../hooks/useAuth'

const authFirebase = new AuthFirebase()

function AppRoutes() {
  // const [currentUser, setCurrentUser] = useState<User | null>(null);
  // const [loading, setLoading] = useState<boolean>(true);

  const { currentUser, loading } = useAuth();

  console.log("AppRoutes rendering - Loading:", loading, "User:", currentUser?.uid)

  // if (loading) {
  //   console.log("AppRoutes: Still loading auth state...");
  //   return <LoadingSpinner />;
  // }

  return (
    <Router>
      <Routes>
        <Route path="/" element={currentUser ? <Dashboard /> : <AuthPage />} />
      </Routes>
    </Router>

  );

}

export default AppRoutes