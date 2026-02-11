// src/components/Menu/ProductModal.jsx
import { useStore } from '@nanostores/react';
import { isModalOpen, modalProduct, closeProductModal, addCartItem, selectedGlobalSize } from '../../stores/cartStore';
import { menuItems, opcionesRefrescos } from '../../data/menuData'; 
import { useState, useEffect, useMemo } from 'react';

// --- COMPONENTES VISUALES ---
const OptionPills = ({ title, options, selected, onSelect, icon }) => {
  if (!options || options.length === 0) return null;
  return (
    <div className="mb-4">
      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-2">
        {icon && <i className={`fa-solid ${icon} text-amber-500`}></i>}
        {title}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={`
              px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border
              ${selected === opt 
                ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/30 transform scale-105' 
                : 'bg-white text-stone-600 border-stone-200 hover:border-amber-400 hover:text-amber-600'
              }
            `}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

const SelectionCard = ({ label, value, selected, onSelect, iconClass }) => (
    <button
        onClick={() => onSelect(value)}
        className={`
            flex-1 p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2
            ${selected === value 
                ? 'border-amber-500 bg-amber-50 text-amber-800 shadow-md' 
                : 'border-stone-200 bg-white text-stone-500 hover:border-amber-300 hover:bg-stone-50'
            }
        `}
    >
        <i className={`fa-solid ${iconClass} text-2xl ${selected === value ? 'text-amber-500' : 'text-stone-400'}`}></i>
        <span className="font-bold text-sm">{label}</span>
        {selected === value && <div className="w-2 h-2 rounded-full bg-amber-500 mt-1"></div>}
    </button>
);

const FlavorSelector = ({ slots, labels, selections, setSelections, activeFlavorSlot, setActiveFlavorSlot, pizzaOptions, currentProductKeyBase }) => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2 mb-2">
           {Array.from({ length: slots }).map((_, idx) => {
             const slotNum = idx + 1;
             let selectionKey;
             if (slots === 1) selectionKey = currentProductKeyBase; 
             else selectionKey = currentProductKeyBase === 'pizza' ? `pizza${slotNum}` : `flavor${slotNum}`;

             const selectedFlavorName = selections[selectionKey];
             const selectedPizza = pizzaOptions.find(p => p.name === selectedFlavorName);

             return (
               <button
                 key={slotNum}
                 onClick={() => setActiveFlavorSlot(slotNum)}
                 className={`
                   relative p-3 rounded-xl border-2 text-left transition-all overflow-hidden h-20 flex flex-col justify-center
                   ${activeFlavorSlot === slotNum 
                     ? 'border-amber-500 bg-amber-50 shadow-md' 
                     : 'border-stone-200 bg-white hover:bg-stone-50'
                   }
                 `}
               >
                 {selectedPizza && (
                   <img src={selectedPizza.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 blur-[1px]" />
                 )}
                 <div className="relative z-10">
                   <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block">
                     {labels[idx] || `Opción ${slotNum}`}
                   </span>
                   <span className={`text-sm font-bold leading-tight block truncate ${selectedFlavorName ? 'text-stone-800' : 'text-stone-400'}`}>
                     {selectedFlavorName || "Toca para elegir"}
                   </span>
                 </div>
               </button>
             );
           })}
        </div>

        <div>
           <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
             <i className="fa-solid fa-pizza-slice text-amber-500 mr-2"></i>
             Elige sabor para: <span className="text-stone-800 font-black">Opción {activeFlavorSlot}</span>
           </label>
           
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
             {pizzaOptions.map(pizza => {
               let currentSlotKey;
               if (slots === 1) currentSlotKey = currentProductKeyBase;
               else currentSlotKey = currentProductKeyBase === 'pizza' ? `pizza${activeFlavorSlot}` : `flavor${activeFlavorSlot}`;
               
               const isSelected = selections[currentSlotKey] === pizza.name;

               return (
                 <button 
                   key={pizza.id}
                   onClick={() => {
                     setSelections({ ...selections, [currentSlotKey]: pizza.name });
                     if (activeFlavorSlot < slots) setActiveFlavorSlot(activeFlavorSlot + 1);
                   }}
                   className={`
                     group relative rounded-lg overflow-hidden border transition-all shadow-sm min-w-0
                     ${isSelected ? 'border-amber-500 ring-2 ring-amber-500/50' : 'border-stone-200 opacity-90 hover:opacity-100 hover:border-amber-300'}
                   `}
                 >
                   <div className="aspect-square w-full relative">
                      <img 
                        src={pizza.image} 
                        alt={pizza.name} 
                        className="absolute inset-0 w-full h-full object-cover" 
                        loading="lazy" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-2 flex items-end">
                        <span className="text-[10px] font-bold text-white leading-tight line-clamp-2 text-left">{pizza.name}</span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-amber-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-lg border border-white z-20">
                          <i className="fa-solid fa-check"></i>
                        </div>
                      )}
                   </div>
                 </button>
               );
             })}
           </div>
        </div>
      </div>
    );
};

export default function ProductModal() {
  const isOpen = useStore(isModalOpen);
  const product = useStore(modalProduct);
  const globalSize = useStore(selectedGlobalSize); 

  const [selections, setSelections] = useState({});
  const [activeFlavorSlot, setActiveFlavorSlot] = useState(1);

  const pizzaOptions = useMemo(() => menuItems.filter(item => item.category === 'Pizzas'), []);

  useEffect(() => {
    setSelections({});
    setActiveFlavorSlot(1);
  }, [product]);

  if (!isOpen || !product) return null;

  const isSelectionIncomplete = () => {
    if (product.id === 'paquete-2' && !selections.pizza) return true;
    if (product.id === 'paquete-3' && (!selections.pizza1 || !selections.pizza2 || !selections.pizza3)) return true;
    if (product.id === 'promo-magno' && !selections.flavor1) return true;
    
    if (['pizza-rectangular', 'pizza-barra'].includes(product.id) && !selections.drink) return true;
    if (product.id.includes('hamburguesa') && !selections.drink) return true;
    if ((product.id.includes('costillas') || product.id.includes('alitas')) && !selections.drink) return true;
    
    if (product.category === 'Bebidas' && !selections.flavor) return true;

    return false;
  };

  const getActiveSize = () => {
    if (selections.size) return selections.size;
    if (product.prices) {
        const sizes = Object.keys(product.prices);
        if (globalSize && sizes.includes(globalSize)) return globalSize;
        if (sizes.includes('Familiar')) return 'Familiar';
        return sizes[0];
    }
    return 'General';
  };

  const activeSize = getActiveSize();
  let currentPrice = product.price;
  if (product.prices && activeSize && product.prices[activeSize]) {
      currentPrice = product.prices[activeSize];
  }

  // --- MODIFICADO: Aceptamos 'e' para la animación ---
  const handleSubmit = (e) => {
    if (isSelectionIncomplete()) return;
    
    // --- INICIO ANIMACIÓN ---
    if (e && e.currentTarget) {
        const btn = e.currentTarget;
        const rect = btn.getBoundingClientRect();
        
        // Disparamos el evento personalizado con las coordenadas del botón verde
        window.dispatchEvent(new CustomEvent('trigger-add-to-cart-animation', {
            detail: {
                x: rect.left + rect.width / 2, // Centro X
                y: rect.top + rect.height / 2  // Centro Y
            }
        }));
    }
    // --- FIN ANIMACIÓN ---

    let displaySize = activeSize;
    let finalSelections = { ...selections };

    // --- LÓGICA PARA INCLUIR JARRITO EN EL CARRITO AUTOMÁTICAMENTE ---
    const paquetesConJarrito = ['paquete-1', 'paquete-2', 'paquete-3', 'promo-magno'];
    if (paquetesConJarrito.includes(product.id)) {
        finalSelections.drink = "Refresco Jarrito";
    }

    if (['paquete-1', 'paquete-2', 'paquete-3'].includes(product.id)) displaySize = "Grande";
    if (product.id === 'promo-magno') displaySize = "Familiar";
    if (product.id === 'pizza-rectangular') displaySize = "Rectangular";
    if (product.id === 'pizza-barra') displaySize = "Barra";

    const finalItem = {
      ...product,
      price: currentPrice,
      priceFull: currentPrice,
      size: displaySize, 
      selections: { ...finalSelections, size: displaySize },
      description: product.description, // Agregado para el mensaje de WhatsApp
      customDescription: Object.values(finalSelections).filter(Boolean).join(', ')
    };
    addCartItem(finalItem);
    closeProductModal();
  };

  const jarritosOptions = opcionesRefrescos?.refrescos_2l || ["Pepsi", "Manzanita", "Sangría", "Mirinda", "7UP"];
  const refrescos355Options = opcionesRefrescos?.refrescos_355ml || ["Fanta", "Sprite", "Fresca", "Mundet"];

  const renderForm = () => {
    if (product.id === 'paquete-2') {
        return (
          <div className="space-y-6">
            <FlavorSelector slots={1} labels={["Tu Pizza Grande"]} selections={selections} setSelections={setSelections} activeFlavorSlot={activeFlavorSlot} setActiveFlavorSlot={setActiveFlavorSlot} pizzaOptions={pizzaOptions} currentProductKeyBase="pizza" />
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <i className="fa-solid fa-utensils text-amber-500"></i> Acompañante
              </label>
              <div className="flex gap-3">
                 <SelectionCard label="Alitas" value="Alitas" selected={selections.side} onSelect={(val) => setSelections({...selections, side: val, sideFlavor: null})} iconClass="fa-drumstick-bite" />
                 <SelectionCard label="Hamburguesa" value="Hamburguesa" selected={selections.side} onSelect={(val) => setSelections({...selections, side: val})} iconClass="fa-burger" />
              </div>
            </div>
            {selections.side === 'Alitas' && (
                <OptionPills title="Salsa Alitas" icon="fa-pepper-hot" options={["BBQ", "Mango Habanero"]} selected={selections.sideFlavor} onSelect={(val) => setSelections({...selections, sideFlavor: val})} />
            )}
            <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-sm flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <i className="fa-solid fa-bottle-water"></i>
                </div>
                <div>
                    <p className="text-stone-800 text-sm font-bold">Incluye: Refresco Jarrito</p>
                    <p className="text-stone-500 text-xs text-amber-600 font-bold">Por favor, indícanos el sabor en notas al final</p>
                </div>
            </div>
          </div>
        );
    }

    if (product.id === 'paquete-3') {
        return (
          <div className="space-y-4">
            <p className="text-xs text-amber-600 font-bold uppercase mb-2">Selecciona tus 3 pizzas grandes:</p>
            <FlavorSelector slots={3} labels={["Pizza 1", "Pizza 2", "Pizza 3"]} selections={selections} setSelections={setSelections} activeFlavorSlot={activeFlavorSlot} setActiveFlavorSlot={setActiveFlavorSlot} pizzaOptions={pizzaOptions} currentProductKeyBase="pizza" />
            <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-sm flex items-center gap-3 mt-4">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <i className="fa-solid fa-bottle-water"></i>
                </div>
                <div>
                    <p className="text-stone-800 text-sm font-bold">Incluye: Refresco Jarrito</p>
                </div>
            </div>
          </div>
        );
    }

    if (product.id === 'promo-magno') {
        return (
            <div className="space-y-4">
                <p className="text-xs text-amber-600 font-bold uppercase mb-2">Pizza Familiar (Hasta 2 especialidades):</p>
                <FlavorSelector slots={2} labels={["Mitad 1", "Mitad 2 (Opcional)"]} selections={selections} setSelections={setSelections} activeFlavorSlot={activeFlavorSlot} setActiveFlavorSlot={setActiveFlavorSlot} pizzaOptions={pizzaOptions} currentProductKeyBase="flavor" />
                <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-sm flex items-center gap-3 mt-4">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                        <i className="fa-solid fa-bottle-water"></i>
                    </div>
                    <div>
                        <p className="text-stone-800 text-sm font-bold">Incluye: Refresco Jarrito</p>
                    </div>
                </div>
            </div>
        );
    }

    if (product.id === 'pizza-rectangular' || product.id === 'pizza-barra') {
        const slots = product.id === 'pizza-rectangular' ? 4 : 2;
        return (
            <div className="space-y-4">
                <p className="text-xs text-amber-600 font-bold uppercase mb-2">Configura tu Pizza:</p>
                <FlavorSelector slots={slots} labels={slots === 4 ? ["Esp. 1", "Esp. 2", "Esp. 3", "Esp. 4"] : ["Mitad Izq", "Mitad Der"]} selections={selections} setSelections={setSelections} activeFlavorSlot={activeFlavorSlot} setActiveFlavorSlot={setActiveFlavorSlot} pizzaOptions={pizzaOptions} currentProductKeyBase="flavor" />
                <OptionPills title="Refresco 2Lts (OBLIGATORIO)" icon="fa-bottle-water" options={jarritosOptions} selected={selections.drink} onSelect={(val) => setSelections({...selections, drink: val})} />
            </div>
        );
    }

    if (product.id.includes('hamburguesa') || product.id.includes('costillas') || product.id.includes('alitas')) {
        return (
            <div className="space-y-4">
                 {product.id.includes('hamburguesa') && <OptionPills title="Tipo de Carne" icon="fa-drumstick-bite" options={["Res", "Pollo"]} selected={selections.meat} onSelect={(val) => setSelections({...selections, meat: val})} />}
                 {(product.id.includes('costillas') || product.id.includes('alitas')) && <OptionPills title="Salsa" icon="fa-pepper-hot" options={["BBQ", "Mango Habanero"]} selected={selections.flavor} onSelect={(val) => setSelections({...selections, flavor: val})} />}
                 <OptionPills title="Refresco 355ml (OBLIGATORIO)" icon="fa-bottle-water" options={refrescos355Options} selected={selections.drink} onSelect={(val) => setSelections({...selections, drink: val})} />
            </div>
        );
    }

    if (product.category === 'Bebidas') {
        let optionsList = product.id.includes('2lts') ? jarritosOptions : product.id.includes('600ml') ? (opcionesRefrescos?.refrescos_600ml || ["Pepsi"]) : refrescos355Options;
        return (
            <div className="space-y-4">
                 <OptionPills title="Elige Sabor (OBLIGATORIO)" icon="fa-bottle-water" options={optionsList} selected={selections.flavor} onSelect={(val) => setSelections({...selections, flavor: val})} />
            </div>
        );
    }

    if (product.prices) {
        return (
            <div className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <i className="fa-solid fa-ruler-combined text-amber-500"></i> Selecciona el Tamaño
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {Object.entries(product.prices).map(([size, price]) => (
                            <button 
                                key={size}
                                onClick={() => setSelections({...selections, size: size})}
                                className={`
                                    p-4 rounded-xl border text-left transition-all relative overflow-hidden group
                                    ${activeSize === size 
                                        ? 'border-amber-500 bg-amber-50 shadow-md' 
                                        : 'border-stone-200 bg-white text-stone-500 hover:border-amber-300 hover:bg-stone-50'}
                                `}
                            >
                                <span className="block font-bold text-xs uppercase tracking-wider mb-1 opacity-70">{size}</span>
                                <span className={`block text-xl font-serif italic ${activeSize === size ? 'text-amber-600' : 'text-stone-800'}`}>
                                    ${price}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return <div className="py-2 text-center text-stone-400">Producto simple. ¿Agregar al carrito?</div>;
  };

  const isIncomplete = isSelectionIncomplete();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" onClick={closeProductModal}></div>
      <div className="relative bg-[#FFFBF2] border border-orange-100 rounded-3xl w-full max-w-lg p-0 shadow-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-white p-6 border-b border-orange-100 flex justify-between items-start shrink-0">
            <div>
                <h3 className="text-2xl font-serif italic font-bold text-stone-800 mb-1">{product.name}</h3>
                <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-100 border border-amber-200 text-amber-600 text-xs font-bold uppercase tracking-wider">
                        {product.category || "Selección"}
                    </span>
                    <p className="text-stone-800 font-bold text-xl">${currentPrice}</p>
                </div>
            </div>
            <button onClick={closeProductModal} className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-600 border border-stone-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-grow bg-[#FFFBF2]">
            {renderForm()}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-orange-100 flex gap-3 shrink-0">
            <button onClick={closeProductModal} className="flex-1 py-3.5 rounded-xl border border-stone-200 text-stone-500 font-medium hover:bg-stone-50">
                Cancelar
            </button>
            <button 
                disabled={isIncomplete}
                // --- CAMBIO AQUÍ: Pasamos el evento 'e' ---
                onClick={(e) => handleSubmit(e)}
                className={`
                    flex-[2] py-3.5 rounded-xl font-bold transition shadow-lg flex items-center justify-center gap-2 active:scale-95
                    ${isIncomplete 
                        ? 'bg-stone-300 cursor-not-allowed text-stone-500' 
                        : 'bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-green-500/30'}
                `}
            >
                {isIncomplete ? 'Faltan opciones' : <><i className="fa-solid fa-check"></i> Agregar</>}
            </button>
        </div>
      </div>
    </div>
  );
}