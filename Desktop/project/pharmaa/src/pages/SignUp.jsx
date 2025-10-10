// src/pages/SignUp.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../authService";
import { validateLicenseNumber, getValidLicenseNumbers } from "../components/licenseValidator";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validate license number
    if (!validateLicenseNumber(licenseNumber)) {
      alert("Invalid license number. Please check your license number and try again.");
      return;
    }
    
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    
    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    
    try {
      await register(email, password);
      alert(`Verification email sent to ${email}. Please check your inbox and verify your email before signing in.`);
      navigate("/signin");
    } catch (err) {
      console.error("Registration error:", err);
      
      if (err.code === 'auth/network-request-failed') {
        alert('Network error. Please check your internet connection and try again.');
      } else if (err.code === 'auth/email-already-in-use') {
        alert('This email is already registered. Please sign in instead.');
      } else if (err.code === 'auth/invalid-email') {
        alert('Please enter a valid email address.');
      } else if (err.code === 'auth/weak-password') {
        alert('Password should be at least 6 characters long.');
      } else {
        alert('Registration failed: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const showValidLicenses = () => {
    const validLicenses = getValidLicenseNumbers();
    alert(`Valid License Numbers:\n\n${validLicenses.join('\n')}`);
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <p className="auth-subtitle">Professional pharmacy access only</p>
      
      <form className="auth-form" onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="licenseNumber">
            License Number *
            <button 
              type="button" 
              onClick={showValidLicenses}
              style={{
                marginLeft: '10px',
                fontSize: '12px',
                background: 'transparent',
                border: '1px solid #0a66c2',
                color: '#0a66c2',
                padding: '2px 8px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              View Valid Licenses
            </button>
          </label>
          <input
            type="text"
            id="licenseNumber"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            required
            disabled={loading}
            placeholder="Enter your professional license number"
            style={{ textTransform: 'uppercase' }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
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
          <label htmlFor="password">Password *</label>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
              placeholder="At least 6 characters"
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

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password *</label>
          <input
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <div className="auth-switch">
        <p>Already have an account? <Link to="/signin">Sign In</Link></p>
      </div>
    </div>
  );
}