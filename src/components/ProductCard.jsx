import { MessageSquareText } from 'lucide-react';

export default function ProductCard({ producto }) {
  const numeroWhatsapp = "5491149351070"; // Reemplazar por tu número real

  const mensajePredeterminado = encodeURIComponent(
    `Hola PEYEN! Estoy interesado en el siguiente repuesto:\n\n` +
    `• Producto: ${producto.nombre}\n` +
    `• Código: ${producto.codigo}\n` +
    `• Vehículo: ${producto.marca} ${producto.modelo} (${producto.anio})`
  );

  const urlWhatsapp = `https://wa.me/${numeroWhatsapp}?text=${mensajePredeterminado}`;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group">
      
      {/* Contenedor de Imagen con Categoría en Azul Peyen */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden border-b border-slate-100">
        <img 
          src={producto.imagen} 
          alt={producto.nombre} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-3 left-3 bg-peyen-blue/90 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-1 rounded-md tracking-widest uppercase">
          {producto.categoria}
        </span>
      </div>

      {/* Contenido Técnico */}
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-xs font-mono text-slate-400 mb-1 block font-bold">
          CÓD: {producto.codigo}
        </span>
        
        <h3 className="text-lg font-black text-peyen-blue line-clamp-1 group-hover:text-peyen-red transition-colors mb-2 uppercase tracking-wide">
          {producto.nombre}
        </h3>
        
        {/* Cuadro de Compatibilidad Adaptado */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-lg p-2.5 mb-4 text-sm">
          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Apto para:</span>
          <p className="text-peyen-blue font-bold">
            {producto.marca} <span className="text-slate-500 font-normal">{producto.modelo}</span>
          </p>
          <span className="text-xs text-slate-500 font-mono">Modelos: {producto.anio}</span>
        </div>

        {/* Botón de Consulta Oficial en Rojo Peyen */}
        <a 
          href={urlWhatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mt-auto flex items-center justify-center gap-2 bg-peyen-red hover:bg-red-700 text-white font-black uppercase tracking-wider py-2.5 px-4 rounded-xl text-xs transition-colors shadow-xs hover:shadow-peyen-red/10 cursor-pointer"
        >
          <MessageSquareText size={14} />
          Consultar Pieza
        </a>
      </div>

    </div>
  );
}