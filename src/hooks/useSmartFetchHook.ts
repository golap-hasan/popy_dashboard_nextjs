import { useState, useEffect, useMemo } from 'react';
import useDebounce from './usedebounce';

// Generic API list response shape
export type ApiListResponse<T> = {
  data?: T[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPage?: number;
    [k: string]: unknown;
  };
};

type BaseParams = { page?: number; searchTerm?: string };

// The hook returned values
export type UseSmartFetchReturn<P extends BaseParams & Record<string, unknown>, T> = {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  data: T[];
  meta: ApiListResponse<T>["meta"];
  isLoading: boolean;
  isError: boolean;
  filterParams: Partial<P>;
  setFilterParams: React.Dispatch<React.SetStateAction<Partial<P>>>;
};

type QueryHook<P extends BaseParams & Record<string, unknown>, T> = (
  params: P
) => { data?: ApiListResponse<T>; isLoading: boolean; isError: boolean };

// P = params shape expected by query hook (additional to page/searchTerm)
// T = item type of the list
const useSmartFetchHook = <P extends BaseParams & Record<string, unknown>, T>(
  queryHook: QueryHook<P, T>,
  options: Partial<P> = {} as Partial<P>,
  initialParams: Partial<P> = {} as Partial<P>
): UseSmartFetchReturn<P, T> => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterParams, setFilterParams] = useState<Partial<P>>(initialParams);
  
  // Debounce search term and search params
  const debouncedSearchTerm = useDebounce<string>(searchTerm);
  const debouncedFilterParams = useDebounce<Partial<P>>(filterParams);

  const { ...queryOptions } = options;

  // Memoize the stringified debounced search params
  const stringifiedDebouncedParams = useMemo(
    () => JSON.stringify(debouncedFilterParams),
    [debouncedFilterParams]
  );

  // Combine all parameters for the query
  const queryParams = useMemo(
    () =>
      ({
        page: currentPage,
        searchTerm: debouncedSearchTerm,
        ...(debouncedFilterParams as object),
        ...(queryOptions as object),
      }) as unknown as P,
    [currentPage, debouncedSearchTerm, debouncedFilterParams, queryOptions]
  );

  const { data, isLoading, isError } = queryHook(queryParams);

  // Reset to first page when debounced search term or params change
  useEffect(() => {
    const id = setTimeout(() => setCurrentPage(1), 0);
    return () => clearTimeout(id);
  }, [debouncedSearchTerm, stringifiedDebouncedParams]);

  // Expose API payload directly
  const list = (data?.data ?? []) as T[];
  const meta = data?.meta;

  return {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    data: list,
    meta,
    isLoading,
    isError,
    filterParams,
    setFilterParams,
  };
};

export default useSmartFetchHook;