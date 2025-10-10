// authService.js
import { auth, googleProvider } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  updatePassword
} from "firebase/auth";

// Email/password login
export const login = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

// Create account and send verification email
export const register = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  // Send verification email
  await sendEmailVerification(userCredential.user);
  return userCredential;
};

// Send verification email to current user
export const sendVerificationEmail = async () => {
  if (auth.currentUser) {
    await sendEmailVerification(auth.currentUser);
  } else {
    throw new Error('No user logged in');
  }
};

// Check if email is verified
export const isEmailVerified = () => {
  return auth.currentUser?.emailVerified || false;
};

// Google login
export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);

// Forgot password - sends reset email
export const resetPassword = (email) => sendPasswordResetEmail(auth, email);

// Update password (for after reset)
export const updateUserPassword = (newPassword) => {
  if (auth.currentUser) {
    return updatePassword(auth.currentUser, newPassword);
  }
  throw new Error('No user logged in');
};

// Sign out
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out successfully");
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};
