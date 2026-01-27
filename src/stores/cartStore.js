// src/stores/cartStore.js
import { atom, computed } from 'nanostores';

// --- CONSTANTES ---
const PRECIOS_ORILLA = {
  "Chica": 35,
  "Mediana": 40,
  "Grande": 45,
  "Familiar": 50
};

// --- ESTADO BASE ---
export const cartItems = atom([]);
export const isCartOpen = atom(false);
export const isModalOpen = atom(false);
export const modalProduct = atom(null); 
export const selectedGlobalSize = atom(null); 
export const isCheckoutOpen = atom(false);

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
  
  const priceFull = item.priceFull || item.price;
  
  cartItems.set([...currentItems, { 
    ...item, 
    priceFull, 
    uniqueId, 
    addedAt: Date.now(),
    orillaQueso: false 
  }]);
  
  isCartOpen.set(true); 
}

export function removeCartItem(uniqueId) {
  cartItems.set(cartItems.get().filter(i => i.uniqueId !== uniqueId));
}

export function updateCartItem(uniqueId, updates) {
  const currentItems = cartItems.get();
  const updatedItems = currentItems.map(item => {
    if (item.uniqueId === uniqueId) {
      return { ...item, ...updates };
    }
    return item;
  });
  cartItems.set(updatedItems);
}

export function toggleCart(isOpen) {
  isCartOpen.set(isOpen !== undefined ? isOpen : !isCartOpen.get());
}

export function clearCart() {
  cartItems.set([]);
}

export function toggleCheckout(isOpen) {
  isCheckoutOpen.set(isOpen !== undefined ? isOpen : !isCheckoutOpen.get());
}

// --- LÓGICA MAESTRA 2x1 Y TOTALES ---
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
    
    const getRealPrice = (pizza) => {
        let finalPrice = pizza.priceFull || pizza.price || 0;
        if (pizza.prices && pizza.size && pizza.prices[pizza.size]) {
            finalPrice = Number(pizza.prices[pizza.size]);
        }
        return finalPrice;
    };

    list.sort((a, b) => getRealPrice(b) - getRealPrice(a));

    while (list.length > 0) {
      const pizza1 = list.shift();
      const p1Price = getRealPrice(pizza1);
      const p1OrillaCost = pizza1.orillaQueso ? (PRECIOS_ORILLA[size] || 0) : 0;

      if (list.length > 0) {
        // --- CASO 2x1 ---
        const pizza2 = list.shift();
        const p2Price = getRealPrice(pizza2);
        const p2OrillaCost = pizza2.orillaQueso ? (PRECIOS_ORILLA[size] || 0) : 0;
        
        const basePairPrice = Math.max(p1Price, p2Price); 
        const finalPairPrice = basePairPrice + p1OrillaCost + p2OrillaCost;
        
        processedItems.push({
          type: 'promo_pair',
          title: `2x1: ${pizza1.name} y ${pizza2.name}`,
          size: size,
          items: [pizza1, pizza2],
          price: finalPairPrice,
          uniqueId: `pair-${pizza1.uniqueId}`
        });
        
        total += finalPairPrice;
      } else {
        // --- CASO INDIVIDUAL (40% desc) ---
        const baseIndividualPrice = Math.round(p1Price * 0.6);
        const finalIndividualPrice = baseIndividualPrice + p1OrillaCost;
        
        processedItems.push({
          ...pizza1,
          displayPrice: finalIndividualPrice, 
          isWaitingPair: true, 
          uniqueId: pizza1.uniqueId,
          price: finalIndividualPrice 
        });
        
        total += finalIndividualPrice;
      }
    }
  });

  // --- PROCESAR OTROS (PAQUETES, BEBIDAS, COMPLEMENTOS) ---
  otherItems.forEach(item => {
    // Calculamos si tiene orilla de queso activa (por si acaso en individuales)
    const extraOrilla = item.orillaQueso ? (PRECIOS_ORILLA[item.size] || 0) : 0;
    const itemFinalPrice = (item.price || 0) + extraOrilla;

    processedItems.push({
      ...item,
      price: itemFinalPrice // Seteamos el precio final para que el total coincida
    });
    
    total += itemFinalPrice;
  });

  return { items: processedItems, total };
});