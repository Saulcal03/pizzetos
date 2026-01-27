// src/components/Cart/WhatsAppCheckout.jsx
import { useStore } from '@nanostores/react';
import { groupedCart, toggleCheckout, toggleCart } from '../../stores/cartStore';

export default function WhatsAppCheckout() {
  const { items } = useStore(groupedCart);

  const handleClick = () => {
    if (items.length === 0) return;

    // 1. Cerramos el carrito lateral para limpiar la interfaz
    toggleCart(false); 
    
    // 2. Abrimos el modal de Checkout (donde el usuario pone su dirección)
    // Este modal usará la lógica que acabamos de configurar para enviar el mensaje detallado.
    toggleCheckout(true);
  };

  return (
    <div className="w-full px-1">
      <button
        onClick={handleClick}
        disabled={items.length === 0}
        className={`
          w-full py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-3 
          shadow-lg transition-all duration-300 transform active:scale-95
          ${items.length === 0 
            ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none' 
            : 'bg-[#25D366] hover:bg-[#20bd5a] text-white hover:shadow-green-500/40 hover:-translate-y-0.5'
          }
        `}
      >
        {/* Icono de WhatsApp de FontAwesome */}
        <i className={`fa-brands fa-whatsapp text-2xl ${items.length === 0 ? 'opacity-30' : 'animate-pulse'}`}></i>
        
        <span>
          {items.length === 0 ? 'Carrito Vacío' : 'Continuar con el Pedido'}
        </span>

        {/* Flecha indicativa opcional para mejorar la UX */}
        {items.length > 0 && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        )}
      </button>
      
      {items.length > 0 && (
        <p className="text-[10px] text-center text-stone-400 mt-2 font-medium uppercase tracking-tighter">
          Un paso más para completar tu orden
        </p>
      )}
    </div>
  );
}