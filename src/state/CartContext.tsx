import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import {
  createCartReducer,
  createInitialState,
  type CartAction,
  type CartState,
} from './cart';
import { loadState } from '@/lib/persistence';
import type { Catalog } from '@/types';

interface CartContextValue {
  catalog: Catalog;
  state: CartState;
  dispatch: Dispatch<CartAction>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  catalog,
  children,
}: {
  catalog: Catalog;
  children: ReactNode;
}) {
  // Reducer is bound to the catalog; rebuilt only if the catalog changes.
  const reducer = useMemo(() => createCartReducer(catalog), [catalog]);
  const [state, dispatch] = useReducer(reducer, catalog, (c) => {
    return loadState(c) ?? createInitialState(c);
  });

  const value = useMemo(() => ({ catalog, state, dispatch }), [catalog, state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
