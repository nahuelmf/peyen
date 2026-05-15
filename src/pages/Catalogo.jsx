import { useState, useMemo, useContext } from 'react';
import { ProductContext } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { Search, RotateCcw } from 'lucide-react';

export default function Catalogo() {
  const { productos } = useContext(ProductContext);
  const [busquedaLocal, setBusquedaLocal] = useState('');
  const [marcaSeleccionada, setMarcaSeleccionada] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');

  const marcasUnicas = useMemo(() => [...new Set(productos.map(p => p.marca))], [productos]);
  const categoriasUnicas = useMemo(() => [...new Set(productos.map(p => p.categoria))], [productos]);

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const matchBusqueda = 
        p.nombre.toLowerCase().includes(busquedaLocal.toLowerCase()) ||
        p.codigo.toLowerCase().includes(busquedaLocal.toLowerCase()) ||
        p.modelo.toLowerCase().includes(busquedaLocal.toLowerCase());
      const matchMarca = marcaSeleccionada === '' || p.marca === marcaSeleccionada;
      const matchCategoria = categoriaSeleccionada === '' || p.categoria === categoriaSeleccionada;
      return matchBusqueda && matchMarca && matchCategoria;
    });
  }, [busquedaLocal, marcaSeleccionada, categoriaSeleccionada, productos]);

  return (
    <div className="bg-peyen-gray min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 border-b-2 border-peyen-blue/10 pb-4">
          <h2 className="text-3xl font-black text-peyen-blue uppercase tracking-tight sm:text-4xl">
            Catálogo Técnico
          </h2>
          <p className="mt-2 text-slate-500">Buscá tus repuestos por código de pieza, nombre o modelo.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 flex-1 focus-within:border-peyen-blue focus-within:bg-white transition-all">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Filtrar repuestos en esta página..."
              value={busquedaLocal}
              onChange={(e) => setBusquedaLocal(e.target.value)}
              className="w-full bg-transparent border-none outline-hidden text-sm text-slate-800"
            />
          </div>

          <select value={marcaSeleccionada} onChange={(e) => setMarcaSeleccionada(e.target.value)} className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg p-2.5 min-w-[160px]">
            <option value="">Todas las Marcas</option>
            {marcasUnicas.map(m => <option key={m} value={m}>{m}</option>)}
          </select>

          <select value={categoriaSeleccionada} onChange={(e) => setCategoriaSeleccionada(e.target.value)} className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg p-2.5 min-w-[160px]">
            <option value="">Todas las Categorías</option>
            {categoriasUnicas.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {(busquedaLocal || marcaSeleccionada || categoriaSeleccionada) && (
            <button onClick={() => { setBusquedaLocal(''); setMarcaSeleccionada(''); setCategoriaSeleccionada(''); }} className="flex items-center gap-2 bg-red-50 text-peyen-red border border-peyen-red/20 font-bold px-4 py-2.5 rounded-lg text-sm transition-colors cursor-pointer">
              <RotateCcw size={16} /> Limpiar
            </button>
          )}
        </div>

        {productosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productosFiltrados.map(p => <ProductCard key={p.id} producto={p} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-12 bg-white border border-slate-200 rounded-2xl max-w-md mx-auto mt-8">
            <p className="text-lg font-bold text-peyen-blue">Sin coincidencias</p>
          </div>
        )}
      </div>
    </div>
  );
}