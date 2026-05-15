import { useState } from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';

export default function Contacto() {
  const [enviado, setEnviado] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      <div className="mb-8 border-b-2 border-peyen-blue/10 pb-4">
        <h2 className="text-3xl font-black text-peyen-blue uppercase tracking-tight sm:text-4xl">
          Contacto Comercial
        </h2>
        <p className="mt-2 text-slate-500">
          Ponete en contacto con nuestra fábrica y departamento de distribución mayorista.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
        {/* Columna Informativa */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6 shadow-xs">
          <h3 className="text-lg font-black text-peyen-blue border-b pb-3 uppercase tracking-wide">
            Información Institucional
          </h3>
          
          <div className="flex gap-4 items-start">
            <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-peyen-red"><MapPin size={20} /></div>
            <div>
              <p className="font-bold text-peyen-blue">Oficina</p>
              <p className="text-sm text-slate-500 leading-relaxed">Pichincha 940, Temperley, Argentina</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-peyen-red"><Phone size={20} /></div>
            <div>
              <p className="font-bold text-peyen-blue">Atención Telefónica</p>
              <p className="text-sm text-slate-500 font-mono">+54 (11) 4567-8900</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-peyen-red"><Mail size={20} /></div>
            <div>
              <p className="font-bold text-peyen-blue">Correo Electrónico Oficial</p>
              <p className="text-sm text-slate-500 font-mono">info@peyenrepuestos.com</p>
            </div>
          </div>
        </div>

        {/* Formulario Corporativo */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs">
          <h3 className="text-lg font-black text-peyen-blue mb-6 uppercase tracking-wide">
            Envianos tu consulta técnica
          </h3>
          
          {enviado ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold text-sm">
              ¡Mensaje enviado con éxito! Nuestro equipo comercial se comunicará a la brevedad.
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setEnviado(true); }} className="space-y-4">
              <input 
                type="text" placeholder="Nombre completo / Razón Social" required 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-hidden focus:border-peyen-blue focus:bg-white transition-all" 
              />
              <input 
                type="email" placeholder="Correo electrónico de contacto" required 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-hidden focus:border-peyen-blue focus:bg-white transition-all" 
              />
              <textarea 
                placeholder="Escribí acá tu mensaje o listado de códigos solicitados..." rows="4" required 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-hidden focus:border-peyen-blue focus:bg-white transition-all resize-none"
              ></textarea>
              
              <button 
                type="submit" 
                className="w-full flex items-center justify-center gap-2 bg-peyen-blue hover:bg-peyen-blue-dark text-white font-black uppercase tracking-wider py-3 rounded-lg text-xs cursor-pointer transition-colors shadow-md"
              >
                <Send size={14} /> Enviar Mensaje
              </button>
            </form>
          )}
        </div>
      </div>

    </div>
  );
}