import { useState, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext';
import SearchModal from './SearchModal';
import { Menu, X, UserCheck, Search } from 'lucide-react';

export default function Navbar() {
  const { productos } = useContext(ProductContext);
  
  // Estados para el menú responsive y el buscador predictivo
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [textoBusqueda, setTextoBusqueda] = useState('');

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
    <>
      <nav className="bg-[#12243D] text-white sticky top-0 z-50 border-b border-[#001837] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">
            
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

            {/* 2. EL BUSCADOR QUE ME HABÍA OLVIDADO (Solo Escritorio) */}
            <button 
              onClick={() => setModalAbierto(true)}
              className="flex-1 max-w-xs mx-4 hidden md:flex items-center justify-between bg-peyen-blue-dark/50 border border-slate-700/60 rounded-lg px-3 py-1.5 text-slate-400 hover:text-slate-200 hover:border-slate-500 hover:bg-peyen-blue-dark transition-all text-left text-xs cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Search size={14} className="text-slate-400 shrink-0" />
                <span>Buscar repuestos, códigos...</span>
              </div>
              <span className="bg-peyen-blue/80 border border-slate-700/40 text-[9px] px-1.5 py-0.5 rounded-md font-mono text-slate-400 font-bold uppercase">
                Buscar
              </span>
            </button>

            {/* 3. ENLACES CENTRALES (Solo Escritorio) */}
            <div className="hidden md:flex items-center space-x-6">
              <NavLink to="/" className={linkStyles}>Inicio</NavLink>
              <NavLink to="/catalogo" className={linkStyles}>Catálogo</NavLink>
              <NavLink to="/contacto" className={linkStyles}>Contacto</NavLink>
            </div>

            {/* 4. BOTÓN ADMIN (Solo Escritorio) */}
            <div className="hidden md:flex items-center ml-4">
              <Link 
                to="/login" 
                className="flex items-center gap-1.5 border border-slate-400/40 hover:border-peyen-red bg-peyen-blue-dark/50 hover:bg-peyen-red text-white text-[11px] font-black uppercase tracking-widest px-3 py-2 rounded-xl transition-all"
              >
                <UserCheck size={13} />
                Panel Admin
              </Link>
            </div>

            {/* 5. BOTONERA DE CONTROL (Solo Mobile) */}
            <div className="flex md:hidden items-center gap-1">
              {/* Lupa para abrir el buscador predictivo en celulares */}
              <button
                onClick={() => setModalAbierto(true)}
                type="button"
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-peyen-blue-dark cursor-pointer transition-colors"
                title="Abrir buscador instantáneo"
              >
                <Search size={22} />
              </button>

              {/* Botón hamburguesa clásico */}
              <button
                onClick={() => setMenuAbierto(!menuAbierto)}
                type="button"
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-peyen-blue-dark cursor-pointer transition-colors"
              >
                {menuAbierto ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

          </div>
        </div>

        {/* 6. MENÚ DESPLEGABLE INTERACTIVO (Solo Mobile) */}
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            menuAbierto ? 'max-h-64 opacity-100 border-t border-peyen-blue-dark bg-[#12243D]' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="px-3 pt-3 pb-4 space-y-2">
            <NavLink to="/" onClick={() => setMenuAbierto(false)} className={linkStylesMobile}>Inicio</NavLink>
            <NavLink to="/catalogo" onClick={() => setMenuAbierto(false)} className={linkStylesMobile}>Catálogo</NavLink>
            <NavLink to="/contacto" onClick={() => setMenuAbierto(false)} className={linkStylesMobile}>Contacto</NavLink>
            
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

      {/* COMPONENTE MODAL FLOTANTE PREDICTIVO (Disponible para PC y Mobile) */}
      <SearchModal 
        isOpen={modalAbierto} 
        onClose={() => { setModalAbierto(false); setTextoBusqueda(''); }} 
        productos={productos}
        busqueda={textoBusqueda}
        setBusqueda={setTextoBusqueda}
      />
    </>
  );
}