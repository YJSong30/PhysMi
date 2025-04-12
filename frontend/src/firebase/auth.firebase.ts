import app, { auth } from "./index";
import {
  Auth,
  NextFn,
  onAuthStateChanged,
  signOut,
  User,
  UserCredential,
} from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

class AuthFirebase {
  auth: Auth;

  constructor() {
    this.auth = auth;
  }

  async createUser(
    email: string,
    password: string
  ): Promise<import("firebase/auth").User | null> {
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      console.log("User created successfully:", userCredentials.user);
      return userCredentials.user;
    } catch (error) {
      console.log("Error", error);
      return null;
    }
  }

  // create sign in user function

  async loginUser(
    email: string,
    password: string
  ): Promise<import("firebase/auth").User | null> {
    try {
      const loginAttempt = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      console.log("User logged in successfully:", loginAttempt.user);
      return loginAttempt.user;
    } catch (error) {
      console.log("Error", error);
      return null;
    }
  }

  async signOutUser() {
    await signOut(this.auth);
    console.log("user has signed out");
  }

  authSubscriber(callback: NextFn<User | null>) {
    return onAuthStateChanged(this.auth, callback);
  }
}

export default AuthFirebase;
