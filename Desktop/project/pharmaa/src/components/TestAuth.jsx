// src/components/TestAuth.jsx
import { useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function TestAuth() {
  useEffect(() => {
    console.log("Testing Firebase connection...");
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("✅ User is logged in:", user.email);
      } else {
        console.log("✅ No user logged in - Firebase is connected!");
      }
    });

    return unsubscribe;
  }, []);

  return (
    <div style={{ padding: '20px', background: '#f0f0f0' }}>
      <h3>Firebase Test</h3>
      <p>Check browser console for connection status</p>
    </div>
  );
}