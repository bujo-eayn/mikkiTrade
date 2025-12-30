'use client';

import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import type { Vehicle } from '@/lib/supabase';

export interface VehicleFilters {
  search?: string;
  status?: string;
  make?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  minMileage?: number;
  maxMileage?: number;
  bodyType?: string;
  transmission?: string;
  fuelType?: string;
  color?: string;
  featured?: boolean;
  onDeal?: boolean;
  tags?: string[];
}

export interface VehicleSorting {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface VehiclePagination {
  page?: number;
  limit?: number;
}

export interface UseVehiclesOptions {
  filters?: VehicleFilters;
  sorting?: VehicleSorting;
  pagination?: VehiclePagination;
  enabled?: boolean; // Control whether to fetch
  includeDrafts?: boolean; // Include unpublished vehicles (for admin)
}

export interface VehicleWithImages extends Vehicle {
  vehicle_images: Array<{
    id: string;
    url: string;
    thumbnail_url: string | null;
    is_primary: boolean | null;
    display_order: number | null;
    alt_text: string | null;
  }>;
}

export interface UseVehiclesResult {
  vehicles: VehicleWithImages[];
  loading: boolean;
  error: Error | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null;
  mutate: () => void; // For manual revalidation
}

interface VehiclesApiResponse {
  vehicles: VehicleWithImages[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// SWR fetcher
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch vehicles');
  return res.json();
};

// Build query string from options
function buildQueryString(options: UseVehiclesOptions): string {
  const { filters = {}, sorting = {}, pagination = {}, includeDrafts = false } = options;
  const params = new URLSearchParams();

  // Add special parameters
  if (includeDrafts) params.append('includeDrafts', 'true');

  // Add filters
  if (filters.search) params.append('search', filters.search);
  if (filters.status) params.append('status', filters.status);
  if (filters.make) params.append('make', filters.make);
  if (filters.model) params.append('model', filters.model);
  if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
  if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
  if (filters.minYear !== undefined) params.append('minYear', filters.minYear.toString());
  if (filters.maxYear !== undefined) params.append('maxYear', filters.maxYear.toString());
  if (filters.minMileage !== undefined) params.append('minMileage', filters.minMileage.toString());
  if (filters.maxMileage !== undefined) params.append('maxMileage', filters.maxMileage.toString());
  if (filters.bodyType) params.append('bodyType', filters.bodyType);
  if (filters.transmission) params.append('transmission', filters.transmission);
  if (filters.fuelType) params.append('fuelType', filters.fuelType);
  if (filters.color) params.append('color', filters.color);
  if (filters.featured !== undefined) params.append('featured', filters.featured.toString());
  if (filters.onDeal !== undefined) params.append('onDeal', filters.onDeal.toString());
  if (filters.tags && filters.tags.length > 0) params.append('tags', filters.tags.join(','));

  // Add sorting
  if (sorting.sortBy) params.append('sortBy', sorting.sortBy);
  if (sorting.sortOrder) params.append('sortOrder', sorting.sortOrder);

  // Add pagination
  if (pagination.page) params.append('page', pagination.page.toString());
  if (pagination.limit) params.append('limit', pagination.limit.toString());

  return params.toString();
}

/**
 * Hook for fetching vehicles with SWR caching
 * Data is cached and won't refetch unless:
 * - 5 minutes have passed (dedupingInterval)
 * - User explicitly calls mutate()
 * - Window regains focus (disabled by default)
 */
export function useVehicles(options: UseVehiclesOptions = {}): UseVehiclesResult {
  const {
    filters = {},
    sorting = { sortBy: 'created_at', sortOrder: 'desc' },
    pagination = { page: 1, limit: 50 },
    enabled = true,
  } = options;

  const queryString = buildQueryString({ filters, sorting, pagination });
  const apiUrl = enabled ? `/api/vehicles?${queryString}` : null;

  const { data, error, isLoading, mutate } = useSWR<VehiclesApiResponse>(
    apiUrl,
    fetcher,
    {
      // Cache for 5 minutes - won't refetch if data is fresh
      dedupingInterval: 5 * 60 * 1000,
      // Don't revalidate on window focus (save API calls)
      revalidateOnFocus: false,
      // Revalidate when network reconnects
      revalidateOnReconnect: true,
      // Keep previous data while loading new data (better UX)
      keepPreviousData: true,
      // Revalidate when user comes back to the tab
      revalidateIfStale: false,
    }
  );

  return {
    vehicles: data?.vehicles || [],
    loading: isLoading,
    error: error || null,
    pagination: data?.pagination || null,
    mutate,
  };
}

/**
 * Hook for fetching featured vehicles
 * Cached for 10 minutes since featured vehicles change less frequently
 */
export function useFeaturedVehicles(limit: number = 5) {
  const { data, error, isLoading } = useSWR<VehiclesApiResponse>(
    `/api/vehicles?featured=true&limit=${limit}&sortBy=created_at&sortOrder=desc`,
    fetcher,
    {
      dedupingInterval: 10 * 60 * 1000,
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  return {
    vehicles: data?.vehicles || [],
    loading: isLoading,
    error: error || null,
  };
}

/**
 * Hook for fetching deal vehicles
 * Cached for 10 minutes
 */
export function useDealsVehicles(limit: number = 6) {
  const { data, error, isLoading } = useSWR<VehiclesApiResponse>(
    `/api/vehicles?onDeal=true&limit=${limit}&sortBy=created_at&sortOrder=desc`,
    fetcher,
    {
      dedupingInterval: 10 * 60 * 1000,
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  return {
    vehicles: data?.vehicles || [],
    loading: isLoading,
    error: error || null,
  };
}

/**
 * Hook for fetching a single vehicle by ID
 * Cached for 15 minutes since individual vehicles change rarely
 */
export function useVehicle(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<{ vehicle: VehicleWithImages }>(
    id ? `/api/vehicles/${id}` : null,
    fetcher,
    {
      dedupingInterval: 15 * 60 * 1000,
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  return {
    vehicle: data?.vehicle || null,
    loading: isLoading,
    error: error || null,
    mutate,
  };
}

/**
 * Hook for infinite scroll pagination
 * Loads more vehicles as user scrolls - perfect for "Load More" buttons
 */
export function useInfiniteVehicles(
  filters: VehicleFilters = {},
  sorting: VehicleSorting = { sortBy: 'created_at', sortOrder: 'desc' },
  pageSize: number = 20
) {
  const getKey = (pageIndex: number, previousPageData: VehiclesApiResponse | null) => {
    // Reached the end
    if (previousPageData && !previousPageData.pagination.hasNextPage) return null;

    // First page
    const page = pageIndex + 1;
    const queryString = buildQueryString({
      filters,
      sorting,
      pagination: { page, limit: pageSize },
    });
    return `/api/vehicles?${queryString}`;
  };

  const { data, error, size, setSize, isLoading, mutate } = useSWRInfinite<VehiclesApiResponse>(
    getKey,
    fetcher,
    {
      dedupingInterval: 5 * 60 * 1000,
      revalidateOnFocus: false,
      revalidateFirstPage: false,
      persistSize: true,
    }
  );

  // Flatten all vehicles from all pages
  const vehicles = data ? data.flatMap(page => page.vehicles) : [];
  const pagination = data?.[data.length - 1]?.pagination;

  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isEmpty = data?.[0]?.vehicles.length === 0;
  const isReachingEnd = isEmpty || (pagination && !pagination.hasNextPage);

  return {
    vehicles,
    pagination,
    loading: isLoading,
    loadingMore: isLoadingMore,
    reachingEnd: isReachingEnd,
    error: error || null,
    loadMore: () => setSize(size + 1),
    mutate,
  };
}
