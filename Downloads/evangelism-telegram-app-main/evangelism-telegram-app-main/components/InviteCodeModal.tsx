import { useState } from 'react';
import { X, Copy, Check, Mail } from 'lucide-react';

interface InviteCodeModalProps {
  onClose: () => void;
}

export function InviteCodeModal({ onClose }: InviteCodeModalProps) {
  const [codeType, setCodeType] = useState<'single' | 'multi'>('single');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [expiryDays, setExpiryDays] = useState(7);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateCode = () => {
    const prefix = role === 'admin' ? 'ADMIN' : 'INVITE';
    const code = `${prefix}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setGeneratedCode(code);
  };

  const handleCopy = () => {
    if (generatedCode && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(generatedCode)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy code: ', err);
          // Fallback behavior if needed, or just fail gracefully
        });
    }
  };

  const handleShareTelegram = () => {
    const message = `Join our evangelism team! Use this invite code: ${generatedCode}`;
    window.open(`https://t.me/share/url?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-gray-900">Generate Invite Code</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {!generatedCode ? (
          <>
            {/* Role Selection */}
            <div className="space-y-3">
              <label className="block text-sm text-gray-700">Role</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setRole('user')}
                  className={`flex-1 px-4 py-3 rounded-xl border-2 transition-colors ${
                    role === 'user'
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  User
                </button>
                <button
                  onClick={() => setRole('admin')}
                  className={`flex-1 px-4 py-3 rounded-xl border-2 transition-colors ${
                    role === 'admin'
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Code Type */}
            <div className="space-y-3">
              <label className="block text-sm text-gray-700">Code Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setCodeType('single')}
                  className={`px-4 py-3 rounded-xl border-2 transition-colors ${
                    codeType === 'single'
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  Single Use
                </button>
                <button
                  onClick={() => setCodeType('multi')}
                  className={`px-4 py-3 rounded-xl border-2 transition-colors ${
                    codeType === 'multi'
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  Multi Use
                </button>
              </div>
              <p className="text-xs text-gray-500">
                {codeType === 'single'
                  ? 'Code expires after one person uses it'
                  : 'Code can be used by multiple people'}
              </p>
            </div>

            {/* Expiry */}
            <div className="space-y-3">
              <label htmlFor="expiry" className="block text-sm text-gray-700">
                Expires After (days)
              </label>
              <input
                id="expiry"
                type="number"
                value={expiryDays}
                onChange={(e) => setExpiryDays(parseInt(e.target.value) || 1)}
                min="1"
                max="365"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={generateCode}
              className="w-full bg-orange-500 text-white py-3 px-6 rounded-xl hover:bg-orange-600 transition-colors"
            >
              Generate Code
            </button>
          </>
        ) : (
          <>
            {/* Generated Code Display */}
            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 text-center space-y-3">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-sm text-orange-800">Invite Code Generated</p>
              <div className="text-3xl text-orange-900 tracking-wider">
                {generatedCode}
              </div>
              <p className="text-xs text-orange-700">
                {codeType === 'single' ? 'Single use' : 'Multi use'} • Expires in {expiryDays} days
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy Code
                  </>
                )}
              </button>

              <button
                onClick={handleShareTelegram}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                <Mail className="w-5 h-5" />
                Share on Telegram
              </button>

              <button
                onClick={() => setGeneratedCode(null)}
                className="w-full px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Generate Another
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
