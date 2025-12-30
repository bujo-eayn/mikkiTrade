'use client';

import { useIdleTimeout, useSessionRefresh } from '@/lib/hooks/useIdleTimeout';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enable idle timeout (15 minutes of inactivity)
  useIdleTimeout(15);

  // Enable automatic session refresh
  useSessionRefresh();

  return <>{children}</>;
}
