import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import SignOut from '../components/signout-form'
import { useAuth } from '../hooks/useAuth'
import axios from 'axios'
import { Button, Container, TextField } from '@mui/material';


function Dashboard() {
  const { currentUser } = useAuth();

  const testPing = async () => {
    try {

      const token = await currentUser?.getIdToken();
      console.log("Obtained Firebase ID Token:", token ? token.substring(0, 10) + "..." : "No Token")

      const response = await axios.get('http://localhost:5000/api/secure-ping', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Secure ping repsonse:', response.data)

    } catch (error) {
      console.log("Error:", error)
    }
  }

  return (
    <Container style={{ display: 'flex' }}>
      <div>dashboard-page</div>
      <SignOut variant="contained" />
      <Button onClick={testPing}>BUTTON</Button>
    </Container>
  )
}

export default Dashboard