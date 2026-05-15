import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Credenciales de prueba ultra simples
    if (usuario === 'admin' && password === 'admin') {
      localStorage.setItem('peyen_admin_auth', 'true');
      navigate('/admin');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white border border-slate-200 rounded-2xl p-8 shadow-xs">
      <div className="flex flex-col items-center mb-6">
        <div className="p-3 bg-amber-50 text-amber-600 rounded-full mb-3">
          <Lock size={24} />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Ingreso Administración</h2>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Usuario</label>
          <input 
            type="text" required value={usuario} onChange={(e) => setUsuario(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-hidden focus:border-amber-500 focus:bg-white transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Contraseña</label>
          <input 
            type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-hidden focus:border-amber-500 focus:bg-white transition-all"
          />
        </div>

        {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}

        <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg text-sm transition-colors cursor-pointer">
          Ingresar al Panel
        </button>
      </form>
    </div>
  );
}