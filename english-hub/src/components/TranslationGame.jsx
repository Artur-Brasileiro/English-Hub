import React, { useState, useRef, useEffect, useMemo, useLayoutEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { 
  Languages, ArrowLeft, CheckCircle, XCircle, Mic, 
  Clock, GitBranch, Shield, ArrowLeftRight, Flame, Target, Scale, Heart, Lock, Lightbulb, Sparkles, HelpCircle, Trophy
} from 'lucide-react';

// --- REMOVIDO: Import direto ---
// import { TRANSLATION_DATA } from '../../public/data/gameData';

// --- NOVO: Import do Loader ---
import { loadGameData } from '../utils/dataLoader';

import AdUnit from './ads/AdUnit'; 
import { useH5Ads } from '../hooks/useH5Ads'; 
import PageShell from './layout/PageShell';
import ResultScreen from './shared/ResultScreen';
import TranslationEducation from '../content/TranslationEducation';
import { normalizeSentence } from '../utils/textUtils';
import { shuffleArray, ensureArray } from '../utils/arrayUtils';

const ITEMS_PER_LEVEL = 10; 

const TranslationGame = ({ onBack }) => {
  const navigate = useNavigate();
  const { levelId } = useParams();
  const { triggerAdBreak } = useH5Ads();
  
  // Refs
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  // States de Dados Assíncronos
  const [data, setData] = useState(null); // Agora inicia null até carregar
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States do Jogo
  const [view, setView] = useState('loading'); // Começa carregando
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentMode, setCurrentMode] = useState('mix'); 
  const [userAnswer, setUserAnswer] = useState('');
  const [answerStatus, setAnswerStatus] = useState(null); 
  const [isListening, setIsListening] = useState(false);

  // --- CONFIGURAÇÃO VISUAL (Mantida) ---
  const tagMeta = useMemo(() => ({
    conditional: { label: 'Condicionais', sub: 'If/Se', color: 'bg-amber-500', icon: GitBranch },
    concessive: { label: 'Concessivas', sub: 'Even/Embora', color: 'bg-teal-600', icon: Shield },
    temporal: { label: 'Temporais', sub: 'While/When', color: 'bg-cyan-600', icon: Clock },
    contrast: { label: 'Contraste', sub: 'Mas/Porém', color: 'bg-rose-500', icon: ArrowLeftRight },
    cause: { label: 'Causa', sub: 'Porque', color: 'bg-lime-600', icon: Flame },
    purpose: { label: 'Finalidade', sub: 'Para que', color: 'bg-emerald-600', icon: Target },
    result: { label: 'Resultado', sub: 'Então', color: 'bg-blue-600', icon: CheckCircle },
    comparison: { label: 'Comparação', sub: 'Igual a', color: 'bg-violet-600', icon: Scale },
    desire: { label: 'Desejo', sub: 'Quero/Espero', color: 'bg-fuchsia-500', icon: Heart },
    obligation: { label: 'Obrigação', sub: 'Tenho que', color: 'bg-orange-600', icon: Lock },
    advice: { label: 'Conselho', sub: 'Deveria', color: 'bg-sky-600', icon: Lightbulb },
    suggestion: { label: 'Sugestão', sub: 'Que tal', color: 'bg-indigo-600', icon: Sparkles },
    possibility: { label: 'Possibilidade', sub: 'Talvez', color: 'bg-slate-600', icon: HelpCircle }
  }), []);

  const grammarMeta = {
    present_perfect: { label: 'Present Perfect', color: 'bg-blue-500' },
    present_perfect_continuous: { label: 'Present Perfect Cont.', color: 'bg-blue-700' },
    past_perfect: { label: 'Past Perfect', color: 'bg-purple-500' }, 
    future_perfect: { label: 'Future Perfect', color: 'bg-indigo-600' }, 
    all_tenses: { label: 'All Tenses', color: 'bg-slate-800' },          
    questions: { label: 'Perguntas', color: 'bg-cyan-600' }
  };

  // --- EFFECT: CARREGAR DADOS ---
  useEffect(() => {
    loadGameData('translation.json')
      .then((jsonData) => {
        setData(jsonData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Erro ao carregar traduções.");
        setLoading(false);
      });
  }, []);

  // Helpers derivados dos dados (Memoizados)
  const taggedItems = useMemo(() => data ? ensureArray(data.tagged) : [], [data]);
  const allTranslationItems = useMemo(() => data ? Object.values(data).flatMap(ensureArray) : [], [data]);
  
  // --- HELPERS (Áudio e Navegação) ---
  const stopAllAudio = () => {
    if (recognitionRef.current) recognitionRef.current.abort();
    setIsListening(false);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  };

  const handleBackToMenu = () => {
    triggerAdBreak('next', 'return_menu', () => {
        stopAllAudio();
        setView('menu');
        navigate('/translation', { replace: true });
    }, stopAllAudio);
  };

  // --- LOGICA DE ROTA (Só roda quando 'data' existe e 'loading' acabou) ---
  useLayoutEffect(() => {
    if (!loading && data) {
      if (levelId) {
        const isNumeric = /^\d+$/.test(levelId);
        startGame(isNumeric ? parseInt(levelId) : levelId);
      } else {
        setView('menu');
        stopAllAudio();
      }
    }
  }, [levelId, loading, data]); // Adicionei dependências cruciais

  useEffect(() => {
    if (view === 'game' && !answerStatus && window.innerWidth >= 768) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [currentQuestionIndex, view, answerStatus]);

  // Lógica de Regex Flexível
  const createFlexibleRegex = (correctAnswer) => {
    const clean = correctAnswer.toLowerCase().replace(/[.,!?;:]/g, '').trim();
    const tokens = clean.split(/\s+/);
    const regexParts = tokens.map((token, index) => {
      let processedToken = token;
      let isOptional = false;
      if (token.startsWith('(') && token.endsWith(')')) {
        processedToken = token.slice(1, -1); isOptional = true;
      }
      if (processedToken.includes('/')) {
        processedToken = `(?:${processedToken.replace(/\//g, '|')})`;
      } else {
        processedToken = processedToken.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }
      return index === 0 
        ? (isOptional ? `(?:${processedToken}\\s+)?` : `${processedToken}`) 
        : (isOptional ? `(?:\\s+${processedToken})?` : `\\s+${processedToken}`);
    });
    return new RegExp(`^${regexParts.join('')}$`, 'i');
  };

  const checkAnswer = () => {
    if (answerStatus) return; 
    const currentItem = shuffledQuestions[currentQuestionIndex];
    const possibleAnswers = ensureArray(currentItem.en);
    
    const normalizedUser = normalizeSentence(userAnswer);

    const isCorrect = possibleAnswers.some((correctAnswer) => {
      try {
        return createFlexibleRegex(correctAnswer).test(normalizedUser);
      } catch (e) {
        return normalizedUser === normalizeSentence(correctAnswer);
      }
    });

    setAnswerStatus(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) setScore(s => s + 1);
  };

  const startGame = (modeOrLevel) => {
    if (!data) return; // Segurança extra

    setCurrentMode(modeOrLevel);
    let dataToUse = [];

    if (typeof modeOrLevel === 'number') {
        const startIndex = (modeOrLevel - 1) * ITEMS_PER_LEVEL;
        const endIndex = startIndex + ITEMS_PER_LEVEL;
        dataToUse = allTranslationItems.slice(startIndex, endIndex);
    } else {
        const mode = modeOrLevel;
        if (tagMeta[mode]) {
            dataToUse = taggedItems.filter(item => item.tags && item.tags.includes(mode));
        } else if (data[mode]) { // Usa 'data' aqui em vez de TRANSLATION_DATA
            dataToUse = ensureArray(data[mode]);
        } else if (mode === 'all_tenses') {
             dataToUse = allTranslationItems;
        } else {
             dataToUse = allTranslationItems.slice(0, ITEMS_PER_LEVEL);
        }
    }
    
    if (dataToUse.length === 0) {
      navigate('/translation', { replace: true });
      return;
    }

    setShuffledQuestions(shuffleArray(dataToUse));
    setCurrentQuestionIndex(0);
    setScore(0);
    setView('game'); 
    resetTurn();
    window.scrollTo(0, 0);
  };

  const resetTurn = () => {
    setUserAnswer('');
    setAnswerStatus(null);
    setIsListening(false);
  };

  const handleSpeech = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Seu navegador não suporta voz.");

    setIsListening(true);
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e) => {
      setUserAnswer(e.results[0][0].transcript); 
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      resetTurn();
    } else {
      triggerAdBreak('next', 'game_complete', () => setView('result'), stopAllAudio);
    }
  };

  const restartLevel = () => {
      if (levelId) {
          const isNumeric = /^\d+$/.test(levelId);
          startGame(isNumeric ? parseInt(levelId) : levelId);
      } else {
          startGame(currentMode);
      }
  };

  const getPrimaryTag = (tags = []) => tags.find((tag) => Object.keys(tagMeta).includes(tag));
  
  const getGrammarType = (englishSentence) => {
    const sampleSentence = Array.isArray(englishSentence) ? englishSentence[0] : englishSentence;
    if (!sampleSentence || typeof sampleSentence !== 'string') return 'present_perfect';
    const lower = sampleSentence.toLowerCase();
    
    if (/will\s+have\s+been\s+\w+ing/.test(lower)) return 'future_perfect_continuous';
    if (/will\s+have/.test(lower)) return 'future_perfect';
    if (/had\s+been\s+\w+ing/.test(lower)) return 'past_perfect_continuous';
    if (/(have|has|'ve|'s)\s+been\s+\w+ing/.test(lower)) return 'present_perfect_continuous';
    if (/\bhad\b/.test(lower) && !/(have|has|'ve|'s)\s+had/.test(lower)) return 'past_perfect';
    return 'present_perfect';
  };

  // ================= RENDER =================

  // 0. LOADING
  if (loading) {
    return (
      <PageShell title="Translation Master" icon={Languages} iconColorClass="bg-emerald-100 text-emerald-600">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mb-4"></div>
          <p className="text-slate-500 font-medium">Carregando traduções...</p>
        </div>
      </PageShell>
    );
  }

  if (error) {
     return <div className="p-10 text-center text-red-600 font-bold">{error}</div>;
  }

  // 1. MENU
  if (view === 'menu') {
    return (
      <PageShell
        title="Translation Master"
        description="O treino definitivo para você parar de travar. Aprenda a pensar em inglês traduzindo frases reais do dia a dia."
        icon={Languages}
        iconColorClass="bg-emerald-100 text-emerald-600"
      >
        <h3 className="text-slate-500 font-bold uppercase tracking-wider text-sm mb-4 text-left pl-2 border-l-4 border-emerald-500">
           Modos de Treino
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
             {/* Tag Modes */}
             {Object.entries(tagMeta).map(([key, meta]) => (
                 <div key={key} onClick={() => navigate(`/translation/level/${key}`)} className="bg-white border border-slate-200 p-5 rounded-xl cursor-pointer hover:shadow-lg hover:border-emerald-400 transition-all flex items-center gap-4 group">
                    <div className={`p-3 rounded-lg text-white ${meta.color} group-hover:scale-110 transition-transform`}>
                       <meta.icon className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                       <h4 className="font-bold text-slate-800 text-lg">{meta.label}</h4>
                       <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{meta.sub}</span>
                    </div>
                </div>
             ))}
             {/* Extra Modes */}
             <div onClick={() => navigate(`/translation/level/present_perfect`)} className="bg-white border border-slate-200 p-5 rounded-xl cursor-pointer hover:shadow-lg hover:border-blue-400 transition-all flex items-center gap-4 group">
                  <div className="p-3 rounded-lg text-white bg-blue-500 group-hover:scale-110 transition-transform"><CheckCircle className="w-6 h-6" /></div>
                  <div className="text-left"><h4 className="font-bold text-slate-800">Present Perfect</h4></div>
             </div>
             <div onClick={() => navigate(`/translation/level/all_tenses`)} className="bg-white border border-slate-200 p-5 rounded-xl cursor-pointer hover:shadow-lg hover:border-slate-600 transition-all flex items-center gap-4 group">
                  <div className="p-3 rounded-lg text-white bg-slate-800 group-hover:scale-110 transition-transform"><Flame className="w-6 h-6" /></div>
                  <div className="text-left"><h4 className="font-bold text-slate-800">All Tenses</h4></div>
             </div>
        </div>
        <TranslationEducation />
      </PageShell>
    );
  }

  // 2. RESULTADO
  if (view === 'result') {
    return (
      <ResultScreen 
        score={score}
        total={shuffledQuestions.length}
        subtitle={typeof currentMode === 'number' ? `Nível ${currentMode}` : `Modo: ${currentMode}`}
        onRetry={() => triggerAdBreak('next', 'game_retry', restartLevel, stopAllAudio)}
        onBack={handleBackToMenu}
        colorClass="text-emerald-500"
        btnColorClass="bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200"
      />
    );
  }

  // 3. JOGO
  const currentItem = shuffledQuestions[currentQuestionIndex];
  if (!currentItem) return <div className="min-h-screen flex items-center justify-center animate-pulse text-slate-400 font-bold">Carregando nível...</div>;

  // Lógica Visual do Header
  const primaryTag = getPrimaryTag(currentItem.tags);
  const shouldResolveGrammar = ['mix', 'present_perfect', 'past_perfect'].includes(currentMode) || typeof currentMode === 'number';
  const questionType = shouldResolveGrammar && !primaryTag ? getGrammarType(currentItem.en) : (typeof currentMode === 'string' ? currentMode : 'mix');

  let headerColor = 'bg-emerald-500';
  let HeaderIcon = Languages; 
  let headerTitle = 'Traduza';
  
  if (tagMeta[questionType]) {
      headerColor = tagMeta[questionType].color;
      HeaderIcon = tagMeta[questionType].icon; 
      headerTitle = tagMeta[questionType].label;
  } else if (grammarMeta[questionType]) {
      headerColor = grammarMeta[questionType].color;
      headerTitle = grammarMeta[questionType].label;
  } else if (primaryTag && tagMeta[primaryTag]) {
      headerColor = tagMeta[primaryTag].color;
      HeaderIcon = tagMeta[primaryTag].icon;
      headerTitle = tagMeta[primaryTag].label;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col items-center">
      <Helmet>
        <title>{typeof currentMode === 'number' ? `Nível ${currentMode} - EnglishUp` : 'Treino de Tradução - EnglishUp'}</title>
      </Helmet>

      {/* HEADER AD */}
      <div className="w-full bg-white border-b border-slate-200 py-2 flex flex-col items-center justify-center relative z-20 shadow-sm min-h-25">
         <div className="block md:hidden"><AdUnit key={`mob-top`} slotId="8330331714" width="320px" height="100px" label="Patrocinado"/></div>
         <div className="hidden md:block"><AdUnit slotId="5673552248" width="728px" height="90px" label="Patrocinado"/></div>
      </div>

      <div className="w-full max-w-7xl mx-auto flex flex-col xl:flex-row justify-center items-start gap-8 p-4 mt-4">
          
          {/* SIDEBAR ESQUERDA */}
          <div className="hidden xl:flex w-80 shrink-0 flex-col gap-4 sticky top-36">
             <AdUnit key={`desk-left`} slotId="5118244396" width="300px" height="600px" label="Patrocinado"/>
          </div>

          {/* ÁREA CENTRAL */}
          <div className="w-full max-w-2xl flex flex-col">
            <div className="flex justify-between items-center mb-4 px-2">
               <button onClick={handleBackToMenu} className="text-slate-400 hover:text-slate-600 flex items-center gap-1">
                 <ArrowLeft className="w-5 h-5" /> <span className="text-sm font-bold uppercase tracking-wide">Menu</span>
               </button>
               <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">
                 {currentQuestionIndex + 1} / {shuffledQuestions.length}
               </span>
            </div>

            {/* CARD DO JOGO */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative mb-8">
              <div className={`${headerColor} p-8 text-center min-h-40 flex flex-col items-center justify-center transition-colors duration-500`}>
                <span className="text-white/80 uppercase tracking-widest text-xs font-bold mb-3 flex items-center gap-2 justify-center">
                  <HeaderIcon className="w-4 h-4" /> {headerTitle}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight max-w-lg mx-auto">
                  "{currentItem.pt}"
                </h2>
              </div>

              <div className="p-6 md:p-10">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Sua Tradução</label>
                <div className="flex gap-2 mb-6">
                  <div className="relative grow" key={currentQuestionIndex}>
                    <textarea 
                      ref={inputRef}
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      disabled={answerStatus !== null}
                      placeholder="Digite em inglês..."
                      rows={2}
                      className={`w-full p-4 rounded-xl border-2 outline-none font-medium text-lg resize-none transition-all ${
                          answerStatus === 'correct' ? "border-green-500 bg-green-50 text-green-700" :
                          answerStatus === 'incorrect' ? "border-red-500 bg-red-50 text-red-700" :
                          "border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
                      }`}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && !answerStatus) { e.preventDefault(); checkAnswer(); } }}
                    />
                    {answerStatus && (
                      <div className="absolute right-3 top-3">
                        {answerStatus === 'correct' ? <CheckCircle className="w-6 h-6 text-green-500" /> : <XCircle className="w-6 h-6 text-red-500" />}
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={handleSpeech} disabled={answerStatus !== null}
                    className={`p-4 rounded-xl border-2 transition-all h-22 w-22 flex items-center justify-center ${isListening ? 'bg-red-500 border-red-500 text-white animate-pulse' : 'bg-white border-slate-200 text-slate-400'}`}
                  >
                    <Mic className="w-8 h-8" />
                  </button>
                </div>

                <div className="pt-2">
                  {!answerStatus ? (
                    <button onClick={checkAnswer} disabled={!userAnswer.trim()} className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${!userAnswer.trim() ? 'bg-slate-200 text-slate-400' : 'bg-slate-800 text-white'}`}>Verificar</button>
                  ) : (
                    <div className="animate-fadeIn">
                       {answerStatus === 'incorrect' && (
                          <div className="mb-4 bg-red-50 p-4 rounded-xl border border-red-100">
                            <span className="block text-red-400 text-xs font-bold uppercase tracking-wider mb-1">Resposta Correta:</span>
                            <p className="text-red-700 font-bold text-lg">
                                "{ensureArray(currentItem.en)[0].replace(/[()]/g, '')}"
                            </p>            
                          </div>
                       )}
                       <button onClick={nextQuestion} className={`w-full text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-lg ${answerStatus === 'correct' ? 'bg-emerald-500' : 'bg-slate-800'}`}>
                        {currentQuestionIndex < shuffledQuestions.length - 1 ? 'Próxima' : 'Ver Resultados'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <TranslationEducation />
            
            <div className="mt-40 pointer-events-auto">
              <AdUnit slotId="4391086704" width="336px" height="280px" label="Publicidade"/>
            </div>
          </div>

          {/* SIDEBAR DIREITA */}
          <div className="hidden xl:flex w-80 shrink-0 flex-col gap-4 sticky top-36">
             <AdUnit key={`desk-right`} slotId="3805162724" width="300px" height="250px" label="Patrocinado"/>
             <div className="bg-amber-50 rounded-xl p-6 border border-amber-100 shadow-sm">
                <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                   <Trophy className="w-4 h-4" /> Dica Pro
                </h3>
                <p className="text-sm text-amber-700/80 leading-relaxed">
                   Não desanime ao errar! Foque em entender a estrutura da frase para aprimorar sua fluência.
                </p>
             </div>
          </div>
      </div>

      {/* MOBILE AD */}
      <div className="xl:hidden w-full flex flex-col items-center pb-8 bg-slate-50 mt-4 min-h-62.5">
          <AdUnit key={`mob-bot`} slotId="3477859667" width="300px" height="250px" label="Patrocinado"/>
      </div>
    </div>
  );
};

export default TranslationGame;