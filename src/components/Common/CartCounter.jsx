import { useStore } from '@nanostores/react';
// CORRECCIÓN: Importamos 'cartItems' que SÍ existe en tu store, en lugar de 'cartCount'
import { cartItems } from '../../stores/cartStore';

export default function CartCounter() {
  // Leemos la lista de productos
  const items = useStore(cartItems);
  
  // Calculamos la cantidad
  const count = items.length;

  if (count === 0) return null; // Ocultar si está vacío

  return (
    <span className="bg-brand-dark text-brand-yellow text-xs font-bold px-2 py-0.5 rounded-full ml-1 animate-pulse">
      {count}
    </span>
  );
}