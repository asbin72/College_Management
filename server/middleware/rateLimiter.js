/**
 * Lightweight In-Memory Rate Limiting Middleware
 * Protects auth and public endpoints against abuse and brute-force attacks.
 */

const rateLimitMap = new Map();

// Periodic cleanup of expired rate limit buckets (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000).unref();

export function createRateLimiter({ windowMs = 15 * 60 * 1000, maxRequests = 100, message = 'Too many requests. Please try again later.' } = {}) {
  return (req, res, next) => {
    const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
    const key = `${req.path}:${clientIp}`;
    const now = Date.now();

    let record = rateLimitMap.get(key);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs
      };
      rateLimitMap.set(key, record);
    } else {
      record.count += 1;
    }

    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - record.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

    if (record.count > maxRequests) {
      return res.status(429).json({
        success: false,
        message,
        errorCode: 'TOO_MANY_REQUESTS',
        retryAfterSeconds: Math.ceil((record.resetTime - now) / 1000)
      });
    }

    next();
  };
}

export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 20, // max 20 login/signup attempts per 15 minutes per IP
  message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.'
});

export const publicApiRateLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minute
  maxRequests: 60, // max 60 public requests per minute per IP
  message: 'Request rate limit exceeded. Please slow down your requests.'
});
