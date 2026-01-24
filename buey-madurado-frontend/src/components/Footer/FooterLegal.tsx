// src/components/Footer/FooterLegal.tsx
import { FaBalanceScale, FaFingerprint, FaCookie } from "react-icons/fa";

export default function FooterLegal() {
  return (
    <div className="text-center md:text-left">
      <h3 className="text-amber-500 font-bold text-lg mb-3 uppercase">Legal</h3>
      <ul className="space-y-2 text-sm">
        <li className="flex justify-center md:justify-start items-center gap-2">
          <FaBalanceScale className="text-amber-500" />
          <a className="hover:text-amber-500 transition">Términos y condiciones</a>
        </li>
        <li className="flex justify-center md:justify-start items-center gap-2">
          <FaFingerprint className="text-amber-500" />
          <a className="hover:text-amber-500 transition">Política de privacidad</a>
        </li>
        <li className="flex justify-center md:justify-start items-center gap-2">
          <FaCookie className="text-amber-500" />
          <a className="hover:text-amber-500 transition">Configuración de cookies</a>
        </li>
      </ul>
    </div>
  );
}