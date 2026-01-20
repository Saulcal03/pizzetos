import { useState } from 'react';

export default function AdminPanel() {
  // CONFIGURACIÓN
  const PANTRY_ID = "262852f3-c7f9-4503-aaea-2ad6f03cbdab";
  const BASKET_NAME = "contador_pedidos";
  const API_URL = `https://getpantry.cloud/apiv1/pantry/${PANTRY_ID}/basket/${BASKET_NAME}`;

  // ESTADOS DE DATOS
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false); 
  
  // ESTADOS DE LOGIN
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const [error, setError] = useState(''); 

  // NUEVOS ESTADOS PARA ALERTAS BONITAS
  const [showResetModal, setShowResetModal] = useState(false); // Controla la ventana de "¿Estás seguro?"
  const [notification, setNotification] = useState(null); // Controla el mensaje de éxito/error

  // --- FUNCIÓN HELPER: MOSTRAR NOTIFICACIÓN ---
  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    // Que desaparezca sola después de 3 segundos
    setTimeout(() => setNotification(null), 3000);
  };

  // --- FUNCIÓN: CARGAR DATOS ---
  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        // Si ya estábamos logueados y es una actualización manual, mostramos aviso sutil
        if (isAuthorized) showToast("Datos actualizados correctamente", "success");
      }
    } catch (error) {
      console.error("Error cargando datos", error);
      showToast("Error al cargar datos", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- FUNCIÓN 1: PEDIR CONFIRMACIÓN (ABRIR MODAL) ---
  const handleResetRequest = () => {
    setShowResetModal(true);
  };

  // --- FUNCIÓN 2: EJECUTAR REINICIO (AL DAR CLICK EN "SÍ") ---
  const confirmReset = async () => {
    setShowResetModal(false); // Cerramos el modal primero
    setLoading(true);

    const resetData = {
      "Miraflores": 0,
      "Chalco": 0,
      "_ultima_actualizacion": new Date().toLocaleString()
    };

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resetData)
      });
      
      setStats(resetData);
      showToast("¡Contador reiniciado a CERO!", "success"); // Notificación bonita

    } catch (error) {
      console.error("Error al reiniciar", error);
      showToast("Hubo un error al intentar reiniciar", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- VALIDAR CONTRASEÑA ---
  const handleLogin = (e) => {
    e.preventDefault();
    setError(''); 

    if (password === 'pizza123') { 
      setIsAuthorized(true);
      fetchStats(); // Cargar datos al entrar
    } else {
      setError("La contraseña es incorrecta. Inténtalo de nuevo.");
      if (navigator.vibrate) navigator.vibrate(200);
    }
  };

  // ==========================================
  // VISTAS
  // ==========================================

  // 1. LOGIN
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#FFFBF2] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-orange-100 w-full max-w-sm text-center transition-all duration-300">
          <h1 className="font-serif text-3xl text-gray-800 mb-2">Acceso Admin</h1>
          <p className="text-sm text-gray-500 mb-8">Solo personal autorizado</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                className={`w-full p-4 pr-12 border rounded-lg focus:outline-none transition-colors ${
                  error ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-300' : 'border-gray-200 focus:border-amber-500 text-black bg-white'
                }`}
                value={password}
                onChange={(e) => { setPassword(e.target.value); if(error) setError(''); }}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-amber-600 focus:outline-none cursor-pointer z-10"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                )}
              </button>
            </div>
            {error && <div className="flex items-center justify-center gap-2 text-red-500 text-sm animate-pulse"><span>{error}</span></div>}
            <button className="w-full bg-amber-500 text-white font-bold py-3.5 rounded-lg hover:bg-amber-600 transition-all shadow-md">Entrar al Panel</button>
          </form>
        </div>
      </div>
    );
  }

  // 2. CARGANDO
  if (loading) return (
    <div className="min-h-screen bg-[#FFFBF2] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
      <p className="text-amber-800 font-medium animate-pulse">Procesando...</p>
    </div>
  );

  // 3. DASHBOARD PRINCIPAL
  return (
    <div className="min-h-screen bg-[#FFFBF2] p-6 md:p-12 relative">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div className="text-center md:text-left">
            <h1 className="font-serif italic text-4xl text-black">Panel de Ventas</h1>
            <p className="text-gray-500 mt-1">Gestión en tiempo real</p>
          </div>
          <div className="flex gap-3">
             <button onClick={fetchStats} className="bg-white text-gray-600 hover:text-amber-600 px-4 py-3 rounded-xl transition-all flex items-center gap-2 font-medium shadow-sm border border-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Actualizar
             </button>
             <button onClick={handleResetRequest} className="bg-red-50 text-red-600 hover:bg-red-500 hover:text-white px-4 py-3 rounded-xl transition-all flex items-center gap-2 font-medium shadow-sm border border-red-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                Reiniciar Mes
             </button>
          </div>
        </div>

        {/* TARJETAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-xl shadow-amber-500/5 border-l-4 border-amber-500 flex justify-between items-center transform transition hover:-translate-y-1 hover:shadow-2xl">
            <div>
              <div className="flex items-center gap-2 mb-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span><p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Sucursal</p></div>
              <h2 className="text-3xl font-serif text-gray-800">Miraflores</h2>
            </div>
            <div className="text-right">
              <span className="block text-6xl font-serif text-amber-500 leading-none">{stats?.Miraflores || 0}</span>
              <span className="text-xs text-gray-400 font-medium">Pedidos totales</span>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl shadow-green-500/5 border-l-4 border-green-500 flex justify-between items-center transform transition hover:-translate-y-1 hover:shadow-2xl">
            <div>
              <div className="flex items-center gap-2 mb-2"><span className="w-2 h-2 rounded-full bg-green-500"></span><p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Sucursal</p></div>
              <h2 className="text-3xl font-serif text-gray-800">Chalco</h2>
            </div>
            <div className="text-right">
              <span className="block text-6xl font-serif text-green-500 leading-none">{stats?.Chalco || 0}</span>
              <span className="text-xs text-gray-400 font-medium">Pedidos totales</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-12 text-center">
             <span className="inline-block px-4 py-1 rounded-full bg-gray-100 text-gray-400 text-xs font-medium border border-gray-200">
               Última sincronización: {stats?._ultima_actualizacion || "Esperando datos..."}
             </span>
        </div>
      </div>

      {/* --- MODAL PERSONALIZADO (POP-UP DE CONFIRMACIÓN) --- */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
           <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-100 transform transition-all scale-100">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-500 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-center text-gray-800 mb-2">¿Estás seguro?</h3>
              <p className="text-center text-gray-500 text-sm mb-6">
                 Esto pondrá el contador de ambas sucursales en <strong>CERO</strong>. Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                 <button onClick={() => setShowResetModal(false)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors">
                    Cancelar
                 </button>
                 <button onClick={confirmReset} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30">
                    Sí, Reiniciar
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* --- NOTIFICACIÓN FLOTANTE (TOAST) --- */}
      {notification && (
        <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up z-50 ${notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
           {notification.type === 'error' ? (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           ) : (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           )}
           <p className="font-bold text-sm">{notification.message}</p>
        </div>
      )}

    </div>
  );
}