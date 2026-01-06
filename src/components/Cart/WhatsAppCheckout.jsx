import { useStore } from '@nanostores/react';
import { groupedCart } from '../../stores/cartStore';

export default function WhatsAppCheckout() {
  const { items, total } = useStore(groupedCart);
  
  // ⚠️ TU NÚMERO AQUÍ
  const PHONE_NUMBER = "5215584457355"; 

  const handleCheckout = () => {
    if (items.length === 0) return;

    // 1. Encabezado
    let message = `🍕 *¡Hola! Quiero hacer un pedido en Roger Pizza:*\n\n`;

    // 2. Recorremos los productos
    items.forEach((item) => {
      // CASO A: Promoción 2x1
      if (item.type === 'promo_pair') {
        message += `🔥 *PROMO 2x1 ($${item.price})*\n`;
        message += `   - ${item.items[0].name} (${item.items[0].size})\n`;
        message += `   - ${item.items[1].name} (${item.items[1].size})\n`;
      } 
      // CASO B: Pizza con descuento (Huérfana)
      else if (item.isDiscounted) {
        message += `🏷️ *${item.name}* (40% OFF) - $${item.displayPrice}\n`;
        message += `   Tam: ${item.size}\n`;
      } 
      // CASO C: Producto Normal / Paquete (Aquí entra el refresco)
      else {
        message += `📝 *${item.name}* - $${item.price}\n`;
        
        // Si es un paquete, mostramos el detalle (Ej: Refresco: Coca)
        if (item.description && item.category === 'paquetes') {
             message += `   Detalle: ${item.description}\n`;
        }
        // Si tiene tamaño (refrescos o pizzas solas sin promo)
        else if (item.size && item.size !== 'Unico') {
            message += `   Tam: ${item.size}\n`;
        }
      }
      message += `\n`; 
    });

    // 3. Total
    message += `💰 *TOTAL A PAGAR: $${total}*\n`;
    message += `📍 *Dirección de entrega:* (Escribe aquí tu dirección)`;

    // 4. Enviar
    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={items.length === 0}
      className={`w-full py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 shadow-lg transition-all duration-300
        ${items.length === 0 
          ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
          : 'bg-[#25D366] hover:bg-[#20bd5a] text-white hover:scale-[1.02] hover:shadow-green-900/50'
        }`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.001.572 2.135.806 3.0.809 3.182 0 5.769-2.587 5.769-5.767 0-3.181-2.586-5.767-5.768-5.767zm8.016-3.868c-1.954-2.079-5.074-2.834-7.902-1.914-2.827.919-4.832 3.39-5.116 6.31l-.01.12c-.08 2.37.7 4.61 2.18 6.47l-1.6 5.86 6.01-1.58c1.64 1 3.51 1.52 5.43 1.52 5.52 0 10-4.48 10-10 0-2.65-1.03-5.15-2.9-7.01zm-3.056 12.016c-.28.79-1.37 1.45-2.26 1.49-.6.02-1.22-.09-2.31-.55-1.46-.62-2.57-1.57-3.53-2.53-.95-.96-1.9-2.06-2.52-3.52-.46-1.08-.57-1.7-.55-2.3.04-.89.7-1.99 1.49-2.26.24-.09.5-.12.76-.08.68.12 1.58 2.06 1.66 2.24.09.18.06.39-.07.64-.13.25-.26.4-.52.65-.21.2-.45.44-.22.84.45.77 1.15 1.59 2.12 2.45.96.86 1.95 1.44 2.82 1.76.4.15.68-.01.9-.22.25-.25.4-.38.65-.51.25-.13.46-.16.64-.07.18.09 2.13.98 2.24 1.66.04.26.02.52-.07.76z"/>
      </svg>
      {items.length === 0 ? 'Carrito Vacío' : 'Pedir por WhatsApp'}
    </button>
  );
}