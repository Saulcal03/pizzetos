// src/stores/cartStore.js
import { atom, computed } from 'nanostores';

// --- ESTADO BASE ---
export const cartItems = atom([]);
export const isCartOpen = atom(false);
export const isModalOpen = atom(false);
export const modalProduct = atom(null); 
export const selectedGlobalSize = atom(null); 

// --- HELPERS ---
export const cartCount = computed(cartItems, items => items.length);

// --- ACCIONES MODAL ---
export function openProductModal(product) {
  modalProduct.set(product);
  isModalOpen.set(true);
}

export function closeProductModal() {
  isModalOpen.set(false);
  modalProduct.set(null);
}

// --- ACCIONES CARRITO ---
export function addCartItem(item) {
  const currentItems = cartItems.get();
  const uniqueId = Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
  
  // Aseguramos que item tenga priceFull, si no lo tiene, usamos price
  const priceFull = item.priceFull || item.price;
  
  // Guardamos el item con priceFull explícito para que la lógica 2x1 no falle
  cartItems.set([...currentItems, { ...item, priceFull, uniqueId, addedAt: Date.now() }]);
  
  isCartOpen.set(true); 
}

export function removeCartItem(uniqueId) {
  cartItems.set(cartItems.get().filter(i => i.uniqueId !== uniqueId));
}

export function toggleCart(isOpen) {
  isCartOpen.set(isOpen !== undefined ? isOpen : !isCartOpen.get());
}

// --- LÓGICA MAESTRA 2x1 (CORREGIDA PARA EVITAR NaN) ---
export const groupedCart = computed(cartItems, (items) => {
  let processedItems = [];
  let total = 0;
  
  const allPizzas = items.filter(i => i.category === 'Pizzas' || i.category === 'Especialidades del Mar');
  const otherItems = items.filter(i => i.category !== 'Pizzas' && i.category !== 'Especialidades del Mar');

  const pizzasBySize = {};
  allPizzas.forEach(p => {
    const size = p.size || 'General';
    if (!pizzasBySize[size]) pizzasBySize[size] = [];
    pizzasBySize[size].push(p);
  });

  Object.keys(pizzasBySize).forEach(size => {
    const list = [...pizzasBySize[size]];
    
    // Ordenamos por precio descendente para emparejar las más caras
    list.sort((a, b) => (b.priceFull || b.price) - (a.priceFull || a.price));

    while (list.length > 0) {
      const pizza1 = list.shift();
      // Leemos el precio de forma segura (usa priceFull si existe, si no price, si no 0)
      const p1Price = pizza1.priceFull || pizza1.price || 0;

      if (list.length > 0) {
        // --- TENEMOS PAREJA (2x1) ---
        const pizza2 = list.shift();
        const p2Price = pizza2.priceFull || pizza2.price || 0;
        
        // La más cara define el precio del par
        const pairPrice = Math.max(p1Price, p2Price); 
        
        processedItems.push({
          type: 'promo_pair',
          title: `2x1: ${pizza1.name} y ${pizza2.name}`,
          size: size,
          items: [pizza1, pizza2],
          price: pairPrice,
          uniqueId: `pair-${pizza1.uniqueId}`
        });
        total += pairPrice;
      } else {
        // --- PIZZA SOLA (Individual con Descuento) ---
        // Aplicamos 40% de descuento (precio * 0.6)
        const individualPrice = Math.round(p1Price * 0.6);
        
        processedItems.push({
          ...pizza1,
          displayPrice: individualPrice, 
          isWaitingPair: true, 
          uniqueId: pizza1.uniqueId,
          price: individualPrice 
        });
        total += individualPrice;
      }
    }
  });

  otherItems.forEach(item => {
    processedItems.push(item);
    total += item.price || 0;
  });

  return { items: processedItems, total };
});