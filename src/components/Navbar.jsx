import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, UserCheck } from 'lucide-react';

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Clases compartidas para los enlaces de navegación (escritorio y mobile)
  // Nota: Usamos Publica Sans Regular/Medium implícito en tu CSS global
  const linkStyles = ({ isActive }) =>
    `text-xs uppercase tracking-wider font-bold transition-colors ${
      isActive 
        ? 'text-peyen-red border-b-2 border-peyen-red pb-1' 
        : 'text-slate-300 hover:text-white'
    }`;

  const linkStylesMobile = ({ isActive }) =>
    `text-sm uppercase tracking-wider font-black block py-3 px-4 rounded-xl transition-colors ${
      isActive 
        ? 'bg-peyen-red text-white' 
        : 'text-slate-300 hover:bg-peyen-blue-dark hover:text-white'
    }`;

  return (
    <nav className="bg-[#12243D] text-white sticky top-0 z-50 border-b border-[#001837] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* 1. LOGO (Izquierda) */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="bg-white px-3 py-1 rounded-md shadow-xs hover:opacity-90 transition-opacity">
              <img 
                src="/logo-peyen.png" 
                alt="PEYEN Repuestos" 
                className="h-7 w-auto object-contain" 
              />
            </Link>
          </div>

          {/* 2. ENLACES CENTRALES (Solo Escritorio) */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={linkStyles}>Inicio</NavLink>
            <NavLink to="/catalogo" className={linkStyles}>Catálogo</NavLink>
            <NavLink to="/contacto" className={linkStyles}>Contacto</NavLink>
          </div>

          {/* 3. BOTÓN ADMIN (Solo Escritorio) */}
          <div className="hidden md:flex items-center">
            <Link 
              to="/login" 
              className="flex items-center gap-1.5 border border-slate-400/40 hover:border-peyen-red bg-peyen-blue-dark/50 hover:bg-peyen-red text-white text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all"
            >
              <UserCheck size={13} />
              Panel Admin
            </Link>
          </div>

          {/* 4. BOTÓN HAMBURGUESA (Solo Mobile) */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-peyen-blue-dark focus:outline-hidden cursor-pointer transition-colors"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menú de navegación</span>
              {menuAbierto ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* 5. MENÚ DESPLEGABLE INTERACTIVO (Solo Mobile) */}
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          menuAbierto ? 'max-h-64 opacity-100 border-t border-peyen-blue-dark bg-[#12243D]' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
        id="mobile-menu"
      >
        <div className="px-3 pt-3 pb-4 space-y-2">
          <NavLink 
            to="/" 
            onClick={() => setMenuAbierto(false)} 
            className={linkStylesMobile}
          >
            Inicio
          </NavLink>
          <NavLink 
            to="/catalogo" 
            onClick={() => setMenuAbierto(false)} 
            className={linkStylesMobile}
          >
            Catálogo
          </NavLink>
          <NavLink 
            to="/contacto" 
            onClick={() => setMenuAbierto(false)} 
            className={linkStylesMobile}
          >
            Contacto
          </NavLink>
          
          <div className="pt-2 border-t border-slate-700/40">
            <Link 
              to="/login" 
              onClick={() => setMenuAbierto(false)}
              className="flex items-center justify-center gap-2 bg-peyen-blue-dark text-white text-xs font-black uppercase tracking-wider py-3 px-4 rounded-xl hover:bg-peyen-red transition-colors w-full"
            >
              <UserCheck size={14} />
              Panel Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}