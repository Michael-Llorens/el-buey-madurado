// lib/menu.ts
export interface MenuItem {
  id: string;
  categoria: "Entrantes" | "Carnes" | "Sándwich y hamburguesas" | "Postres";
  nombre: string;
  descripcion: string;
  precio: number;
  imagen?: string;
  unidad?: boolean;
  detalle?: string;
  incluye?: string;
  tipo?: string;
}

export const menuItems: MenuItem[] = [
  // ENTRANTES
  {
    id: "ent-1",
    categoria: "Entrantes",
    nombre: "Picaña de auténtico buey gallego",
    descripcion:
      "Tabla de picaña de auténtico buey gallego con 500 días de maduración con foie fresco rallado.",
    precio: 28,
  },
  {
    id: "ent-2",
    categoria: "Entrantes",
    nombre: "Tabla de cecina",
    descripcion:
      "Cecina Black angus madurada y curada durante 2 años y ahumada con leña de encina acompañada de trufa negra rallada y queso parmesano.",
    precio: 18,
  },
  {
    id: "ent-3",
    categoria: "Entrantes",
    nombre: "Quesadilla de vaca rubia gallega",
    descripcion:
      "Carne con 120 días de maduración, queso rallado, crema de trufa negra, foie fresco rallado y topping de doritos.",
    precio: 13,
  },
  {
    id: "ent-4",
    categoria: "Entrantes",
    nombre: "Patatas EL BUEY",
    descripcion:
      "Patatas con pastrami premium LYO, salsa de trufa negra y queso parmesano curado.",
    precio: 12,
  },
  {
    id: "ent-5",
    categoria: "Entrantes",
    nombre: "Buñuelos de vaca madurada con queso de tetilla",
    descripcion: "Buñuelos de vaca madurada con queso de tetilla.",
    precio: 5,
    unidad: true,
  },
  {
    id: "ent-6",
    categoria: "Entrantes",
    nombre: "Gyozas de chuletón de vaca rubia gallega",
    descripcion: "Gyozas de chuletón de vaca rubia gallega.",
    precio: 12,
    detalle: "4 unidades",
  },
  {
    id: "ent-7",
    categoria: "Entrantes",
    nombre: "Tartar de solomillo de vaca rubia gallega",
    descripcion:
      "Solomillo selección LYO 70 días de maduración con alcaparras, pepinillos, mostaza en grano y emulsión de yema de huevo con grasa de vaca rubia gallega.",
    precio: 17,
  },
  {
    id: "ent-8",
    categoria: "Entrantes",
    nombre: "Pan bao",
    descripcion:
      "Pan bao negro de costilla de vaca rubia gallega con 70 días de maduración cocinada a baja temperatura.",
    precio: 6,
    unidad: true,
  },

  // CARNES
  {
    id: "car-1",
    categoria: "Carnes",
    nombre: "Solomillo de vaca rubia gallega",
    descripcion:
      "Selección LYO con 70 días de maduración con foie y reducción de Pedro Ximénez sobre tulipa de pan brioche.",
    precio: 29,
  },
  {
    id: "car-2",
    categoria: "Carnes",
    nombre: "Entrecot de vaca madurada",
    descripcion: "Entrecot de vaca madurada.",
    precio: 25,
    detalle: "350 g",
  },
  {
    id: "car-3",
    categoria: "Carnes",
    nombre: "Chuletón de vaca rubia gallega madurada",
    descripcion: "Cortes de 1 kg.",
    precio: 50,
    detalle: "€/kg",
  },

  // SÁNDWICH Y HAMBURGUESAS
  {
    id: "san-1",
    categoria: "Sándwich y hamburguesas",
    nombre: "Sándwich el buey",
    descripcion:
      "Pan New York roll, pastrami de vaca madurada premium con queso gallego Arzúa Ulloa, rúcula y mayonesa de ajo puerro.",
    precio: 12,
    tipo: "Sándwich",
  },
  {
    id: "san-2",
    categoria: "Sándwich y hamburguesas",
    nombre: "Sándwich gallego",
    descripcion:
      "Pan New York roll, entrecot de vaca rubia gallega, queso de tetilla al estilo raclette, salsa de trufa negra y mermelada de bacon.",
    precio: 12,
    tipo: "Sándwich",
  },

  // Hamburguesas
  {
    id: "ham-1",
    categoria: "Sándwich y hamburguesas",
    nombre: "Cheese Lover",
    descripcion:
      "200 g de vaca rubia gallega selección LYO con queso azul, queso edam, salsa de gorgonzola, mayonesa de chili dulce y topping de doritos.",
    precio: 14,
    tipo: "Hamburguesa",
  },
  {
    id: "ham-2",
    categoria: "Sándwich y hamburguesas",
    nombre: "Buffalo",
    descripcion:
      "200 g de vaca rubia gallega, carne de costilla de vaca madurada a baja temperatura, queso cheddar ahumado y glaseado de barbacoa con Coca-Cola.",
    precio: 16,
    tipo: "Hamburguesa",
  },
  {
    id: "ham-3",
    categoria: "Sándwich y hamburguesas",
    nombre: "Emmy",
    descripcion:
      "200 g de vaca rubia gallega, queso cheddar ahumado, cebolla caramelizada y salsa Emmy casera.",
    precio: 15,
    tipo: "Hamburguesa",
  },
  {
    id: "ham-4",
    categoria: "Sándwich y hamburguesas",
    nombre: "La Pistacha",
    descripcion:
      "200 g de vaca rubia gallega, mermelada de guanciale, burrata, pesto de pistachos y topping de pistachos.",
    precio: 15,
    tipo: "Hamburguesa",
  },
  {
    id: "ham-5",
    categoria: "Sándwich y hamburguesas",
    nombre: "La Suprema",
    descripcion:
      "200 g de vaca rubia gallega, queso de tetilla, cecina Black Angus curada 2 años y mayonesa de ajo puerro con cecina.",
    precio: 15,
    tipo: "Hamburguesa",
  },
  {
    id: "ham-6",
    categoria: "Sándwich y hamburguesas",
    nombre: "El Buey",
    descripcion:
      "200 g de vaca rubia gallega, pastrami de vaca madurada, queso cheddar inglés madurado y una suave capa de crema de trufa.",
    precio: 16,
    tipo: "Hamburguesa",
  },

  // POSTRES
  {
    id: "pos-1",
    categoria: "Postres",
    nombre: "Tarta de queso tradicional",
    descripcion: "Acompañada de kinder bueno o pistacho, a tu gusto.",
    precio: 6,
  },
  {
    id: "pos-2",
    categoria: "Postres",
    nombre: "Tarta de queso de Donuts",
    descripcion: "Tarta de queso de Donuts.",
    precio: 7.5,
  },
  {
    id: "pos-3",
    categoria: "Postres",
    nombre: "Tarta de queso de la Pantera Rosa",
    descripcion: "Tarta de queso de la Pantera Rosa",
    precio: 7.5,
  },
  {
    id: "pos-4",
    categoria: "Postres",
    nombre: "Tarta de queso de Twix",
    descripcion: "Tarta de queso de Twix.",
    precio: 7.5,
  },
  {
    id: "pos-5",
    categoria: "Postres",
    nombre: "Tarta de queso de Oreo",
    descripcion: "Tarta de queso de Oreo.",
    precio: 7.5,
  },
];

export const getMenuByCategory = (categoria: MenuItem["categoria"]) => {
  return menuItems.filter((item) => item.categoria === categoria);
};

export const getMenuItemById = (id: string) => {
  return menuItems.find((item) => item.id === id);
};