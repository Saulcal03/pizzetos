// src/components/Menu/AddToCartBtn.jsx
import { openProductModal, addCartItem, selectedGlobalSize } from '../../stores/cartStore';

export default function AddToCartBtn({ product }) {
  
  // Agregamos 'e' para capturar el clic y sus coordenadas
  const handleClick = (e) => {
    const currentSize = selectedGlobalSize.get();

    // --- LÓGICA DE ANIMACIÓN ---
    // 1. Verificamos si se va a agregar directo o si abre modal
    // Se agrega directo si: (Tiene tamaño global seleccionado) O (NO es personalizable)
    const seAgregaDirecto = (currentSize && product.prices && product.prices[currentSize]) || product.type !== 'personalizable';

    if (seAgregaDirecto) {
        const btn = e.currentTarget;
        const rect = btn.getBoundingClientRect();
        
        // Disparamos el evento personalizado con las coordenadas del botón
        window.dispatchEvent(new CustomEvent('trigger-add-to-cart-animation', {
            detail: {
                x: rect.left + rect.width / 2, // Centro X
                y: rect.top + rect.height / 2  // Centro Y
            }
        }));
    }
    // ----------------------------

    // 1. Lógica para pizzas con tamaño global (No tocamos nada aquí)
    if (currentSize && product.prices && product.prices[currentSize]) {
        const priceForSize = product.prices[currentSize];
        addCartItem({
            ...product,
            price: priceForSize,
            priceFull: priceForSize,
            size: currentSize,
            customDescription: product.description || ""
        });
        return;
    }

    // 2. Si es personalizable, abre el modal
    if (product.type === 'personalizable') {
        openProductModal(product);
    } 
    // 3. Lógica para productos fijos con detección de tamaño
    else {
        // Buscamos el tamaño dentro de la descripción del producto
        const desc = (product.description || "").toLowerCase();
        let detectedSize = "General"; // Por defecto

        if (desc.includes("familiar")) detectedSize = "Familiar";
        else if (desc.includes("grande")) detectedSize = "Grande";
        else if (desc.includes("rectangular")) detectedSize = "Rectangular";
        else if (desc.includes("barra")) detectedSize = "Barra";

        addCartItem({
            ...product,
            size: detectedSize, // Asigna el tamaño detectado o "General"
            customDescription: product.description || ""
        });
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