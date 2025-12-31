export default function FooterBottom() {
  const year = new Date().getFullYear();
  return (
    <div className="text-center text-xs text-gray-500 pb-4">
      © <span className="text-amber-500 font-semibold">El Buey Madurado</span> — No es delivery, es experiencia gastronómica. {year}
    </div>
  );
}
