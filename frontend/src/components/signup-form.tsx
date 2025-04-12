import { FormEvent, useState } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import AuthFirebase from '../firebase/auth.firebase'; // Adjust path

const authFirebase = new AuthFirebase();

function SignupForm() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  // Optional: Add username if needed for your DB profile later
  // const [username, setUsername] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    console.log(`Attempting signup for ${email}`);

    // Add password complexity checks here if desired

    const newUser = await authFirebase.createUser(email, password);

    if (newUser) {
      console.log("Signup successful! User:", newUser);
      // Inform user, maybe trigger login or auto-login?

      alert(`Signup Successful for ${newUser.email}! You can now log in.`);
      setEmail('');
      setPassword('');
    } else {
      console.log("Signup failed.");

      // Firebase errors are often specific, could potentially parse error.code
      setError("Signup failed. Email might be in use or password too weak.");
    }
  };

  // --- This component MUST return JSX ---
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Typography component="h2" variant="h6">Sign Up</Typography>
      {/* Add TextField for Username if needed */}
      <TextField
        margin="normal"
        required
        fullWidth
        id="signup-email"
        label="Email Address"
        name="email"
        autoComplete="email"
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
        id="signup-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Sign Up
      </Button>
    </Box>
  );
}

export default SignupForm;