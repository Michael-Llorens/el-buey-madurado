const fs = require('fs');

// Cargar ingredientes y productos
const ingredientes = JSON.parse(fs.readFileSync('docs/bueyMaduradoDB.ingredientes.json', 'utf-8'));
const productos = JSON.parse(fs.readFileSync('docs/seed-productos.json', 'utf-8'));

// Mapa de ingredientes por $oid
const ingMap = {};
ingredientes.forEach(ing => {
  const id = ing._id?.$oid || ing._id;
  ingMap[id] = {
    _id: id,
    nombre: ing.nombre,
    precioExtra: ing.precioExtra || 0,
    alergenos: ing.alergenos || [],
  };
});

// Resolver productos con ingredientes
const output = productos.map(prod => {
  const ingredientesResueltos = (prod.ingredientes || []).map(ref => {
    const ingId = ref.ingrediente?.$oid || ref.ingrediente;
    const ing = ingMap[ingId];
    return {
      ingrediente: ing || { _id: ingId, nombre: 'Desconocido', precioExtra: 0, alergenos: [] },
      cantidad: ref.cantidad,
      unidad: ref.unidad,
    };
  });

  return {
    _id: prod._id?.$oid || prod._id || `gen-${Math.random().toString(36).slice(2, 10)}`,
    nombre: prod.nombre,
    descripcion: prod.descripcion,
    precio: prod.precio,
    categoria: prod.categoria,
    imagen: prod.imagen || '',
    ingredientes: ingredientesResueltos,
    ingredientesExtra: prod.ingredientesExtra || [],
    permitirPersonalizacion: prod.permitirPersonalizacion ?? true,
    permitirExtras: prod.permitirExtras ?? false,
    permitirRemover: prod.permitirRemover ?? false,
    disponible: prod.disponible ?? true,
    activo: prod.activo ?? true,
  };
}).filter(p => p.disponible && p.activo);

fs.writeFileSync('public/data/productos.json', JSON.stringify(output, null, 2));
console.log(`Generados ${output.length} productos estáticos en public/data/productos.json`);

// Verificar que todos los ingredientes se resolvieron
let errores = 0;
output.forEach(p => {
  p.ingredientes.forEach(i => {
    if (i.ingrediente.nombre === 'Desconocido') {
      console.error(`  ERROR: ${p.nombre} tiene ingrediente no resuelto`);
      errores++;
    }
  });
});
if (errores === 0) console.log('Todos los ingredientes resueltos correctamente');
