// src/data/menu.ts

export interface MenuItem {
  id: string;
  categoria: "Entrantes" | "Carnes" | "Hamburguesas" | "Postres" | "Bebidas";
  nombre: string;
  descripcion: string;
  precio: string;
  imagen?: string;
  unidad?: boolean;
  detalle?: string;
  incluye?: string;
  tipo?: string;

  // ✅ Nuevo (opcional, solo lo usaremos en Bebidas)
  subcategoria?: "Cervezas" | "Refrescos" | "Vinos";
}

export const menuItems: MenuItem[] = [
  // =========================
  // ENTRANTES FRÍOS Y NO TAN FRÍOS
  // =========================
  {
    id: "ent-1",
    categoria: "Entrantes",
    tipo: "Frío",
    nombre: "Tartar de auténtico buey gallego LYO",
    descripcion:
      "Carne de auténtico buey gallego selección LYO con maduración extrema, fusionado con emulsión de yema y grasa de buey.",
    precio: "24€",
  },
  {
    id: "ent-2",
    categoria: "Entrantes",
    tipo: "Frío",
    nombre: "Trilogía del buey",
    descripcion:
      "Secreto de buey gallego selección LYO con 500 días de maduración, picaña de buey gallego selección LYO con 500 días de maduración y cecina de wagyu.",
    precio: "28€",
  },
  {
    id: "ent-3",
    categoria: "Entrantes",
    tipo: "Frío",
    nombre: "Tabla de picaña",
    descripcion:
      "Picaña de buey selección LYO con 500 días de maduración, atemperada a 60 grados.",
    precio: "28€",
  },
  {
    id: "ent-4",
    categoria: "Entrantes",
    tipo: "Frío",
    nombre: "Tabla de cecina de wagyu",
    descripcion: "Cecina de auténtico wagyu.",
    precio: "27€",
  },
  {
    id: "ent-5",
    categoria: "Entrantes",
    tipo: "Frío",
    nombre: "Rueda de queso",
    descripcion:
      "Queso de leche cruda de oveja con virutas de cecina en su interior.",
    precio: "12€",
  },
  {
    id: "ent-6",
    categoria: "Entrantes",
    tipo: "Frío",
    nombre: "Secreto de buey gallego selección LYO",
    descripcion:
      "Secreto de buey gallego selección LYO con 500 días de maduración.",
    precio: "25€",
    detalle: "150 g",
  },
  {
    id: "ent-7",
    categoria: "Entrantes",
    tipo: "Frío",
    nombre: "Trinchado de wagyu japonés A5 (máxima infiltración)",
    descripcion: "Trinchado de wagyu japonés A5.",
    precio: "27€",
    detalle: "100 g",
  },

  // =========================
  // ENTRANTES (CALIENTES)
  // =========================
  {
    id: "ent-8",
    categoria: "Entrantes",
    tipo: "Entrante",
    nombre: "La croqueta del buey",
    descripcion:
      "Croqueta de cecina de buey con leche de oveja envuelta con cecina de buey, sobre palomitas de torrezno deshidratado. Pídela y nosotros te diremos cómo comértela.\nMínimo 2 unidades.",
    precio: "4€/ud",
    unidad: true,
  },
  {
    id: "ent-9",
    categoria: "Entrantes",
    tipo: "Entrante",
    nombre: "Croquetas de gamba roja al ajillo con kimchi",
    descripcion:
      "Croquetas de gamba roja al ajillo con kimchi. Mínimo 2 unidades.",
    precio: "3€/ud",
    unidad: true,
  },
  {
    id: "ent-10",
    categoria: "Entrantes",
    tipo: "Entrante",
    nombre: "Gyozas de vaca rubia gallega con demiglace",
    descripcion: "Gyozas de vaca rubia gallega con demiglace de Pedro Ximenéz.",
    precio: "12€",
    detalle: "4 unidades",
  },
  {
    id: "ent-11",
    categoria: "Entrantes",
    tipo: "Entrante",
    nombre: "Patatas EL BUEY",
    descripcion:
      "Patata natural, pastrami de vaca madurada premium selección LYO, salsa de trufa negra y queso parmesano.",
    precio: "15€",
  },
  {
    id: "ent-12",
    categoria: "Entrantes",
    tipo: "Entrante",
    nombre: "Buñuelos de vaca madurada",
    descripcion:
      "Masa de buñuelo valenciano relleno de vaca madurada y queso de tetilla con reducción de Pedro Ximénez, 2 unidades.",
    precio: "10€",
    detalle: "2 unidades",
  },
  {
    id: "ent-13",
    categoria: "Entrantes",
    tipo: "Entrante",
    nombre: "Quesadilla de buey gallego",
    descripcion:
      "Carne de buey gallego con 500 días de maduración, salsa de trufa negra, queso parmesano, topping de doritos y foie fresco rallado.",
    precio: "15€",
  },
  {
    id: "ent-14",
    categoria: "Entrantes",
    tipo: "Entrante",
    nombre: "Tentáculos del buey",
    descripcion:
      "Tentáculos de pulpo a la brasa sobre parmentier de patata y kimchi, fusionados con picaña de buey de 500 días de maduración.",
    precio: "28€",
  },
  {
    id: "ent-15",
    categoria: "Entrantes",
    tipo: "Entrante",
    nombre: "Calamar de playa XXL",
    descripcion:
      "Calamar de playa XXL en dos texturas, acompañado con mayonesa de ajo puerro y cecina.",
    precio: "19€",
  },
  {
    id: "ent-16",
    categoria: "Entrantes",
    tipo: "Entrante",
    nombre: "Cesta de panes gourmet.",
    descripcion:
      "Pan de tomate. Pan de cereales. Pan tradicional. Pan de aceitunas.",
    precio: "6€",
  },

  // =========================
  // HAMBURGUESAS
  // =========================
  {
    id: "ham-0",
    categoria: "Hamburguesas",
    tipo: "Suplemento",
    nombre: "Mejora a Carne de Buey 500 Días",
    descripcion:
      "Sustituye la carne de vaca de la hamburguesa por carne de buey madurada 500 días LYO.",
    precio: "5€",
    unidad: true,
  },
    {
    id: "ham-9",
    categoria: "Hamburguesas",
    tipo: "Suplemento",
    nombre: "Carne extra de vaca (200 días)",
    descripcion:
      "Añade 180 g extra de carne de vaca madurada 200 días.",
    precio: "5€",
    unidad: true,
  },
    {
    id: "ham-10",
    categoria: "Hamburguesas",
    tipo: "Suplemento",
    nombre: "Carne extra de buey (500 días)",
    descripcion:
      "Añade 180 g extra de carne de buey madurado 500 días.",
    precio: "8€",
    unidad: true,
  },
  {
    id: "ham-8",
    categoria: "Hamburguesas",
    tipo: "Hamburguesa",
    nombre: "LOS CUÑAOS",
    descripcion:
      "Carne de vaca 150 días y carne de buey 500 días. Mayonesa de tuétano. Secreto de buey gallego 200 días de maduración. Demiglace de buey caramelizada. Queso chedar madurado picante.",
    precio: "20€",
  },
  {
    id: "ham-1",
    categoria: "Hamburguesas",
    tipo: "Hamburguesa",
    nombre: "BÚFALO",
    descripcion:
      "180gr de carne de vaca rubia gallega con +150 días de maduración (selección especial LYO), costilla de vaca rubia gallega, queso ahumado y glaseado de barbacoa de Coca-Cola.",
    precio: "18€",
  },
  {
    id: "ham-2",
    categoria: "Hamburguesas",
    tipo: "Hamburguesa",
    nombre: "EsMMY BUEY",
    descripcion:
      "180gr de carne de vaca rubia gallega con +150 días de maduración (selección especial LYO), cebolla caramelizada, queso ahumado, salsa EMMY, envuelta en picaña de buey gallego con 500 días de maduración.",
    precio: "18€",
  },
  {
    id: "ham-3",
    categoria: "Hamburguesas",
    tipo: "Hamburguesa",
    nombre: "LA SUPREMA",
    descripcion:
      "180gr de carne de vaca rubia gallega con +150 días de maduración (selección especial LYO), cecina de buey, queso de tetilla estilo raclette y mayonesa de ajo puerro y cecina.",
    precio: "18€",
  },
  {
    id: "ham-4",
    categoria: "Hamburguesas",
    tipo: "Hamburguesa",
    nombre: "BUEY",
    descripcion:
      "180gr de carne de vaca rubia gallega con +150 días de maduración (selección especial LYO), pastrami de vaca selección LYO, queso cheddar inglés madurado y crema de trufa negra.",
    precio: "18€",
  },
  {
    id: "ham-5",
    categoria: "Hamburguesas",
    tipo: "Hamburguesa",
    nombre: "DORITOS CHEESE LOVER",
    descripcion:
      "180gr de carne de vaca rubia gallega con +150 días de maduración (selección especial LYO), tortita de queso mozzarella, queso ahumado, crema de queso azul, mayonesa de chili dulce y topping de doritos.",
    precio: "16€",
  },
  {
    id: "ham-6",
    categoria: "Hamburguesas",
    tipo: "Hamburguesa",
    nombre: "CARLOS CATALÁ",
    descripcion:
      "180gr de carne de vaca rubia gallega con +150 días de maduración (selección especial LYO), panceta cocinada a baja temperatura y ahumada, queso ahumado, salsa hotney y relish de pepinillo.",
    precio: "18€",
    detalle: "200 g",
  },
  {
    id: "ham-7",
    categoria: "Hamburguesas",
    tipo: "Hamburguesa",
    nombre: "👑 The Golden Burger",
    descripcion:
      "180gr de auténtico buey gallego (cárnicas LYO) con maduración extrema de 500 días, auténtico wagyu japonés A5, queso ahumado, toque de mayonesa yakitori con grasa de vaca madurada, brioche envuelto en oro de 24k.",
    precio: "28€",
    detalle: "200 g",
  },

  // =========================
  // CARNES
  // =========================
  {
    id: "car-1",
    categoria: "Carnes",
    nombre: "Entrecot de vaca rubia gallega (50 días de maduración)",
    descripcion: "Entrecot de vaca rubia gallega con 50 días de maduración.",
    precio: "28€",
    detalle: "300–350 g",
  },
  {
    id: "car-2",
    categoria: "Carnes",
    nombre: "Entrecot Old Especial Beef PREMIUM (70 días de maduración)",
    descripcion:
      "Entrecot Old Especial Beef PREMIUM con 70 días de maduración.",
    precio: "38€",
    detalle: "300–350 g",
  },
  {
    id: "car-3",
    categoria: "Carnes",
    nombre: "Entrecot buey de wagyu",
    descripcion: "Entrecot exclusivo hasta fin de existencias. 500gr aprox.",
    precio: "50€",
    detalle: "50€",
  },
  {
    id: "car-4",
    categoria: "Carnes",
    nombre: "Chuletón GOLD (50 días)",
    descripcion:
      "Chuletón de vaca Simmental con 50 días de maduración. Selección especial Juan Navarro.",
    precio: "70€/kg",
    detalle: "€/kg",
  },
  {
    id: "car-5",
    categoria: "Carnes",
    nombre: "Chuletón ESMERALDA (90 días)",
    descripcion:
      "Chuletón de vaca rubia gallega con 90 días de maduración. Selección especial Juan Navarro.",
    precio: "100€/kg",
    detalle: "€/kg",
  },
  {
    id: "car-6",
    categoria: "Carnes",
    nombre: "Chuletón DIAMANTE TOP (150 días)",
    descripcion:
      "Chuletón de vaca Simmental con 150 días de maduración. Selección especial Juan Navarro.",
    precio: "120€/kg",
    detalle: "€/kg",
  },

  // POSTRES
  // =========================
  {
    id: "pos-1",
    categoria: "Postres",
    nombre: "Tarta de queso con cazalla y naranja",
    descripcion:
      "⭐ Tarta del mes de marzo · Tarta de queso con cazalla y naranja con topping de chocolate blanco.",
    precio: "7.5€",
  },
  {
    id: "pos-2",
    categoria: "Postres",
    nombre: "Tarta de queso Kinder",
    descripcion: "Base cremosa con el inconfundible sabor a chocolate Kinder.",
    precio: "7.5€",
  },
  {
    id: "pos-3",
    categoria: "Postres",
    nombre: "Tarta de queso Donuts",
    descripcion: "Inspirada en el clásico Donuts, dulce y sorprendente.",
    precio: "7.5€",
  },
  {
    id: "pos-4",
    categoria: "Postres",
    nombre: "Tarta de queso Nutella",
    descripcion:
      "Base cremosa con el intenso e irresistible sabor de Nutella.",
    precio: "7.5€",
  },
  // =========================
  // BEBIDAS
  // =========================

  // 🍺 CERVEZAS
  {
    id: "beb-cer-1",
    categoria: "Bebidas",
    subcategoria: "Cervezas",
    nombre: "Founders Porter",
    descripcion: "Cerveza negra.",
    precio: "4,30€",
  },
  {
    id: "beb-cer-2",
    categoria: "Bebidas",
    subcategoria: "Cervezas",
    nombre: "Mahou Maestra Doble Lúpulo",
    descripcion: "",
    precio: "3,20€",
  },
  {
    id: "beb-cer-3",
    categoria: "Bebidas",
    subcategoria: "Cervezas",
    nombre: "Mahou Barrica Bourbon",
    descripcion: "",
    precio: "4,30€",
  },
  {
    id: "beb-cer-4",
    categoria: "Bebidas",
    subcategoria: "Cervezas",
    nombre: "Mahou 5 Estrellas",
    descripcion: "",
    precio: "2,80€",
  },
  {
    id: "beb-cer-5",
    categoria: "Bebidas",
    subcategoria: "Cervezas",
    nombre: "Mahou 0,0 Tostada",
    descripcion: "",
    precio: "2,80€",
  },
  {
    id: "beb-cer-6",
    categoria: "Bebidas",
    subcategoria: "Cervezas",
    nombre: "Mahou Sin Gluten",
    descripcion: "",
    precio: "2,80€",
  },
  {
    id: "beb-cer-7",
    categoria: "Bebidas",
    subcategoria: "Cervezas",
    nombre: "Mahou Radler",
    descripcion: "",
    precio: "2,80€",
  },
  {
    id: "beb-cer-8",
    categoria: "Bebidas",
    subcategoria: "Cervezas",
    nombre: "Mahou Rosé (fresa)",
    descripcion: "",
    precio: "3,20€",
  },

  // 🥤 REFRESCOS & AGUAS
  {
    id: "beb-ref-1",
    categoria: "Bebidas",
    subcategoria: "Refrescos",
    nombre: "Agua",
    descripcion: "",
    precio: "2,20€",
  },
  {
    id: "beb-ref-2",
    categoria: "Bebidas",
    subcategoria: "Refrescos",
    nombre: "Agua con gas",
    descripcion: "",
    precio: "2,50€",
  },
  {
    id: "beb-ref-3",
    categoria: "Bebidas",
    subcategoria: "Refrescos",
    nombre: "Refrescos",
    descripcion: "",
    precio: "2,80€",
  },
  {
    id: "beb-ref-4",
    categoria: "Bebidas",
    subcategoria: "Refrescos",
    nombre: "Tónica Royal Bliss",
    descripcion: "",
    precio: "2,50€",
  },
  {
    id: "beb-ref-5",
    categoria: "Bebidas",
    subcategoria: "Refrescos",
    nombre: "Tónica Royal Bliss Berry",
    descripcion: "",
    precio: "2,50€",
  },

  // 🍷 VINOS
  // Copas
  {
    id: "beb-vin-1",
    categoria: "Bebidas",
    subcategoria: "Vinos",
    tipo: "Copa",
    nombre: "Vino Portia Verdejo (Rueda)",
    descripcion: "Copa, blanco.",
    precio: "3,50€",
  },
  {
    id: "beb-vin-2",
    categoria: "Bebidas",
    subcategoria: "Vinos",
    tipo: "Copa",
    nombre: "Vino Mucho Más",
    descripcion: "Copa, tinto",
    precio: "3,50€",
  },

  // Botella - Blanco
  {
    id: "beb-vin-3",
    categoria: "Bebidas",
    subcategoria: "Vinos",
    tipo: "Blanco",
    nombre: "Castillo de Miraflores (Verdejo)",
    descripcion: "Botella, blanco.",
    precio: "16€",
  },
  {
    id: "beb-vin-4",
    categoria: "Bebidas",
    subcategoria: "Vinos",
    tipo: "Blanco",
    nombre: "Quinta do Sil (Godello)",
    descripcion: "Botella, blanco.",
    precio: "22€",
  },
  {
    id: "beb-vin-5",
    categoria: "Bebidas",
    subcategoria: "Vinos",
    tipo: "Blanco",
    nombre: "Gran Bazán Etiqueta Verde (Albariño)",
    descripcion: "D.O. Rías Baixas · 100% Albariño · Botella, blanco.",
    precio: "25€",
  },

  // Botella - Tinto
  {
    id: "beb-vin-9",
    categoria: "Bebidas",
    subcategoria: "Vinos",
    tipo: "Tinto",
    nombre: "Bordón (Crianza)",
    descripcion: "Rioja · Botella, tinto.",
    precio: "16€",
  },
  {
    id: "beb-vin-8",
    categoria: "Bebidas",
    subcategoria: "Vinos",
    tipo: "Tinto",
    nombre: "Álvarez Nölting",
    descripcion: "Utiel, Requena · Botella, tinto.",
    precio: "28€",
  },
  {
    id: "beb-vin-7",
    categoria: "Bebidas",
    subcategoria: "Vinos",
    tipo: "Tinto",
    nombre: "Abadía San Quirce (Crianza)",
    descripcion: "Ribera del Duero · Botella, tinto.",
    precio: "30€",
  },
  {
    id: "beb-vin-6",
    categoria: "Bebidas",
    subcategoria: "Vinos",
    tipo: "Tinto",
    nombre: "Pago de Fuentecojo",
    descripcion: "Ribera del Duero · Tempranillo 2021 · Botella, tinto.",
    precio: "28€",
  },
  {
    id: "beb-vin-10",
    categoria: "Bebidas",
    subcategoria: "Vinos",
    tipo: "Tinto",
    nombre: "BAI GORRI 2023",
    descripcion: "Rioja · Botella, tinto.",
    precio: "35€",
  },
  {
    id: "beb-vin-13",
    categoria: "Bebidas",
    subcategoria: "Vinos",
    tipo: "Tinto",
    nombre: "Bordón Reserva",
    descripcion: "Rioja · Botella, tinto.",
    precio: "35€",
  },
  {
    id: "beb-vin-11",
    categoria: "Bebidas",
    subcategoria: "Vinos",
    tipo: "Tinto",
    nombre: "Valparaíso Raíces",
    descripcion: "Ribera del Duero · Botella, tinto.",
    precio: "45€",
  },
  {
    id: "beb-vin-12",
    categoria: "Bebidas",
    subcategoria: "Vinos",
    tipo: "Tinto",
    nombre: "Pálpito",
    descripcion: "Bodegas Franco Españolas · Botella, tinto.",
    precio: "60€",
  },
  {
    id: "beb-vin-15",
    categoria: "Bebidas",
    subcategoria: "Vinos",
    tipo: "Tinto",
    nombre: "Clio 2023",
    descripcion: "Juan Gil Jumilla · Botella, tinto.",
    precio: "75€",
  },
  {
    id: "beb-vin-14",
    categoria: "Bebidas",
    subcategoria: "Vinos",
    tipo: "Tinto",
    nombre: "Macán Clásico 2021",
    descripcion: "Rioja · Botella, tinto.",
    precio: "95€",
  },
  {
    id: "beb-vin-16",
    categoria: "Bebidas",
    subcategoria: "Vinos",
    tipo: "Tinto",
    nombre: "El Nido 2023",
    descripcion: "Juan Gil Jumilla· Botella, tinto.",
    precio: "180€",
  },
  {
    id: "beb-vin-17",
    categoria: "Bebidas",
    subcategoria: "Vinos",
    tipo: "Tinto",
    nombre: "Vega Sicilia UNICO 2015",
    descripcion: "Botella, tinto.",
    precio: "475€",
  },
];

export const getMenuByCategory = (categoria: MenuItem["categoria"]) => {
  return menuItems.filter((item) => item.categoria === categoria);
};

export const getMenuItemById = (id: string) => {
  return menuItems.find((item) => item.id === id);
};
