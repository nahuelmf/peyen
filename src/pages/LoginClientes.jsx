import { useState, useContext } from 'react';
import { ProductContext } from '../context/ProductContext';
import { useNavigate } from 'react-router-dom';
import { KeyRound, User, AlertCircle } from 'lucide-react';

export default function LoginClientes() {
  const { usuarios, setUsuarioLogueado } = useContext(ProductContext);
  const [inputUsuario, setInputUsuario] = useState('');
  const [inputClave, setInputClave] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Corremos la verificación cruzada en la base de datos local
    const clienteEncontrado = usuarios.find(
      (u) => u.usuario.toLowerCase() === inputUsuario.toLowerCase().trim() && u.clave === inputClave
    );

    if (clienteEncontrado) {
      setUsuarioLogueado(clienteEncontrado); // Guardamos la sesión activa en el estado global
      alert(`¡Hola, ${clienteEncontrado.nombreEmpresa}! Cuenta mayorista sincronizada.`);
      navigate('/catalogo'); // Redirección automática a la planilla de repuestos
    } else {
      setError('Las credenciales no coinciden con ningún distribuidor activo.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Portal de Distribuidores</h2>
        <p className="text-xs text-slate-500 mt-1">Colocá tu cuenta asignada por PEYEN para visualizar listas de precios y bonificaciones.</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 px-5 border border-slate-200 shadow-xs rounded-2xl">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Nombre de Usuario</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><User size={14} /></span>
                <input type="text" required value={inputUsuario} onChange={(e)=>setInputUsuario(e.target.value)} className="w-full bg-slate-50 border rounded-xl pl-9 pr-3 py-2 text-xs outline-hidden focus:border-blue-600 focus:bg-white transition-all" placeholder="ej: warnes_rep" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Contraseña de Entrada</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><KeyRound size={14} /></span>
                <input type="password" required value={inputClave} onChange={(e)=>setInputClave(e.target.value)} className="w-full bg-slate-50 border rounded-xl pl-9 pr-3 py-2 text-xs outline-hidden focus:border-blue-600 focus:bg-white transition-all" placeholder="••••••••" />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-[10px] font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100">
                <AlertCircle size={13} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-xs py-2.5 rounded-xl tracking-wider shadow-xs transition-colors cursor-pointer">
              Sincronizar Terminal
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}