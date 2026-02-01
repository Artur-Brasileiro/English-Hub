export const loadGameData = async (filename) => {
  try {
    // O fetch busca na pasta /public automaticamente
    const response = await fetch(`/data/${filename}`);
    if (!response.ok) {
      throw new Error(`Erro ao carregar ${filename}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro no dataLoader:", error);
    throw error;
  }
};