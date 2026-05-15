import { useState, useContext } from 'react';
import { ProductContext } from '../context/ProductContext';
import { PlusCircle, Trash2, Image, KeyRound, Pencil, Save, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const { productos, agregarProducto, actualizarProducto, eliminarProducto } = useContext(ProductContext);
  const navigate = useNavigate();

  // Estado para controlar qué producto se está editando (null = modo alta)
  const [editandoId, setEditandoId] = useState(null);

  // Estados del Formulario
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('Frenos');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [anio, setAnio] = useState('');
  const [imagenBase64, setImagenBase64] = useState('');
  const [errorImagen, setErrorImagen] = useState('');

  // Cargar datos en el formulario para editar
  const iniciarEdicion = (producto) => {
    setEditandoId(producto.id);
    setCodigo(producto.codigo);
    setNombre(producto.nombre);
    setCategoria(producto.categoria);
    setMarca(producto.marca);
    setModelo(producto.modelo);
    setAnio(producto.anio);
    setImagenBase64(producto.imagen);
    setErrorImagen('');
  };

  // Cancelar edición y limpiar
  const cancelarEdicion = () => {
    setEditandoId(null);
    setCodigo('');
    setNombre('');
    setCategoria('Frenos');
    setMarca('');
    setModelo('');
    setAnio('');
    setImagenBase64('');
    setErrorImagen('');
  };

  const handleImageChange = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    if (archivo.size > 2 * 1024 * 1024) {
      setErrorImagen('La imagen es muy pesada. Elegí una menor a 2MB.');
      return;
    }

    setErrorImagen('');
    const lector = new FileReader();
    lector.onloadend = () => {
      setImagenBase64(lector.result);
    };
    lector.readAsDataURL(archivo);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const imagenFinal = imagenBase64 || "/logo-peyen.png";

    const datosProducto = {
      codigo,
      nombre,
      categoria,
      marca,
      modelo,
      anio,
      imagen: imagenFinal
    };

    if (editandoId) {
      // Modo Edición
      actualizarProducto(editandoId, datosProducto);
      alert('¡Repuesto modificado con éxito!');
    } else {
      // Modo Alta
      agregarProducto(datosProducto);
      alert('¡Repuesto publicado con éxito!');
    }

    cancelarEdicion();
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem('peyen_admin_auth');
    navigate('/login');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-peyen-blue/10 pb-4 mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-peyen-blue uppercase tracking-tight">
            Panel de Control General
          </h2>
          <p className="text-sm text-slate-500">Modificá el stock, catálogo e imágenes en tiempo real.</p>
        </div>
        <button 
          onClick={handleCerrarSesion}
          className="flex items-center gap-2 bg-slate-200 hover:bg-red-50 hover:text-peyen-red text-slate-700 font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
        >
          <KeyRound size={14} /> Cerrar Sesión
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMNA IZQUIERDA: FORMULARIO DINÁMICO */}
        <div className={`bg-white border rounded-2xl p-6 shadow-xs lg:col-span-5 transition-all ${editandoId ? 'border-peyen-red/40 bg-red-50/5' : 'border-slate-200'}`}>
          <h3 className="text-base font-black text-peyen-blue uppercase tracking-wide mb-4 flex items-center justify-between border-b pb-2">
            <span className="flex items-center gap-2">
              {editandoId ? <Pencil size={18} className="text-peyen-red" /> : <PlusCircle size={18} className="text-peyen-red" />}
              {editandoId ? 'Modificar Repuesto' : 'Nuevo Repuesto'}
            </span>
            {editandoId && (
              <button onClick={cancelarEdicion} className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-[10px] uppercase font-bold cursor-pointer">
                <XCircle size={12} /> Cancelar
              </button>
            )}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Código Único</label>
                <input type="text" placeholder="ej: FR-102" value={codigo} onChange={e => setCodigo(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-hidden focus:border-peyen-blue focus:bg-white" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Categoría</label>
                <select value={categoria} onChange={e => setCategoria(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-hidden focus:border-peyen-blue focus:bg-white h-[34px]">
                  <option value="Frenos">Frenos</option>
                  <option value="Hidráulica">Hidráulica</option>
                  <option value="Embragues">Embragues</option>
                  <option value="Suspensión">Suspensión</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Nombre del Componente</label>
              <input type="text" placeholder="ej: Pastillas de Freno" value={nombre} onChange={e => setNombre(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-hidden focus:border-peyen-blue focus:bg-white" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Marca Auto</label>
                <input type="text" placeholder="ej: Fiat" value={marca} onChange={e => setMarca(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-xs outline-hidden focus:border-peyen-blue focus:bg-white" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Modelo / Motor</label>
                <input type="text" placeholder="ej: Cronos" value={modelo} onChange={e => setModelo(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-xs outline-hidden focus:border-peyen-blue focus:bg-white" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Años (Rango)</label>
                <input type="text" placeholder="ej: 2018-2026" value={anio} onChange={e => setAnio(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-xs outline-hidden focus:border-peyen-blue focus:bg-white" />
              </div>
            </div>

            {/* SECTOR DE IMAGEN */}
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 bg-slate-50/50 flex flex-col items-center justify-center text-center">
              {imagenBase64 ? (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border bg-white group">
                  <img src={imagenBase64} alt="Vista previa" className="w-full h-full object-cover" />
                  <label className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[9px] font-bold transition-opacity cursor-pointer">
                    <Image size={14} className="mb-0.5" />
                    Cambiar foto
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center space-y-1 group">
                  <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-400 group-hover:text-peyen-red transition-colors">
                    <Image size={20} />
                  </div>
                  <span className="text-xs font-bold text-peyen-blue group-hover:underline">Subir imagen</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
              {errorImagen && <p className="text-[10px] text-peyen-red font-bold mt-2">{errorImagen}</p>}
            </div>

            <button type="submit" className={`w-full text-white font-black uppercase tracking-wider py-3 rounded-xl text-xs cursor-pointer transition-colors shadow-sm flex items-center justify-center gap-2 ${editandoId ? 'bg-peyen-red hover:bg-red-700' : 'bg-peyen-blue hover:bg-peyen-blue-dark'}`}>
              {editandoId ? <Save size={14} /> : null}
              {editandoId ? 'Guardar Cambios' : 'Publicar Artículo'}
            </button>
          </form>
        </div>

        {/* COLUMNA DERECHA: LISTADO DE PRODUCTOS CON DOBLE ACCIÓN */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs lg:col-span-7">
          <h3 className="text-base font-black text-peyen-blue uppercase tracking-wide mb-4 border-b pb-2">
            Artículos en Catálogo ({productos.length})
          </h3>

          <div className="divide-y divide-slate-100 max-h-[520px] overflow-y-auto pr-2 space-y-2">
            {productos.map((p) => (
              <div key={p.id} className={`flex items-center justify-between py-2.5 px-2 gap-4 rounded-xl transition-all ${editandoId === p.id ? 'bg-red-50/40 border border-peyen-red/20' : 'border border-transparent'}`}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 bg-slate-50 border rounded-lg overflow-hidden shrink-0">
                    <img src={p.imagen} alt={p.nombre} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-700 px-1 py-0.5 rounded border border-slate-200">
                        {p.codigo}
                      </span>
                      <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider">{p.categoria}</span>
                    </div>
                    <h4 className="text-xs font-bold text-peyen-blue truncate mt-0.5 uppercase">{p.nombre}</h4>
                    <p className="text-[10px] text-slate-400 truncate">Apto: {p.marca} {p.modelo}</p>
                  </div>
                </div>

                {/* Botonera de Acciones */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => iniciarEdicion(p)}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${editandoId === p.id ? 'text-peyen-red bg-red-50' : 'text-slate-400 hover:text-peyen-blue hover:bg-slate-100'}`}
                    title="Editar repuesto"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => eliminarProducto(p.id)}
                    className="p-2 text-slate-400 hover:text-peyen-red hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Eliminar repuesto"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}