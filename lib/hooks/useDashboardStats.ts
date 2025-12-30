import useSWR from 'swr';

interface DashboardStats {
  totalVehicles: number;
  publishedVehicles: number;
  draftVehicles: number;
  availableVehicles: number;
  soldVehicles: number;
  reservedVehicles: number;
  dealsCount: number;
  featuredCount: number;
  addedThisWeek: number;
  addedThisMonth: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useDashboardStats() {
  const { data, error, isLoading } = useSWR<DashboardStats>(
    '/api/dashboard/stats',
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  return {
    stats: data,
    loading: isLoading,
    error,
  };
}
