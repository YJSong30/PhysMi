import { FormEvent, useState } from 'react'
import app, { auth } from "./firebase/index.js"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { Button, TextField, Container, Typography } from '@mui/material'

function App() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(`Your email is ${email} and your password is ${password}`)
    console.log({ email, password })
  }

  return (
    <>
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" style={{ paddingBottom: '10px' }}>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}

          />
          <TextField
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}

          />
          <Button type="submit" variant="outlined" color="primary">
            Sign In
          </Button>
        </form>
      </Container>
    </>
  )
}

export default App
