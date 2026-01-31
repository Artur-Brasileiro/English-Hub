import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { VOCABULARY_DATA } from '../data/gameData';
import {
  ArrowRight,
  Check,
  X,
  Trophy,
  ArrowLeft,
  PlayCircle,
  CornerDownLeft,
  Info,
  BookOpen,
  BrainCircuit,
  ShieldCheck,
} from 'lucide-react';

// --- IMPORTS DOS COMPONENTES DE ANÚNCIOS E HOOK ---
import AdUnit from './ads/AdUnit'; 
import { useH5Ads } from '../hooks/useH5Ads'; 

const WORDS_PER_LEVEL = 30;

// --- FUNÇÕES UTILITÁRIAS E ALGORITMOS (MANTIDOS ORIGINAIS) ---
const normalize = (text) => {
  return String(text ?? '')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, ' ');
};

const normalizeLoose = (text) => {
  return normalize(text).replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
};

const buildAcceptedAnswers = (ptArray) => {
  const accepted = new Set();
  for (const raw of Array.isArray(ptArray) ? ptArray : []) {
    const base = normalizeLoose(raw);
    if (base) accepted.add(base);
  }
  return accepted;
};

// Algoritmo de Levenshtein (Distância de edição)
const levenshtein = (a, b) => {
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
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
};

const similarity = (a, b) => {
  const A = normalize(a);
  const B = normalize(b);
  if (!A || !B) return 0;
  const dist = levenshtein(A, B);
  const maxLen = Math.max(A.length, B.length);
  return maxLen === 0 ? 1 : 1 - dist / maxLen;
};

const isPronunciationMatch = (heardRaw, targetRaw) => {
  const heard = normalize(heardRaw);
  const target = normalize(targetRaw);
  if (!heard || !target) return false;
  if (heard === target) return true;
  if (heard.includes(target)) return true;
  const score = similarity(heard, target);
  if (target.length <= 4) return score >= 0.8;
  return score >= 0.85;
};

const shuffleWords = (words) => {
  const shuffled = [...words];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// --- COMPONENTE: CONTEXTO EDUCACIONAL ---
const EducationalContext = () => (
  <section className="w-full mt-12 px-6 py-10 bg-white rounded-3xl border border-slate-200 shadow-sm text-slate-600 animate-fadeIn">
    {/* Cabeçalho do Artigo */}
    <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
      <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600 shadow-sm">
        <BookOpen className="w-8 h-8" />
      </div>
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
          Como expandir seu Vocabulário em Inglês
        </h2>
        <p className="text-slate-500 font-medium mt-1">
          A ciência por trás da memorização e o Princípio de Pareto (80/20).
        </p>
      </div>
    </div>
    
    <div className="prose prose-slate max-w-none grid md:grid-cols-2 gap-10 text-left">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" /> 
            Active Recall: O fim do "decoreba"
          </h3>
          <p className="text-sm leading-relaxed text-slate-600">
            Ler listas de palavras cria apenas uma ilusão de competência. Este jogo força seu cérebro a fazer o oposto: ele exige que você <strong>busque a informação</strong> na memória. É esse esforço cognitivo que move a palavra da memória de curto prazo para a de longo prazo.
          </p>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">O que é a Regra 80/20?</h4>
          <p className="text-sm leading-relaxed text-slate-600 mb-3">
            O Princípio de Pareto diz que <strong>20% das palavras correspondem a 80% das conversas</strong>. 
          </p>
          <ul className="text-sm space-y-3">
            <li className="flex gap-3">
              <span className="font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded text-xs h-fit">Foco</span>
              <span>
                Em vez de decorar o dicionário todo, foque nas <strong>1.000 palavras mais frequentes</strong> (Nível Essencial deste jogo). Isso já garante que você entenda a maioria dos diálogos do dia a dia.
              </span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-500" /> 
            3 Pilares da Memorização
          </h3>
          <p className="text-sm leading-relaxed text-slate-600 mb-4">
            Não adianta jogar uma vez e parar. Para garantir que o vocabulário "grude", siga este roteiro:
          </p>
          
          <ul className="space-y-4">
            <li className="bg-white border-l-4 border-indigo-400 pl-4 py-1">
              <span className="block text-xs font-bold text-indigo-600 uppercase mb-1">Associação Sonora</span>
              <p className="text-sm text-slate-700">Sempre repita a palavra em voz alta após acertar. O cérebro grava melhor o que o ouvido escuta.</p>
            </li>
            <li className="bg-white border-l-4 border-rose-400 pl-4 py-1">
              <span className="block text-xs font-bold text-rose-600 uppercase mb-1">Contextualização</span>
              <p className="text-sm text-slate-700">A palavra <em>"Run"</em> pode ser "correr" ou "administrar" (run a business). Tente criar frases mentais.</p>
            </li>
          </ul>
        </div>

        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
          <h3 className="text-indigo-900 font-bold text-sm mb-2 flex items-center gap-2">
            <BrainCircuit className="w-4 h-4" /> Dica Pro: Spaced Repetition
          </h3>
          <p className="text-xs text-indigo-800/80 leading-relaxed">
            O cérebro esquece 50% do que aprendeu em 24h. Volte neste jogo amanhã e tente superar seu recorde. Revisitando o conteúdo em intervalos, você combate a "Curva do Esquecimento".
          </p>
        </div>
      </div>
    </div>
  </section>
);

// --- COMPONENTE PRINCIPAL ---
const VocabularyGame = ({ onBack }) => {
  const navigate = useNavigate();
  const { levelId } = useParams();

  const urlLevel = levelId ? parseInt(levelId) : null;

  // View State Padronizado
  const [view, setView] = useState(urlLevel ? 'game' : 'menu');
  const [currentLevelId, setCurrentLevelId] = useState(urlLevel || 1);

  // --- HOOK DA H5 GAMES API ---
  const { triggerAdBreak } = useH5Ads();

  // Estados do Jogo
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [tags, setTags] = useState([]); 
  const [typingText, setTypingText] = useState('');
  
  const [feedback, setFeedback] = useState(null);
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });
  const [levelShuffleKey, setLevelShuffleKey] = useState(0);
  const [answerReport, setAnswerReport] = useState(null);

  // Voz e Pronúncia
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [pronunciationFeedback, setPronunciationFeedback] = useState(null); 
  const [pronunciationError, setPronunciationError] = useState(null);
  const [speechRate, setSpeechRate] = useState(1);

  // Refs e Foco
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // --- PROTOCOLO DE UNIFICAÇÃO: ÁUDIO ---
  const stopAllAudio = () => {
    // 1. Para TTS
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);

    // 2. Para STT
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
    setIsListening(false);
  };

  // --- PROTOCOLO DE UNIFICAÇÃO: ROTEAMENTO ---
  const handleBackToMenu = () => {
    triggerAdBreak('next', 'return_menu', () => {
        stopAllAudio();
        setView('menu');
        navigate('/vocabulary', { replace: true });
    }, stopAllAudio);
  };

  // UseEffect de Roteamento
  useEffect(() => {
    if (urlLevel) {
      setCurrentLevelId(urlLevel);
      setView('game');
      restartInternalState();
      window.scrollTo(0, 0);
    } else {
      setView('menu');
      stopAllAudio();
    }
  }, [urlLevel]);

  const restartInternalState = () => {
    stopAllAudio();
    setCurrentWordIndex(0);
    setStats({ correct: 0, wrong: 0 });
    setSpeechRate(1);
    setLevelShuffleKey((prev) => prev + 1);
    resetInputsAndFeedback();
  };

  const totalLevels = Math.ceil(VOCABULARY_DATA.length / WORDS_PER_LEVEL);

  const currentLevelWords = useMemo(() => {
    const startIndex = (currentLevelId - 1) * WORDS_PER_LEVEL;
    const endIndex = startIndex + WORDS_PER_LEVEL;
    const levelWords = VOCABULARY_DATA.slice(startIndex, endIndex);
    return shuffleWords(levelWords);
  }, [currentLevelId, levelShuffleKey]);

  const currentWord = currentLevelWords[currentWordIndex];

  // Focar no input
  useEffect(() => {
    if (!feedback && view === 'game') {
      if (window.innerWidth >= 768) {
        inputRef.current?.focus();
      }
    }
  }, [currentWordIndex, feedback, view]);

  // --- FUNÇÕES DE CONTROLE ---
  const resetInputsAndFeedback = () => {
    setTags([]);
    setTypingText('');
    setFeedback(null);
    setAnswerReport(null);
    setIsFocused(false);
    setPronunciationFeedback(null);
    setPronunciationError(null);
  };

  const restartLevelInternal = () => {
    restartInternalState();
    window.scrollTo(0, 0);
  };

  const nextWord = () => {
    resetInputsAndFeedback();
    if (currentWordIndex + 1 < currentLevelWords.length) {
      setCurrentWordIndex((prev) => prev + 1);
    } else {
      // Protocolo: AdBreak ao finalizar nível
      triggerAdBreak('next', 'level_complete', () => {
        setView('result');
      }, stopAllAudio);
    }
  };

  // --- LÓGICA DE TAGS E JOGO ---
  const addTag = (text) => {
    if (feedback) return;
    const clean = text.trim();
    if (!clean) return;

    if (!tags.some(t => normalizeLoose(t) === normalizeLoose(clean))) {
      setTags(prev => [...prev, clean]);
    }
    setTypingText('');
  };

  const removeTag = (index) => {
    if (feedback) return;
    setTags(prev => prev.filter((_, i) => i !== index));
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (feedback) return;

    if (['Enter', ','].includes(e.key)) {
      e.preventDefault();
      if (typingText.trim()) {
        addTag(typingText);
      } else if (tags.length > 0 && e.key === 'Enter') {
        checkAnswer(e);
      }
    }
    
    if (e.key === 'Backspace' && !typingText && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const checkAnswer = (e) => {
    if (e) e.preventDefault();
    if (feedback) return; // Proteção de submissão
    if (!currentWord) return;

    const providedRaw = [...tags];
    if (typingText.trim()) providedRaw.push(typingText.trim());

    if (providedRaw.length === 0) return;

    const accepted = buildAcceptedAnswers(currentWord.pt);

    const providedEval = providedRaw.map((text) => {
      const ok = accepted.has(normalizeLoose(text));
      return { text, ok };
    });

    const anyCorrect = providedEval.some((a) => a.ok);
    const providedCorrectSet = new Set(providedEval.filter((a) => a.ok).map((a) => normalizeLoose(a.text)));

    const missing = (Array.isArray(currentWord.pt) ? currentWord.pt : []).filter((pt) => {
      return !providedCorrectSet.has(normalizeLoose(pt));
    });

    setAnswerReport({
      provided: providedEval,
      missing,
    });

    setTags(providedRaw);
    setTypingText('');

    if (anyCorrect) {
      setFeedback('correct');
      setStats((prev) => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setFeedback('wrong');
      setStats((prev) => ({ ...prev, wrong: prev.wrong + 1 }));
    }
  };

  // --- ÁUDIO E VOZ ---
  const speakCurrentWord = () => {
    if (!currentWord?.en) return;
    if (!window.speechSynthesis) {
      setPronunciationError('Erro áudio');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(currentWord.en);
    utterance.lang = 'en-US';
    utterance.rate = speechRate;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      setPronunciationError('Erro áudio');
    };
    setPronunciationError(null);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const startPronunciationCheck = () => {
    if (!currentWord?.en) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setPronunciationError('Navegador não suporta');
      return;
    }
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 5;

    const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
    if (SpeechGrammarList && currentWord?.en) {
      try {
        const grammar = `#JSGF V1.0; grammar words; public <word> = ${currentWord.en};`;
        const speechRecognitionList = new SpeechGrammarList();
        speechRecognitionList.addFromString(grammar, 1);
        recognition.grammars = speechRecognitionList;
      } catch (err) {}
    }

    recognition.onstart = () => {
      setPronunciationError(null);
      setPronunciationFeedback(null); 
      setIsListening(true);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => {
      setIsListening(false);
      setPronunciationFeedback('wrong');
      setPronunciationError('Erro');
    };
    recognition.onresult = (event) => {
      const results = event.results?.[0];
      const target = currentWord.en;
      if (!results || results.length === 0) {
        setPronunciationFeedback('wrong');
        return;
      }
      const alternatives = Array.from(results).map((r) => ({ transcript: r.transcript || '' }));
      const hit = alternatives.some((alt) => isPronunciationMatch(alt.transcript, target));
      setPronunciationFeedback(hit ? 'correct' : 'wrong');
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  // --- RENDERIZAÇÃO ---

  // 1. MENU DE NÍVEIS
  if (view === 'menu') {
    const levelsArray = Array.from({ length: totalLevels }, (_, i) => i + 1);

    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 animate-fade-in">
        <Helmet>
          <title>Treinar Vocabulário e Palavras Mais Usadas | EnglishUp</title>
          <meta 
            name="description" 
            content={`Jogo gratuito para aprender as palavras mais usadas do inglês. Expanda seu vocabulário e melhore sua leitura com ${VOCABULARY_DATA.length} termos essenciais.`} 
          />
        </Helmet>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="bg-rose-100 p-4 rounded-full inline-flex mb-4 text-rose-600 shadow-sm">
              <BookOpen className="w-10 h-10 md:w-12 md:h-12" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3">
              Vocabulary Builder
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-6">
              O jogo ideal para treinar seu vocabulário e aprender as <strong>palavras mais usadas do inglês</strong>. 
              São {VOCABULARY_DATA.length} termos essenciais divididos em {totalLevels} níveis.
            </p>
            
            {/* PROTOCOLO: Roteamento Seguro para sair do jogo */}
            <button
              onClick={() => navigate("/", { replace: true })}
              className="bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-800 px-6 py-2 rounded-full font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar ao Hub Principal
            </button>
          </div>
          
          <hr className="border-slate-200 mb-8" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
            {levelsArray.map((levelId) => (
              <div
                key={levelId}
                onClick={() => navigate(`/vocabulary/level/${levelId}`)} 
                className="group bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:border-rose-300 transition-all duration-300 cursor-pointer relative overflow-hidden"
              >
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <span className="bg-rose-50 text-rose-700 text-xs font-bold px-2 py-1 rounded mb-2 inline-block uppercase tracking-wider">
                      Nível {levelId}
                    </span>
                    <p className="text-slate-500 text-xs font-medium">
                      Palavras {((levelId - 1) * WORDS_PER_LEVEL) + 1} -{' '}
                      {Math.min(levelId * WORDS_PER_LEVEL, VOCABULARY_DATA.length)}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
                    <PlayCircle className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <EducationalContext />
        </div>
      </div>
    );
  }

  // 2. TELA DE RESULTADO
  if (view === 'result') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 animate-fade-in">
        <Helmet>
          <title>{`Resultado Nível ${currentLevelId} - EnglishUp`}</title>
          <meta name="description" content={`Você completou o nível ${currentLevelId} com ${stats.correct} acertos. Continue praticando para melhorar seu inglês técnico.`} />
        </Helmet>
        
        <div className="mb-6">
          <AdUnit slotId="2492081057" width="300px" height="250px" label="Publicidade" />
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 text-center max-w-lg w-full mb-8">
          <div className="w-24 h-24 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Trophy className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            Nível {currentLevelId} Concluído!
          </h2>
          <p className="text-slate-500 mb-8">Você praticou {currentLevelWords.length} palavras.</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
              <p className="text-4xl font-black text-green-600">{stats.correct}</p>
              <p className="text-xs font-bold text-green-800 uppercase tracking-wider">Acertos</p>
            </div>
            <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
              <p className="text-4xl font-black text-red-500">{stats.wrong}</p>
              <p className="text-xs font-bold text-red-800 uppercase tracking-wider">Erros</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {currentLevelId < totalLevels && (
              <button
                onClick={() => triggerAdBreak(
                    'next', 
                    `level_complete_${currentLevelId}`, 
                    () => navigate(`/vocabulary/level/${currentLevelId + 1}`),
                    stopAllAudio
                )}
                className="w-full bg-slate-800 text-white py-3.5 rounded-xl font-bold hover:bg-slate-900 transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                Próximo Nível <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => triggerAdBreak(
                  'next', 
                  'level_retry', 
                  () => {
                      setView('game'); 
                      restartLevelInternal();
                  },
                  stopAllAudio
              )}
              className="w-full bg-white border-2 border-slate-200 text-slate-600 py-3.5 rounded-xl font-bold hover:bg-slate-50 transition-colors"
            >
              Repetir Nível
            </button>

            {/* PROTOCOLO: Roteamento Seguro */}
            <button
              onClick={handleBackToMenu}
              className="text-slate-400 hover:text-slate-600 text-sm font-medium mt-2"
            >
              Voltar ao Menu de Níveis
            </button>
          </div>
        </div>

        <EducationalContext />
      </div>
    );
  }

  // 3. JOGO PRINCIPAL
  const progressPercentage = (currentWordIndex / currentLevelWords.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col items-center">
      <Helmet>
        <title>{`Nível ${currentLevelId} - EnglishUp`}</title> 
        <meta name="description" content={`Pratique a palavra "${currentWord?.en || 'técnica'}" e outras do nível ${currentLevelId}. Aprenda inglês técnico com Active Recall.`} />
      </Helmet>
      
      {/* HEADER AD */}
      <div className="w-full bg-white border-b border-slate-200 py-2 flex flex-col items-center justify-center relative z-20 shadow-sm min-h-25 md:min-h-27.5">         <div className="block md:hidden">
            <AdUnit key={`mobile-top-${currentLevelId}`} slotId="8330331714" width="320px" height="100px" label="Patrocinado"/>
         </div>
         <div className="hidden md:block">
            <AdUnit slotId="5673552248" width="728px" height="90px" label="Patrocinado"/>
         </div>
      </div>

      <div className="w-full max-w-360 mx-auto flex flex-col xl:flex-row justify-center items-start gap-11 p-4 mt-4">          
          {/* SIDEBAR ESQUERDA */}
          <div className="hidden xl:flex w-80 shrink-0 flex-col gap-4 sticky top-36">
             <AdUnit key={`desktop-left-${currentLevelId}`} slotId="5118244396" width="300px" height="600px" label="Patrocinado"/>
          </div>

          {/* ÁREA CENTRAL */}
          <div className="w-full max-w-2xl flex flex-col">
            
            <div className="flex items-center justify-between mb-4 px-2">
              {/* PROTOCOLO: Botão de Voltar Padronizado */}
              <button
                onClick={handleBackToMenu}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold transition-colors text-sm uppercase tracking-wide"
              >
                <ArrowLeft className="w-4 h-4" /> Menu
              </button>
              <span className="text-slate-400 font-bold text-sm uppercase tracking-wide">
                Nível {currentLevelId}
              </span>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative mb-8">
              <div className="w-full bg-slate-100 h-2">
                <div
                  className="bg-rose-600 h-2 transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              <div className="p-6 md:p-12 text-center">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-widest rounded-full mb-8">
                  <PlayCircle className="w-3 h-3" /> Palavra {currentWordIndex + 1} /{' '}
                  {currentLevelWords.length}
                </span>

                <div className="mb-10">
                  <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-2 wrap-break-word">
                    {currentWord?.en}
                  </h1>
                  <p className="text-slate-400 text-sm font-medium italic">Como se diz isso em português?</p>
                </div>

                {/* CONTROLES DE ÁUDIO */}
                <div className="flex flex-col items-center gap-3 mb-8">
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Velocidade
                      <select
                        value={speechRate}
                        onChange={(e) => setSpeechRate(Number(e.target.value))}
                        className="border border-slate-200 rounded-md px-2 py-1 text-slate-700 bg-white text-xs font-bold"
                      >
                        <option value={0.5}>0.5x</option>
                        <option value={0.75}>0.75x</option>
                        <option value={1}>1x</option>
                        <option value={1.25}>1.25x</option>
                      </select>
                    </label>

                    <button
                      type="button"
                      onClick={speakCurrentWord}
                      className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors disabled:opacity-50"
                      disabled={isSpeaking}
                    >
                      {isSpeaking ? 'Reproduzindo...' : 'Ouvir pronuncia'}
                    </button>

                    <button
                      type="button"
                      onClick={startPronunciationCheck}
                      className="px-4 py-2 rounded-lg bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                      disabled={isListening}
                    >
                      <span>{isListening ? 'Ouvindo...' : 'Repetir pronuncia'}</span>
                      <div 
                        className={`w-3 h-3 rounded-full transition-all duration-300 border border-white
                          ${
                            isListening 
                              ? 'bg-yellow-300 animate-pulse shadow-[0_0_8px_rgba(253,224,71,0.8)]'
                              : pronunciationFeedback === 'correct'
                              ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,1)] scale-110'
                              : pronunciationFeedback === 'wrong'
                              ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                              : 'bg-rose-400/50' 
                          }
                        `}
                      />
                    </button>
                  </div>
                  {pronunciationError && (
                    <p className="text-xs text-red-500 font-medium">{pronunciationError}</p>
                  )}
                </div>

                {/* ÁREA DE RESPOSTA */}
                <div className="max-w-3xl mx-auto mb-8">
                    <div 
                        className={`
                            min-h-17.5 w-full bg-white border-2 rounded-xl flex flex-wrap items-center gap-2 p-3 cursor-text transition-all shadow-sm
                            ${feedback 
                                ? (feedback === 'correct' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') 
                                : (isFocused ? 'border-rose-500 shadow-md' : 'border-slate-200 hover:border-slate-300')
                            }
                        `}
                        onClick={() => !feedback && inputRef.current?.focus()}
                    >
                        {tags.map((tag, idx) => {
                            let tagStyle = "bg-slate-100 border-slate-300 text-slate-700";
                            let icon = null;

                            if (feedback && answerReport) {
                                const result = answerReport.provided.find(p => p.text === tag);
                                if (result?.ok) {
                                    tagStyle = "bg-green-100 border-green-400 text-green-800";
                                    icon = <Check className="w-3 h-3 ml-1" />;
                                } else {
                                    tagStyle = "bg-red-100 border-red-400 text-red-800 opacity-70 line-through decoration-red-500";
                                }
                            }

                            return (
                                <span key={idx} className={`px-3 py-1.5 rounded-lg text-lg font-medium border flex items-center animate-scale-in ${tagStyle}`}>
                                    {tag}
                                    {icon}
                                    {!feedback && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); removeTag(idx); }}
                                            className="ml-2 text-slate-400 hover:text-slate-600"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </span>
                            );
                        })}

                        {!feedback && (
                            <input
                                ref={inputRef}
                                type="text"
                                value={typingText}
                                onChange={(e) => setTypingText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                className="grow bg-transparent outline-none text-lg font-medium text-slate-800 placeholder:text-slate-300 min-w-35 text-left"
                                placeholder={tags.length === 0 ? "Digite a tradução..." : "Digite outra..."}
                                autoComplete="off"
                            />
                        )}

                        {!feedback && (typingText || tags.length > 0) && (
                             <button
                             onClick={checkAnswer}
                             className="bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors shadow-md p-2 ml-auto"
                             title="Enviar respostas"
                           >
                             <ArrowRight className="w-5 h-5" />
                           </button>
                        )}
                    </div>

                    {!feedback && (
                        <div className="flex justify-center mt-2 text-xs text-slate-400 gap-1 items-center">
                            <span>Pressione</span> 
                            <span className="border border-slate-200 rounded px-1 py-0.5 bg-white font-mono flex items-center shadow-sm"><CornerDownLeft className="w-3 h-3"/></span>
                            <span>para adicionar sinônimos</span>
                        </div>
                    )}
                </div>

                {feedback && (
                  <div className="animate-fade-in-up">
                    {feedback === 'correct' ? (
                      <div className="flex flex-col items-center text-green-600 mb-6">
                        <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full mb-2">
                          <Check className="w-5 h-5" />
                          <span className="font-bold">Correto!</span>
                        </div>
                        {answerReport?.missing?.length > 0 && (
                            <p className="text-xs text-slate-500 mt-2 text-center">
                              Outras opções: <strong>{answerReport.missing.join(', ')}</strong>
                            </p>
                          )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-red-600 mb-6">
                        <div className="flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full mb-2">
                          <X className="w-5 h-5" />
                          <span className="font-bold">Ops! Não foi dessa vez.</span>
                        </div>
                        <p className="text-slate-500 text-sm mt-1">
                            Respostas corretas: <strong className="text-slate-700">{currentWord.pt.join(', ')}</strong>
                        </p>
                      </div>
                    )}

                    <button
                      onClick={nextWord}
                      autoFocus
                      className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold text-white shadow-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mx-auto
                        ${
                          feedback === 'correct'
                            ? 'bg-green-600 hover:bg-green-700 shadow-green-200'
                            : 'bg-slate-800 hover:bg-slate-900 shadow-slate-300'
                        }`}
                    >
                      {currentWordIndex + 1 === currentLevelWords.length ? 'Ver Resultado' : 'Próxima Palavra'}{' '}
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <EducationalContext />

            <div className="mt-40 pointer-events-auto">
              <AdUnit slotId="4391086704" width="336px" height="280px" label="Publicidade"/>
            </div>
          </div>

          {/* SIDEBAR DIREITA */}
          <div className="hidden xl:flex w-80 shrink-0 flex-col gap-4 sticky top-36">
             <AdUnit key={`desktop-right-${currentLevelId}`} slotId="3805162724" width="300px" height="250px" label="Patrocinado"/>
             
             <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
                <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                   <Trophy className="w-4 h-4" /> Dica Pro
                </h3>
                <p className="text-sm text-amber-700/80">
                   Tente usar sinônimos quando possível! Isso aumenta sua pontuação oculta de fluência.
                </p>
             </div>
          </div>
      </div>

      <div className="xl:hidden w-full flex flex-col items-center pb-8 bg-slate-50 mt-4">
          <div className="h-24 w-full flex items-center justify-center pointer-events-none">
             <span className="text-[10px] text-slate-300 uppercase tracking-widest">--- Publicidade abaixo ---</span>
          </div>
          <AdUnit key={`mobile-bottom-${currentLevelId}`} slotId="3477859667" width="300px" height="250px" label="Patrocinado"/>
      </div>
    </div>
  );
};

export default VocabularyGame;