import { useStore } from '@nanostores/react';
import { isModalOpen, modalProduct, closeProductModal, addCartItem } from '../../stores/cartStore';
import { menuItems, opcionesRefrescos } from '../../data/menuData'; // Importamos tus datos
import { useState, useEffect } from 'react';

export default function ProductModal() {
  const isOpen = useStore(isModalOpen);
  const product = useStore(modalProduct);
  
  // Estado local para guardar las selecciones del usuario
  const [selections, setSelections] = useState({});

  // Resetear selecciones cuando cambia el producto
  useEffect(() => {
    setSelections({});
  }, [product]);

  if (!isOpen || !product) return null;

  // Filtramos solo las pizzas para los dropdowns
  const pizzaOptions = menuItems.filter(item => item.category === 'Pizzas');

  const handleSubmit = () => {
    // Aquí construimos el objeto final para el carrito
    const finalItem = {
      ...product,
      selections: selections, // Guardamos qué sabores eligió
      // Creamos una descripción bonita para el carrito
      customDescription: Object.values(selections).join(', ')
    };
    
    addCartItem(finalItem);
    closeProductModal();
  };

  // --- RENDERIZADO DE FORMULARIOS SEGÚN EL TIPO ---
  const renderForm = () => {
    switch (product.id) {
      
      // CASO: PAQUETE 2 (1 Pizza + Complemento + Refresco)
      case 'paquete-2':
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

            {/* Sabor de Alitas/Hamburguesa (Condicional) */}
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

      // CASO: PAQUETE 3 (3 Pizzas)
      case 'paquete-3':
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
        
      // CASO DEFAULT (Bebidas, Snacks simples)
      default:
        return (
            <div className="text-center py-4">
                <p className="text-gray-300">¿Deseas agregar <b>{product.name}</b> al carrito?</p>
                {/* Si tiene opciones de refresco (definidas en menuData), mostrarlas */}
                {product.opciones && (
                    <select className="mt-4 w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-white"
                        onChange={(e) => setSelections({...selections, flavor: e.target.value})}>
                        <option value="">Elige sabor...</option>
                        {product.opciones.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                )}
            </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay Oscuro */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeProductModal}></div>

      {/* Ventana Modal */}
      <div className="relative bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
            <div>
                <h3 className="text-2xl font-serif italic font-bold text-white">{product.name}</h3>
                <p className="text-amber-500 font-bold">${product.price}</p>
            </div>
            <button onClick={closeProductModal} className="text-gray-500 hover:text-white text-2xl">&times;</button>
        </div>

        {/* Formulario Dinámico */}
        <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {renderForm()}
        </div>

        {/* Footer / Botones */}
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