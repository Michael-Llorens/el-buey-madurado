import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./Pages/Home";
import Carta from "./Pages/Carta";
import SobreNosotros from "./Pages/SobreNosotros";
import Contacto from "./Pages/Contacto";

import WhatsAppButton from "./components/WhatsAppButton";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <Router>
      <main className="relative min-h-screen bg-[#160a00] overflow-x-hidden">
        <Navbar />

        <div className="pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/carta" element={<Carta />} />
            <Route path="/sobrenosotros" element={<SobreNosotros />} />
            <Route path="/contacto" element={<Contacto />} />
          </Routes>
        </div>
      </main>
      <WhatsAppButton />
      <Footer />
    </Router>

  );
}

export default App;
