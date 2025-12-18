import { authFetch } from "./request";

const cache = {
  foods: new Map(),
  recipes: new Map(),
  stores: new Map()
};

const loadFood = async (id) => {
  if (cache.foods.has(id)) return cache.foods.get(id);
  try {
    const res = await authFetch(`http://localhost:3001/Food/get/${id}`);
    const data = await res.json();
    cache.foods.set(id, data);
    return data;
  } catch (err) {
    console.error(`food error ${id}:`, err);
    return null;
  }
};

const loadRecipe = async (id) => {
  if (cache.recipes.has(id)) return cache.recipes.get(id);
  try {
    const res = await authFetch(`http://localhost:3001/Recipe/get/${id}`);
    const data = await res.json();
    cache.recipes.set(id, data);
    return data;
  } catch (err) {
    console.error(`recipe error ${id}:`, err);
    return null;
  }
};

const loadStore = async (id) => {
  if (cache.stores.has(id)) return cache.stores.get(id);
  try {
    const res = await authFetch(`http://localhost:3001/Store/get/${id}`);
    const data = await res.json();
    cache.stores.set(id, data);
    return data;
  } catch (err) {
    console.error(`store error ${id}:`, err);
    return null;
  }
};

export const formatters = {
  IngredientAmount: {
    food: async (id) => (await loadFood(id))?.label || `Food #${id}`,
    recipe: async (id) => (await loadRecipe(id))?.label || `Recipe #${id}`
  },
  FoodUser: {
    food: async (id) => (await loadFood(id))?.label || `Food #${id}`
  },
  FoodStore: {
    food: async (id) => (await loadFood(id))?.label || `Food #${id}`,
    store: async (id) => (await loadStore(id))?.label || `Store #${id}`
  }
};

// Formate une valeur selon table/colonne
export const formatValue = async (table, column, value) => {
  return formatters[table]?.[column] 
    ? await formatters[table][column](value) 
    : value;
};

// Formate toutes les colonnes d'une ligne
export const formatRow = async (table, row, columns) => {
  const formatted = { ...row };
  for (const col of columns) {
    if (row[col] != null) {
      formatted[col] = await formatValue(table, col, row[col]);
    }
  }
  return formatted;
};

// Efface le cache (après create/update/delete)
export const clearCache = (type = 'all') => {
  if (type === 'all') {
    Object.values(cache).forEach(map => map.clear());
  } else {
    cache[type]?.clear();
  }
};

// Supprime une entrée spécifique du cache
export const removeCacheEntry = (type, key) => cache[type]?.delete(key);