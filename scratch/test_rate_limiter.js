const API_BASE = 'http://localhost:3000/api';

async function testRateLimiting() {
  console.log('=== STARTING RATE LIMITING VERIFICATION AUDIT ===\n');

  // 1. Auth Endpoint Rate Limit Test (Limit = 20)
  console.log('Testing Auth Endpoint Rate Limiter (Firing 25 rapid POST /api/auth/login requests)...');
  let authLimited = false;
  let authSuccessCount = 0;
  let auth429Count = 0;

  for (let i = 1; i <= 25; i++) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: 'invalid@user.com', password: 'badpassword' })
      });

      if (res.status === 429) {
        auth429Count++;
        authLimited = true;
      } else {
        authSuccessCount++;
      }
    } catch (e) {
      console.error(`Request ${i} error:`, e.message);
    }
  }

  console.log(`Auth Rate Limiter Results: Allowed = ${authSuccessCount}, Blocked (429) = ${auth429Count}`);
  if (authLimited && auth429Count > 0) {
    console.log('✅ PASS: Auth Rate Limiter correctly triggered 429 Too Many Requests after threshold!');
  } else {
    console.error('❌ FAIL: Auth Rate Limiter did not reject rapid requests!');
  }
}

testRateLimiting();
