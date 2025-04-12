import { FormEvent, useState } from 'react'
import app, { auth } from "../firebase/index.js"
import { Button, TextField, Container, Typography, Box } from '@mui/material'
import AuthFirebase from '../firebase/auth.firebase.js'
function LoginForm() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string | null>(null); // State for errors

  const authFirebase = new AuthFirebase();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    console.log(`Attemping login for ${email}`)

    const loggedInUser = await authFirebase.loginUser(email, password)

    if (loggedInUser) {
      console.log("Login successful! User:", loggedInUser)
      alert(`Login successful for ${loggedInUser.email}`)
      setEmail('')
      setPassword('')

    } else {
      console.log("Login failed.");
      setError("Invalid email or password."); // Set error state
    }

  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Typography component="h2" variant="h6">Login</Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        id="login-email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="login-password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <Typography color="error">{error}</Typography>} {/* Display error */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Sign In
      </Button>
    </Box>
  );
}

export default LoginForm
