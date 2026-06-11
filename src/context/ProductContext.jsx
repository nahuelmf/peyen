import { createContext, useState, useEffect } from 'react';
import { db } from "../firebase"; 
import { collection, addDoc, getDocs, query, where } from "firebase/firestore"; // Asegúrate de importar esto
export const ProductContext = createContext();

export function ProductProvider({ children }) {
  // Estado de catálogo de repuestos (ahora inicia vacío, se llena con Firebase)
  const [productos, setProductos] = useState([]);

  // Estado de Clientes Mayoristas
  const [usuarios, setUsuarios] = useState([
    { id: "u1", nombreEmpresa: "Distribuidora Warnes", cuit: "20-12345678-9", usuario: "warnes", clave: "123", descuento: 0.40 },
    { id: "u2", nombreEmpresa: "Repuestos Calzada", cuit: "27-98765432-1", usuario: "calzada", clave: "123", descuento: 0.25 }
  ]);

  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [carrito, setCarrito] = useState([]);

  // --- EFECTO: Cargar productos desde Firebase al iniciar ---
useEffect(() => {
  const cargarProductosDesdeFirebase = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "productos"));
      
      const productosFirebase = querySnapshot.docs.map(doc => ({
        id: doc.id, // Este es el ID único de Firebase
        ...doc.data()
      }));

      // Ordenar alfabéticamente/numéricamente por código
      productosFirebase.sort((a, b) => {
        return String(a.codigo).localeCompare(String(b.codigo), undefined, { 
          numeric: true, 
          sensitivity: 'base' 
        });
      });

      setProductos(productosFirebase);
    } catch (error) {
      console.error("Error al cargar productos: ", error);
    }
  };
  cargarProductosDesdeFirebase();
}, []);

  // --- MÉTODOS DE PRODUCTOS ---
const agregarProducto = async (nuevoProducto) => {
  try {
    // 1. Crear una referencia a la colección
    const productosRef = collection(db, "productos");

    // 2. Crear una consulta para buscar si el código ya existe
    const q = query(productosRef, where("codigo", "==", nuevoProducto.codigo));
    const querySnapshot = await getDocs(q);

    // 3. Si querySnapshot.empty es falso, significa que ya existe
    if (!querySnapshot.empty) {
      alert("Error: Ya existe un producto con este código.");
      return; // Cortamos la ejecución aquí
    }

    // 4. Si no existe, procedemos a guardarlo
    const docRef = await addDoc(productosRef, {
      ...nuevoProducto,
      precioBase: nuevoProducto.precioBase || 15000
    });

    setProductos((prev) => [...prev, { ...nuevoProducto, id: docRef.id }]);
    console.log("Producto guardado exitosamente");

  } catch (error) {
    console.error("Error al guardar producto:", error);
  }
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