// src/components/Menu/ProductModal.jsx
import { useStore } from '@nanostores/react';
import { isModalOpen, modalProduct, closeProductModal, addCartItem, selectedGlobalSize } from '../../stores/cartStore';
import { menuItems, opcionesRefrescos } from '../../data/menuData'; 
import { useState, useEffect, useMemo } from 'react';

// --- COMPONENTES VISUALES EXTERNOS (OPTIMIZADOS) ---

const OptionPills = ({ title, options, selected, onSelect, icon }) => {
  if (!options || options.length === 0) return null;

  return (
    <div className="mb-4">
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
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
                ? 'bg-amber-500 text-black border-amber-500 shadow-lg shadow-amber-500/20 transform scale-105' 
                : 'bg-neutral-800 text-gray-400 border-neutral-700 hover:border-gray-500 hover:bg-neutral-750'
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
                ? 'border-amber-500 bg-amber-500/10 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                : 'border-neutral-700 bg-neutral-800/50 text-gray-500 hover:border-neutral-500 hover:bg-neutral-800'
            }
        `}
    >
        <i className={`fa-solid ${iconClass} text-2xl ${selected === value ? 'text-amber-500' : 'text-gray-600'}`}></i>
        <span className="font-bold text-sm">{label}</span>
        {selected === value && <div className="w-2 h-2 rounded-full bg-amber-500 mt-1"></div>}
    </button>
);

const FlavorSelector = ({ slots, labels, selections, setSelections, activeFlavorSlot, setActiveFlavorSlot, pizzaOptions, currentProductKeyBase }) => {
    return (
      <div className="space-y-4">
        {/* Visualización de Slots */}
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
                     ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                     : 'border-neutral-700 bg-neutral-800 hover:bg-neutral-750'
                   }
                 `}
               >
                 {selectedPizza && (
                   <img src={selectedPizza.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 blur-[1px]" />
                 )}
                 <div className="relative z-10">
                   <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider block">
                     {labels[idx] || `Opción ${slotNum}`}
                   </span>
                   <span className="text-sm font-bold text-white leading-tight block truncate">
                     {selectedFlavorName || "Toca para elegir"}
                   </span>
                 </div>
               </button>
             );
           })}
        </div>

        {/* Grilla de Opciones */}
        <div>
           <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
             <i className="fa-solid fa-pizza-slice text-amber-500 mr-2"></i>
             Elige sabor para: <span className="text-white">Opción {activeFlavorSlot}</span>
           </label>
           
           <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
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
                     group relative rounded-lg overflow-hidden aspect-square border transition-all
                     ${isSelected ? 'border-amber-500 ring-2 ring-amber-500/50' : 'border-transparent opacity-70 hover:opacity-100'}
                   `}
                 >
                   <img src={pizza.image} alt={pizza.name} className="w-full h-full object-cover" loading="lazy" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-2 flex items-end">
                     <span className="text-[10px] font-bold text-white leading-tight">{pizza.name}</span>
                   </div>
                   {isSelected && (
                     <div className="absolute top-1 right-1 bg-amber-500 text-black w-5 h-5 rounded-full flex items-center justify-center text-xs shadow-lg">
                       <i className="fa-solid fa-check"></i>
                     </div>
                   )}
                 </button>
               );
             })}
           </div>
        </div>
      </div>
    );
};

// --- COMPONENTE PRINCIPAL ---

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

  // --- LÓGICA DE PRECIOS Y TAMAÑOS ---
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

  const handleSubmit = () => {
    const finalItem = {
      ...product,
      price: currentPrice,
      priceFull: currentPrice,
      size: activeSize,
      selections: { ...selections, size: activeSize },
      customDescription: Object.values(selections).filter(Boolean).join(', ')
    };
    addCartItem(finalItem);
    closeProductModal();
  };

  // --- VARIABLES DE RESPALDO ---
  const jarritosOptions = opcionesRefrescos?.refrescos_2l || ["Pepsi", "Manzanita", "Sangría", "Mirinda", "7UP"];
  const refrescos355Options = opcionesRefrescos?.refrescos_355ml || ["Fanta", "Sprite", "Fresca", "Mundet"];

  // --- RENDERIZADO DE FORMULARIOS ---
  const renderForm = () => {
    
    // CASO: PAQUETE 2
    if (product.id === 'paquete-2') {
        return (
          <div className="space-y-6">
            <FlavorSelector 
                slots={1} 
                labels={["Tu Pizza Grande"]} 
                selections={selections} 
                setSelections={setSelections}
                activeFlavorSlot={activeFlavorSlot}
                setActiveFlavorSlot={setActiveFlavorSlot}
                pizzaOptions={pizzaOptions}
                currentProductKeyBase="pizza" 
            />
            
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
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
            
            {/* REFRESCO FIJO */}
            <div className="bg-neutral-800 p-3 rounded-lg border border-neutral-700 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                    <i className="fa-solid fa-bottle-water"></i>
                </div>
                <div>
                    <p className="text-gray-300 text-sm font-bold">Incluye: Refresco Jarrito</p>
                    <p className="text-gray-500 text-xs">Sabor incluido en el paquete</p>
                </div>
            </div>
          </div>
        );
    }

    // CASO: PAQUETE 3
    if (product.id === 'paquete-3') {
        return (
          <div className="space-y-4">
            <p className="text-xs text-amber-500 font-bold uppercase mb-2">Selecciona tus 3 pizzas grandes:</p>
            <FlavorSelector 
                slots={3} 
                labels={["Pizza 1", "Pizza 2", "Pizza 3"]} 
                selections={selections} 
                setSelections={setSelections}
                activeFlavorSlot={activeFlavorSlot}
                setActiveFlavorSlot={setActiveFlavorSlot}
                pizzaOptions={pizzaOptions}
                currentProductKeyBase="pizza" 
            />
            
            {/* REFRESCO FIJO */}
            <div className="bg-neutral-800 p-3 rounded-lg border border-neutral-700 flex items-center gap-3 mt-4">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                    <i className="fa-solid fa-bottle-water"></i>
                </div>
                <div>
                    <p className="text-gray-300 text-sm font-bold">Incluye: Refresco Jarrito</p>
                    <p className="text-gray-500 text-xs">Sabor incluido en el paquete</p>
                </div>
            </div>
          </div>
        );
    }

    // PROMO MAGNO (CORREGIDO: Refresco Fijo)
    if (product.id === 'promo-magno') {
        return (
            <div className="space-y-4">
                <p className="text-xs text-amber-500 font-bold uppercase mb-2">Pizza Familiar (Hasta 2 especialidades):</p>
                <FlavorSelector 
                    slots={2} 
                    labels={["Mitad 1", "Mitad 2 (Opcional)"]} 
                    selections={selections} 
                    setSelections={setSelections}
                    activeFlavorSlot={activeFlavorSlot}
                    setActiveFlavorSlot={setActiveFlavorSlot}
                    pizzaOptions={pizzaOptions}
                    currentProductKeyBase="flavor"
                />
                
                {/* REFRESCO FIJO */}
                <div className="bg-neutral-800 p-3 rounded-lg border border-neutral-700 flex items-center gap-3 mt-4">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                        <i className="fa-solid fa-bottle-water"></i>
                    </div>
                    <div>
                        <p className="text-gray-300 text-sm font-bold">Incluye: Refresco Jarrito</p>
                        <p className="text-gray-500 text-xs">Sabor incluido en el paquete</p>
                    </div>
                </div>
            </div>
        );
    }

    // PIZZA RECTANGULAR
    if (product.id === 'pizza-rectangular') {
        return (
            <div className="space-y-4">
                <p className="text-xs text-amber-500 font-bold uppercase mb-2">Elige las 4 esquinas:</p>
                <FlavorSelector 
                    slots={4} 
                    labels={["Esp. 1", "Esp. 2", "Esp. 3", "Esp. 4"]} 
                    selections={selections} 
                    setSelections={setSelections}
                    activeFlavorSlot={activeFlavorSlot}
                    setActiveFlavorSlot={setActiveFlavorSlot}
                    pizzaOptions={pizzaOptions}
                    currentProductKeyBase="flavor"
                />
                <OptionPills title="Refresco 2Lts" icon="fa-bottle-water" options={jarritosOptions} selected={selections.drink} onSelect={(val) => setSelections({...selections, drink: val})} />
            </div>
        );
    }

    // PIZZA BARRA
    if (product.id === 'pizza-barra') {
        return (
            <div className="space-y-4">
                <p className="text-xs text-amber-500 font-bold uppercase mb-2">Elige las 2 mitades:</p>
                <FlavorSelector 
                    slots={2} 
                    labels={["Mitad Izquierda", "Mitad Derecha"]} 
                    selections={selections} 
                    setSelections={setSelections}
                    activeFlavorSlot={activeFlavorSlot}
                    setActiveFlavorSlot={setActiveFlavorSlot}
                    pizzaOptions={pizzaOptions}
                    currentProductKeyBase="flavor"
                />
                <OptionPills title="Refresco 2Lts" icon="fa-bottle-water" options={jarritosOptions} selected={selections.drink} onSelect={(val) => setSelections({...selections, drink: val})} />
            </div>
        );
    }

    // HAMBURGUESAS
    if (product.id.includes('hamburguesa')) {
        return (
            <div className="space-y-4">
                 <OptionPills title="Tipo de Carne" icon="fa-drumstick-bite" options={["Res", "Pollo"]} selected={selections.meat} onSelect={(val) => setSelections({...selections, meat: val})} />
                 <OptionPills title="Refresco 355ml" icon="fa-bottle-water" options={refrescos355Options} selected={selections.drink} onSelect={(val) => setSelections({...selections, drink: val})} />
            </div>
        );
    }

    // COSTILLAS O ALITAS
    if (product.id.includes('costillas') || product.id.includes('alitas')) {
        return (
            <div className="space-y-4">
                 <OptionPills title="Salsa" icon="fa-pepper-hot" options={["BBQ", "Mango Habanero"]} selected={selections.flavor} onSelect={(val) => setSelections({...selections, flavor: val})} />
                 <OptionPills title="Refresco 355ml" icon="fa-bottle-water" options={refrescos355Options} selected={selections.drink} onSelect={(val) => setSelections({...selections, drink: val})} />
            </div>
        );
    }

    // REFRESCOS INDIVIDUALES
    if (product.category === 'Bebidas') {
        let optionsList = [];
        if (product.id.includes('2lts')) optionsList = jarritosOptions;
        else if (product.id.includes('600ml')) optionsList = opcionesRefrescos?.refrescos_600ml || ["Pepsi", "Manzanita"];
        else optionsList = refrescos355Options;

        return (
            <div className="space-y-4">
                 <OptionPills title="Elige Sabor" icon="fa-bottle-water" options={optionsList} selected={selections.flavor} onSelect={(val) => setSelections({...selections, flavor: val})} />
            </div>
        );
    }

    // PIZZA REGULAR
    if (product.prices) {
        return (
            <div className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
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
                                        ? 'border-amber-500 bg-amber-500/20 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                                        : 'border-white/10 bg-neutral-800 text-gray-400 hover:border-amber-500/50 hover:bg-neutral-750'}
                                `}
                            >
                                <span className="block font-bold text-xs uppercase tracking-wider mb-1 opacity-70">{size}</span>
                                <span className={`block text-xl font-serif italic ${activeSize === size ? 'text-amber-500' : 'text-white'}`}>
                                    ${price}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return <div className="py-2 text-center text-gray-400">Producto simple. ¿Agregar al carrito?</div>;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      
      {/* Fondo semi-transparente */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" onClick={closeProductModal}></div>
      
      <div className="relative bg-neutral-900 border border-white/10 rounded-3xl w-full max-w-lg p-0 shadow-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
        
        <div className="bg-gradient-to-r from-neutral-800 to-neutral-900 p-6 border-b border-white/5 flex justify-between items-start shrink-0">
            <div>
                <h3 className="text-2xl font-serif italic font-bold text-white mb-1">{product.name}</h3>
                <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-amber-500 text-xs font-bold uppercase tracking-wider">
                        {product.category || "Selección"}
                    </span>
                    <p className="text-white font-bold text-xl">${currentPrice}</p>
                </div>
            </div>
            {/* BOTÓN DE CERRAR MEJORADO (X) */}
            <button onClick={closeProductModal} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors border border-white/5 hover:border-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
            {renderForm()}
        </div>

        <div className="p-4 bg-neutral-900 border-t border-white/5 flex gap-3 shrink-0">
            <button onClick={closeProductModal} className="flex-1 py-3.5 rounded-xl border border-white/10 text-gray-300 font-medium hover:bg-white/5 transition active:scale-95">
                Cancelar
            </button>
            <button 
                onClick={handleSubmit}
                className="flex-[2] py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold hover:from-amber-400 hover:to-amber-500 transition shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 active:scale-95"
            >
                <i className="fa-solid fa-check"></i>
                Agregar
            </button>
        </div>

      </div>
    </div>
  );
}