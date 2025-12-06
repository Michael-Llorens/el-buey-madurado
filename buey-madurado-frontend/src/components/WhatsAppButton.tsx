export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/34670775786"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-8 right-5 w-12 h-12 z-[1000] transition-transform duration-300 hover:scale-110"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
        className="w-full h-full object-contain drop-shadow-md"
      />
    </a>
  );
}