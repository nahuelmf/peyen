import { useEffect, useRef } from 'react';
import { Search, X, MessageSquareText, CornerDownLeft } from 'lucide-react';

export default function SearchModal({ isOpen, onClose, productos, busqueda, setBusqueda }) {
  const inputRef = useRef(null);
  const numeroWhatsapp = "5491123456789"; // Tu número comercial real

  // Auto-foco al abrir e interactividad con el teclado (Esc para cerrar)
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filtrado reactivo en caliente
  const resultados = busqueda.trim() === '' ? [] : productos.filter((p) => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.modelo.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.marca.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-100 flex items-start justify-center pt-[10vh] px-4">
      {/* Fondo oscuro traslúcido de desenfoque cinematográfico */}
      <div className="absolute inset-0 bg-peyen-blue/40 backdrop-blur-xs transition-opacity" onClick={onClose}></div>

      {/* Contenedor del Panel Predictivo */}
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[70vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Cabecera del Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <Search size={20} className="text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Escribí un código, nombre o vehículo (ej: FR-1025, Cronos)..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 border-none outline-hidden"
          />
          {busqueda && (
            <button onClick={() => setBusqueda('')} className="text-xs text-peyen-red font-bold hover:underline px-1 cursor-pointer">
              Limpiar
            </button>
          )}
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200 transition-colors cursor-pointer">
            <X size={16} />
          </button>
        </div>

        {/* Zona de Resultados Dinámicos */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[150px]">
          {busqueda.trim() === '' ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-8 text-slate-400 space-y-1">
              <Search size={32} className="text-slate-300 stroke-[1.5]" />
              <p className="text-sm font-bold text-peyen-blue/70">Buscador Instantáneo PEYEN</p>
              <p className="text-xs max-w-xs">Ingresá los datos del repuesto para consultar stock o compatibilidad en tiempo real.</p>
            </div>
          ) : resultados.length > 0 ? (
            resultados.map((p) => {
              const msg = encodeURIComponent(`Hola PEYEN! Consulto stock del repuesto:\n• Código: ${p.codigo}\n• Producto: ${p.nombre}\n• Vehículo: ${p.marca} ${p.modelo}`);
              return (
                <a
                  key={p.id}
                  href={`https://wa.me/${numeroWhatsapp}?text=${msg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 hover:border-peyen-blue/20 hover:bg-slate-50/70 transition-all group cursor-pointer"
                >
                  {/* Miniatura de Imagen de Repuesto */}
                  <div className="w-14 h-14 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                    <img src={p.imagen} alt={p.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>

                  {/* Datos Técnicos */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-black text-peyen-red tracking-wider uppercase bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                        {p.codigo}
                      </span>
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-tight">{p.categoria}</span>
                    </div>
                    <h4 className="text-sm font-bold text-peyen-blue truncate mt-1 group-hover:text-peyen-red transition-colors uppercase">
                      {p.nombre}
                    </h4>
                    <p className="text-xs text-slate-500 truncate font-medium">
                      Apto: <span className="font-bold text-slate-700">{p.marca}</span> {p.modelo} ({p.anio})
                    </p>
                  </div>

                  {/* Icono de Acción lateral */}
                  <div className="text-slate-300 group-hover:text-peyen-red transition-colors pr-2">
                    <MessageSquareText size={16} />
                  </div>
                </a>
              );
            })
          ) : (
            <div className="text-center py-10 text-slate-400 text-xs">
              No se encontraron repuestos para "<span className="font-bold text-peyen-blue">{busqueda}</span>".
            </div>
          )}
        </div>

        {/* Footer del Buscador - Atajos */}
        <div className="bg-slate-50 border-t border-slate-100 px-4 py-2 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><CornerDownLeft size={10} /> Consultar por WhatsApp</span>
            <span>Esc para Cerrar</span>
          </div>
          <span className="text-peyen-blue/40 font-black tracking-widest">PEYEN REPUESTOS</span>
        </div>

      </div>
    </div>
  );
}