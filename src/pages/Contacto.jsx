import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Contacto() {
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState(false);

  // Manejador asincrónico para enviar los datos sin recargar ni salir de la web
  const handleSubmitReal = async (e) => {
    e.preventDefault(); // Detiene el viaje a la web de Formspree
    setEnviando(true);

    const formData = new FormData(e.target);

    try {
      const respuesta = await fetch("https://formspree.io/f/xjgzryzr", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (respuesta.ok) {
        alert("¡Consulta enviada con éxito! Redireccionando...");
        navigate("/"); // Te manda directo a la Home de tu propia app
      } else {
        alert("Hubo un problema al procesar el mensaje. Intentá de nuevo.");
      }
    } catch (error) {
      alert("Error de conexión. Revisá tu red e intentá nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Encabezado de Sección */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <h2 className="text-3xl font-black text-peyen-blue uppercase tracking-tight">
          Contacto Comercial
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          Ponete en contacto con nuestra administración central para consultas técnicas o alta de nuevos distribuidores.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* BLOQUE IZQUIERDO: INFORMACIÓN INSTITUCIONAL */}
        <div className="md:col-span-5 bg-peyen-blue text-white rounded-3xl p-8 space-y-6 border border-peyen-blue-dark shadow-md relative overflow-hidden">
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-peyen-red/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <h3 className="text-lg font-black uppercase tracking-wide border-b border-slate-700/60 pb-3">
            Atención Mayorista
          </h3>
          
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-peyen-red shrink-0 mt-0.5" />
              <div>
                <p className="font-bold uppercase text-xs text-slate-400">Planta Industrial</p>
                <p className="text-slate-200 mt-0.5">Buenos Aires, Argentina</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail size={18} className="text-peyen-red shrink-0 mt-0.5" />
              <div>
                <p className="font-bold uppercase text-xs text-slate-400">Correo Electrónico</p>
                <p className="text-slate-200 mt-0.5">info@peyenrepuestos.com.ar</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone size={18} className="text-peyen-red shrink-0 mt-0.5" />
              <div>
                <p className="font-bold uppercase text-xs text-slate-400">Teléfono / WhatsApp</p>
                <p className="text-slate-200 mt-0.5">+54 (11) 1234-5678</p>
              </div>
            </div>
          </div>
        </div>

        {/* BLOQUE DERECHO: FORMULARIO CONTROLADO POR FETCH */}
        <div className="md:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <h3 className="text-lg font-black text-peyen-blue uppercase tracking-wide mb-6 border-b pb-3">
            Enviar Mensaje Instantáneo
          </h3>
          
          <form onSubmit={handleSubmitReal} className="space-y-5">
            {/* Campo: Nombre */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 tracking-wider">
                Nombre / Razón Social
              </label>
              <input 
                type="text" 
                name="nombre" 
                required 
                placeholder="Ej: Distribuidora Warnes S.A."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-hidden focus:border-peyen-blue focus:bg-white transition-all" 
              />
            </div>

            {/* Campo: Email */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 tracking-wider">
                Tu Correo Electrónico
              </label>
              <input 
                type="email" 
                name="email" 
                required 
                placeholder="ejemplo@correo.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-hidden focus:border-peyen-blue focus:bg-white transition-all" 
              />
            </div>

            {/* Campo: Mensaje */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 tracking-wider">
                Consulta Técnica o Pedido
              </label>
              <textarea 
                name="message" 
                rows="4" 
                required 
                placeholder="Escribí los códigos de repuestos o modelos sobre los que necesitás cotización..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-hidden focus:border-peyen-blue focus:bg-white transition-all resize-none"
              ></textarea>
            </div>

            {/* Botón de Envío Dinámico */}
            <button 
              type="submit" 
              disabled={enviando}
              className="w-full bg-peyen-red hover:bg-red-700 text-white font-black uppercase tracking-wider py-3.5 rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Send size={14} />
              {enviando ? 'Enviando...' : 'Enviar Consulta Real'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}