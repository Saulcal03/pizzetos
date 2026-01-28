// src/components/Cart/CartFlyout.jsx
import { useStore } from '@nanostores/react';
import { isCartOpen, groupedCart, removeCartItem, toggleCart, toggleCheckout, updateCartItem, addCartItem } from '../../stores/cartStore';

// PRECIOS DE LA ORILLA DE QUESO
const PRECIOS_ORILLA = {
  "Chica": 35,
  "Mediana": 40,
  "Grande": 45,
  "Familiar": 50
};

export default function CartFlyout() {
  const isOpen = useStore(isCartOpen);
  const { items, total } = useStore(groupedCart);

  const handleCheckout = () => {
    toggleCart(false);     
    toggleCheckout(true);  
  };

  const handleToggleOrilla = (uniqueId, currentVal) => {
    updateCartItem(uniqueId, { orillaQueso: !currentVal });
  };

  const handleRemovePair = (itemsArray) => {
    itemsArray.forEach(pizza => removeCartItem(pizza.uniqueId));
  };

  // --- LÓGICA DE LA PROMO JARRITOS (CORREGIDA) ---
  
  // Verificamos si existe al menos una promoción de 2x1 activa
  const tieneCombos2x1 = items.some(item => item.type === 'promo_pair');
  
  // Verificamos si ya existe el Jarrito con el ID específico de promoción en el carrito
  const yaTieneJarritoPromo = items.some(item => item.id === 'jarritos-2lts-promo');
  
  // El banner se muestra solo si hay combos Y NO se ha añadido el jarrito de oferta
  // Al añadir uno, la variable 'yaTieneJarritoPromo' será true y el banner se ocultará.
  const showJarritoPromo = tieneCombos2x1 && !yaTieneJarritoPromo;

  const handleAddJarrito = () => {
    addCartItem({
      id: 'jarritos-2lts-promo', // ID único para controlar la promoción
      name: 'Refresco Jarritos 2 Lts (Promo)',
      price: 25, 
      category: 'Bebidas',
      type: 'bebida_promo',
      image: '/img/refresco2l.webp'
    });
  };

  return (
    <>
      {/* OVERLAY */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => toggleCart(false)}
      />

      {/* SIDEBAR */}
      <aside className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#FFFBF2] border-l border-orange-100 shadow-2xl z-[70] transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* HEADER */}
        <div className="p-5 border-b border-orange-100 flex justify-between items-center bg-white/50">
          <h2 className="font-serif italic text-2xl text-gray-800 tracking-wide">Tu Pedido</h2>
          <button onClick={() => toggleCart(false)} className="text-gray-400 hover:text-orange-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* LISTA DE ITEMS */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-[#FFFBF2]">
          {items.length === 0 ? (
            <div className="text-center text-gray-400 mt-10 flex flex-col items-center">
              <p className="text-gray-500">Tu carrito está vacío.</p>
            </div>
          ) : (
            items.map((item) => {
              
              // --- CASO 1: PROMOCIÓN 2x1 ---
              if (item.type === 'promo_pair') {
                return (
                  <div key={item.uniqueId} className="bg-white rounded-xl border border-orange-200 shadow-sm relative overflow-hidden">
                    <div className="bg-amber-50 p-3 border-b border-amber-100 flex justify-between items-center">
                        <div>
                            <span className="text-amber-700 font-bold text-sm uppercase tracking-wider block">Promoción 2x1 ({item.size})</span>
                        </div>
                        <span className="font-serif italic text-xl text-amber-600 font-medium">${item.price}</span>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {item.items.map((pizza, index) => (
                            <div key={pizza.uniqueId} className="p-4 hover:bg-orange-50/30 transition-colors">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-orange-100 text-orange-600 text-[11px] font-bold px-2 py-0.5 rounded-full">{index + 1}</span>
                                        <h4 className="font-bold text-gray-800 text-sm">{pizza.name}</h4>
                                    </div>
                                    <button onClick={() => removeCartItem(pizza.uniqueId)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                </div>
                                {pizza.customDescription && <p className="text-xs text-gray-500 mt-1 ml-8">{pizza.customDescription}</p>}

                                {PRECIOS_ORILLA[item.size] && (
                                    <div className="mt-2 ml-8">
                                        <label className="flex items-center space-x-2 cursor-pointer select-none group">
                                        <input type="checkbox" checked={pizza.orillaQueso || false} onChange={() => handleToggleOrilla(pizza.uniqueId, pizza.orillaQueso)} className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500 border-gray-300" />
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="text-gray-600">Orilla de Queso</span>
                                            <span className="text-orange-600 font-bold">+${PRECIOS_ORILLA[item.size]}</span>
                                        </div>
                                        </label>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    
                    <div className="bg-gray-50 p-2 text-right border-t border-gray-100">
                         <button onClick={() => handleRemovePair(item.items)} className="text-red-400 hover:text-red-600 text-[10px] font-bold uppercase px-2">
                            Eliminar Combo Completo
                          </button>
                    </div>
                  </div>
                );
              }

              // --- CASO 2: PRODUCTO INDIVIDUAL / PAQUETES ---
              const costoOrilla = PRECIOS_ORILLA[item.size] || 0;
              const precioFinal = item.orillaQueso ? (item.price + costoOrilla) : item.price;
              const isPromoItem = item.id === 'jarritos-2lts-promo';
              
              const showOrillaOption = item.category === 'Pizzas' && !item.id.includes('paquete') && !item.id.includes('promo');

              return (
                <div key={item.uniqueId} className={`rounded-xl p-4 border shadow-sm relative group ${isPromoItem ? 'bg-orange-50 border-orange-300' : 'bg-white border-orange-100'}`}>
                  <div className="flex flex-col">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 text-lg leading-tight">
                            {item.name} 
                            {isPromoItem && <span className="ml-2 text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded-full uppercase">Oferta</span>}
                        </h4>
                        
                        {item.size && item.size !== "General" && (
                          <span className="inline-block mt-1 bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold border border-amber-200 uppercase">
                            {item.size}
                          </span>
                        )}

                        {item.customDescription && (
                          <p className="text-[11px] text-stone-500 mt-2 bg-stone-50 p-2 rounded-lg border border-stone-100 italic">
                            {item.customDescription}
                          </p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <span className="font-serif italic text-xl text-amber-600 font-medium">${precioFinal}</span>
                      </div>
                    </div>

                    {showOrillaOption && PRECIOS_ORILLA[item.size] && (
                      <div className="mt-3 pt-2 border-t border-dashed border-gray-100">
                        <label className="flex items-center space-x-2 cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={item.orillaQueso || false} 
                            onChange={() => handleToggleOrilla(item.uniqueId, item.orillaQueso)} 
                            className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500 border-gray-300" 
                          />
                          <div className="flex justify-between w-full text-sm">
                            <span className="text-gray-700 font-medium">Con Orilla de Queso</span>
                            <span className="text-orange-600 font-bold">+${PRECIOS_ORILLA[item.size]}</span>
                          </div>
                        </label>
                      </div>
                    )}

                    <button onClick={() => removeCartItem(item.uniqueId)} className="self-end mt-2 text-red-500 font-bold hover:underline text-xs">
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* BANNER DE PROMOCIÓN JARRITOS (SOLO APARECE SI CORRESPONDE) */}
        {showJarritoPromo && (
            <div className="px-5 pb-2">
                <div 
                  className="bg-gradient-to-r from-orange-400 to-amber-500 rounded-xl p-3 shadow-lg flex items-center justify-between text-white relative overflow-hidden group cursor-pointer" 
                  onClick={handleAddJarrito}
                >
                    <div className="flex flex-col relative z-10">
                        <span className="font-bold text-xs uppercase tracking-wider text-yellow-100">¡Oferta Especial Única!</span>
                        <span className="font-medium text-[10px]">Añade 1 Jarritos 2L por tus combos</span>
                    </div>
                    <div className="flex items-center gap-3 relative z-10">
                        <span className="font-serif italic text-2xl font-bold text-white drop-shadow-md">$25</span>
                        <div className="bg-white text-orange-600 rounded-full p-1 shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* FOOTER */}
        <div className="p-6 bg-white border-t border-orange-100 pb-24 md:pb-6">
          <div className="flex justify-between items-end mb-4">
            <span className="text-gray-500 font-medium text-sm uppercase tracking-wide">Total</span>
            <span className="text-3xl font-serif italic text-amber-600 font-medium">${total}</span>
          </div>
          
          <button 
            onClick={handleCheckout} 
            disabled={items.length === 0} 
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${items.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#25D366] hover:bg-[#20bd5a]'}`}
          >
              <span>Continuar con el Pedido</span>
          </button>
        </div>
      </aside>
    </>
  );
}