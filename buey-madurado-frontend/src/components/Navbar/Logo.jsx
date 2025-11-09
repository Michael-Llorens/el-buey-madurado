import { images } from "../../assets/images";

export default function Logo() {
  return (
    <div className="flex items-center space-x-2">
      {/* Contenedor circular con fondo blanco */}
      <div className="h-13 w-13 rounded-full bg-white flex items-center justify-center overflow-hidden">
        <img src={images.logo} alt="El Buey Madurado" className="h-12 w-12 object-contain" />
      </div>

      {/* Texto del logo */}
      <span className="text-xl font-bold text-amber-400">El Buey Madurado</span>
    </div>
  );
}