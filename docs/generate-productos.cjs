const fs = require('fs');
const ingredientes = JSON.parse(fs.readFileSync('docs/bueyMaduradoDB.ingredientes.json', 'utf-8'));

const ing = {};
ingredientes.forEach(i => { ing[i.nombre] = i._id.$oid; });

const oid = (nombre) => {
  const id = ing[nombre];
  if (!id) console.error('NOT FOUND:', nombre);
  return { "$oid": id };
};

const ref = (nombre, cantidad, unidad) => ({
  ingrediente: oid(nombre),
  cantidad,
  unidad: unidad || 'gramos'
});

const productos = [
  // === ENTRANTES FRÍOS ===
  { nombre: "Tartar de auténtico buey gallego LYO", descripcion: "Carne de auténtico buey gallego selección LYO con maduración extrema, fusionado con emulsión de yema y grasa de buey.", precio: 24, categoria: "Entrantes",
    ingredientes: [ref("Carne de buey gallego LYO (maduración extrema 500 días)", 150), ref("Yema de huevo", 1, "unidades"), ref("Grasa de buey", 15)],
    permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },

  { nombre: "Trilogía del buey", descripcion: "Secreto de buey gallego selección LYO con 500 días de maduración, picaña de buey gallego selección LYO con 500 días de maduración y cecina de wagyu.", precio: 28, categoria: "Entrantes",
    ingredientes: [ref("Secreto de buey gallego LYO (500 días)", 80), ref("Picaña de buey gallego LYO (500 días)", 80), ref("Cecina de wagyu", 60)],
    permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },

  { nombre: "Tabla de picaña", descripcion: "Picaña de buey selección LYO con 500 días de maduración, atemperada a 60 grados.", precio: 28, categoria: "Entrantes",
    ingredientes: [ref("Picaña de buey gallego LYO (500 días)", 200)],
    permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },

  { nombre: "Tabla de cecina de wagyu", descripcion: "Cecina de auténtico wagyu.", precio: 27, categoria: "Entrantes",
    ingredientes: [ref("Cecina de wagyu", 180)],
    permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },

  { nombre: "Rueda de queso", descripcion: "Queso de leche cruda de oveja con virutas de cecina en su interior.", precio: 12, categoria: "Entrantes",
    ingredientes: [ref("Queso de leche cruda de oveja", 200), ref("Cecina de buey", 30)],
    permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },

  { nombre: "Secreto de buey gallego selección LYO", descripcion: "Secreto de buey gallego selección LYO con 500 días de maduración. 150g.", precio: 25, categoria: "Entrantes",
    ingredientes: [ref("Secreto de buey gallego LYO (500 días)", 150)],
    permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },

  { nombre: "Trinchado de wagyu japonés A5", descripcion: "Trinchado de wagyu japonés A5 (máxima infiltración). 100g.", precio: 27, categoria: "Entrantes",
    ingredientes: [ref("Wagyu japonés A5", 100)],
    permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },

  // === ENTRANTES CALIENTES ===
  { nombre: "La croqueta del buey", descripcion: "Croqueta de cecina de buey con leche de oveja envuelta con cecina de buey, sobre palomitas de torrezno deshidratado. Mínimo 2 unidades.", precio: 4, categoria: "Entrantes",
    ingredientes: [ref("Masa de croqueta de cecina", 1, "unidades"), ref("Cecina de buey", 20), ref("Palomitas de torrezno deshidratado", 15)],
    permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },

  { nombre: "Croquetas de gamba roja al ajillo con kimchi", descripcion: "Croquetas de gamba roja al ajillo con kimchi. Mínimo 2 unidades.", precio: 3, categoria: "Entrantes",
    ingredientes: [ref("Masa de croqueta de gamba roja", 1, "unidades"), ref("Kimchi", 10)],
    permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },

  { nombre: "Gyozas de vaca rubia gallega con demiglace", descripcion: "Gyozas de vaca rubia gallega con demiglace de Pedro Ximénez. 4 unidades.", precio: 12, categoria: "Entrantes",
    ingredientes: [ref("Masa de gyoza", 4, "unidades"), ref("Vaca madurada (para buñuelos/gyozas)", 120), ref("Demiglace de Pedro Ximénez", 30, "ml")],
    permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },

  { nombre: "Patatas EL BUEY", descripcion: "Patata natural, pastrami de vaca madurada premium selección LYO, salsa de trufa negra y queso parmesano.", precio: 15, categoria: "Entrantes",
    ingredientes: [ref("Patata natural", 300), ref("Pastrami de vaca madurada LYO", 50), ref("Salsa de trufa negra", 20, "ml"), ref("Queso parmesano", 20)],
    permitirPersonalizacion: true, permitirExtras: true, permitirRemover: true },

  { nombre: "Buñuelos de vaca madurada", descripcion: "Masa de buñuelo valenciano relleno de vaca madurada y queso de tetilla con reducción de Pedro Ximénez. 2 unidades.", precio: 10, categoria: "Entrantes",
    ingredientes: [ref("Masa de buñuelo valenciano", 2, "unidades"), ref("Vaca madurada (para buñuelos/gyozas)", 60), ref("Queso de tetilla", 30), ref("Reducción de Pedro Ximénez", 20, "ml")],
    permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },

  { nombre: "Quesadilla de buey gallego", descripcion: "Carne de buey gallego con 500 días de maduración, salsa de trufa negra, queso parmesano, topping de doritos y foie fresco rallado.", precio: 15, categoria: "Entrantes",
    ingredientes: [ref("Tortilla de trigo (quesadilla)", 1, "unidades"), ref("Carne de buey gallego LYO (maduración extrema 500 días)", 80), ref("Salsa de trufa negra", 20, "ml"), ref("Queso parmesano", 20), ref("Doritos (topping)", 15), ref("Foie fresco", 20)],
    permitirPersonalizacion: true, permitirExtras: true, permitirRemover: true },

  { nombre: "Tentáculos del buey", descripcion: "Tentáculos de pulpo a la brasa sobre parmentier de patata y kimchi, fusionados con picaña de buey de 500 días de maduración.", precio: 28, categoria: "Entrantes",
    ingredientes: [ref("Pulpo", 200), ref("Parmentier de patata", 100), ref("Kimchi", 30), ref("Picaña de buey gallego LYO (500 días)", 40)],
    permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },

  { nombre: "Calamar de playa XXL", descripcion: "Calamar de playa XXL en dos texturas, acompañado con mayonesa de ajo puerro y cecina.", precio: 19, categoria: "Entrantes",
    ingredientes: [ref("Calamar de playa XXL", 300), ref("Mayonesa de ajo puerro y cecina", 30, "ml")],
    permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },

  { nombre: "Cesta de panes gourmet", descripcion: "Pan de tomate. Pan de cereales. Pan tradicional. Pan de aceitunas.", precio: 6, categoria: "Entrantes",
    ingredientes: [ref("Pan de tomate", 1, "unidades"), ref("Pan de cereales", 1, "unidades"), ref("Pan tradicional", 1, "unidades"), ref("Pan de aceitunas", 1, "unidades")],
    permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },

  // === HAMBURGUESAS ===
  { nombre: "LOS CUÑAOS", descripcion: "Carne de vaca 150 días y carne de buey 500 días. Mayonesa de tuétano. Secreto de buey gallego 200 días. Demiglace de buey caramelizada. Queso cheddar madurado picante.", precio: 20, categoria: "Hamburguesas",
    ingredientes: [ref("Carne de vaca rubia gallega LYO (+150 días)", 90), ref("Carne de buey gallego LYO (maduración extrema 500 días)", 90), ref("Pan brioche", 1, "unidades"), ref("Mayonesa de tuétano", 20, "ml"), ref("Secreto de buey gallego (200 días)", 40), ref("Demiglace de buey caramelizada", 20, "ml"), ref("Queso cheddar madurado picante", 30)],
    permitirPersonalizacion: true, permitirExtras: true, permitirRemover: true },

  { nombre: "BÚFALO", descripcion: "180g de carne de vaca rubia gallega con +150 días de maduración, costilla de vaca rubia gallega, queso ahumado y glaseado de barbacoa de Coca-Cola.", precio: 18, categoria: "Hamburguesas",
    ingredientes: [ref("Carne de vaca rubia gallega LYO (+150 días)", 180), ref("Pan brioche", 1, "unidades"), ref("Costilla de vaca rubia gallega", 50), ref("Queso ahumado", 30), ref("Glaseado de barbacoa de Coca-Cola", 20, "ml")],
    permitirPersonalizacion: true, permitirExtras: true, permitirRemover: true },

  { nombre: "EsMMY BUEY", descripcion: "180g de carne de vaca rubia gallega, cebolla caramelizada, queso ahumado, salsa EMMY, envuelta en picaña de buey gallego con 500 días de maduración.", precio: 18, categoria: "Hamburguesas",
    ingredientes: [ref("Carne de vaca rubia gallega LYO (+150 días)", 180), ref("Pan brioche", 1, "unidades"), ref("Cebolla caramelizada", 30), ref("Queso ahumado", 30), ref("Salsa EMMY", 20, "ml"), ref("Picaña de buey gallego LYO (500 días)", 30)],
    permitirPersonalizacion: true, permitirExtras: true, permitirRemover: true },

  { nombre: "LA SUPREMA", descripcion: "180g de carne de vaca rubia gallega, cecina de buey, queso de tetilla estilo raclette y mayonesa de ajo puerro y cecina.", precio: 18, categoria: "Hamburguesas",
    ingredientes: [ref("Carne de vaca rubia gallega LYO (+150 días)", 180), ref("Pan brioche", 1, "unidades"), ref("Cecina de buey", 30), ref("Queso de tetilla", 40), ref("Mayonesa de ajo puerro y cecina", 20, "ml")],
    permitirPersonalizacion: true, permitirExtras: true, permitirRemover: true },

  { nombre: "BUEY", descripcion: "180g de carne de vaca rubia gallega, pastrami de vaca selección LYO, queso cheddar inglés madurado y crema de trufa negra.", precio: 18, categoria: "Hamburguesas",
    ingredientes: [ref("Carne de vaca rubia gallega LYO (+150 días)", 180), ref("Pan brioche", 1, "unidades"), ref("Pastrami de vaca madurada LYO", 40), ref("Queso cheddar inglés madurado", 30), ref("Salsa de trufa negra", 20, "ml")],
    permitirPersonalizacion: true, permitirExtras: true, permitirRemover: true },

  { nombre: "DORITOS CHEESE LOVER", descripcion: "180g de carne de vaca rubia gallega, tortita de queso mozzarella, queso ahumado, crema de queso azul, mayonesa de chili dulce y topping de doritos.", precio: 16, categoria: "Hamburguesas",
    ingredientes: [ref("Carne de vaca rubia gallega LYO (+150 días)", 180), ref("Pan brioche", 1, "unidades"), ref("Queso mozzarella", 40), ref("Queso ahumado", 20), ref("Crema de queso azul", 15), ref("Mayonesa de chili dulce", 20, "ml"), ref("Doritos (topping)", 15)],
    permitirPersonalizacion: true, permitirExtras: true, permitirRemover: true },

  { nombre: "CARLOS CATALÁ", descripcion: "180g de carne de vaca rubia gallega, panceta ahumada a baja temperatura, queso ahumado, salsa hotney y relish de pepinillo.", precio: 18, categoria: "Hamburguesas",
    ingredientes: [ref("Carne de vaca rubia gallega LYO (+150 días)", 180), ref("Pan brioche", 1, "unidades"), ref("Panceta ahumada baja temperatura", 40), ref("Queso ahumado", 30), ref("Salsa hotney", 20, "ml"), ref("Relish de pepinillo", 20, "ml")],
    permitirPersonalizacion: true, permitirExtras: true, permitirRemover: true },

  { nombre: "The Golden Burger", descripcion: "180g de auténtico buey gallego con maduración extrema de 500 días, auténtico wagyu japonés A5, queso ahumado, mayonesa yakitori con grasa de vaca madurada, brioche envuelto en oro de 24k.", precio: 28, categoria: "Hamburguesas",
    ingredientes: [ref("Carne de buey gallego LYO (maduración extrema 500 días)", 180), ref("Pan brioche envuelto en oro 24k", 1, "unidades"), ref("Wagyu japonés A5", 30), ref("Queso ahumado", 30), ref("Mayonesa yakitori con grasa de vaca madurada", 20, "ml"), ref("Oro comestible 24k (lámina)", 1, "unidades")],
    permitirPersonalizacion: true, permitirExtras: true, permitirRemover: true },

  // === CARNES ===
  { nombre: "Entrecot de vaca rubia gallega (50 días)", descripcion: "Entrecot de vaca rubia gallega con 50 días de maduración. 300-350g.", precio: 28, categoria: "Carnes",
    ingredientes: [ref("Carne de vaca rubia gallega (50 días)", 325)],
    permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },

  { nombre: "Entrecot Old Especial Beef PREMIUM (70 días)", descripcion: "Entrecot Old Especial Beef PREMIUM con 70 días de maduración. 300-350g.", precio: 38, categoria: "Carnes",
    ingredientes: [ref("Vaca Old Especial Beef PREMIUM (70 días)", 325)],
    permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },

  { nombre: "Entrecot buey de wagyu", descripcion: "Entrecot exclusivo hasta fin de existencias. 500g aprox.", precio: 50, categoria: "Carnes",
    ingredientes: [ref("Entrecot de buey wagyu", 500)],
    permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },

  { nombre: "Chuletón GOLD (50 días)", descripcion: "Chuletón de vaca Simmental con 50 días de maduración. Selección especial Juan Navarro. Precio por kg.", precio: 70, categoria: "Carnes",
    ingredientes: [ref("Vaca Simmental (50 días)", 1000)],
    permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },

  { nombre: "Chuletón ESMERALDA (90 días)", descripcion: "Chuletón de vaca rubia gallega con 90 días de maduración. Selección especial Juan Navarro. Precio por kg.", precio: 100, categoria: "Carnes",
    ingredientes: [ref("Vaca rubia gallega (90 días)", 1000)],
    permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },

  { nombre: "Chuletón DIAMANTE TOP (150 días)", descripcion: "Chuletón de vaca Simmental con 150 días de maduración. Selección especial Juan Navarro. Precio por kg.", precio: 120, categoria: "Carnes",
    ingredientes: [ref("Vaca Simmental (150 días)", 1000)],
    permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },

  // === POSTRES ===
  { nombre: "Tarta de queso con cazalla y naranja", descripcion: "Tarta del mes de marzo. Tarta de queso con cazalla y naranja con topping de chocolate blanco.", precio: 7.5, categoria: "Postres",
    ingredientes: [ref("Base de tarta de queso", 1, "unidades"), ref("Cazalla y naranja", 30, "ml"), ref("Topping de chocolate blanco", 20)],
    permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },

  { nombre: "Tarta de queso Kinder", descripcion: "Base cremosa con el inconfundible sabor a chocolate Kinder.", precio: 7.5, categoria: "Postres",
    ingredientes: [ref("Base de tarta de queso", 1, "unidades"), ref("Topping de chocolate Kinder", 30)],
    permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },

  { nombre: "Tarta de queso Donuts", descripcion: "Inspirada en el clásico Donuts, dulce y sorprendente.", precio: 7.5, categoria: "Postres",
    ingredientes: [ref("Base de tarta de queso", 1, "unidades"), ref("Topping de Donuts", 30)],
    permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },

  { nombre: "Tarta de queso Nutella", descripcion: "Base cremosa con el intenso e irresistible sabor de Nutella.", precio: 7.5, categoria: "Postres",
    ingredientes: [ref("Base de tarta de queso", 1, "unidades"), ref("Topping de Nutella", 30)],
    permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },

  // === BEBIDAS - Cervezas ===
  { nombre: "Founders Porter", descripcion: "Cerveza negra.", precio: 4.3, categoria: "Bebidas", ingredientes: [], permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },
  { nombre: "Mahou Maestra Doble Lúpulo", descripcion: "Cerveza.", precio: 3.2, categoria: "Bebidas", ingredientes: [], permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },
  { nombre: "Mahou Barrica Bourbon", descripcion: "Cerveza.", precio: 4.3, categoria: "Bebidas", ingredientes: [], permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },
  { nombre: "Mahou 5 Estrellas", descripcion: "Cerveza.", precio: 2.8, categoria: "Bebidas", ingredientes: [], permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },
  { nombre: "Mahou 0,0 Tostada", descripcion: "Cerveza sin alcohol.", precio: 2.8, categoria: "Bebidas", ingredientes: [], permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },
  { nombre: "Mahou Sin Gluten", descripcion: "Cerveza sin gluten.", precio: 2.8, categoria: "Bebidas", ingredientes: [], permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },
  { nombre: "Mahou Radler", descripcion: "Cerveza con limón.", precio: 2.8, categoria: "Bebidas", ingredientes: [], permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },
  { nombre: "Mahou Rosé (fresa)", descripcion: "Cerveza con fresa.", precio: 3.2, categoria: "Bebidas", ingredientes: [], permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },

  // === BEBIDAS - Refrescos ===
  { nombre: "Agua", descripcion: "Agua mineral.", precio: 2.2, categoria: "Bebidas", ingredientes: [], permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },
  { nombre: "Agua con gas", descripcion: "Agua con gas.", precio: 2.5, categoria: "Bebidas", ingredientes: [], permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },
  { nombre: "Refrescos", descripcion: "Coca-Cola, Fanta, etc.", precio: 2.8, categoria: "Bebidas", ingredientes: [], permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },
  { nombre: "Tónica Royal Bliss", descripcion: "Tónica premium.", precio: 2.5, categoria: "Bebidas", ingredientes: [], permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },
  { nombre: "Tónica Royal Bliss Berry", descripcion: "Tónica con frutos rojos.", precio: 2.5, categoria: "Bebidas", ingredientes: [], permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },

  // === BEBIDAS - Vinos Copas ===
  { nombre: "Vino Portia Verdejo (Rueda)", descripcion: "Copa, blanco.", precio: 3.5, categoria: "Bebidas", ingredientes: [], permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },
  { nombre: "Vino Mucho Más", descripcion: "Copa, tinto.", precio: 3.5, categoria: "Bebidas", ingredientes: [], permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },

  // === BEBIDAS - Vinos Blancos ===
  { nombre: "Castillo de Miraflores (Verdejo)", descripcion: "Botella, blanco.", precio: 16, categoria: "Bebidas", ingredientes: [], permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },
  { nombre: "Quinta do Sil (Godello)", descripcion: "Botella, blanco.", precio: 22, categoria: "Bebidas", ingredientes: [], permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },
  { nombre: "Gran Bazán Etiqueta Verde (Albariño)", descripcion: "D.O. Rías Baixas · 100% Albariño · Botella, blanco.", precio: 25, categoria: "Bebidas", ingredientes: [], permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },

  // === BEBIDAS - Vinos Tintos ===
  { nombre: "Bordón (Crianza)", descripcion: "Rioja · Botella, tinto.", precio: 16, categoria: "Bebidas", ingredientes: [], permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },
  { nombre: "Álvarez Nölting", descripcion: "Utiel, Requena · Botella, tinto.", precio: 28, categoria: "Bebidas", ingredientes: [], permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },
  { nombre: "Abadía San Quirce (Crianza)", descripcion: "Ribera del Duero · Botella, tinto.", precio: 30, categoria: "Bebidas", ingredientes: [], permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },
  { nombre: "Pago de Fuentecojo", descripcion: "Ribera del Duero · Tempranillo 2021 · Botella, tinto.", precio: 28, categoria: "Bebidas", ingredientes: [], permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },
  { nombre: "BAI GORRI 2023", descripcion: "Rioja · Botella, tinto.", precio: 35, categoria: "Bebidas", ingredientes: [], permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },
  { nombre: "Bordón Reserva", descripcion: "Rioja · Botella, tinto.", precio: 35, categoria: "Bebidas", ingredientes: [], permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },
  { nombre: "Valparaíso Raíces", descripcion: "Ribera del Duero · Botella, tinto.", precio: 45, categoria: "Bebidas", ingredientes: [], permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },
  { nombre: "Pálpito", descripcion: "Bodegas Franco Españolas · Botella, tinto.", precio: 60, categoria: "Bebidas", ingredientes: [], permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },
  { nombre: "Clio 2023", descripcion: "Juan Gil Jumilla · Botella, tinto.", precio: 75, categoria: "Bebidas", ingredientes: [], permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },
  { nombre: "Macán Clásico 2021", descripcion: "Rioja · Botella, tinto.", precio: 95, categoria: "Bebidas", ingredientes: [], permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },
  { nombre: "El Nido 2023", descripcion: "Juan Gil Jumilla · Botella, tinto.", precio: 180, categoria: "Bebidas", ingredientes: [], permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },
  { nombre: "Vega Sicilia UNICO 2015", descripcion: "Botella, tinto.", precio: 475, categoria: "Bebidas", ingredientes: [], permitirPersonalizacion: false, permitirExtras: false, permitirRemover: false },
];

const output = productos.map(p => ({
  nombre: p.nombre,
  descripcion: p.descripcion,
  precio: p.precio,
  categoria: p.categoria,
  imagen: "",
  ingredientes: p.ingredientes,
  ingredientesExtra: [],
  permitirPersonalizacion: p.permitirPersonalizacion,
  permitirExtras: p.permitirExtras,
  permitirRemover: p.permitirRemover,
  disponible: true,
  activo: true
}));

fs.writeFileSync('docs/seed-productos.json', JSON.stringify(output, null, 2));
console.log('Productos generados:', output.length);

// Verificar que no hay IDs faltantes
const errores = [];
output.forEach(p => {
  p.ingredientes.forEach(i => {
    if (!i.ingrediente || !i.ingrediente.$oid) errores.push(p.nombre);
  });
});
if (errores.length) console.error('ERRORES en:', [...new Set(errores)]);
else console.log('Todos los IDs de ingredientes correctos');
