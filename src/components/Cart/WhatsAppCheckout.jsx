import { useStore } from '@nanostores/react';
import { groupedCart, toggleCheckout, toggleCart } from '../../stores/cartStore';

export default function WhatsAppCheckout() {
  const { items } = useStore(groupedCart);

  const handleClick = () => {
    if (items.length === 0) return;
    // 1. Cerramos el carrito lateral para que no estorbe
    toggleCart(false); 
    // 2. Abrimos la nueva ventana de datos
    toggleCheckout(true);
  };

  return (
    <button
      onClick={handleClick}
      disabled={items.length === 0}
      className={`w-full py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 shadow-lg transition-all duration-300
        ${items.length === 0 
          ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
          : 'bg-[#25D366] hover:bg-[#20bd5a] text-white hover:scale-[1.02] hover:shadow-green-900/50'
        }`}
    >
      <i className="fa-brands fa-whatsapp text-2xl"></i>
      {items.length === 0 ? 'Carrito Vacío' : 'Continuar con el Pedido'}
    </button>
  );
}