// src/stores/cartStore.js
import { atom, computed } from 'nanostores';

// --- CONSTANTES ---
// Precios de la orilla rellena según la imagen
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

// --- NUEVO: Estado para el Checkout ---
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
  
  // Aseguramos que item tenga priceFull, si no lo tiene, usamos price
  const priceFull = item.priceFull || item.price;
  
  // Guardamos el item con priceFull explícito y orillaQueso en falso por defecto
  cartItems.set([...currentItems, { 
    ...item, 
    priceFull, 
    uniqueId, 
    addedAt: Date.now(),
    orillaQueso: false // Por defecto sin orilla
  }]);
  
  isCartOpen.set(true); 
}

export function removeCartItem(uniqueId) {
  cartItems.set(cartItems.get().filter(i => i.uniqueId !== uniqueId));
}

// --- NUEVO: Acción para actualizar un item (ej. activar orilla) ---
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
  

// --- NUEVO: Función para abrir/cerrar Checkout ---
export function toggleCheckout(isOpen) {
  isCheckoutOpen.set(isOpen !== undefined ? isOpen : !isCheckoutOpen.get());
}

// --- LÓGICA MAESTRA 2x1 (CORREGIDA Y BLINDADA) ---
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
    
    // Función auxiliar para obtener el precio REAL correcto
    const getRealPrice = (pizza) => {
        // 1. Intentamos leer el precio que viene en el objeto
        let finalPrice = pizza.priceFull || pizza.price || 0;

        // 2. AUTOCORRECCIÓN: Si tenemos la tabla de precios y el tamaño, forzamos el precio correcto.
        if (pizza.prices && pizza.size && pizza.prices[pizza.size]) {
            finalPrice = Number(pizza.prices[pizza.size]);
        }
        return finalPrice;
    };

    // Ordenamos usando el precio corregido (REAL) para emparejar bien
    list.sort((a, b) => getRealPrice(b) - getRealPrice(a));

    while (list.length > 0) {
      const pizza1 = list.shift();
      const p1Price = getRealPrice(pizza1);
      
      // Costo extra de orilla para Pizza 1 (si aplica)
      const p1OrillaCost = pizza1.orillaQueso ? (PRECIOS_ORILLA[size] || 0) : 0;

      if (list.length > 0) {
        // --- TENEMOS PAREJA (2x1) ---
        const pizza2 = list.shift();
        const p2Price = getRealPrice(pizza2);
        
        // Costo extra de orilla para Pizza 2 (si aplica)
        const p2OrillaCost = pizza2.orillaQueso ? (PRECIOS_ORILLA[size] || 0) : 0;
        
        // La más cara define el precio BASE del par
        const basePairPrice = Math.max(p1Price, p2Price); 
        
        // El precio FINAL es: Precio base del 2x1 + Orillas extras (si las pidieron)
        // Las orillas NO entran en la promo 2x1, se cobran completas.
        const finalPairPrice = basePairPrice + p1OrillaCost + p2OrillaCost;
        
        processedItems.push({
          type: 'promo_pair',
          title: `2x1: ${pizza1.name} y ${pizza2.name}`,
          size: size,
          items: [pizza1, pizza2], // Guardamos los items originales para poder modificarlos
          price: finalPairPrice,   // Precio total del combo
          uniqueId: `pair-${pizza1.uniqueId}`
        });
        
        total += finalPairPrice;
      } else {
        // --- PIZZA SOLA (Individual con Descuento) ---
        // Aplicamos 40% de descuento al precio BASE
        const baseIndividualPrice = Math.round(p1Price * 0.6);
        
        // El precio FINAL es: Precio base con descuento + Orilla extra (sin descuento)
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

  otherItems.forEach(item => {
    processedItems.push(item);
    // Si en el futuro los otros items tienen extras, se sumarían aquí
    total += item.price || 0;
  });

  return { items: processedItems, total };

 
});
