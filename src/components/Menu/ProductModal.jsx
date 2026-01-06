// src/components/Menu/ProductModal.jsx
import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { isModalOpen, currentProduct, closeProductModal, addCartItem, toggleCart, selectedGlobalSize } from '../../stores/cartStore';

export default function ProductModal() {
  const isOpen = useStore(isModalOpen);
  const product = useStore(currentProduct);
  const globalSize = useStore(selectedGlobalSize);

  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (globalSize && product?.prices && product.prices[globalSize]) {
        setSelectedSize(globalSize);
      } else {
        setSelectedSize(null);
      }
    }
  }, [isOpen, product, globalSize]);

  if (!isOpen || !product) return null;

  const sizes = product.prices ? Object.keys(product.prices) : [];
  const currentPrice = selectedSize ? product.prices[selectedSize] : 0;

  const handleAddToCart = () => {
    if (!selectedSize) return;
    
    // Lógica simplificada: Agregar directo. El CartStore se encarga del 2x1 automático.
    addCartItem({
      id: product.id,
      name: product.name,
      image: product.image,
      category: product.category,
      size: selectedSize,
      priceFull: currentPrice,
      price: currentPrice, // Mandamos precio full, el store aplica descuentos si es necesario
      wantsPromo: true // Por defecto asumimos que quiere promo si es posible
    });

    closeProductModal();
    toggleCart(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm transition-opacity" onClick={closeProductModal}></div>

      <div className="relative bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col animate-fadeIn">
        
        {/* IMAGEN Y TÍTULO */}
        <div className="relative h-56">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent"></div>
          <button onClick={closeProductModal} className="absolute top-4 right-4 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="absolute bottom-4 left-6">
            <h3 className="text-3xl font-serif text-white italic">{product.name}</h3>
          </div>
        </div>

        <div className="p-6">
          <p className="text-neutral-400 text-sm mb-6">{product.description}</p>

          {/* SI NO HAY TAMAÑO GLOBAL, MOSTRAMOS SELECTOR. SI SÍ HAY, MOSTRAMOS RESUMEN */}
          {!globalSize ? (
            <div className="grid grid-cols-2 gap-2 mb-6">
              {sizes.map(size => (
                <button key={size} onClick={() => setSelectedSize(size)} className={`py-2 px-3 rounded-lg border text-sm ${selectedSize === size ? 'bg-amber-500 text-black border-amber-500 font-bold' : 'border-white/10 text-neutral-300'}`}>
                  {size} <span className="block text-xs opacity-70">${product.prices[size]}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl mb-6 border border-white/10">
              <div>
                <span className="text-xs text-neutral-500 uppercase tracking-widest">Tamaño</span>
                <p className="text-xl font-bold text-white">{selectedSize}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-neutral-500 uppercase tracking-widest">Precio</span>
                <p className="text-xl font-bold text-amber-500">${currentPrice}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all ${!selectedSize ? 'bg-neutral-800 text-neutral-600' : 'bg-amber-500 hover:bg-amber-400 text-neutral-900 hover:shadow-amber-500/20'}`}
          >
            <span>Agregar al Pedido</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}