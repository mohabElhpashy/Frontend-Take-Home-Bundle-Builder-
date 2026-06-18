import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import {
  cartReducer,
  createInitialState,
  type CartAction,
  type CartState,
} from './cart';
import { loadState } from '../lib/persistence';

interface CartContextValue {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}

const CartContext = createContext<CartContextValue | null>(null);

/** Restore a saved system if one exists, otherwise start from the seed. */
function initState(): CartState {
  return loadState() ?? createInitialState();
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, initState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
