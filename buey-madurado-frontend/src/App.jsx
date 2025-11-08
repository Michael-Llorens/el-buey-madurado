// src/App.jsx
import Navbar from "./components/Navbar";
import ProductoList from "./components/ProductoList";

function App() {
  return (
    <main className="relative min-h-screen bg-gray-100 overflow-x-hidden">
      <Navbar />

      <div className="pt-20"> {/* espacio para navbar fija */}
        <h1 className="text-3xl font-bold text-center py-6 text-amber-900">
          Productos del Buey Madurado
        </h1>
        <ProductoList />
      </div>
    </main>
  );
}

export default App;
