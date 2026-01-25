import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { VOCABULARY_DATA } from '../data/gameData';
import {
  ArrowRight,
  Check,
  X,
  Trophy,
  ArrowLeft,
  BookOpen,
  PlayCircle,
  CornerDownLeft
} from 'lucide-react';

const WORDS_PER_LEVEL = 30;

// --- FUNÇÕES UTILITÁRIAS ---
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

// --- ALGORITMOS DE TEXTO ---
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

// --- COMPONENTE PRINCIPAL ---

const VocabularyGame = ({ onBack }) => {
  const navigate = useNavigate();
  const [view, setView] = useState('menu');

  // Estados do Jogo
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // Estados de Input (Tags + Texto)
  const [tags, setTags] = useState([]); 
  const [typingText, setTypingText] = useState('');
  
  const [feedback, setFeedback] = useState(null);
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });
  const [levelShuffleKey, setLevelShuffleKey] = useState(0);
  const [answerReport, setAnswerReport] = useState(null);

  // Voz e Pronúncia
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [pronunciationFeedback, setPronunciationFeedback] = useState(null); // null, 'correct', 'wrong'
  const [pronunciationError, setPronunciationError] = useState(null);
  const [speechRate, setSpeechRate] = useState(1);

  // Refs e Foco
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  const totalLevels = Math.ceil(VOCABULARY_DATA.length / WORDS_PER_LEVEL);

  const currentLevelWords = useMemo(() => {
    const startIndex = (currentLevelId - 1) * WORDS_PER_LEVEL;
    const endIndex = startIndex + WORDS_PER_LEVEL;
    const levelWords = VOCABULARY_DATA.slice(startIndex, endIndex);
    return shuffleWords(levelWords);
  }, [currentLevelId, levelShuffleKey]);

  const currentWord = currentLevelWords[currentWordIndex];

  // Focar no input ao mudar a palavra
  useEffect(() => {
    if (!feedback && view === 'game') {
      inputRef.current?.focus();
    }
  }, [currentWordIndex, feedback, view]);

  // --- FUNÇÕES DE CONTROLE ---

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const resetInputsAndFeedback = () => {
    setTags([]);
    setTypingText('');
    setFeedback(null);
    setAnswerReport(null);
    setIsFocused(false);
    
    // Reseta estado de pronúncia
    setPronunciationFeedback(null);
    setPronunciationError(null);
  };

  const enterLevel = (levelId) => {
    stopListening();
    setCurrentLevelId(levelId);
    setLevelShuffleKey((prev) => prev + 1);
    setCurrentWordIndex(0);
    setStats({ correct: 0, wrong: 0 });
    setSpeechRate(1);
    resetInputsAndFeedback();
    setView('game');
    window.scrollTo(0, 0);
  };

  const returnToMenu = () => {
    stopListening();
    setPronunciationFeedback(null);
    setPronunciationError(null);
    setSpeechRate(1);
    setView('menu');
  };

  const nextWord = () => {
    resetInputsAndFeedback();
    if (currentWordIndex + 1 < currentLevelWords.length) {
      setCurrentWordIndex((prev) => prev + 1);
    } else {
      setView('result');
    }
  };

  // --- LÓGICA DE TAGS ---

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
    if (feedback) return;
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
      setPronunciationFeedback(null); // Reseta a bolinha para cinza/amarelo
      setIsListening(true);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => {
      setIsListening(false);
      setPronunciationFeedback('wrong'); // Erro técnico conta como falha visualmente ou pode ser tratado diferente
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

  if (view === 'menu') {
    const levelsArray = Array.from({ length: totalLevels }, (_, i) => i + 1);

    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 animate-fade-in">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="bg-blue-100 p-4 rounded-full inline-flex mb-4 text-blue-600 shadow-sm">
              <BookOpen className="w-10 h-10 md:w-12 md:h-12" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3">
              Vocabulary Builder
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-6">
              Expanda seu vocabulário. {VOCABULARY_DATA.length} palavras divididas em {totalLevels}{' '}
              níveis.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-800 px-6 py-2 rounded-full font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar ao Hub Principal
            </button>
          </div>
          <hr className="border-slate-200 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-16">
            {levelsArray.map((levelId) => (
              <div
                key={levelId}
                onClick={() => enterLevel(levelId)}
                className="group bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer relative overflow-hidden"
              >
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded mb-2 inline-block uppercase tracking-wider">
                      Nível {levelId}
                    </span>
                    <p className="text-slate-500 text-xs font-medium">
                      Palavras {((levelId - 1) * WORDS_PER_LEVEL) + 1} -{' '}
                      {Math.min(levelId * WORDS_PER_LEVEL, VOCABULARY_DATA.length)}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <PlayCircle className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'result') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 text-center max-w-lg w-full">
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
                onClick={() => enterLevel(currentLevelId + 1)}
                className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
              >
                Próximo Nível <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => enterLevel(currentLevelId)}
              className="w-full py-3.5 bg-white border-2 border-slate-100 text-slate-600 font-bold rounded-xl hover:border-slate-300 transition-colors"
            >
              Repetir Nível
            </button>

            <button
              onClick={returnToMenu}
              className="text-slate-400 hover:text-slate-600 text-sm font-medium mt-2"
            >
              Voltar ao Menu de Níveis
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = (currentWordIndex / currentLevelWords.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 p-4 font-sans text-slate-800 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-8 pt-4">
          <button
            onClick={returnToMenu}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold transition-colors text-sm uppercase tracking-wide"
          >
            <ArrowLeft className="w-4 h-4" /> Menu
          </button>
          <span className="text-slate-400 font-bold text-sm uppercase tracking-wide">
            Nível {currentLevelId}
          </span>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative">
          <div className="w-full bg-slate-100 h-2">
            <div
              className="bg-blue-600 h-2 transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="p-8 md:p-12 text-center">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest rounded-full mb-8">
              <PlayCircle className="w-3 h-3" /> Palavra {currentWordIndex + 1} /{' '}
              {currentLevelWords.length}
            </span>

            <div className="mb-10">
              <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-2 wrap-break-word">
                {currentWord?.en}
              </h1>
              <p className="text-slate-400 text-sm font-medium italic">Como se diz isso em português?</p>
            </div>

            {/* CONTROLES DE ÁUDIO COM "BOLINHA" */}
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

                {/* BOTÃO COM STATUS DE PRONÚNCIA EM BOLINHA */}
                <button
                  type="button"
                  onClick={startPronunciationCheck}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  disabled={isListening}
                >
                  <span>{isListening ? 'Ouvindo...' : 'Repetir pronuncia'}</span>
                  
                  {/* BOLINHA INDICADORA */}
                  <div 
                    className={`w-3 h-3 rounded-full transition-all duration-300
                      ${
                        // Estado: Ouvindo (Piscando Amarelo/Branco)
                        isListening 
                          ? 'bg-yellow-300 animate-pulse shadow-[0_0_8px_rgba(253,224,71,0.8)]'
                          : // Estado: Correto (Verde)
                          pronunciationFeedback === 'correct'
                          ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,1)] scale-110'
                          : // Estado: Errado (Vermelho)
                          pronunciationFeedback === 'wrong'
                          ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                          : // Estado: Padrão (Cinza Claro)
                          'bg-blue-400/50' 
                      }
                    `}
                  />
                </button>
              </div>

              {/* Mensagem de erro técnica (só aparece se o navegador falhar, não se o usuário errar a pronúncia) */}
              {pronunciationError && (
                <p className="text-xs text-red-500 font-medium">{pronunciationError}</p>
              )}
            </div>

            {/* ÁREA DE RESPOSTA (TAGS) */}
            <div className="max-w-3xl mx-auto mb-8">
                <div 
                    className={`
                        min-h-17.5 w-full bg-white border-2 rounded-xl flex flex-wrap items-center gap-2 p-3 cursor-text transition-all shadow-sm
                        ${feedback 
                            ? (feedback === 'correct' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') 
                            : (isFocused ? 'border-blue-500 shadow-md' : 'border-slate-200 hover:border-slate-300')
                        }
                    `}
                    onClick={() => !feedback && inputRef.current?.focus()}
                >
                    {/* Tags */}
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
                         className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md p-2 ml-auto"
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
      </div>
    </div>
  );
};

export default VocabularyGame;