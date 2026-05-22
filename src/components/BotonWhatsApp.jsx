import { MessageSquare } from 'lucide-react';

export default function BotonWhatsApp() {
  // Configuración del enlace de WhatsApp
  const numeroTelefono = "541149351070"; // <-- Reemplazá por el número real de PEYEN (con código de país, sin el + ni espacios)
  const mensajePredeterminado = encodeURIComponent("Hola! Estoy navegando el catálogo web de PEYEN y me interesaría realizar una consulta técnica.");
  
  const urlWhatsApp = `https://wa.me/${numeroTelefono}?text=${mensajePredeterminado}`;

  return (
    <a
      href={urlWhatsApp}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center bg-[#25D366] text-white p-3.5 rounded-full shadow-xl hover:bg-[#128C7E] hover:scale-110 active:scale-95 transition-all group duration-300 cursor-pointer animate-bounce-slow"
      title="Chatear con un asesor técnico"
    >
      {/* Efecto de onda expansiva/pulso por detrás */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 group-hover:opacity-0 animate-ping pointer-events-none"></span>
      
      {/* Icono de mensaje o chat (puedes usar el MessageSquare estilizado si no tenés el de WhatsApp) */}
      <svg 
        viewBox="0 0 24 24" 
        className="w-6 h-6 fill-current"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.324 5.328 0 11.859 0c3.166.001 6.141 1.233 8.378 3.469 2.237 2.235 3.469 5.211 3.469 8.379-.002 6.534-5.325 11.86-11.859 11.86-.002 0-.003 0-.005 0-2.016-.001-3.99-.512-5.748-1.483L0 24zm6.204-3.513l.365.217c1.551.92 3.65 1.406 5.284 1.407 5.429 0 9.845-4.417 9.847-9.847.001-2.63-1.022-5.101-2.882-6.963C16.977 3.441 14.505 2.417 11.86 2.417c-5.43 0-9.847 4.418-9.849 9.849-.001 1.701.447 3.361 1.298 4.84l.239.416-1.013 3.698 3.79-.993zM16.62 14.94c-.263-.131-1.554-.767-1.795-.855-.24-.088-.415-.131-.589.131-.174.263-.677.855-.83 1.03-.153.175-.306.197-.569.066-1.144-.572-1.925-1.002-2.693-2.317-.197-.338.197-.314.564-1.049.06-.12.03-.224-.015-.312-.045-.088-.415-1.002-.569-1.374-.15-.362-.303-.313-.415-.319-.107-.005-.23-.006-.353-.006-.123 0-.323.046-.492.23-.169.184-.645.63-.645 1.537 0 .907.66 1.784.752 1.907.092.124 1.299 1.983 3.147 2.778.44.189.782.302 1.05.387.442.14.844.12 1.161.073.354-.053 1.082-.442 1.233-.847.152-.404.152-.751.107-.823-.046-.073-.169-.115-.432-.246z"/>
      </svg>
    </a>
  );
}