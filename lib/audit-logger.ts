import { supabaseAdmin } from './supabase-server';

/**
 * Audit event types for authentication and security events
 */
export const AuditEventType = {
  // Authentication events
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILED: 'login_failed',
  LOGOUT: 'logout',
  SESSION_EXPIRED: 'session_expired',

  // Signup events
  SIGNUP_SUCCESS: 'signup_success',
  SIGNUP_FAILED: 'signup_failed',

  // Password events
  PASSWORD_RESET_REQUESTED: 'password_reset_requested',
  PASSWORD_RESET_COMPLETED: 'password_reset_completed',
  PASSWORD_RESET_FAILED: 'password_reset_failed',
  PASSWORD_CHANGE: 'password_change',

  // Email verification events
  EMAIL_VERIFIED: 'email_verified',
  EMAIL_VERIFICATION_SENT: 'email_verification_sent',
  EMAIL_VERIFICATION_FAILED: 'email_verification_failed',

  // Account security events
  ACCOUNT_LOCKED: 'account_locked',
  ACCOUNT_UNLOCKED: 'account_unlocked',
  ACCOUNT_DEACTIVATED: 'account_deactivated',
  ACCOUNT_REACTIVATED: 'account_reactivated',

  // Rate limiting events
  RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',

  // CSRF events
  CSRF_TOKEN_INVALID: 'csrf_token_invalid',

  // Admin actions
  ADMIN_ACTION: 'admin_action',
} as const;

export type AuditEventTypeValue = typeof AuditEventType[keyof typeof AuditEventType];

/**
 * Audit log entry interface
 */
export interface AuditLogEntry {
  userId?: string | null;
  eventType: AuditEventTypeValue | string;
  eventData?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  success?: boolean;
  errorMessage?: string;
}

/**
 * Get client IP address from request
 */
export function getClientIpFromRequest(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  return 'unknown';
}

/**
 * Log an audit event to the database
 * @param entry - Audit log entry details
 * @returns Promise that resolves when log is saved
 */
export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  try {
    // Note: audit_logs table doesn't exist in database schema
    // Logging to console instead
    console.log(`Audit event: ${entry.eventType}`, {
      userId: entry.userId,
      success: entry.success,
      ipAddress: entry.ipAddress,
      eventData: entry.eventData,
      errorMessage: entry.errorMessage,
    });

    // Uncomment when audit_logs table is added to database:
    // const { error } = await supabaseAdmin
    //   .from('audit_logs')
    //   .insert({
    //     user_id: entry.userId || null,
    //     event_type: entry.eventType,
    //     event_data: entry.eventData || {},
    //     ip_address: entry.ipAddress || null,
    //     user_agent: entry.userAgent || null,
    //     success: entry.success !== undefined ? entry.success : true,
    //     error_message: entry.errorMessage || null,
    //   });
    //
    // if (error) {
    //   console.error('Failed to log audit event:', error);
    // }
  } catch (error) {
    console.error('Audit logging error:', error);
    // Silently fail - don't disrupt the application
  }
}

/**
 * Helper function to log authentication events from Next.js API routes
 * @param request - Next.js request object
 * @param entry - Audit log entry (without IP and user agent, which are extracted from request)
 */
export async function logAuthEvent(
  request: Request,
  entry: Omit<AuditLogEntry, 'ipAddress' | 'userAgent'>
): Promise<void> {
  const ipAddress = getClientIpFromRequest(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';

  await logAuditEvent({
    ...entry,
    ipAddress,
    userAgent,
  });
}

/**
 * Query audit logs with filters
 * @param filters - Query filters
 * @returns Array of audit log entries
 */
export async function queryAuditLogs(filters: {
  userId?: string;
  eventType?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
  onlyFailures?: boolean;
}) {
  // Note: audit_logs table doesn't exist in database schema
  // Return empty array for now
  console.log('queryAuditLogs called but audit_logs table not available', filters);
  return [];

  // Uncomment when audit_logs table is added to database:
  // try {
  //   let query = supabaseAdmin
  //     .from('audit_logs')
  //     .select('*')
  //     .order('created_at', { ascending: false });
  //
  //   if (filters.userId) {
  //     query = query.eq('user_id', filters.userId);
  //   }
  //
  //   if (filters.eventType) {
  //     query = query.eq('event_type', filters.eventType);
  //   }
  //
  //   if (filters.startDate) {
  //     query = query.gte('created_at', filters.startDate.toISOString());
  //   }
  //
  //   if (filters.endDate) {
  //     query = query.lte('created_at', filters.endDate.toISOString());
  //   }
  //
  //   if (filters.onlyFailures) {
  //     query = query.eq('success', false);
  //   }
  //
  //   if (filters.limit) {
  //     query = query.limit(filters.limit);
  //   }
  //
  //   if (filters.offset) {
  //     query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
  //   }
  //
  //   const { data, error } = await query;
  //
  //   if (error) {
  //     console.error('Error querying audit logs:', error);
  //     return [];
  //   }
  //
  //   return data || [];
  // } catch (error) {
  //   console.error('Audit log query error:', error);
  //   return [];
  // }
}

/**
 * Get audit log statistics
 */
export async function getAuditStats(userId?: string, days: number = 30) {
  // Note: audit_logs table doesn't exist in database schema
  // Return null for now
  console.log('getAuditStats called but audit_logs table not available', { userId, days });
  return null;

  // Uncomment when audit_logs table is added to database:
  // try {
  //   const startDate = new Date();
  //   startDate.setDate(startDate.getDate() - days);
  //
  //   let query = supabaseAdmin
  //     .from('audit_logs')
  //     .select('event_type, success')
  //     .gte('created_at', startDate.toISOString());
  //
  //   if (userId) {
  //     query = query.eq('user_id', userId);
  //   }
  //
  //   const { data, error } = await query;
  //
  //   if (error || !data) {
  //     return null;
  //   }
  //
  //   // Aggregate statistics
  //   const stats = {
  //     totalEvents: data.length,
  //     successfulEvents: data.filter(e => e.success).length,
  //     failedEvents: data.filter(e => !e.success).length,
  //     eventTypeCounts: {} as Record<string, number>,
  //   };
  //
  //   data.forEach(event => {
  //     stats.eventTypeCounts[event.event_type] = (stats.eventTypeCounts[event.event_type] || 0) + 1;
  //   });
  //
  //   return stats;
  // } catch (error) {
  //   console.error('Error getting audit stats:', error);
  //   return null;
  // }
}
