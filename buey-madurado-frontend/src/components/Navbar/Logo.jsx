// src/components/Logo.jsx
import logo from "../../assets/images/Logo-Buey.png";
import { Link } from "react-router-dom";

export default function Logo() {

  const handleClick = (e) => {
    // Si ya estamos en home, hacer scroll al inicio
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  };

  return (
    <Link to="/" onClick={handleClick} className="flex items-center">
      {/* Contenedor circular */}
      <div className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-20 justify-center">
        <img 
          src={logo} 
          alt="El Buey Madurado - Home" 
          className="h-14 w-14 sm:h-18 sm:w-18 md:h-22 md:w-22 object-contain"
        />
      </div>
    </Link>
  );
}
