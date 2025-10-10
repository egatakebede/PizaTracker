// src/pages/SignIn.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, loginWithGoogle, resetPassword, sendVerificationEmail } from "../authService";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const userCredential = await login(email, password);
      const user = userCredential.user;
      
      // Check if email is verified
      if (!user.emailVerified) {
        alert('Please verify your email address before signing in. Check your inbox for the verification email.');
        await sendVerificationEmail();
        alert('A new verification email has been sent to your email address.');
        return;
      }
      
      navigate("/"); // go to dashboard only if verified
    } catch (err) {
      console.error("Login error:", err);
      
      if (err.code === 'auth/network-request-failed') {
        alert('Network error. Please check your internet connection and try again.');
      } else if (err.code === 'auth/invalid-email') {
        alert('Please enter a valid email address.');
      } else if (err.code === 'auth/user-not-found') {
        alert('No account found with this email.');
      } else if (err.code === 'auth/wrong-password') {
        alert('Incorrect password.');
      } else if (err.code === 'auth/too-many-requests') {
        alert('Too many failed attempts. Please try again later or reset your password.');
      } else {
        alert('Login failed: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReset = async () => {
    if (!email) return alert("Please enter your email first");
    try {
      await resetPassword(email);
      alert("Password reset email sent! Please check your inbox.");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      <p className="auth-subtitle">Stay updated on your professional world</p>
      
      <form className="auth-form" onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button 
              type="button" 
              className="show-password"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? "hide" : "show"}
            </button>
          </div>
        </div>

        <a href="#" className="forgot-password" onClick={handleReset}>
          Forgot password?
        </a>
        
        <button type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
        
        <div className="divider">
          <span>or</span>
        </div>

        <button type="button" className="social-login" onClick={handleGoogle}>
          Continue with Google
        </button>

        <button type="button" className="social-login apple">
          <span>✓</span> Sign in with Apple
        </button>
      </form>

      <div className="auth-switch">
        <p>New to our platform? <Link to="/signup">Join now</Link></p>
      </div>
    </div>
  );
}
const handleSignIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // ✅ CRITICAL: Check if email is verified
    if (!user.emailVerified) {
      // Block access
      await signOut(auth); // Sign out immediately
      alert('Please verify your email before signing in');
      await sendEmailVerification(user); // Resend verification
      return;
    }
    
    // Only allow access if verified
    navigate('/dashboard');
    
  } catch (error) {
    // Handle error
  }
};