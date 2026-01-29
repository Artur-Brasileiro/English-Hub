import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { 
  Languages, RefreshCw, ArrowLeft, ArrowRight, CheckCircle, XCircle, Mic, 
  Clock, GitBranch, Shield, ArrowLeftRight, Flame, Target, Scale, Heart, Lock, Lightbulb, Sparkles, HelpCircle,
  PenTool, Trophy
} from 'lucide-react';
import { TRANSLATION_DATA } from '../data/gameData';

// --- IMPORTS DO ADSENSE E HOOK ---
import AdUnit from './ads/AdUnit'; 
import { useH5Ads } from '../hooks/useH5Ads'; 

const ITEMS_PER_LEVEL = 10; 

// --- ÍCONE CUSTOMIZADO ---
const BrainCircuitIcon = ({className}) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.97-3.284"/><path d="M17.97 14.716A4 4 0 0 1 16 18"/></svg>
);

// --- COMPONENTE: CONTEXTO EDUCACIONAL ---
const EducationalContext = () => (
  <section className="w-full mt-12 px-6 py-8 bg-white rounded-3xl border border-slate-200 shadow-sm text-slate-600 animate-fadeIn">
    <div className="flex items-center gap-3 mb-6">
      <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
        <PenTool className="w-6 h-6" />
      </div>
      <h2 className="text-xl md:text-2xl font-bold text-slate-800">
        Active Construction: O Segredo da Fluência
      </h2>
    </div>
    
    <div className="prose prose-slate max-w-none grid md:grid-cols-2 gap-8 text-left">
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
          <BrainCircuitIcon className="w-4 h-4 text-emerald-500" /> Por que traduzir?
        </h3>
        <p className="text-sm leading-relaxed mb-4">
          Diferente de apenas "ler" (passivo), traduzir para o inglês obriga seu cérebro a <strong>construir a frase do zero</strong> (ativo). 
          Isso cria conexões neurais mais fortes e simula a pressão da fala real.
        </p>
      </div>
      
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" /> Gramática Contextual
        </h3>
        <ul className="text-sm space-y-2 list-disc pl-4 marker:text-emerald-500">
          <li><strong>Padrões Reais:</strong> Você aprende <i>Present Perfect</i> ou <i>Conditionals</i> usando-os para resolver problemas, não decorando tabelas.</li>
          <li><strong>Thinking Time:</strong> O esforço agora reduz o tempo que você leva para pensar antes de falar no futuro.</li>
        </ul>
      </div>
    </div>
  </section>
);

const TranslationGame = ({ onBack }) => {
  const navigate = useNavigate();
  const { levelId } = useParams();

  const { triggerAdBreak } = useH5Ads();
  const recognitionRef = useRef(null);

  const [view, setView] = useState('menu'); 
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentMode, setCurrentMode] = useState('mix'); 
  
  const [userAnswer, setUserAnswer] = useState('');
  const [answerStatus, setAnswerStatus] = useState(null); 
  const [isListening, setIsListening] = useState(false);

  // --- CONFIGURAÇÃO VISUAL DOS MODOS ---
  const tagMeta = useMemo(() => ({
    conditional: { label: 'Condicionais', sub: 'If/Se', color: 'bg-amber-500', desc: 'If I had...', icon: GitBranch },
    concessive: { label: 'Concessivas', sub: 'Even/Embora', color: 'bg-teal-600', desc: 'Even if...', icon: Shield },
    temporal: { label: 'Temporais', sub: 'While/When', color: 'bg-cyan-600', desc: 'While/When...', icon: Clock },
    contrast: { label: 'Contraste', sub: 'Mas/Porém', color: 'bg-rose-500', desc: '..., but ...', icon: ArrowLeftRight },
    cause: { label: 'Causa', sub: 'Porque', color: 'bg-lime-600', desc: 'Because/As', icon: Flame },
    purpose: { label: 'Finalidade', sub: 'Para que', color: 'bg-emerald-600', desc: 'So that', icon: Target },
    result: { label: 'Resultado', sub: 'Então', color: 'bg-blue-600', desc: 'Therefore', icon: CheckCircle },
    comparison: { label: 'Comparação', sub: 'Igual a', color: 'bg-violet-600', desc: 'As...as', icon: Scale },
    desire: { label: 'Desejo', sub: 'Quero/Espero', color: 'bg-fuchsia-500', desc: 'I wish', icon: Heart },
    obligation: { label: 'Obrigação', sub: 'Tenho que', color: 'bg-orange-600', desc: 'Must/Have to', icon: Lock },
    advice: { label: 'Conselho', sub: 'Deveria', color: 'bg-sky-600', desc: 'Should', icon: Lightbulb },
    suggestion: { label: 'Sugestão', sub: 'Que tal', color: 'bg-indigo-600', desc: 'Why don’t we?', icon: Sparkles },
    possibility: { label: 'Possibilidade', sub: 'Talvez', color: 'bg-slate-600', desc: 'Might/Maybe', icon: HelpCircle }
  }), []);

  const grammarMeta = {
    present_perfect: { label: 'Present Perfect', color: 'bg-blue-500' },
    present_perfect_continuous: { label: 'Present Perfect Cont.', color: 'bg-blue-700' },
    past_perfect: { label: 'Past Perfect', color: 'bg-purple-500' }, 
    future_perfect: { label: 'Future Perfect', color: 'bg-indigo-600' }, 
    all_tenses: { label: 'All Tenses', color: 'bg-slate-800' },          
    questions: { label: 'Perguntas', color: 'bg-cyan-600' }
  };

  const toArray = (value) => Array.isArray(value) ? value : [];
  const taggedItems = useMemo(() => toArray(TRANSLATION_DATA.tagged), []);
  const allTranslationItems = useMemo(() => Object.values(TRANSLATION_DATA).flatMap(toArray), []);
  
  useEffect(() => {
    if (levelId) {
      const isNumeric = /^\d+$/.test(levelId);
      startGame(isNumeric ? parseInt(levelId) : levelId);
    } else {
      setView('menu');
      stopAllAudio();
    }
  }, [levelId]);

  const stopAllAudio = () => {
    setIsListening(false);
    if (recognitionRef.current) recognitionRef.current.abort();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
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

  const normalizeUserAnswer = (text) => text.toLowerCase().replace(/[.,!?;:]/g, '').replace(/\s+/g, ' ').trim();
  
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
    const currentItem = shuffledQuestions[currentQuestionIndex];
    const possibleAnswers = Array.isArray(currentItem.en) ? currentItem.en : [currentItem.en];
    const normalizedUser = normalizeUserAnswer(userAnswer);

    const isCorrect = possibleAnswers.some((correctAnswer) => {
      try {
        return createFlexibleRegex(correctAnswer).test(normalizedUser);
      } catch (e) {
        return normalizedUser === normalizeUserAnswer(correctAnswer);
      }
    });

    setAnswerStatus(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) setScore(s => s + 1);
  };

  const startGame = (modeOrLevel) => {
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
        } else if (TRANSLATION_DATA[mode]) {
            dataToUse = toArray(TRANSLATION_DATA[mode]);
        } else if (mode === 'all_tenses') {
             dataToUse = allTranslationItems;
        } else {
             dataToUse = allTranslationItems.slice(0, ITEMS_PER_LEVEL);
        }
    }
    
    if (dataToUse.length === 0) {
      alert(`Nível vazio ou não encontrado.`);
      navigate('/translation');
      return;
    }

    const shuffled = [...dataToUse].sort(() => 0.5 - Math.random());
    setShuffledQuestions(shuffled);
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
      triggerAdBreak('next', 'game_complete', () => {
        setView('result');
      }, stopAllAudio);
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

  // --- TELA 1: MENU ---
  if (view === 'menu') {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 animate-fadeIn">
         <Helmet>
            <title>Translation Master - EnglishUp</title>
         </Helmet>

         {/* 1. LAYOUT PADRONIZADO: max-w-6xl (antes era 5xl) */}
         <div className="max-w-6xl mx-auto text-center">
            
            <div className="mb-8">
                <div className="bg-emerald-100 p-4 rounded-full inline-flex mb-4 text-emerald-600 shadow-sm">
                    <Languages className="w-10 h-10 md:w-12 md:h-12" />
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3">
                    Translation Master
                </h1>
                <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-6">
                    Selecione um tópico específico para treinar agora.
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 px-6 py-2 rounded-full font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 mx-auto"
                >
                    <ArrowLeft className="w-4 h-4" /> Voltar ao Hub Principal
                </button>
            </div>

            {/* 2. LINHA DIVISÓRIA (Igual aos outros jogos) */}
            <hr className="border-slate-200 mb-8" />

            {/* LISTA DE MODOS */}
            <h3 className="text-slate-500 font-bold uppercase tracking-wider text-sm mb-4 text-left pl-2 border-l-4 border-emerald-500">
               Modos de Treino
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                 {/* Modos do TagMeta */}
                 {Object.entries(tagMeta).map(([key, meta]) => (
                     <div 
                        key={key} 
                        onClick={() => navigate(`/translation/level/${key}`)}
                        className="bg-white border border-slate-200 p-5 rounded-xl cursor-pointer hover:shadow-lg hover:border-emerald-400 transition-all flex items-center gap-4 group"
                     >
                        <div className={`p-3 rounded-lg text-white ${meta.color} group-hover:scale-110 transition-transform`}>
                           <meta.icon className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                           <h4 className="font-bold text-slate-800 text-lg">{meta.label}</h4>
                           <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{meta.sub}</span>
                        </div>
                    </div>
                 ))}
                 
                 {/* Modos Extras */}
                 <div onClick={() => navigate(`/translation/level/present_perfect`)} className="bg-white border border-slate-200 p-5 rounded-xl cursor-pointer hover:shadow-lg hover:border-blue-400 transition-all flex items-center gap-4 group">
                      <div className="p-3 rounded-lg text-white bg-blue-500 group-hover:scale-110 transition-transform"><CheckCircle className="w-6 h-6" /></div>
                      <div className="text-left"><h4 className="font-bold text-slate-800">Present Perfect</h4></div>
                 </div>
                 <div onClick={() => navigate(`/translation/level/past_perfect`)} className="bg-white border border-slate-200 p-5 rounded-xl cursor-pointer hover:shadow-lg hover:border-purple-400 transition-all flex items-center gap-4 group">
                      <div className="p-3 rounded-lg text-white bg-purple-500 group-hover:scale-110 transition-transform"><Clock className="w-6 h-6" /></div>
                      <div className="text-left"><h4 className="font-bold text-slate-800">Past Perfect</h4></div>
                 </div>

                 <div onClick={() => navigate(`/translation/level/future_perfect`)} className="bg-white border border-slate-200 p-5 rounded-xl cursor-pointer hover:shadow-lg hover:border-indigo-400 transition-all flex items-center gap-4 group">
                      <div className="p-3 rounded-lg text-white bg-indigo-600 group-hover:scale-110 transition-transform"><Sparkles className="w-6 h-6" /></div>
                      <div className="text-left"><h4 className="font-bold text-slate-800">Future Perfect</h4></div>
                 </div>
                 <div onClick={() => navigate(`/translation/level/questions`)} className="bg-white border border-slate-200 p-5 rounded-xl cursor-pointer hover:shadow-lg hover:border-cyan-400 transition-all flex items-center gap-4 group">
                      <div className="p-3 rounded-lg text-white bg-cyan-600 group-hover:scale-110 transition-transform"><HelpCircle className="w-6 h-6" /></div>
                      <div className="text-left"><h4 className="font-bold text-slate-800">Perguntas</h4></div>
                 </div>
                 <div onClick={() => navigate(`/translation/level/all_tenses`)} className="bg-white border border-slate-200 p-5 rounded-xl cursor-pointer hover:shadow-lg hover:border-slate-600 transition-all flex items-center gap-4 group">
                      <div className="p-3 rounded-lg text-white bg-slate-800 group-hover:scale-110 transition-transform"><Flame className="w-6 h-6" /></div>
                      <div className="text-left"><h4 className="font-bold text-slate-800">All Tenses</h4></div>
                 </div>
            </div>

            <EducationalContext />
         </div>
      </div>
    );
  }

  // --- TELA 2: RESULTADO ---
  if (view === 'result') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 py-12 px-4 animate-fadeIn">
        <Helmet><title>Resultado - EnglishUp</title></Helmet>
        
        <div className="mb-6">
          <AdUnit slotId="2492081057" width="300px" height="250px" label="Publicidade" />
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 max-w-md w-full text-center">
            <h2 className="text-4xl font-bold text-slate-800 mb-2">Treino Concluído!</h2>
            <div className="text-6xl font-black text-emerald-500 mb-4">{score}/{shuffledQuestions.length}</div>
            <p className="text-slate-400 font-medium mb-6 uppercase tracking-wider text-xs">
                 {typeof currentMode === 'number' ? `Nível ${currentMode}` : `Modo: ${currentMode}`}
            </p>
            <div className="flex gap-3 flex-col w-full">
               <button 
                  onClick={() => triggerAdBreak('next', 'game_retry', restartLevel, stopAllAudio)} 
                  className="bg-emerald-500 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
               >
                  <RefreshCw className="w-4 h-4" /> Jogar Novamente
               </button>
               <button 
                  onClick={() => triggerAdBreak('next', 'back_menu', () => navigate('/translation'), stopAllAudio)} 
                  className="border-2 border-slate-200 text-slate-600 px-6 py-3.5 rounded-xl font-bold hover:bg-slate-50 transition-colors"
               >
                  Escolher Outro Nível
               </button>
            </div>
        </div>
      </div>
    );
  }

  // --- TELA 3: JOGO ---
  const currentItem = shuffledQuestions[currentQuestionIndex];
  
  if (!currentItem) {
      return (
        <div className="min-h-screen flex items-center justify-center text-slate-500 font-bold animate-pulse">
           Carregando nível...
        </div>
      );
  }

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
        <title>{typeof currentMode === 'number' ? `Nível ${currentMode}` : 'Treino'} - EnglishUp</title>
      </Helmet>

      {/* HEADER AD */}
      <div className="w-full bg-white border-b border-slate-200 py-2 flex flex-col items-center justify-center relative z-20 shadow-sm min-h-25 md:min-h-27.5">
         <div className="block md:hidden"><AdUnit key={`mob-top`} slotId="8330331714" width="320px" height="100px" label="Patrocinado"/></div>
         <div className="hidden md:block"><AdUnit slotId="5673552248" width="728px" height="90px" label="Patrocinado"/></div>
      </div>

      {/* WRAPPER DE 3 COLUNAS */}
      <div className="w-full max-w-360 mx-auto flex flex-col xl:flex-row justify-center items-start gap-5 p-4 mt-4">
          
          {/* ANÚNCIO ESQUERDA */}
          <div className="hidden xl:flex w-80 shrink-0 flex-col gap-4 sticky top-36">
             <AdUnit key={`desk-left`} slotId="5118244396" width="300px" height="600px" label="Patrocinado"/>
          </div>

          {/* ÁREA CENTRAL DO JOGO */}
          <div className="w-full max-w-2xl flex flex-col">
            
            <div className="flex justify-between items-center mb-4 px-2">
               <button onClick={() => navigate('/translation')} className="text-slate-400 hover:text-slate-600 flex items-center gap-1">
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
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      disabled={answerStatus !== null}
                      placeholder="Digite em inglês..."
                      rows={2}
                      // 3. ESTILO DE INPUT PADRONIZADO (Border-2 + Focus Ring Emerald)
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
                                "{Array.isArray(currentItem.en) ? currentItem.en[0].replace(/[()]/g, '') : currentItem.en.replace(/[()]/g, '')}"
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

            <EducationalContext />
            
            <div className="mt-8 hidden md:flex justify-center">
               <AdUnit slotId="4391086704" width="336px" height="280px" label="Publicidade"/>
            </div>

          </div>

          {/* ANÚNCIO DIREITA */}
          <div className="hidden xl:flex w-80 shrink-0 flex-col gap-4 sticky top-36">
             <AdUnit key={`desk-right`} slotId="3805162724" width="300px" height="250px" label="Patrocinado"/>
             
             {/* Dica Pro */}
             <div className="bg-amber-50 rounded-xl p-6 border border-amber-100 shadow-sm">
                <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                   <Trophy className="w-4 h-4" /> Dica Pro
                </h3>
                <p className="text-sm text-amber-700/80 leading-relaxed">
                   Não desanime ao errar! Foque em entender a estrutura da frase e o porquê da correção para aprimorar sua fluência.
                </p>
             </div>
          </div>
      </div>

      {/* MOBILE AD */}
      <div className="xl:hidden w-full flex flex-col items-center pb-8 bg-slate-50 mt-4">
          <AdUnit key={`mob-bot`} slotId="3477859667" width="300px" height="250px" label="Patrocinado"/>
      </div>
    </div>
  );
};

export default TranslationGame;