const dataCache = {};

export const loadGameData = async (filename) => {
  // Se já tivermos os dados, retorna do cache imediatamente
  if (dataCache[filename]) {
    return dataCache[filename];
  }

  try {
    const response = await fetch(`/data/${filename}`);
    if (!response.ok) {
      throw new Error(`Erro ao carregar ${filename}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Salva no cache antes de retornar
    dataCache[filename] = data;
    
    return data;
  } catch (error) {
    console.error("Erro no dataLoader:", error);
    throw error;
  }
};