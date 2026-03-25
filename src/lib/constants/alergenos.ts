// 14 alérgenos regulados por la UE (Reglamento 1169/2011)
export const ALERGENOS_UE = [
  'gluten',
  'crustaceos',
  'huevos',
  'pescado',
  'cacahuetes',
  'soja',
  'lacteos',
  'frutos_secos',
  'apio',
  'mostaza',
  'sesamo',
  'sulfitos',
  'altramuces',
  'moluscos',
] as const;

export type AlergenoUE = typeof ALERGENOS_UE[number];

// Mapa de nombres legibles para mostrar en la UI
export const ALERGENOS_LABELS: Record<AlergenoUE, string> = {
  gluten: 'Gluten',
  crustaceos: 'Crustáceos',
  huevos: 'Huevos',
  pescado: 'Pescado',
  cacahuetes: 'Cacahuetes',
  soja: 'Soja',
  lacteos: 'Lácteos',
  frutos_secos: 'Frutos de cáscara',
  apio: 'Apio',
  mostaza: 'Mostaza',
  sesamo: 'Sésamo',
  sulfitos: 'Sulfitos',
  altramuces: 'Altramuces',
  moluscos: 'Moluscos',
};

// Iconos/emojis representativos por alérgeno
export const ALERGENOS_ICONOS: Record<AlergenoUE, string> = {
  gluten: '🌾',
  crustaceos: '🦐',
  huevos: '🥚',
  pescado: '🐟',
  cacahuetes: '🥜',
  soja: '🫘',
  lacteos: '🥛',
  frutos_secos: '🌰',
  apio: '🥬',
  mostaza: '🟡',
  sesamo: '⚪',
  sulfitos: '🍷',
  altramuces: '🌱',
  moluscos: '🦪',
};

// Colores para badges de alérgenos
export const ALERGENOS_COLORES: Record<AlergenoUE, string> = {
  gluten: 'bg-amber-700',
  crustaceos: 'bg-red-600',
  huevos: 'bg-yellow-600',
  pescado: 'bg-blue-600',
  cacahuetes: 'bg-orange-700',
  soja: 'bg-green-700',
  lacteos: 'bg-sky-500',
  frutos_secos: 'bg-amber-800',
  apio: 'bg-green-600',
  mostaza: 'bg-yellow-700',
  sesamo: 'bg-stone-500',
  sulfitos: 'bg-purple-600',
  altramuces: 'bg-lime-700',
  moluscos: 'bg-indigo-600',
};

/**
 * Obtiene los alérgenos únicos de un producto a partir de sus ingredientes.
 * Cada ingrediente debe tener un campo `alergenos: string[]`.
 */
export function getAlergenosProducto(
  producto: { ingredientes?: Array<{ ingrediente?: { alergenos?: string[] } }> }
): AlergenoUE[] {
  if (!producto.ingredientes?.length) return [];

  const set = new Set<AlergenoUE>();
  for (const item of producto.ingredientes) {
    if (item.ingrediente?.alergenos) {
      for (const a of item.ingrediente.alergenos) {
        if (ALERGENOS_UE.includes(a as AlergenoUE)) {
          set.add(a as AlergenoUE);
        }
      }
    }
  }
  return Array.from(set);
}
