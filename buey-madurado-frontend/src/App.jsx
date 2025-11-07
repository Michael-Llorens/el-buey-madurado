import ProductoList from "./components/ProductoList";

function App() {
  return (
    <main className="min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center py-6 text-amber-900">
        Productos del Buey Madurado
      </h1>
      <ProductoList />
    </main>
  );
}

export default App;
