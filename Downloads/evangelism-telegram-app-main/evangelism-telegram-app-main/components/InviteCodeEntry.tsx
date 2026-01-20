import { useState } from 'react';
import { X, Check, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { supabase } from '../services/supabase';

interface InviteCodeEntryProps {
  onSuccess: (name: string, language: 'en' | 'am' | 'om' | 'ti') => void;
  onCancel?: () => void;
}

export function InviteCodeEntry({ onSuccess, onCancel }: InviteCodeEntryProps) {
  const [step, setStep] = useState<'code' | 'profile'>('code');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState<'en' | 'am' | 'om' | 'ti'>('en');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsValidating(true);

    try {
      const result = await api.validateInviteCode(code);
      if (result.valid) {
        setStep('profile');
      } else {
        setError(result.message || "Invalid invite code");
      }
    } catch (err) {
      setError("Failed to verify code. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSigningUp(true);

    try {
      // 1. Create Account
      await api.signup({
        email,
        password,
        name,
        language,
        inviteCode: code
      });

      // 2. Sign In
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;

      // 3. Success
      onSuccess(name, language);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create account");
    } finally {
      setIsSigningUp(false);
    }
  };

  if (step === 'code') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 space-y-6">
          {onCancel && (
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          )}
          
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-gray-900">Enter Invite Code</h2>
            <p className="text-gray-600 text-sm">
              Your team admin sent this to you. No code = no signup.
            </p>
          </div>

          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm text-gray-700 mb-2">
                Invite Code
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter your code"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            {error && (
              <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="text-xs text-gray-500 space-y-1">
              <p>Demo codes for testing:</p>
              <p className="text-orange-600">WELCOME2024, TEAM123, FAITH777</p>
            </div>

            <button
              type="submit"
              disabled={isValidating || !code.trim()}
              className="w-full bg-orange-500 text-white py-3 px-6 rounded-xl hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isValidating ? 'Verifying...' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-gray-900">Create Your Profile</h2>
          <p className="text-gray-600 text-sm">
            Set up your login details
          </p>
        </div>

        <form onSubmit={handleCreateProfile} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm text-gray-700 mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a secure password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="language" className="block text-sm text-gray-700 mb-2">
              Preferred Language
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="am">Amharic (አማርኛ)</option>
              <option value="om">Afaan Oromo</option>
              <option value="ti">Tigrigna (ትግርኛ)</option>
            </select>
          </div>

          {error && (
            <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSigningUp || !name.trim() || !email.trim() || !password.trim()}
            className="w-full bg-orange-500 text-white py-3 px-6 rounded-xl hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSigningUp && <Loader2 className="w-5 h-5 animate-spin" />}
            {isSigningUp ? 'Creating Account...' : 'Get Started'}
          </button>
        </form>
      </div>
    </div>
  );
}
