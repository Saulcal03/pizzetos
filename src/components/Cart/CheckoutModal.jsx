import { useStore } from '@nanostores/react';
import { isCheckoutOpen, toggleCheckout, groupedCart } from '../../stores/cartStore';
import { useState } from 'react';

export default function CheckoutModal() {
  const isOpen = useStore(isCheckoutOpen);
  const { items, total } = useStore(groupedCart);

  // --- CONFIGURACIÓN DE SUCURSALES (Tus datos originales) ---
  const SUCURSALES = {
    "Miraflores": {
      nombre: "Pizzetos Miraflores",
      telefono: "5215584457355" 
    },
    "Chalco": {
      nombre: "Pizzetos Chalco",
      telefono: "5215573959109"
    }
  };

  // --- ESTADO DEL FORMULARIO ---
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    sucursal: '',       // Aquí guardamos "Miraflores" o "Chalco"
    metodoPago: 'Efectivo',
    pagoCon: '',        // Para calcular cambio
    notas: ''
  });

  // --- MANEJADOR DE CAMBIOS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  // --- GENERAR MENSAJE DE WHATSAPP ---
  const handleSendOrder = () => {
    // 1. Obtenemos el número correcto según la sucursal elegida
    const sucursalData = SUCURSALES[formData.sucursal];
    
    // Si por error no hay sucursal, detenemos
    if (!sucursalData) return; 

    let message = `⭐ *NUEVO PEDIDO - ${sucursalData.nombre.toUpperCase()}* ⭐%0A%0A`;
    
    // 2. Datos del Cliente
    message += `👤 *DATOS DEL CLIENTE*%0A`;
    message += `*Nombre:* ${formData.nombre}%0A`;
    message += `*Teléfono:* ${formData.telefono}%0A`;
    message += `📍 *Dirección:* ${formData.direccion}%0A`;
    if (formData.notas) message += `📝 *Referencias/Notas:* ${formData.notas}%0A`;
    message += `%0A`;

    // 3. Productos
    message += `🍕 *DETALLES DEL PEDIDO*%0A`;
    items.forEach(item => {
      if (item.type === 'promo_pair') {
        message += `- *PROMO 2x1* ($${item.price}):%0A`;
        message += `   • ${item.items[0].name} (${item.size})%0A`;
        message += `   • ${item.items[1].name} (${item.size})%0A`;
      } else {
        message += `- *${item.name}* ($${item.price})%0A`;
        if (item.size && item.category !== 'paquetes') message += `   Tamaño: ${item.size}%0A`;
        if (item.customDescription) message += `   Detalles: ${item.customDescription}%0A`;
      }
    });
    message += `%0A`; 

    // 4. Cálculos de Pago
    message += `💰 *MÉTODO DE PAGO*%0A`;
    message += `*Opción:* ${formData.metodoPago}%0A`;
    
    if (formData.metodoPago === 'Efectivo' && formData.pagoCon) {
        const montoEntregado = parseFloat(formData.pagoCon);
        const cambio = montoEntregado - total;
        message += `_Paga con: $${montoEntregado} (Cambio: $${cambio > 0 ? cambio : 0})_%0A`;
    } else if (formData.metodoPago === 'Efectivo') {
        message += `_Paga con monto exacto_%0A`;
    }

    message += `%0A*TOTAL A PAGAR: $${total}*`;

    // 5. Abrir WhatsApp con el número dinámico
    window.open(`https://wa.me/${sucursalData.telefono}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      
      {/* 1. OVERLAY */}
      <div 
        className="absolute inset-0 bg-[#0f0f0f]/60 backdrop-blur-md transition-opacity"
        onClick={() => toggleCheckout(false)}
      ></div>

      {/* 2. VENTANA PRINCIPAL */}
      <div className="relative w-full max-w-2xl bg-[#1a1a1a] rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden flex flex-col md:flex-row animate-fade-in-up max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible">
        
        {/* --- COLUMNA IZQUIERDA: RESUMEN (MODIFICADO PARA VER SABORES) --- */}
        <div className="bg-[#222] p-6 md:w-2/5 border-r border-white/5 flex flex-col justify-between">
          <div>
            <h3 className="text-amber-500 font-bold text-xs uppercase tracking-widest mb-4">Tu Pedido</h3>
            
            <div className="space-y-4 max-h-[200px] md:max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
              {items.map(item => (
                <div key={item.uniqueId} className="flex flex-col border-b border-white/5 pb-3 last:border-0">
                  
                  {/* Encabezado: Nombre y Precio */}
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-white text-sm leading-tight pr-2">
                        {item.title || item.name}
                    </span>
                    <span className="text-amber-500 font-bold text-sm">
                        ${item.price}
                    </span>
                  </div>

                  {/* Tamaño (si aplica y no es paquete) */}
                  {item.size && item.category !== 'paquetes' && (
                    <span className="text-[11px] text-gray-500">{item.size}</span>
                  )}

                  {/* --- AQUÍ ESTÁ EL CAMBIO: MOSTRAR SABORES --- */}
                  {/* Si hay descripción personalizada (sabores) y no es igual al tamaño, la mostramos */}
                  {item.customDescription && item.customDescription !== item.size && (
                     <p className="text-[11px] text-gray-400 mt-1 pl-2 border-l-2 border-amber-500/50 italic">
                        {item.customDescription}
                     </p>
                  )}
                  
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex justify-between items-end">
              <span className="text-gray-400 text-sm">Total Final</span>
              <span className="text-3xl font-serif italic text-white">${total}</span>
            </div>
          </div>
        </div>

        {/* --- COLUMNA DERECHA: FORMULARIO (Tu código original intacto) --- */}
        <div className="p-6 md:w-3/5 bg-[#1a1a1a]">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-serif text-white">Datos de Entrega</h2>
            <button onClick={() => toggleCheckout(false)} className="text-gray-500 hover:text-white transition p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            
            {/* 0. SELECCIÓN DE SUCURSAL */}
            <div className="group">
              <label className="block text-xs text-gray-500 mb-1">Elige tu Sucursal</label>
              <select 
                name="sucursal"
                value={formData.sucursal}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 focus:bg-white/10 transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled className="bg-[#222]">Selecciona una opción...</option>
                <option value="Miraflores" className="bg-[#222]">📍 Pizzetos Miraflores</option>
                <option value="Chalco" className="bg-[#222]">📍 Pizzetos Chalco</option>
              </select>
            </div>

            {/* 1. Nombre y Teléfono */}
            <div className="grid grid-cols-2 gap-4">
                <div className="group">
                <label className="block text-xs text-gray-500 mb-1 group-focus-within:text-amber-500 transition-colors">Nombre</label>
                <input 
                    type="text" 
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 focus:bg-white/10 transition-all placeholder-gray-600"
                    placeholder="Tu nombre"
                />
                </div>
                <div className="group">
                <label className="block text-xs text-gray-500 mb-1 group-focus-within:text-amber-500 transition-colors">Teléfono</label>
                <input 
                    type="tel" 
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 focus:bg-white/10 transition-all placeholder-gray-600"
                    placeholder="10 dígitos"
                />
                </div>
            </div>
              
            {/* 2. Método de Pago */}
            <div className="grid grid-cols-2 gap-4">
                <div className="group">
                    <label className="block text-xs text-gray-500 mb-1">Forma de Pago</label>
                    <select 
                    name="metodoPago"
                    value={formData.metodoPago}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                    >
                    <option value="Efectivo" className="bg-[#222]">💵 Efectivo</option>
                    <option value="Transferencia" className="bg-[#222]">📱 Transferencia</option>
                    <option value="Tarjeta" className="bg-[#222]">💳 Tarjeta</option>
                    </select>
                </div>

                {/* CAMPO DE CAMBIO */}
                {formData.metodoPago === 'Efectivo' && (
                    <div className="group animate-fadeIn">
                        <label className="block text-xs text-amber-500 mb-1 font-bold">¿Con cuánto pagas?</label>
                        <input 
                        type="number" 
                        name="pagoCon"
                        value={formData.pagoCon}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-amber-500/50 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 focus:bg-white/10 transition-all placeholder-gray-500"
                        placeholder={`Ej: ${Math.ceil(total / 50) * 50}`} 
                        />
                    </div>
                )}
            </div>

            {/* 3. Dirección */}
            <div className="group">
              <label className="block text-xs text-gray-500 mb-1 group-focus-within:text-amber-500 transition-colors">Dirección de Entrega</label>
              <textarea 
                name="direccion"
                rows="2"
                value={formData.direccion}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 focus:bg-white/10 transition-all resize-none placeholder-gray-600"
                placeholder="Calle, Número, Colonia, Mz, Lt..."
              ></textarea>
            </div>

            {/* 4. Notas */}
            <div className="group">
              <label className="block text-xs text-gray-500 mb-1 group-focus-within:text-amber-500 transition-colors">Referencias (Opcional)</label>
              <input 
                type="text" 
                name="notas"
                value={formData.notas}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 focus:bg-white/10 transition-all placeholder-gray-600"
                placeholder="Ej: Portón negro, fachada amarilla..."
              />
            </div>

            {/* Botón de Acción */}
            <button 
              onClick={handleSendOrder}
              disabled={!formData.nombre || !formData.direccion || !formData.telefono || !formData.sucursal}
              className={`
                w-full mt-2 py-4 rounded-xl font-bold text-black shadow-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1
                ${(!formData.nombre || !formData.direccion || !formData.telefono || !formData.sucursal) 
                  ? 'bg-gray-700 cursor-not-allowed opacity-50 text-gray-400' 
                  : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:shadow-amber-500/25'}
              `}
            >
              <span>Enviar Pedido por WhatsApp</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </button>
            <p className="text-[10px] text-gray-500 text-center">
              Al confirmar, se abrirá WhatsApp con el número de la sucursal seleccionada.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}