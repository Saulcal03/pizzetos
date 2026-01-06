import { useStore } from '@nanostores/react';
import { isCartOpen, groupedCart, removeCartItem, toggleCart } from '../../stores/cartStore';
import WhatsAppCheckout from './WhatsAppCheckout'; // <--- IMPORTANTE

export default function CartFlyout() {
  const isOpen = useStore(isCartOpen);
  const { items, total } = useStore(groupedCart);

  return (
    <>
      {/* OVERLAY */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => toggleCart(false)}
      />

      {/* SIDEBAR */}
      <aside className={`fixed top-0 right-0 h-full w-full max-w-md bg-brand-surface border-l border-white/10 shadow-2xl z-[70] transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* HEADER */}
        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-brand-dark/50">
          <h2 className="font-display text-2xl text-white tracking-wide">Tu Pedido</h2>
          <button onClick={() => toggleCart(false)} className="text-gray-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* LISTA DE ITEMS */}
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
                    <button 
                      onClick={() => { removeCartItem(item.items[0].uniqueId); removeCartItem(item.items[1].uniqueId); }}
                      className="absolute top-2 right-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 000-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    </button>
                  </div>
                ) : (
                  // SI ES UN PRODUCTO INDIVIDUAL (Pizza o Paquete)
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-white">{item.name}</h4>
                      
                      {/* Mostramos tamaño solo si existe y no es paquete (los paquetes usan description) */}
                      {item.size && item.category !== 'paquetes' && (
                        <p className="text-xs text-gray-400">{item.size}</p>
                      )}

                      {/* DETALLE EXTRA (Ej: Refresco del paquete) */}
                      {item.description && (
                         <p className="text-xs text-brand-yellow mt-1">{item.description}</p>
                      )}

                      {item.isDiscounted && <span className="text-green-400 text-xs font-bold block mt-1">40% Descuento aplicado</span>}
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

        {/* FOOTER */}
        <div className="p-6 bg-brand-dark/80 border-t border-white/10 backdrop-blur-md">
          <div className="flex justify-between items-end mb-4">
            <span className="text-gray-400 font-medium">Total Estimado</span>
            <span className="font-display text-4xl text-brand-yellow">${total}</span>
          </div>
          
          {/* BOTÓN NUEVO (Color Verde WhatsApp) */}
          <WhatsAppCheckout />
          
        </div>

      </aside>
    </>
  );
}