import { CartProvider } from './state/CartContext';
import { Builder } from './components/Builder';
import { ReviewPanel } from './components/ReviewPanel';
import './App.css';

export default function App() {
  return (
    <CartProvider>
      <div className="page">
        <header className="page__header">
          <h1 className="page__title">Let's get started!</h1>
        </header>
        <div className="layout">
          <main className="layout__builder">
            <Builder />
          </main>
          <div className="layout__review">
            <ReviewPanel />
          </div>
        </div>
      </div>
    </CartProvider>
  );
}
