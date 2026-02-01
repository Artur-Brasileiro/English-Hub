/**
 * Utilitários para manipulação e comparação de textos.
 * Usado em: VocabularyGame, IrregularVerbsGame, PhrasalVerbsGame, TranslationGame.
 */

/**
 * Normalização PADRÃO (Preserva hífens).
 * Remove acentos, caracteres especiais (exceto hífen e espaço) e espaços extras.
 * Converte para minúsculas.
 * Ex: "São Paulo - SP" -> "sao paulo - sp"
 */
export const normalizeText = (text) => {
  return String(text ?? '')
    .toLowerCase()
    .trim()
    .normalize('NFD') // Separa acentos das letras
    .replace(/[\u0300-\u036f]/g, '') // Remove os acentos
    .replace(/[^\p{L}\p{N}\s-]/gu, '') // Remove tudo que não for Letra, Número, Espaço ou Hífen
    .replace(/\s+/g, ' '); // Remove espaços duplos
};

/**
 * Normalização "FROUXA" (Remove hífens).
 * Ideal para inputs do usuário onde o hífen é opcional.
 * Ex: "bem-vindo" vira "bem vindo".
 * Usado em: VocabularyGame (comparação de tags), PhrasalVerbs.
 */
export const normalizeLoose = (text) => {
  // Pega a normalização padrão e troca hífen por espaço
  return normalizeText(text).replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
};

/**
 * Normalização para FRASES (Translation Game).
 * Remove pontuação gramatical (. , ! ? ; :) mas mantém a estrutura da frase.
 * Ex: "Hello, World!" -> "hello world"
 */
export const normalizeSentence = (text) => {
  return String(text ?? '')
    .toLowerCase()
    .replace(/[.,!?;:]/g, '') // Remove apenas pontuação gramatical
    .replace(/\s+/g, ' ')     // Remove espaços extras
    .trim();
};

/**
 * Algoritmo de Distância de Levenshtein.
 * Calcula o número de edições (inserir, deletar, trocar) necessárias para transformar 'a' em 'b'.
 * Usado para: Cálculo de similaridade e "fuzzy matching".
 */
export const levenshtein = (a, b) => {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,       // deleção
        dp[i][j - 1] + 1,       // inserção
        dp[i - 1][j - 1] + cost // substituição
      );
    }
  }
  return dp[m][n];
};

/**
 * Calcula a similaridade entre duas strings (de 0 a 1).
 * Usa normalizeText internamente para garantir comparação justa.
 * Usado em: VocabularyGame (validação de pronúncia).
 */
export const calculateSimilarity = (a, b) => {
  const A = normalizeText(a);
  const B = normalizeText(b);
  
  if (!A || !B) return 0;
  if (A === B) return 1; // Atalho rápido
  
  const dist = levenshtein(A, B);
  const maxLen = Math.max(A.length, B.length);
  
  return maxLen === 0 ? 1 : 1 - dist / maxLen;
};