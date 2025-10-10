// /api/verify-recaptcha.js (or your backend route)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, action } = req.body;

  try {
    const verificationResponse = await fetch(
      `https://recaptchaenterprise.googleapis.com/v1/projects/your-project-id/assessments?key=6LeGiOQrAAAAAE5OAKkQw3D-uADyUX3tYGYtryHX`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: {
            token,
            siteKey: '6LeGiOQrAAAAAE5OAKkQw3D-uADyUX3tYGYtryHX',
            expectedAction: action,
          },
        }),
      }
    );

    const data = await verificationResponse.json();

    if (data.riskAnalysis && data.riskAnalysis.score >= 0.5) {
      // Score threshold can be adjusted (0.0 - 1.0)
      return res.status(200).json({ success: true, score: data.riskAnalysis.score });
    } else {
      return res.status(200).json({ success: false, score: data.riskAnalysis?.score });
    }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return res.status(500).json({ success: false, error: 'Verification failed' });
  }
}