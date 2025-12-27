import joseImg from "../../assets/images/equipo-jose.png";
import mariaImg from "../../assets/images/equipo-maria.jpg";
import carlosImg from "../../assets/images/equipo-carlos.jpg";

export default function Equipo() {
  const team = [
    { name: "Jose Pérez", role: "Chef especializado en carnes", image: joseImg },
    { name: "María López", role: "Responsable de maduración", image: mariaImg },
    { name: "Carlos Ruiz", role: "Sous Chef", image: carlosImg },
  ];

  return (
    <section className="w-full py-16 flex flex-col items-center">
      <h2 className="text-4xl md:text-5xl font-heading text-amber-300 mb-12">
        Nuestro equipo
      </h2>
      <div className="max-w-6xl w-full px-6 grid sm:grid-cols-2 md:grid-cols-3 gap-8">
        {team.map((member) => (
          <div key={member.name} className="flex flex-col items-center text-center">
            <div className="w-64 h-64 rounded-2xl overflow-hidden shadow-lg mb-4">
              <img
                src={member.image.src}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-amber-300 text-xl font-semibold">{member.name}</h3>
            <p className="text-white">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}