// src/components/Menu/AddToCartBtn.jsx
import { openProductModal, addCartItem, selectedGlobalSize } from '../../stores/cartStore';

export default function AddToCartBtn({ product }) {
  
  const handleClick = () => {
    // 1. Leemos el tamaño que está seleccionado arriba (ej. "Familiar")
    const currentSize = selectedGlobalSize.get();

    // 2. LÓGICA INTELIGENTE:
    // Si hay un tamaño seleccionado Y este producto tiene precio para ese tamaño (es una pizza)...
    // ...lo agregamos DIRECTO al carrito con el precio correcto.
    if (currentSize && product.prices && product.prices[currentSize]) {
        const priceForSize = product.prices[currentSize];
        
        addCartItem({
            ...product,
            price: priceForSize,      // Ponemos el precio real (ej. 375)
            priceFull: priceForSize,  // Importante para el descuento
            size: currentSize         // Guardamos que es Familiar
        });
        return; // Terminamos aquí, NO abrimos el modal.
    }

    // 3. Si no hay tamaño seleccionado (o es un Paquete/Refresco), seguimos la lógica normal
    if (product.type === 'personalizable') {
        openProductModal(product);
    } else {
        // Si es fijo (ej. Papas), añadir directo
        addCartItem(product);
    }
  };

  return (
    <button 
        onClick={handleClick}
        className="w-full bg-amber-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
    >
        <span>Agregar</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
    </button>
  );
}