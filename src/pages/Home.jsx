import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, Wrench } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-16 pb-16">
      
      {/* SECCIÓN HERO - Unificada con el Azul Peyen Oficial */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-peyen-blue text-white rounded-3xl p-8 sm:p-12 md:p-16 shadow-xl relative overflow-hidden border border-peyen-blue-dark">
          
          {/* Decoración sutil de fondo usando el rojo de la marca de forma muy suave */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-peyen-red/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative max-w-3xl mx-auto text-center space-y-6">
            
            {/* LOGO PERFECTAMENTE CENTRADO */}
            <div className="flex justify-center mb-2">
              <Link to="/" className="inline-flex items-center hover:opacity-90 transition-opacity bg-white px-5 py-2 rounded-xl shadow-md">
                <img src="/logo-peyen.png" alt="PEYEN Repuestos" className="h-10 w-auto object-contain" />
              </Link>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase leading-tight">
              Seguridad y Alta Performance <br />
              <span className="text-peyen-red">en Cada Componente</span>
            </h1>
            
            <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              En PEYEN fabricamos y distribuimos repuestos de frenos e hidráulica automotriz bajo los más estrictos estándares de calidad del mercado.
            </p>
            
            <div className="pt-4">
              <Link 
                to="/catalogo" 
                className="inline-flex items-center gap-2 bg-peyen-red hover:bg-red-700 text-white font-black uppercase tracking-wider text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-md transition-all hover:scale-[1.02] cursor-pointer"
              >
                Explorar Catálogo Técnico
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN CARACTERÍSTICAS (Las tarjetitas de abajo) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-peyen-blue uppercase tracking-tight">
            ¿Por qué elegir los componentes PEYEN?
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Garantía de confianza para distribuidoras, casas de repuestos y talleres mecánicos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tarjeta 1 */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-peyen-red">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-black text-peyen-blue uppercase tracking-wide">Máxima Durabilidad</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Materiales testeados bajo condiciones extremas de presión y temperatura para asegurar una response de frenado óptima.
            </p>
          </div>

          {/* Tarjeta 2 */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-peyen-red">
              <Truck size={24} />
            </div>
            <h3 className="text-lg font-black text-peyen-blue uppercase tracking-wide">Distribución Nacional</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Llegamos a todo el país con logística propia y estratégica, asegurando que el repuesto que necesitás llegue a tiempo.
            </p>
          </div>

          {/* Tarjeta 3 */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-peyen-red">
              <Wrench size={24} />
            </div>
            <h3 className="text-lg font-black text-peyen-blue uppercase tracking-wide">Soporte y Asesoramiento</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Contamos con un equipo técnico especializado listo para ayudarte a identificar el código de pieza exacto para tu vehículo.
            </p>
          </div>
        </div>
      </section>

      {/* SECCIÓN LLAMADO A LA ACCIÓN PEYEN (Mayoristas) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-black text-peyen-blue uppercase tracking-wide">
              ¿Sos distribuidor o tenés un taller mecánico?
            </h3>
            <p className="text-sm text-slate-500 max-w-xl">
              Ponete en contacto con nuestro departamento de ventas mayoristas para acceder a listas de precios especiales y planes de financiación.
            </p>
          </div>
          <Link 
            to="/contacto" 
            className="bg-peyen-blue hover:bg-peyen-blue-dark text-white font-black uppercase tracking-wider text-xs px-6 py-3.5 rounded-xl transition-colors shadow-xs shrink-0 cursor-pointer"
          >
            Consultar por Mayor
          </Link>
        </div>
      </section>

    </div>
  );
}