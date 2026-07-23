import { createContext, useContext, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPublicConfig } from '../services/publicApi';

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const query = useQuery({
    queryKey: ['public', 'configuracion'],
    queryFn: getPublicConfig,
    staleTime: 5 * 60 * 1000
  });

  const value = useMemo(
    () => ({
      config: query.data?.data || null,
      loading: query.isLoading,
      error: query.error,
      refetch: query.refetch
    }),
    [query.data, query.isLoading, query.error, query.refetch]
  );

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog debe usarse dentro de CatalogProvider');
  return ctx;
}
