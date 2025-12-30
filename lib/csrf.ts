import { createHash, randomBytes } from 'crypto';

/**
 * Generate a CSRF token
 * In production, this should be tied to the user's session
 */
export function generateCSRFToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Create a hash of a token with a secret
 * This can be used to validate tokens without storing them
 */
export function hashToken(token: string, secret?: string): string {
  const csrfSecret = secret || process.env.CSRF_SECRET || 'default-csrf-secret-change-me';
  return createHash('sha256')
    .update(`${token}-${csrfSecret}`)
    .digest('hex');
}

/**
 * Validate a CSRF token against a hash
 */
export function validateCSRFToken(token: string, expectedHash: string, secret?: string): boolean {
  const computedHash = hashToken(token, secret);
  return computedHash === expectedHash;
}

/**
 * Simple in-memory CSRF token store
 * In production with multiple instances, use Redis or database
 */
class CSRFTokenStore {
  private tokens: Map<string, { token: string; expiresAt: number }> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired tokens every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, value] of this.tokens.entries()) {
      if (now > value.expiresAt) {
        this.tokens.delete(key);
      }
    }
  }

  /**
   * Store a CSRF token for a session
   * @param sessionId - Unique session identifier (e.g., user ID or session token)
   * @param token - CSRF token to store
   * @param ttlMinutes - Time to live in minutes (default: 60)
   */
  set(sessionId: string, token: string, ttlMinutes: number = 60): void {
    const expiresAt = Date.now() + (ttlMinutes * 60 * 1000);
    this.tokens.set(sessionId, { token, expiresAt });
  }

  /**
   * Get and validate a CSRF token
   * @param sessionId - Unique session identifier
   * @param token - Token to validate
   * @returns true if valid, false otherwise
   */
  validate(sessionId: string, token: string): boolean {
    const stored = this.tokens.get(sessionId);

    if (!stored) {
      return false;
    }

    // Check if expired
    if (Date.now() > stored.expiresAt) {
      this.tokens.delete(sessionId);
      return false;
    }

    // Validate token
    return stored.token === token;
  }

  /**
   * Get a token for a session (without validation)
   */
  get(sessionId: string): string | null {
    const stored = this.tokens.get(sessionId);

    if (!stored) {
      return null;
    }

    // Check if expired
    if (Date.now() > stored.expiresAt) {
      this.tokens.delete(sessionId);
      return null;
    }

    return stored.token;
  }

  /**
   * Remove a token
   */
  delete(sessionId: string): void {
    this.tokens.delete(sessionId);
  }

  /**
   * Clear all tokens (for testing)
   */
  clear(): void {
    this.tokens.clear();
  }
}

// Singleton instance
export const csrfTokenStore = new CSRFTokenStore();

/**
 * Middleware helper to validate CSRF token from request
 * @param request - Next.js request object
 * @param sessionId - Session identifier (typically from cookies)
 * @returns Object with success status and error message if failed
 */
export function validateCSRFFromRequest(
  request: Request,
  sessionId: string
): { valid: boolean; error?: string } {
  // Get CSRF token from header
  const csrfToken = request.headers.get('x-csrf-token');

  if (!csrfToken) {
    return {
      valid: false,
      error: 'Missing CSRF token. Please refresh the page and try again.',
    };
  }

  // Validate token
  const isValid = csrfTokenStore.validate(sessionId, csrfToken);

  if (!isValid) {
    return {
      valid: false,
      error: 'Invalid or expired CSRF token. Please refresh the page and try again.',
    };
  }

  return { valid: true };
}

/**
 * Generate and store a new CSRF token for a session
 * @param sessionId - Session identifier
 * @returns The generated CSRF token
 */
export function createCSRFToken(sessionId: string): string {
  const token = generateCSRFToken();
  csrfTokenStore.set(sessionId, token);
  return token;
}
