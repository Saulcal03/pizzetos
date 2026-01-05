import { useStore } from '@nanostores/react';
import { isCartOpen, groupedCart, removeCartItem, toggleCart } from '../../stores/cartStore';

export default function CartFlyout() {
  const isOpen = useStore(isCartOpen);
  const { items, total } = useStore(groupedCart);

  // Función para generar mensaje de WhatsApp
  const handleCheckout = () => {
    if (items.length === 0) return;
    
    let message = "Hola, me gustaría hacer un pedido:\n\n";
    items.forEach(item => {
      if (item.type === 'promo_pair') {
        message += `🔥 *2x1 ${item.items[0].size}* ($${item.price})\n   - ${item.items[0].name}\n   - ${item.items[1].name}\n`;
      } else {
        message += `🍕 *${item.name}* (${item.size || 'Unico'}) - $${item.displayPrice || item.price}\n`;
      }
    });
    message += `\n💰 *Total: $${total}*`;
    
    // Número de sucursal por defecto (puedes hacerlo dinámico luego)
    const phone = "5215584457355"; 
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
      {/* OVERLAY (Fondo oscuro) */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => toggleCart(false)}
      />

      {/* SIDEBAR (Panel lateral) */}
      <aside className={`fixed top-0 right-0 h-full w-full max-w-md bg-brand-surface border-l border-white/10 shadow-2xl z-[70] transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* HEADER DEL CARRITO */}
        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-brand-dark/50">
          <h2 className="font-display text-2xl text-white tracking-wide">Tu Pedido</h2>
          <button onClick={() => toggleCart(false)} className="text-gray-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* LISTA DE ITEMS (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 mt-10 flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p>Tu carrito está vacío.</p>
              <p className="text-sm mt-2">¡Agrega unas pizzas para comenzar!</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.uniqueId} className="bg-brand-dark rounded-xl p-4 border border-white/5 relative group animate-fade-in-up">
                {/* SI ES UN PAR 2x1 */}
                {item.type === 'promo_pair' ? (
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="bg-brand-yellow text-black text-xs font-bold px-2 py-1 rounded uppercase">Promoción 2x1</span>
                      <span className="font-display text-xl text-brand-yellow">${item.price}</span>
                    </div>
                    <div className="text-sm text-gray-300 pl-2 border-l-2 border-brand-yellow/50 space-y-1">
                      <p>1. {item.items[0].name}</p>
                      <p>2. {item.items[1].name}</p>
                    </div>
                    {/* Botón Eliminar Par Completo */}
                    <button 
                      onClick={() => { removeCartItem(item.items[0].uniqueId); removeCartItem(item.items[1].uniqueId); }}
                      className="absolute top-2 right-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 000-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    </button>
                  </div>
                ) : (
                  // SI ES UN PRODUCTO INDIVIDUAL
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-white">{item.name}</h4>
                      <p className="text-xs text-gray-400">{item.size}</p>
                      {item.isDiscounted && <span className="text-green-400 text-xs font-bold">40% Descuento aplicado</span>}
                    </div>
                    <div className="text-right">
                      <span className="font-display text-xl text-brand-yellow">${item.displayPrice || item.price}</span>
                      <button 
                        onClick={() => removeCartItem(item.uniqueId)}
                        className="block ml-auto mt-1 text-gray-500 hover:text-red-500 text-xs"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* FOOTER DEL CARRITO (TOTAL Y PAGAR) */}
        <div className="p-6 bg-brand-dark/80 border-t border-white/10 backdrop-blur-md">
          <div className="flex justify-between items-end mb-4">
            <span className="text-gray-400 font-medium">Total Estimado</span>
            <span className="font-display text-4xl text-brand-yellow">${total}</span>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={items.length === 0}
            className={`w-full py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 shadow-neon transition-all ${
              items.length === 0 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed shadow-none' 
                : 'bg-brand-yellow text-black hover:scale-[1.02]'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            Enviar Pedido por WhatsApp
          </button>
        </div>

      </aside>
    </>
  );
}