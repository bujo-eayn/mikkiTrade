/**
 * Simple in-memory rate limiter
 * For production with multiple instances, consider using Redis-based rate limiting
 * like @upstash/ratelimit
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Check if a request should be rate limited
   * @param identifier - Unique identifier (e.g., IP address or email)
   * @param maxRequests - Maximum number of requests allowed
   * @param windowMs - Time window in milliseconds
   * @returns Object with success flag and remaining attempts
   */
  check(
    identifier: string,
    maxRequests: number,
    windowMs: number
  ): {
    success: boolean;
    remaining: number;
    resetTime: number;
    retryAfter?: number;
  } {
    const now = Date.now();
    const entry = this.store.get(identifier);

    if (!entry || now > entry.resetTime) {
      // No entry or expired - create new entry
      const resetTime = now + windowMs;
      this.store.set(identifier, {
        count: 1,
        resetTime,
      });

      return {
        success: true,
        remaining: maxRequests - 1,
        resetTime,
      };
    }

    // Entry exists and is still valid
    if (entry.count >= maxRequests) {
      // Rate limit exceeded
      return {
        success: false,
        remaining: 0,
        resetTime: entry.resetTime,
        retryAfter: Math.ceil((entry.resetTime - now) / 1000), // seconds
      };
    }

    // Increment count
    entry.count++;
    this.store.set(identifier, entry);

    return {
      success: true,
      remaining: maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  /**
   * Reset the rate limit for a specific identifier
   */
  reset(identifier: string) {
    this.store.delete(identifier);
  }
}

// Create singleton instance
const rateLimiter = new RateLimiter();

// Rate limit configurations
export const RATE_LIMITS = {
  LOGIN: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  SIGNUP: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
} as const;

/**
 * Rate limit a login attempt
 */
export function rateLimitLogin(identifier: string) {
  return rateLimiter.check(
    `login:${identifier}`,
    RATE_LIMITS.LOGIN.maxRequests,
    RATE_LIMITS.LOGIN.windowMs
  );
}

/**
 * Rate limit a signup attempt
 */
export function rateLimitSignup(identifier: string) {
  return rateLimiter.check(
    `signup:${identifier}`,
    RATE_LIMITS.SIGNUP.maxRequests,
    RATE_LIMITS.SIGNUP.windowMs
  );
}

/**
 * Get client IP address from request
 */
export function getClientIp(request: Request): string {
  // Try various headers that might contain the real IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback to 'unknown' if no IP found
  // In production, this shouldn't happen
  return 'unknown';
}
