import { CartProvider } from '@/state/CartContext';
import { useCatalog } from '@/api/useCatalog';
import { Builder } from '@/features/builder/Builder';
import { ReviewPanel } from '@/features/review/ReviewPanel';
import './App.css';

export default function App() {
  const { data: catalog, isPending, isError, error, refetch } = useCatalog();

  if (isPending) {
    return <Status>Loading your system…</Status>;
  }

  if (isError || !catalog) {
    return (
      <Status>
        Couldn't load your system{error ? ` (${error.message})` : ''}.
        <button type="button" className="app-retry" onClick={() => refetch()}>
          Try again
        </button>
      </Status>
    );
  }

  return (
    <CartProvider catalog={catalog}>
      <div className="page">
        <header className="page__header">
          <h1 className="page__title">Let's get started!</h1>
        </header>
        {/*
          stacked < 1140px  ·  side-by-side (1fr | 440px) 1140-1279px
          ·  >= 1280px stacked again (cameras one row, review full-width)
        */}
        <div className="flex flex-col gap-5 split:grid split:grid-cols-[minmax(0,1fr)_440px] split:gap-6 split:items-start xl:flex xl:items-stretch">
          <main>
            <Builder />
          </main>
          <div className="w-full split:sticky split:top-6 xl:static" id="review">
            <ReviewPanel />
          </div>
        </div>
      </div>
    </CartProvider>
  );
}

function Status({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center gap-3 p-6 text-center text-[0.95rem] text-muted">
      {children}
    </div>
  );
}
