import { useState, useContext, useMemo } from 'react';
import { ProductContext } from '../context/ProductContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ShoppingCart, LogIn, LogOut, Trash2, Plus, Minus, X, FileDown, Lock, Pencil, ChevronLeft, ChevronRight, Eye 
} from 'lucide-react';
import emailjs from '@emailjs/browser';
import { storage } from '../firebase'; // Asegúrate de que la ruta sea correcta
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Catalogo() {
  const { 
    productos, usuarioLogueado, setUsuarioLogueado,
    carrito, agregarAlCarrito, actualizarCantidad, eliminarDelCarrito, vaciarCarrito 
  } = useContext(ProductContext);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Estados
  const [busqueda, setBusqueda] = useState('');
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [imagenModal, setImagenModal] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [enviandoEmail, setEnviandoEmail] = useState(false);
  
const handleBusquedaChange = (e) => {
  setBusqueda(e.target.value);
  setPaginaActual(1);
};

  const productosPorPagina = 12;
  const categoriaFiltro = searchParams.get('categoria');

  // Cálculos de negocio
  const esAdmin = usuarioLogueado?.role === 'admin';
  const esMayorista = usuarioLogueado?.role === 'cliente';
  const factorDescuento = esMayorista ? (1 - (usuarioLogueado.descuento || 0)) : 1;
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  const subtotalBase = carrito.reduce((sum, item) => sum + ((item.precioBase || 0) * item.cantidad), 0);
  const totalConDescuento = subtotalBase * factorDescuento;

  // Lógica de Filtrado (Combinada)
  const productosFiltrados = useMemo(() => {
    return productos.filter(p => {
      const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                              p.codigo.toLowerCase().includes(busqueda.toLowerCase());
      const coincideCategoria = categoriaFiltro 
        ? p.categoria?.toLowerCase() === categoriaFiltro.toLowerCase() 
        : true;
      return coincideBusqueda && coincideCategoria;
    });
  }, [productos, busqueda, categoriaFiltro]);

  // Lógica de Paginación
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
  const indiceUltimoProducto = paginaActual * productosPorPagina;
  const indicePrimerProducto = indiceUltimoProducto - productosPorPagina;
  const productosPaginaActual = productosFiltrados.slice(indicePrimerProducto, indiceUltimoProducto);

  const obtenerPáginasVisibles = () => {
    const paginas = [];
    const limiteVecinos = 1;
    if (totalPaginas <= 7) {
      for (let i = 1; i <= totalPaginas; i++) paginas.push(i);
    } else {
      paginas.push(1);
      if (paginaActual > 4) paginas.push('...');
      const inicio = Math.max(2, paginaActual - limiteVecinos);
      const fin = Math.min(totalPaginas - 1, paginaActual + limiteVecinos);
      for (let i = inicio; i <= fin; i++) paginas.push(i);
      if (paginaActual < totalPaginas - 3) paginas.push('...');
      paginas.push(totalPaginas);
    }
    return paginas;
  };

  // --- LÓGICA DE PEDIDO ---
  const handleFinalizarPedido = async () => {
    if (carrito.length === 0) return;
    setEnviandoEmail(true);
    try {
      const fechaActual = new Date().toLocaleDateString('es-AR');
      const contenidoCSV = carrito.map(item => 
        `${usuarioLogueado?.codigoCliente || 'S/C'},${fechaActual},${item.codigo},${item.nombre},${item.cantidad}`
      ).join('\n'); 

      const blob = new Blob([contenidoCSV], { type: 'text/csv;charset=utf-8;' });
      const nombreArchivo = `pedidos/Cli_${usuarioLogueado?.codigoCliente || 'sin_id'}_${Date.now()}.csv`;
      const storageRef = ref(storage, nombreArchivo);
      const snapshot = await uploadBytes(storageRef, blob);
      const linkDescarga = await getDownloadURL(snapshot.ref);

      await emailjs.send('service_wi2zsn8', 'template_h31c4cs', {
        empresa: usuarioLogueado?.nombreEmpresa || 'Cliente',
        codigo_cliente: usuarioLogueado?.codigoCliente || 'N/A',
        link_descarga: linkDescarga 
      }, 'uDn8BDDQoU4wkBGIT');

      alert('¡Pedido enviado con éxito!');
      vaciarCarrito();
      setCarritoAbierto(false);
    } catch (err) {
      console.error(err);
      alert('Error al enviar el pedido.');
    } finally {
      setEnviandoEmail(false);
    }
  };
  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans relative">
      <nav className="bg-[#111827] text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black tracking-tight text-white uppercase">PEYEN B2B</h1>
            {esMayorista && (
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                🏢 Distribuidor: {usuarioLogueado.nombreEmpresa} ({usuarioLogueado.descuento * 100}% OFF)
              </p>
            )}
            {esAdmin && <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">⚡ Administrador</p>}
          </div>

          <div className="flex items-center gap-3">
            {esAdmin && (
              <button onClick={() => navigate('/admin')} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[10px] uppercase px-3 py-2 rounded-xl transition-colors cursor-pointer">
                Panel Admin
              </button>
            )}
            {usuarioLogueado && (
              <button onClick={() => setCarritoAbierto(true)} className="relative p-2.5 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-colors cursor-pointer">
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white font-black text-[9px] w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            )}
            {usuarioLogueado ? (
              <button onClick={() => { setUsuarioLogueado(null); vaciarCarrito(); navigate('/login'); }} className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px] uppercase px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer">
                <LogOut size={12} /> Salir
              </button>
            ) : (
              <button onClick={() => navigate('/login')} className="bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs">
                <LogIn size={12} /> Terminal Mayorista
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <input 
            type="text"
            value={busqueda}
            onChange={handleBusquedaChange}
            placeholder="Filtrar catálogo por código de pieza o descripción comercial..."
            className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium text-slate-800 outline-hidden focus:border-slate-400 transition-colors shadow-xs"
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  <th className="py-3.5 px-4 w-12 text-center">Línea</th>
                  <th className="py-3.5 px-4 w-14 text-center">Foto</th>
                  <th className="py-3.5 px-3 w-28">Código</th>
                  <th className="py-3.5 px-3">Descripción / Aplicación</th>
                  <th className="py-3.5 px-3 w-32">Marca Auto</th>
                  <th className="py-3.5 px-4 w-40 text-right">Valores</th>
                  <th className="py-3.5 px-4 w-16 text-center">Pedir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {productosFiltrados.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-12 text-slate-400 font-medium bg-white">No se encontraron piezas.</td></tr>
                ) : (
                  productosPaginaActual.map(p => {
                    const precioLista = p.precioBase || 0;
                    const precioNetoUnitario = precioLista * factorDescuento;
                    return (
                      <tr key={p.id} className="transition-colors hover:bg-slate-50/80 bg-white">
                        <td className="py-3 px-4 text-center">
                          <span className="bg-slate-900 text-white font-mono font-black text-[9px] px-2 py-0.5 rounded-md uppercase">
                            {p.categoria}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-center">
                          <div 
                            onClick={() => setImagenModal({ url: p.imagen, nombre: p.nombre, codigo: p.codigo })}
                            className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 p-0.5 flex items-center justify-center overflow-hidden mx-auto cursor-zoom-in hover:border-blue-500 group relative transition-all"
                          >
                            <img src={p.imagen} alt="" className="max-h-full max-w-full object-contain rounded-md" onError={(e)=>{e.target.src="/logo-peyen.png"}} />
                            <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                              <Eye size={10} />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900 tracking-tight">{p.codigo}</td>
                        <td className="py-3 px-3 font-semibold text-slate-700">{p.nombre}</td>
                        <td className="py-3 px-3 font-bold text-slate-400 uppercase text-[10px] tracking-wider">{p.marca || 'Varios'}</td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          {usuarioLogueado ? (
                            esMayorista ? (
                              <div className="space-y-0.5">
                                <span className="text-[10px] font-bold text-slate-400 line-through block">${precioLista.toLocaleString('es-AR')}</span>
                                <span className="text-xs font-black text-blue-600 block">${precioNetoUnitario.toLocaleString('es-AR')} <span className="text-[9px] font-bold">NETO</span></span>
                              </div>
                            ) : (
                              <span className="text-xs font-black text-slate-900">${precioLista.toLocaleString('es-AR')} <span className="text-[9px] text-slate-400 font-bold">LISTA</span></span>
                            )
                          ) : (
                            <div className="flex justify-end text-slate-400 font-bold text-[10px] items-center gap-1"><Lock size={10} /> <span>Restringido</span></div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {usuarioLogueado ? (
                            esAdmin ? (
                              <button onClick={() => navigate('/admin')} className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg cursor-pointer"><Pencil size={13} /></button>
                            ) : (
                              <button onClick={() => { agregarAlCarrito(p, 1); }} className="bg-slate-950 hover:bg-slate-800 text-white p-1.5 rounded-lg cursor-pointer shadow-xs"><Plus size={12} /></button>
                            )
                          ) : (
                            <button onClick={() => navigate('/login')} className="p-1.5 text-slate-300 hover:text-blue-600 cursor-pointer"><Lock size={13} /></button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {totalPaginas > 1 && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-semibold text-slate-500">
              <div>Mostrando <span className="text-slate-800 font-bold">{indicePrimerProducto + 1}</span> a <span className="text-slate-800 font-bold">{Math.min(indiceUltimoProducto, productosFiltrados.length)}</span> de <span className="text-slate-800 font-bold">{productosFiltrados.length}</span> piezas</div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setPaginaActual(p => Math.max(p - 1, 1))} disabled={paginaActual === 1} className="p-1.5 rounded-xl border bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 cursor-pointer transition-colors"><ChevronLeft size={14} /></button>
                {obtenerPáginasVisibles().map((pag, idx) => (
                  pag === '...' ? <span key={`dots-${idx}`} className="px-2 text-slate-400 font-bold select-none">...</span> :
                  <button key={`page-${pag}`} onClick={() => setPaginaActual(pag)} className={`w-8 h-8 text-xs font-bold rounded-xl transition-all ${paginaActual === pag ? 'bg-blue-600 text-white shadow-xs scale-105' : 'bg-white border text-slate-600 hover:bg-slate-50'}`}>{pag}</button>
                ))}
                <button onClick={() => setPaginaActual(p => Math.min(p + 1, totalPaginas))} disabled={paginaActual === totalPaginas} className="p-1.5 rounded-xl border bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 cursor-pointer transition-colors"><ChevronRight size={14} /></button>
              </div>
            </div>
          )}
        </div>
      </main>

      {imagenModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setImagenModal(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setImagenModal(null)} className="absolute top-3 right-3 bg-slate-100 hover:bg-slate-200 text-slate-500 p-2 rounded-xl cursor-pointer"><X size={16} /></button>
            <div className="aspect-video w-full bg-slate-50 rounded-xl border flex items-center justify-center p-4 overflow-hidden mt-2">
              <img src={imagenModal.url} alt="" className="max-h-full max-w-full object-contain rounded-lg" onError={(e)=>{e.target.src="/logo-peyen.png"}} />
            </div>
            <div className="mt-4">
              <span className="font-mono font-black text-blue-600 text-xs block">{imagenModal.codigo}</span>
              <h3 className="font-bold text-slate-800 text-sm uppercase mt-0.5">{imagenModal.nombre}</h3>
            </div>
          </div>
        </div>
      )}

      {carritoAbierto && usuarioLogueado && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full flex flex-col justify-between shadow-2xl">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-slate-800" />
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Tu Pedido ({totalItems})</h2>
              </div>
              <button onClick={() => setCarritoAbierto(false)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"><X size={16} /></button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-3">
              {carrito.map(item => (
                <div key={item.id} className="flex gap-3 bg-slate-50 border p-2.5 rounded-xl text-xs relative">
                  <div className="flex-1 min-w-0 pr-6">
                    <span className="font-mono font-bold text-slate-900 block text-[11px]">{item.codigo}</span>
                    <p className="font-semibold text-slate-600 truncate">{item.nombre}</p>
                    <span className="text-[11px] font-black text-slate-800 block mt-1">${((item.precioBase || 0) * factorDescuento * item.cantidad).toLocaleString('es-AR')}</span>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 flex items-center border bg-white rounded-lg overflow-hidden">
                    <button onClick={() => actualizarCantidad(item.id, item.cantidad - 1)} className="p-1 hover:bg-slate-50 text-slate-500 cursor-pointer"><Minus size={11} /></button>
                    <span className="px-2 font-bold text-[11px] text-slate-800 min-w-[20px] text-center">{item.cantidad}</span>
                    <button onClick={() => actualizarCantidad(item.id, item.cantidad + 1)} className="p-1 hover:bg-slate-50 text-slate-500 cursor-pointer"><Plus size={11} /></button>
                  </div>
                  <button onClick={() => eliminarDelCarrito(item.id)} className="absolute top-2.5 right-2.5 text-slate-300 hover:text-red-500 cursor-pointer"><Trash2 size={13} /></button>
                </div>
              ))}
            </div>
            <div className="p-4 border-t bg-slate-50/50 space-y-3">
              <div className="space-y-1.5 text-xs">
                {esMayorista && <div className="flex justify-between text-slate-400 font-medium"><span>Subtotal Lista:</span><span>${subtotalBase.toLocaleString('es-AR')}</span></div>}
                {esMayorista && <div className="flex justify-between text-emerald-600 font-bold text-[11px]"><span>Descuento ({usuarioLogueado.descuento * 100}%):</span><span>-${(subtotalBase * usuarioLogueado.descuento).toLocaleString('es-AR')}</span></div>}
                <div className="flex justify-between items-center text-slate-900 font-black pt-1 border-t border-dashed">
                  <span className="uppercase text-[11px]">Total Neto:</span><span className="text-base text-slate-950">${totalConDescuento.toLocaleString('es-AR')}</span>
                </div>
              </div>
              <button 
                onClick={handleFinalizarPedido} 
                disabled={enviandoEmail}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-black uppercase text-xs py-3 rounded-xl tracking-wider flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
              >
                <FileDown size={14} /> {enviandoEmail ? 'Enviando Pedido...' : 'Emitir Orden (Excel)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}