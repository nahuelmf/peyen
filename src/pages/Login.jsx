import { useState, useContext } from 'react';
import { ProductContext } from '../context/ProductContext';
import { useNavigate } from 'react-router-dom';
import { KeyRound, User, AlertCircle } from 'lucide-react';

export default function Login() {
  const { usuarios, setUsuarioLogueado } = useContext(ProductContext);
  const [inputUsuario, setInputUsuario] = useState('');
  const [inputClave, setInputClave] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const userLimpio = inputUsuario.toLowerCase().trim();

    // 1. VERIFICACIÓN DE CREDENCIALES DE ADMINISTRADOR
    if (userLimpio === 'admin' && inputClave === 'admin') {
      setUsuarioLogueado({ role: 'admin', nombreEmpresa: 'Administrador' });
      alert('¡Acceso concedido! Ingresando al Panel de Control PEYEN...');
      navigate('/admin'); 
      return;
    }

    // 2. VERIFICACIÓN DE DISTRIBUIDORES MAYORISTAS
    const clienteEncontrado = usuarios.find(
      (u) => u.usuario.toLowerCase() === userLimpio && u.clave === inputClave
    );

    if (clienteEncontrado) {
      setUsuarioLogueado({ ...clienteEncontrado, role: 'cliente' });
      alert(`¡Hola, ${clienteEncontrado.nombreEmpresa}! Tarifas mayoristas aplicadas.`);
      navigate('/catalogo'); 
    } else {
      setError('Las credenciales ingresadas no corresponden a ninguna terminal activa.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">PEYEN B2B</h2>
        <p className="text-xs text-slate-500 mt-1">Portal único para Personal Interno y Distribuidores Autorizados.</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 px-5 border border-slate-200 shadow-xs rounded-2xl">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Usuario / Terminal</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><User size={14} /></span>
                <input type="text" required value={inputUsuario} onChange={(e) => setInputUsuario(e.target.value)} className="w-full bg-slate-50 border rounded-xl pl-9 pr-3 py-2.5 text-xs outline-hidden focus:border-slate-900 focus:bg-white transition-all text-slate-800 font-semibold" placeholder="admin o tu_cuenta_b2b" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Contraseña de Entrada</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><KeyRound size={14} /></span>
                <input type="password" required value={inputClave} onChange={(e) => setInputClave(e.target.value)} className="w-full bg-slate-50 border rounded-xl pl-9 pr-3 py-2.5 text-xs outline-hidden focus:border-slate-900 focus:bg-white transition-all text-slate-800" placeholder="••••••••" />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-[10px] font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100">
                <AlertCircle size={13} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-xs py-3 rounded-xl tracking-wider transition-colors cursor-pointer shadow-xs">
              Sincronizar Acceso
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}