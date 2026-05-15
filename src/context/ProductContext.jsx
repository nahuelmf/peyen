import { createContext, useState, useEffect } from 'react';
import productosIniciales from '../data/productos.json';

export const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [productos, setProductos] = useState(() => {
    const guardados = localStorage.getItem('peyen_productos');
    return guardados ? JSON.parse(guardados) : productosIniciales;
  });

  const [busquedaGlobal, setBusquedaGlobal] = useState('');

  useEffect(() => {
    localStorage.setItem('peyen_productos', JSON.stringify(productos));
  }, [productos]);

  const agregarProducto = (nuevoProducto) => {
    setProductos((prev) => [
      ...prev,
      { ...nuevoProducto, id: Date.now() }
    ]);
  };

  // NUEVO: Función para actualizar un repuesto existente
  const actualizarProducto = (id, productoEditado) => {
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...productoEditado } : p))
    );
  };

  const eliminarProducto = (id) => {
    if (window.confirm('¿Estás seguro de que querés eliminar este repuesto del catálogo?')) {
      setProductos((prev) => prev.filter(p => p.id !== id));
    }
  };

  return (
    <ProductContext.Provider value={{ productos, agregarProducto, actualizarProducto, eliminarProducto, busquedaGlobal, setBusquedaGlobal }}>
      {children}
    </ProductContext.Provider>
  );
}