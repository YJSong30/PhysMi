import React from 'react';
import { Button } from '@mui/material';
import { signOut } from "firebase/auth";
import AuthFirebase from '../firebase/auth.firebase';

interface SignOutProps {
  variant: 'text' | 'outlined' | 'contained';
}

const authFirebase = new AuthFirebase();

function SignOut({ variant }: SignOutProps) {
  return (
    <Button variant={variant} onClick={() => { authFirebase.signOutUser(); }
    }>
      Sign Out
    </Button>
  );
}

export default SignOut;
