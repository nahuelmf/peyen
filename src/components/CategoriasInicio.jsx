import { useNavigate } from 'react-router-dom';

const categorias = [
  { nombre: "CILINDROS BOMBAS", imagen: "https://acdn-us.mitiendanube.com/stores/006/161/290/products/mla1371062370_3-1781cbf6392827c5ca17497012229397-1024-1024.webp", ruta: "CILINDROS BOMBAS" },
  { nombre: "REPARACIONES", imagen: "https://image.made-in-china.com/202f0j00gQBUvMycANuo/Kit-Repair-Brake-Drum-Repair-Kits.webp", ruta: "reparaciones" },
  { nombre: "CALIPER", imagen: "https://www.nitro.pe/images/2017/julio/caliper_caliper.jpg", ruta: "despiece" },
  { nombre: "SERVOS", imagen: "https://somosdakar.com/wp-content/uploads/2022/11/servofreno.png", ruta: "servos" },
  { nombre: "CONEXIONES", imagen: "https://image.made-in-china.com/318f0j00ntaYMSsyhVuf/3-12-2-mp4.webp", ruta: "CONEXIONES" },
  { nombre: "CHAJA", imagen: "https://rafrenfrenos.com.ar/assets/archivos/recortadas/chajafrenos_5ea93619c0_es.webp", ruta: "CHAJA" },
  
];

export default function CategoriasInicio() {
  const navigate = useNavigate();

  return (
    <section className="py-12 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Explorar por Categoría</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categorias.map((cat) => (
          <div 
            key={cat.nombre}
            onClick={() => navigate(`/catalogo?categoria=${cat.ruta}`)}
            className="relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:scale-[1.03] transition-transform duration-300"
          >
            <img src={cat.imagen} alt={cat.nombre} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
              <h3 className="text-white font-bold text-lg">{cat.nombre}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}