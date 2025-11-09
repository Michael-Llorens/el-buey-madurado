import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./Pages/Home";
import Carta from "./Pages/Carta";

function App() {
  return (
    <Router>
      <main className="relative min-h-screen bg-amber-950 overflow-x-hidden">
        <Navbar />

        <div className="pt-20">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/carta" element={<Carta />} />
          </Routes>
        </div>
      </main>
    </Router>
  );
}

export default App;
