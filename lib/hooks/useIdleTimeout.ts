import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

/**
 * Hook to automatically log out users after a period of inactivity
 * @param timeoutMinutes - Number of minutes of inactivity before logging out (default: 15)
 * @param warningMinutes - Number of minutes before timeout to show warning (optional)
 */
export function useIdleTimeout(
  timeoutMinutes: number = 15,
  warningMinutes?: number
) {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const warningTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastActivityRef = useRef<number>(Date.now());

  const logout = useCallback(async () => {
    console.log('Idle timeout - logging out user');

    try {
      // Call logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      // Sign out from Supabase
      await supabase.auth.signOut();

      // Redirect to login with timeout message
      router.push('/admin/login?timeout=true');
    } catch (error) {
      console.error('Logout error during idle timeout:', error);
      // Force redirect even if logout fails
      router.push('/admin/login?timeout=true');
    }
  }, [router]);

  const showWarning = useCallback(() => {
    console.log('Idle timeout warning');
    // You can implement a warning modal here if desired
    // For now, we'll just log it
  }, []);

  const resetTimeout = useCallback(() => {
    const now = Date.now();
    lastActivityRef.current = now;

    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      logout();
    }, timeoutMinutes * 60 * 1000);

    // Set warning timeout if specified
    if (warningMinutes && warningMinutes < timeoutMinutes) {
      warningTimeoutRef.current = setTimeout(() => {
        showWarning();
      }, (timeoutMinutes - warningMinutes) * 60 * 1000);
    }
  }, [timeoutMinutes, warningMinutes, logout, showWarning]);

  useEffect(() => {
    // List of events that indicate user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    // Throttle the reset function to avoid excessive calls
    let throttleTimeout: NodeJS.Timeout | null = null;
    const throttledReset = () => {
      if (!throttleTimeout) {
        throttleTimeout = setTimeout(() => {
          resetTimeout();
          throttleTimeout = null;
        }, 1000); // Throttle to once per second
      }
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, throttledReset);
    });

    // Set initial timeout
    resetTimeout();

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, throttledReset);
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      if (throttleTimeout) {
        clearTimeout(throttleTimeout);
      }
    };
  }, [resetTimeout]);

  return {
    resetTimeout,
    lastActivity: lastActivityRef.current,
  };
}

/**
 * Hook to implement session refresh before expiration
 * Supabase sessions expire after 1 hour by default
 */
export function useSessionRefresh() {
  useEffect(() => {
    // Refresh session every 50 minutes (10 minutes before 1-hour expiration)
    const refreshInterval = setInterval(async () => {
      try {
        console.log('Refreshing session...');
        const { data, error } = await supabase.auth.refreshSession();

        if (error) {
          console.error('Session refresh error:', error);
        } else if (data.session) {
          console.log('Session refreshed successfully');
        }
      } catch (error) {
        console.error('Session refresh failed:', error);
      }
    }, 50 * 60 * 1000); // 50 minutes

    // Initial check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        console.log('Active session found');
      }
    });

    return () => {
      clearInterval(refreshInterval);
    };
  }, []);
}
