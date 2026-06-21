import { useQuery } from '@tanstack/react-query';
import { CatalogSchema, type Catalog } from '@/types';

/** Fetch the catalog and validate it at the boundary (never trust the wire). */
async function fetchCatalog(): Promise<Catalog> {
  const res = await fetch('/api/catalog');
  if (!res.ok) {
    throw new Error(`Failed to load catalog (HTTP ${res.status})`);
  }
  // Throws a descriptive ZodError if the payload doesn't match the schema.
  return CatalogSchema.parse(await res.json());
}

/** React Query hook owning the catalog's loading / error / data lifecycle. */
export function useCatalog() {
  return useQuery({ queryKey: ['catalog'], queryFn: fetchCatalog });
}
