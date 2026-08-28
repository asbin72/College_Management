import jwt from 'jsonwebtoken';

const API_BASE = 'http://localhost:3000/api';
const JWT_SECRET = process.env.JWT_SECRET || 'kalpanaaa_super_secret_jwt_key_2026_prod';

const adminToken = jwt.sign(
  { id: 'adm-001', name: 'Super Admin', email: 'admin@kalpanaaa.edu', role: 'ADMIN' },
  JWT_SECRET,
  { expiresIn: '1h' }
);

async function runConcurrencyLoadTest() {
  console.log('=== STARTING HIGH-CONCURRENCY LOAD VERIFICATION (100 PARALLEL REQUESTS) ===\n');

  const totalRequests = 100;
  const endpoints = ['/health', '/courses', '/departments', '/subjects'];
  const startTime = Date.now();

  console.log(`Firing ${totalRequests} parallel requests across endpoints...`);

  const requests = Array.from({ length: totalRequests }, (_, i) => {
    const ep = endpoints[i % endpoints.length];
    const headers = { 'Authorization': `Bearer ${adminToken}` };
    const reqStart = Date.now();
    return fetch(`${API_BASE}${ep}`, { headers })
      .then(res => ({
        status: res.status,
        latencyMs: Date.now() - reqStart,
        endpoint: ep
      }))
      .catch(err => ({
        status: 'ERROR',
        error: err.message,
        latencyMs: Date.now() - reqStart,
        endpoint: ep
      }));
  });

  const results = await Promise.all(requests);
  const totalDurationMs = Date.now() - startTime;

  const successful = results.filter(r => r.status === 200).length;
  const failed = results.filter(r => r.status !== 200).length;
  const latencies = results.map(r => r.latencyMs);
  const avgLatency = Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length);
  const maxLatency = Math.max(...latencies);
  const minLatency = Math.min(...latencies);
  const throughput = Math.round((totalRequests / (totalDurationMs / 1000)));

  console.log(`\n=== CONCURRENCY LOAD TEST RESULTS ===`);
  console.log(`Total Requests Fired: ${totalRequests}`);
  console.log(`Successful (200 OK): ${successful}`);
  console.log(`Failed / Errors: ${failed}`);
  console.log(`Total Test Duration: ${totalDurationMs} ms`);
  console.log(`Calculated Throughput: ${throughput} req/sec`);
  console.log(`Latency - Avg: ${avgLatency} ms, Min: ${minLatency} ms, Max: ${maxLatency} ms`);

  if (failed === 0 && successful === totalRequests) {
    console.log(`\n✅ PASS: 100% of ${totalRequests} concurrent requests succeeded cleanly with zero server crashes or dropped connections!`);
  } else {
    console.error(`\n❌ WARNING: ${failed} requests failed during load test.`);
  }
}

runConcurrencyLoadTest();
