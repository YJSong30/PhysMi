import React from 'react'; // Optional import if using newer JSX transform
import LoginForm from '../components/login-form';
import SignupForm from '../components/signup-form';
import { Container, Grid, Paper, Typography } from '@mui/material';

function AuthPage() {

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Welcome to PhysMi
        </Typography>
        <Grid container spacing={2}>
          <LoginForm />
          <SignupForm />
        </Grid>
      </Paper>
    </Container>
  );
}

export default AuthPage;