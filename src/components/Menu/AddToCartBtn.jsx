import { openProductModal, addCartItem } from '../../stores/cartStore';

export default function AddToCartBtn({ product }) {
  
  const handleClick = () => {
    // Si el producto es personalizable (Paquetes, Refrescos), abrimos modal
    if (product.type === 'personalizable') {
        openProductModal(product);
    } else {
        // Si es fijo (ej. Papas, Paquete 1), añadir directo
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