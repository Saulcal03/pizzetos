// src/components/Menu/ProductModal.jsx
import { useStore } from '@nanostores/react';
import { isModalOpen, modalProduct, closeProductModal, addCartItem, selectedGlobalSize } from '../../stores/cartStore';
import { menuItems, opcionesRefrescos } from '../../data/menuData'; 
import { useState, useEffect } from 'react';

export default function ProductModal() {
  const isOpen = useStore(isModalOpen);
  const product = useStore(modalProduct);
  const globalSize = useStore(selectedGlobalSize); // Leemos el tamaño global directamente
  
  // Estado local
  const [selections, setSelections] = useState({});

  // Resetear selecciones cuando cambia el producto (Solo limpieza básica)
  useEffect(() => {
    setSelections({});
  }, [product]);

  if (!isOpen || !product) return null;

  // --- LÓGICA BLINDADA PARA DETECTAR TAMAÑO Y PRECIO ---
  
  // 1. Función para saber cuál es el tamaño activo REAL en este momento
  const getActiveSize = () => {
    // Si ya seleccionaste algo manualmente en el modal, usa eso
    if (selections.size) return selections.size;

    // Si no has tocado nada, intentamos deducir el mejor tamaño inicial
    if (product.prices) {
        const sizes = Object.keys(product.prices);
        
        // A) ¿Hay un tamaño global seleccionado (desde la pantalla principal)?
        if (globalSize && sizes.includes(globalSize)) return globalSize;
        
        // B) Si no, ¿existe el tamaño "Familiar"? (Prioridad sugerida)
        if (sizes.includes('Familiar')) return 'Familiar';
        
        // C) Si no, el primero que exista (ej. Chica)
        return sizes[0];
    }
    
    return 'General';
  };

  const activeSize = getActiveSize();

  // 2. Calculamos el precio basándonos SIEMPRE en activeSize
  let currentPrice = product.price;
  if (product.prices && activeSize && product.prices[activeSize]) {
      currentPrice = product.prices[activeSize];
  }

  // Filtramos solo las pizzas para los dropdowns de paquetes
  const pizzaOptions = menuItems.filter(item => item.category === 'Pizzas');

  const handleSubmit = () => {
    // Construimos el objeto final usando los valores calculados en tiempo real
    const finalItem = {
      ...product,
      price: currentPrice,      // Precio corregido (ej. 375)
      priceFull: currentPrice,  // Precio full para lógica 2x1
      size: activeSize,         // Tamaño explícito (ej. Familiar)
      selections: { ...selections, size: activeSize }, // Aseguramos que el tamaño vaya en selections
      customDescription: Object.values(selections).join(', ')
    };
    
    addCartItem(finalItem);
    closeProductModal();
  };

  // --- RENDERIZADO DE FORMULARIOS ---
  const renderForm = () => {
    
    // 1. CASO: PAQUETE 2
    if (product.id === 'paquete-2') {
        return (
          <div className="space-y-4">
            {/* Pizza */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1">Elige tu Pizza Grande:</label>
              <select 
                className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-white"
                onChange={(e) => setSelections({...selections, pizza: e.target.value})}
              >
                <option value="">Selecciona...</option>
                {pizzaOptions.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
              </select>
            </div>

            {/* Acompañante */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1">Acompañante:</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input type="radio" name="side" value="Alitas" onChange={(e) => setSelections({...selections, side: 'Alitas'})} /> Alitas
                </label>
                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input type="radio" name="side" value="Hamburguesa" onChange={(e) => setSelections({...selections, side: 'Hamburguesa'})} /> Hamburguesa
                </label>
              </div>
            </div>

            {/* Sabor de Alitas (Condicional) */}
            {selections.side === 'Alitas' && (
               <div>
                 <label className="block text-xs text-amber-500 mb-1">Salsa Alitas:</label>
                 <select className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-white"
                   onChange={(e) => setSelections({...selections, sideFlavor: e.target.value})}>
                   <option value="BBQ">BBQ</option>
                   <option value="Mango Habanero">Mango Habanero</option>
                 </select>
               </div>
            )}
            
            {/* Refresco */}
            <div>
                <label className="block text-sm font-bold text-gray-300 mb-1">Refresco Jarrito:</label>
                 <select className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-white"
                   onChange={(e) => setSelections({...selections, drink: e.target.value})}>
                   <option value="">Elige sabor...</option>
                   {opcionesRefrescos.refrescos_2l.map(r => <option key={r} value={r}>{r}</option>)}
                 </select>
            </div>
          </div>
        );
    }

    // 2. CASO: PAQUETE 3
    if (product.id === 'paquete-3') {
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-400">Elige tus 3 pizzas grandes de especialidad.</p>
            {[1, 2, 3].map(num => (
              <div key={num}>
                <label className="block text-xs font-bold text-amber-500 mb-1">Pizza {num}:</label>
                <select 
                  className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-white"
                  onChange={(e) => setSelections({...selections, [`pizza${num}`]: e.target.value})}
                >
                  <option value="">Selecciona especialidad...</option>
                  {pizzaOptions.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>
            ))}
             {/* Refresco */}
             <div>
                <label className="block text-sm font-bold text-gray-300 mb-1">Refresco Jarrito:</label>
                 <select className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-white"
                   onChange={(e) => setSelections({...selections, drink: e.target.value})}>
                   <option value="">Elige sabor...</option>
                   {opcionesRefrescos.refrescos_2l.map(r => <option key={r} value={r}>{r}</option>)}
                 </select>
            </div>
          </div>
        );
    }

    // 3. CASO: PIZZA NORMAL (Con selector de tamaños)
    if (product.prices) {
        return (
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3">Selecciona el Tamaño:</label>
                    <div className="grid grid-cols-2 gap-3">
                        {Object.entries(product.prices).map(([size, price]) => (
                            <button 
                                key={size}
                                onClick={() => setSelections({...selections, size: size})}
                                className={`
                                    p-3 rounded-xl border text-left transition-all relative overflow-hidden
                                    ${activeSize === size 
                                        ? 'border-amber-500 bg-amber-500/10 text-white shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                                        : 'border-white/10 text-gray-400 hover:border-white/30 hover:bg-white/5'}
                                `}
                            >
                                <span className="block font-bold text-sm uppercase tracking-wider">{size}</span>
                                <span className={`block text-lg font-serif italic ${activeSize === size ? 'text-amber-500' : 'text-gray-500'}`}>
                                    ${price}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-neutral-800/50 p-4 rounded-xl border border-white/5">
                    <p className="text-sm text-gray-400 text-center">
                        Todas nuestras pizzas incluyen salsa de tomate especial y queso mozzarella premium.
                    </p>
                </div>
            </div>
        );
    }

    // 4. CASO DEFAULT
    return (
        <div className="text-center py-4">
            <p className="text-gray-300">¿Deseas agregar <b>{product.name}</b> al carrito?</p>
            {product.opciones && (
                <select className="mt-4 w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-white"
                    onChange={(e) => setSelections({...selections, flavor: e.target.value})}>
                    <option value="">Elige sabor...</option>
                    {product.opciones.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
            )}
        </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeProductModal}></div>
      <div className="relative bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl overflow-hidden animate-fade-in-up">
        
        <div className="flex justify-between items-start mb-6">
            <div>
                <h3 className="text-2xl font-serif italic font-bold text-white">{product.name}</h3>
                <p className="text-amber-500 font-bold text-xl animate-pulse-once key={currentPrice}">
                    ${currentPrice}
                </p>
            </div>
            <button onClick={closeProductModal} className="text-gray-500 hover:text-white text-2xl">&times;</button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {renderForm()}
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 flex gap-3">
            <button onClick={closeProductModal} className="flex-1 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition">
                Cancelar
            </button>
            <button 
                onClick={handleSubmit}
                className="flex-1 py-3 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition shadow-[0_0_15px_rgba(245,158,11,0.3)]"
            >
                Agregar Orden
            </button>
        </div>

      </div>
    </div>
  );
}