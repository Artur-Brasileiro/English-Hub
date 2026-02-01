/**
 * Utilitários para manipulação de Arrays.
 * Usado para padronizar o embaralhamento e garantir segurança de dados.
 */

/**
 * Algoritmo Fisher-Yates (ou Knuth) Shuffle.
 * É a maneira matematicamente correta de embaralhar um array de forma imparcial.
 * Cria uma cópia do array original para não mutar os dados fonte.
 * * @param {Array} array - O array a ser embaralhado.
 * @returns {Array} Um novo array embaralhado.
 */
export const shuffleArray = (array) => {
  if (!Array.isArray(array)) return [];
  
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Garante que o valor retornado seja sempre um array.
 * Substitui a função 'toArray' que existia localmente no TranslationGame.
 * Útil para proteger seu código contra dados undefined/null vindos de APIs ou arquivos.
 * * @param {any} value - O valor a ser verificado.
 * @returns {Array} O próprio array ou um array vazio [].
 */
export const ensureArray = (value) => {
  return Array.isArray(value) ? value : [];
};