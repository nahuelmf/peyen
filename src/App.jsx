import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import Admin from './pages/Admin';
import BotonWhatsApp from './components/BotonWhatsApp';
import LoginClientes from './pages/LoginClientes'; // Importación obligatoria


export default function App() {
  return (
    <ProductProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased">
          
          {/* Barra de navegación superior fija */}
          <Navbar />

          <BotonWhatsApp />

          {/* Contenedor dinámico de las páginas */}
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalogo" element={<Catalogo />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
              {/* RUTA ÚNICA DE ACCESO */}
          <Route path="/login" element={<Login />} />
          <Route path="/login-clientes" element={<LoginClientes />} /> {/* Enlace de entrada */}
            </Routes>
          </main>

          {/* Pie de página institucional */}
          <footer className="bg-slate-900 text-slate-400 py-6 text-center text-sm border-t border-slate-800">
            &copy; {new Date().getFullYear()} Peyen Repuestos. Todos los derechos reservados.
          </footer>

        </div>
      </Router>
    </ProductProvider>
  );
}