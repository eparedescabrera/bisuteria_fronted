import { createContext, useContext, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPublicConfig } from '../services/publicApi';
import { setPublicTiendaSlug } from '../utils/tienda';

const CatalogContext = createContext(null);

export function CatalogProvider({ tiendaSlug, children }) {
  // Sincrónico: el interceptor axios necesita el slug desde el primer request
  setPublicTiendaSlug(tiendaSlug);
  useEffect(() => {
    setPublicTiendaSlug(tiendaSlug);
    return () => setPublicTiendaSlug(null);
  }, [tiendaSlug]);

  const query = useQuery({
    queryKey: ['public', tiendaSlug, 'configuracion'],
    queryFn: () => getPublicConfig(tiendaSlug),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(tiendaSlug),
    retry: (count, error) => {
      const status = error?.response?.status;
      if ([403, 404].includes(status)) return false;
      return count < 1;
    }
  });

  const value = useMemo(
    () => ({
      tiendaSlug,
      config: query.data?.data || null,
      loading: query.isLoading,
      error: query.error,
      refetch: query.refetch
    }),
    [tiendaSlug, query.data, query.isLoading, query.error, query.refetch]
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
