import { createContext, useState } from 'react';


export const ProductContext = createContext();

export function ProductProvider({ children }) {
  // Estado de catálogo de repuestos
  const [productos, setProductos] = useState([
    {
      id: "100-init",
      codigo: "100",
      nombre: "PROTECTOR CUBETA BOMBA 3/4'' - FIAT 600",
      categoria: "CHAJA",
      marca: "FIAT",
      modelo: "Universal",
      anio: "Universal",
      imagen: "/logo-peyen.png",
      precioBase: 12500
    }
  ]);

  // Estado de Clientes Mayoristas
  const [usuarios, setUsuarios] = useState([
    { id: "u1", nombreEmpresa: "Distribuidora Warnes", cuit: "20-12345678-9", usuario: "warnes", clave: "123", descuento: 0.40 },
    { id: "u2", nombreEmpresa: "Repuestos Calzada", cuit: "27-98765432-1", usuario: "calzada", clave: "123", descuento: 0.25 }
  ]);

  // Almacena el usuario/admin activo en la pestaña (null = público general)
  const [usuarioLogueado, setUsuarioLogueado] = useState(null); 

  // ESTADO DEL CARRITO DE COMPRAS
  const [carrito, setCarrito] = useState([]);

  // --- MÉTODOS DE PRODUCTOS ---
  const agregarProducto = (nuevoProducto) => {
    setProductos((prevProductos) => {
      const yaExiste = prevProductos.some(
        (p) => p.codigo.toLowerCase() === nuevoProducto.codigo.toLowerCase()
      );
      if (yaExiste) return prevProductos;
      return [...prevProductos, { ...nuevoProducto, precioBase: nuevoProducto.precioBase || 15000 }];
    });
  };

  const actualizarProducto = (id, productoActualizado) => {
    setProductos((prevProductos) =>
      prevProductos.map((p) => (p.id === id || p.codigo === id ? { ...p, ...productoActualizado } : p))
    );
  };

  const eliminarProducto = (id) => {
    setProductos((prevProductos) => prevProductos.filter((p) => p.id !== id));
  };

  // --- MÉTODOS DE CLIENTES ---
  const agregarUsuario = (nuevoUsuario) => {
    setUsuarios((prevUsuarios) => [...prevUsuarios, { id: `u-${Date.now()}`, ...nuevoUsuario }]);
  };

  const eliminarUsuario = (id) => {
    setUsuarios((prevUsuarios) => prevUsuarios.filter((u) => u.id !== id));
  };

const actualizarUsuario = (id, datosActualizados) => {
    setUsuarios((prevUsuarios) =>
      prevUsuarios.map((u) => (u.id === id ? { ...u, ...datosActualizados } : u))
    );
    console.log("Usuario actualizado localmente con éxito");
  };
  // --- MÉTODOS DEL CARRITO ---
  const agregarAlCarrito = (producto, cantidad = 1) => {
    setCarrito((prevCarrito) => {
      const existe = prevCarrito.find((item) => item.id === producto.id);
      if (existe) {
        return prevCarrito.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + cantidad } : item
        );
      }
      return [...prevCarrito, { ...producto, cantidad }];
    });
  };

  const actualizarCantidad = (id, cantidad) => {
    if (cantidad <= 0) {
      eliminarDelCarrito(id);
      return;
    }
    setCarrito((prevCarrito) =>
      prevCarrito.map((item) => (item.id === id ? { ...item, cantidad } : item))
    );
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prevCarrito) => prevCarrito.filter((item) => item.id !== id));
  };

  const vaciarCarrito = () => setCarrito([]);

  return (
    <ProductContext.Provider
      value={{
        productos,
        agregarProducto,
        actualizarProducto,
        eliminarProducto,
        usuarios,
        agregarUsuario,
        eliminarUsuario,
        usuarioLogueado,
        setUsuarioLogueado,
        carrito,
        agregarAlCarrito,
        actualizarCantidad,
        eliminarDelCarrito,
        vaciarCarrito,
        actualizarUsuario,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}