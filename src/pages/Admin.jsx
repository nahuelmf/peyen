import { useState, useContext, useRef } from 'react';
import { ProductContext } from '../context/ProductContext';
import { useNavigate } from 'react-router-dom';
import { 
  Trash2, Image as ImageIcon, Pencil, XCircle, FileSpreadsheet, UserPlus, ChevronLeft, ChevronRight 
} from 'lucide-react';
import * as XLSX from 'xlsx';

export default function Admin() {
  const { 
    productos, agregarProducto, actualizarProducto, eliminarProducto,
    usuarios, agregarUsuario, usuarioLogueado, setUsuarioLogueado, actualizarUsuario
  } = useContext(ProductContext);
  
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // CONTROL DE SEGURIDAD
  if (!usuarioLogueado || usuarioLogueado.role !== 'admin') {
    return (
      <div className="p-8 text-center text-xs font-bold uppercase text-red-600 bg-red-50 min-h-screen flex flex-col justify-center items-center gap-2">
        ⚠️ Acceso Denegado. Se requieren privilegios de administración corporativa.
        <button onClick={() => navigate('/login')} className="mt-4 bg-slate-900 text-white font-black text-[11px] px-5 py-2.5 rounded-xl cursor-pointer">Ir al Portal de Login</button>
      </div>
    );
  }

  const [pestañaPanel, setPestañaPanel] = useState('repuestos');

  // Estados del Formulario (Ahora incluye precioBase)
  const [editandoId, setEditandoId] = useState(null);
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('CHAJA');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('Universal');
  const [anio, setAnio] = useState('Universal');
  const [precioBase, setPrecioBase] = useState('15000'); // <--- NUEVO CAMPO DE PRECIO
  const [imagenUrl, setImagenUrl] = useState('/logo-peyen.png');

  const [cargandoExcel, setCargandoExcel] = useState(false);
  const [busquedaAdmin, setBusquedaAdmin] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 8;

  // Estados comerciales
const [nombreEmpresa, setNombreEmpresa] = useState('');
const [cuit, setCuit] = useState('');
const [codigoCliente, setCodigoCliente] = useState(''); // Nuevo
const [usuarioReg, setUsuarioReg] = useState('');
const [claveReg, setClaveReg] = useState('');
const [descuentoPorcentaje, setDescuentoPorcentaje] = useState('30');
const [editandoUsuarioId, setEditandoUsuarioId] = useState(null);

  // Lógica de carga Base64
  const handleSeleccionarImagen = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    const lector = new FileReader();
    lector.readAsDataURL(archivo);
    lector.onloadend = () => { setImagenUrl(lector.result); };
  };

  const handleEliminarImagen = () => {
    setImagenUrl('/logo-peyen.png');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Carga Manual / Guardado de Cambios de precios
  const handleIniciarEdicion = (p) => {
    setEditandoId(p.id);
    setCodigo(p.codigo);
    setNombre(p.nombre);
    setCategoria(p.categoria);
    setMarca(p.marca);
    setModelo(p.modelo || 'Universal');
    setAnio(p.anio || 'Universal');
    setPrecioBase(String(p.precioBase || 15000)); // Carga el precio actual al editar
    setImagenUrl(p.imagen || '/logo-peyen.png');
  };

  const handleCancelarEdicion = () => {
    setEditandoId(null);
    setCodigo(''); setNombre(''); setMarca(''); setModelo('Universal'); setAnio('Universal'); setPrecioBase('15000'); setImagenUrl('/logo-peyen.png');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmitProducto = (e) => {
    e.preventDefault();
    const datosProducto = { 
      codigo: codigo.trim(), 
      nombre: nombre.trim(), 
      categoria, 
      marca: marca.trim() || 'Varios', 
      modelo, 
      anio, 
      imagen: imagenUrl, 
      precioBase: parseFloat(precioBase) || 0 // Guarda el precio modificado
    };

    if (editandoId) {
      actualizarProducto(editandoId, datosProducto);
      setEditandoId(null);
      alert('¡Mantenimiento de repuesto finalizado con éxito!');
    } else {
      agregarProducto({ id: `p-${Date.now()}`, ...datosProducto });
      alert('¡Repuesto insertado manualmente!');
    }
    setCodigo(''); setNombre(''); setMarca(''); setModelo('Universal'); setAnio('Universal'); setPrecioBase('15000'); setImagenUrl('/logo-peyen.png');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Importación desde Planilla Excel
  const handleImportarExcel = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    setCargandoExcel(true);
    const lector = new FileReader();
    lector.readAsArrayBuffer(archivo);
    lector.onload = (evento) => {
      try {
        const datosBinarios = evento.target.result;
        const libro = XLSX.read(datosBinarios, { type: 'buffer' });
        const hoja = libro.Sheets[libro.SheetNames[0]];
        const filasJson = XLSX.utils.sheet_to_json(hoja);
        let productosCargados = 0;
        
        filasJson.forEach((fila, idx) => {
          const codigoRaw = fila['Identificador'] || fila['identificador'] || '';
          const nombreRaw = fila['Descripción 1'] || fila['descripcion 1'] || '';
          const lineaRaw = fila['Línea'] || fila['linea'] || 'Varios';
          const marcaRaw = fila['Marca'] || fila['marca'] || 'Varios';
          const precioRaw = fila['Precio'] || fila['precio'] || fila['Precio Lista'] || 15000; // Lee precio si viene en el Excel
          
          let rubroLimpio = String(lineaRaw).trim();
          if (rubroLimpio.includes('-')) rubroLimpio = rubroLimpio.split('-')[1].trim();

          const nuevoProd = { 
            id: `${String(codigoRaw).trim()}-${idx}`, 
            codigo: String(codigoRaw).trim(), 
            nombre: String(nombreRaw).trim(), 
            categoria: rubroLimpio, 
            marca: String(marcaRaw).trim(), 
            modelo: 'Universal', 
            anio: 'Universal', 
            imagen: "/logo-peyen.png", 
            precioBase: parseFloat(precioRaw) || 15000 
          };
          
          if (nuevoProd.codigo && nuevoProd.nombre) { 
            agregarProducto(nuevoProd); 
            productosCargados++; 
          }
        });
        setPaginaActual(1);
        alert(`¡Espectacular! Se inyectaron ${productosCargados} repuestos al sistema.`);
      } catch (err) { 
        alert('Error al procesar el archivo Excel.'); 
      } finally { 
        setCargandoExcel(false); 
        e.target.value = '';
      }
    };
  };

const handleSubmitUsuario = (e) => {
  e.preventDefault();
  
  // Debug: Mira qué ID está intentando actualizar
  console.log("Editando ID:", editandoUsuarioId); 
  console.log("Datos a enviar:", { nombreEmpresa, cuit, codigoCliente, /*... resto ...*/ });

if (editandoUsuarioId) {
    actualizarUsuario(editandoUsuarioId, { 
      nombreEmpresa, 
      cuit, 
      codigoCliente, 
      usuario: usuarioReg.toLowerCase().trim(), 
      clave: claveReg, 
      descuento: parseFloat(descuentoPorcentaje) / 100 
    });
    alert('Distribuidor actualizado correctamente.');
    setEditandoUsuarioId(null);
  } else {
    agregarUsuario(datosUsuario);
    alert('Distribuidor creado.');
  }

  // Limpiar campos
  setNombreEmpresa(''); setCuit(''); setCodigoCliente(''); setUsuarioReg(''); setClaveReg(''); setDescuentoPorcentaje('30');
};

const handleIniciarEdicionUsuario = (u) => {
  setEditandoUsuarioId(u.id);
  setNombreEmpresa(u.nombreEmpresa);
  setCuit(u.cuit);
  setCodigoCliente(u.codigoCliente || '');
  setUsuarioReg(u.usuario);
  setClaveReg(u.clave);
  setDescuentoPorcentaje((u.descuento * 100).toString());
};

  // Filtrado y armado de páginas
  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busquedaAdmin.toLowerCase()) || 
    p.codigo.toLowerCase().includes(busquedaAdmin.toLowerCase())
  );

  const indiceUltimoProducto = paginaActual * productosPorPagina;
  const indicePrimerProducto = indiceUltimoProducto - productosPorPagina;
  const productosPaginaActual = productosFiltrados.slice(indicePrimerProducto, indiceUltimoProducto);
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-slate-50 min-h-screen">
      
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Mantenimiento de Catálogo de Productos</h2>
        <button onClick={() => { setUsuarioLogueado(null); navigate('/login'); }} className="bg-white border text-slate-700 font-bold px-4 py-2 rounded-xl text-xs uppercase cursor-pointer hover:bg-slate-100">Cerrar Módulo</button>
      </div>

      <div className="flex gap-2 border-b pb-4 mb-6">
        <button onClick={() => setPestañaPanel('repuestos')} className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase cursor-pointer ${pestañaPanel === 'repuestos' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 border'}`}>📦 Catálogo de Productos</button>
        <button onClick={() => setPestañaPanel('usuarios')} className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase cursor-pointer ${pestañaPanel === 'usuarios' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 border'}`}>👥 Cuentas y Descuentos</button>
      </div>

      {pestañaPanel === 'repuestos' ? (
        <div>
          {/* Volcado Masivo */}
          <div className="bg-white border rounded-2xl p-4 shadow-xs mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><FileSpreadsheet size={20} /></div>
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase">Volcado Masivo de Catálogo</h4>
                <p className="text-[11px] text-slate-400">Poblá el listado de repuestos de manera masiva mediante un archivo Excel.</p>
              </div>
            </div>
            <label className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase px-5 py-2.5 rounded-xl cursor-pointer transition-colors shadow-xs">
              {cargandoExcel ? 'Procesando Planilla...' : 'Cargar Excel'}
              <input type="file" accept=".xlsx, .xls, .csv" onChange={handleImportarExcel} className="hidden" />
            </label>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* FORMULARIO DE ALTA / MODIFICACIÓN */}
            <div className="bg-white border rounded-2xl p-5 lg:col-span-5 shadow-xs">
              <h3 className="text-xs font-black uppercase text-slate-900 mb-4 pb-2 border-b flex justify-between items-center">
                <span>DATOS DEL REPUESTO</span>
                {editandoId && (
                  <button type="button" onClick={handleCancelarEdicion} className="text-[10px] text-red-500 font-bold uppercase flex items-center gap-0.5 hover:underline"><XCircle size={11} /> Cancelar</button>
                )}
              </h3>
              <form onSubmit={handleSubmitProducto} className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Código</label>
                    <input type="text" value={codigo} onChange={(e)=>setCodigo(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold" placeholder="F03212" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Precio Lista ($)</label>
                    <input type="number" value={precioBase} onChange={(e)=>setPrecioBase(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-blue-600" placeholder="15000" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Descripción 1</label>
                  <input type="text" value={nombre} onChange={(e)=>setNombre(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold" placeholder="Brake Pad..." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Marca</label>
                    <input type="text" value={marca} onChange={(e)=>setMarca(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs uppercase" placeholder="Marca" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Línea</label>
                    <input type="text" value={categoria} onChange={(e)=>setCategoria(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs uppercase" placeholder="Línea" />
                  </div>
                </div>

                {/* Multimedia */}
                <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                  <span className="block text-[10px] font-black uppercase text-slate-800 tracking-wide">Imagen del Producto</span>
                  <div className="flex items-center justify-between gap-4">
                    <div className="w-16 h-16 rounded-xl border bg-slate-50 flex items-center justify-center p-1 overflow-hidden shrink-0">
                      <img src={imagenUrl} alt="Preview" className="w-full h-full object-cover rounded-lg" onError={(e)=>{e.target.src="/logo-peyen.png"}} />
                    </div>
                    <div className="flex gap-2 w-full justify-end">
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"><Pencil size={12} /> Editar Imagen</button>
                      <button type="button" onClick={handleEliminarImagen} className="px-3 py-2 bg-white border border-red-100 text-red-500 rounded-xl text-[11px] font-bold hover:bg-red-50 flex items-center gap-1.5 cursor-pointer"><Trash2 size={12} /> Eliminar</button>
                    </div>
                  </div>
                  <input type="file" ref={fileInputRef} accept="image/*" onChange={handleSeleccionarImagen} className="hidden" />
                </div>

                <button type="submit" className="w-full bg-[#111827] text-white font-black uppercase text-xs py-3 rounded-xl tracking-wider hover:bg-slate-800 transition-colors cursor-pointer">GUARDAR CAMBIOS</button>
              </form>
            </div>

            {/* TABLA DE PRODUCTOS (Muestra y permite seleccionar para cambiar precios) */}
            <div className="bg-white border rounded-2xl lg:col-span-7 shadow-xs overflow-hidden">
              <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-white">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">LISTADO DE PRODUCTOS</h3>
                <input type="text" value={busquedaAdmin} onChange={(e) => { setBusquedaAdmin(e.target.value); setPaginaActual(1); }} placeholder="Filtrar por código o descripción..." className="bg-slate-50 border rounded-xl px-3 py-1.5 text-xs w-full sm:w-64 font-medium outline-hidden" />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      <th className="py-3 px-4 w-12 text-center">Foto</th>
                      <th className="py-3 px-3">Código</th>
                      <th className="py-3 px-3">Descripción</th>
                      <th className="py-3 px-3">Precio Lista</th> {/* <--- COLUMNA VISUAL EN TABLA */}
                      <th className="py-3 px-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {productosPaginaActual.length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-10 text-slate-400 font-medium bg-white">No hay repuestos activos.</td></tr>
                    ) : (
                      productosPaginaActual.map(p => (
                        <tr key={p.id} className={`transition-colors bg-white hover:bg-slate-50/60 ${editandoId === p.id ? 'bg-amber-50/40' : ''}`}>
                          <td className="py-2.5 px-4">
                            <div className="w-10 h-10 rounded-lg bg-slate-50 border p-0.5 flex items-center justify-center overflow-hidden mx-auto">
                              <img src={p.imagen} alt="" className="w-full h-full object-cover rounded-md" onError={(e)=>{e.target.src="/logo-peyen.png"}} />
                            </div>
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{p.codigo}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-700 max-w-[180px] truncate">{p.nombre}</td>
                          <td className="py-2.5 px-3 font-bold text-blue-600">${(p.precioBase || 0).toLocaleString('es-AR')}</td> {/* <--- PRECIO RENDERIZADO */}
                          <td className="py-2.5 px-4 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1">
                              <button onClick={() => handleIniciarEdicion(p)} className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg cursor-pointer"><Pencil size={13} /></button>
                              <button onClick={() => eliminarProducto(p.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 size={13} /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {totalPaginas > 1 && (
  <div className="flex justify-center items-center gap-2 py-6 border-t border-slate-200 mt-6 bg-white w-full">
    
    {/* Botón Anterior */}
    <button 
      onClick={() => setPaginaActual(p => Math.max(p - 1, 1))} 
      disabled={paginaActual === 1}
      className="flex items-center px-3 py-1 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
    >
      Anterior
    </button>

    {/* Indicador de páginas */}
    <div className="flex items-center gap-1 mx-2">
      <span className="text-sm font-semibold text-slate-700">
        Pág. {paginaActual} de {totalPaginas}
      </span>
    </div>

    {/* Botón Siguiente */}
    <button 
      onClick={() => setPaginaActual(p => Math.min(p + 1, totalPaginas))} 
      disabled={paginaActual === paginaActual === totalPaginas}
      className="flex items-center px-3 py-1 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
    >
      Siguiente
    </button>
  </div>
)}
            </div>

          </div>
        </div>
      ) : (
        /* VISTA DE USUARIOS */
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* FORMULARIO DE ALTA / EDICIÓN */}
          <div className="bg-white border rounded-2xl p-5 lg:col-span-5 shadow-sm">
            <h3 className="text-xs font-black uppercase text-slate-800 mb-3 flex justify-between items-center">
              <span className="flex items-center gap-2">
                <UserPlus size={14} className="text-blue-600" /> 
                {editandoUsuarioId ? 'Editar Distribuidor' : 'Crear Acceso Distribuidor'}
              </span>
              {editandoUsuarioId && (
                <button onClick={() => { setEditandoUsuarioId(null); setNombreEmpresa(''); setCuit(''); setCodigoCliente(''); setUsuarioReg(''); setClaveReg(''); setDescuentoPorcentaje('30'); }} className="text-[10px] text-red-500 font-bold uppercase underline cursor-pointer">Cancelar</button>
              )}
            </h3>
            
            <form onSubmit={handleSubmitUsuario} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Razón Social</label>
                <input type="text" value={nombreEmpresa} onChange={(e)=>setNombreEmpresa(e.target.value)} required className="w-full bg-slate-50 border rounded-xl px-3 py-1.5 text-xs" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">CUIT</label><input type="text" value={cuit} onChange={(e)=>setCuit(e.target.value)} required className="w-full bg-slate-50 border rounded-xl px-3 py-1.5 text-xs" /></div>
                <div><label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Código Cliente</label><input type="text" value={codigoCliente} onChange={(e)=>setCodigoCliente(e.target.value)} required className="w-full bg-slate-50 border rounded-xl px-3 py-1.5 text-xs font-mono font-bold" /></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Usuario</label><input type="text" value={usuarioReg} onChange={(e)=>setUsuarioReg(e.target.value)} required className="w-full bg-slate-50 border rounded-xl px-3 py-1.5 text-xs" /></div>
                <div><label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Clave</label><input type="password" value={claveReg} onChange={(e)=>setClaveReg(e.target.value)} required className="w-full bg-slate-50 border rounded-xl px-3 py-1.5 text-xs" /></div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Bonificación (%)</label>
                <div className="relative flex items-center"><input type="number" min="0" max="90" value={descuentoPorcentaje} onChange={(e)=>setDescuentoPorcentaje(e.target.value)} required className="w-full bg-slate-50 border rounded-xl px-3 py-1.5 text-xs font-bold text-blue-600" /><span className="absolute right-3 text-[10px] font-bold text-slate-400">% OFF</span></div>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-black uppercase text-xs py-2.5 rounded-xl cursor-pointer hover:bg-blue-700 transition-colors">
                {editandoUsuarioId ? 'Guardar Cambios' : 'Habilitar Mayorista'}
              </button>
            </form>
          </div>

          {/* LISTADO DE USUARIOS */}
          <div className="bg-white border rounded-2xl p-5 lg:col-span-7 shadow-sm">
            <h3 className="text-xs font-black uppercase text-slate-800 mb-3">Distribución Mayorista Activa ({usuarios.length})</h3>
            <div className="space-y-2 max-h-[350px] overflow-y-auto">
              {usuarios.map(u => (
                <div key={u.id} className="flex justify-between items-center p-3 border rounded-xl bg-slate-50/50 text-xs hover:border-blue-200 transition-colors">
                  <div className="cursor-pointer flex-1" onClick={() => handleIniciarEdicionUsuario(u)}>
                    <p className="font-bold text-slate-800">{u.nombreEmpresa} <span className="text-blue-400">✎</span></p>
                    <p className="text-[10px] text-slate-400">
                      Cód: <span className="font-mono font-bold text-blue-600">{u.codigoCliente}</span> | 
                      User: <span className="font-mono">{u.usuario}</span>
                    </p>
                  </div>
                  <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-md text-[10px]">{u.descuento * 100}% OFF</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}