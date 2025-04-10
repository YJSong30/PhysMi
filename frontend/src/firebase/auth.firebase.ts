import app, { auth } from "./index";
import { Auth } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

class AuthFirebase {
  auth: Auth;

  constructor() {
    this.auth = auth;
  }

  async createUser(email: string, password: string): Promise<void> {
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      console.log("User created successfully", userCredentials.user);
    } catch (error) {
      console.log("Error", error);
    }
  }
}
