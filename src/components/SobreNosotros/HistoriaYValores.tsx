import historiaImg from "../../assets/images/sobre-nosotros.jpg";

export default function HistoriaYValores() {
  return (
    <section className="w-full py-32 px-6 max-w-4xl mx-auto text-center">
      <h2 className="text-4xl md:text-5xl font-heading text-amber-300 mb-10">
        Nuestra historia
      </h2>

      <p className="text-white leading-relaxed mb-6">
        Todo empezó con una idea sencilla: respetar la carne.
        Elegir bien el origen, esperar el tiempo necesario
        y tratar cada pieza como única.
      </p>

      <p className="text-white leading-relaxed mb-12">
        No creemos en atajos ni en modas.
        Creemos en el fuego, en la paciencia
        y en el sabor auténtico.
      </p>

      <img
        src={historiaImg.src}
        alt="Nuestra cocina"
        className="mx-auto rounded-xl shadow-lg mb-12"
      />

      <div className="flex justify-center gap-10 uppercase tracking-widest text-amber-300 text-sm">
        <span>Origen</span>
        <span>Tiempo</span>
        <span>Respeto</span>
        <span>Fuego</span>
      </div>
    </section>
  );
}
