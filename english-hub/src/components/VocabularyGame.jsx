import React, { useState, useMemo, useRef, useEffect, useLayoutEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight, Check, X, Trophy, ArrowLeft, PlayCircle,
  CornerDownLeft, BookOpen, ArrowDown
} from 'lucide-react';

import { loadGameData } from '../utils/dataLoader';

import AdUnit from './ads/AdUnit'; 
import { useH5Ads } from '../hooks/useH5Ads'; 

import PageShell from './layout/PageShell';
import ResultScreen from './shared/ResultScreen';
import VocabularyEducation from '../content/VocabularyEducation';
import { normalizeText, normalizeLoose, calculateSimilarity } from '../utils/textUtils';
import { shuffleArray } from '../utils/arrayUtils';

const WORDS_PER_LEVEL = 30;

const buildAcceptedAnswers = (ptArray) => {
  const accepted = new Set();
  const list = Array.isArray(ptArray) ? ptArray : [];
  for (const raw of list) {
    const base = normalizeLoose(raw);
    if (base) accepted.add(base);
  }
  return accepted;
};

const isPronunciationMatch = (heardRaw, targetRaw) => {
  const heard = normalizeText(heardRaw);
  const target = normalizeText(targetRaw);
  if (!heard || !target) return false;
  if (heard === target) return true;
  if (heard.includes(target)) return true;
  
  const score = calculateSimilarity(heard, target);
  
  if (target.length <= 4) return score >= 0.8;
  return score >= 0.85;
};

const VocabularyGame = ({ onBack }) => {
  const navigate = useNavigate();
  const { levelId } = useParams();
  const { triggerAdBreak } = useH5Ads();

  // --- STATES DE DADOS (Assíncrono) ---
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const urlLevel = levelId ? parseInt(levelId) : null;
  
  const totalLevels = data.length > 0 ? Math.ceil(data.length / WORDS_PER_LEVEL) : 0;

  // States
  const [view, setView] = useState('loading'); 
  const [currentLevelId, setCurrentLevelId] = useState(urlLevel || 1);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [tags, setTags] = useState([]); 
  const [typingText, setTypingText] = useState('');
  
  const [feedback, setFeedback] = useState(null);
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });
  const [levelShuffleKey, setLevelShuffleKey] = useState(0);
  const [answerReport, setAnswerReport] = useState(null);

  // Áudio
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [pronunciationFeedback, setPronunciationFeedback] = useState(null); 
  const [pronunciationError, setPronunciationError] = useState(null);
  const [speechRate, setSpeechRate] = useState(1);

  // Refs
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  
  // Ref para a seção de metodologia
  const educationRef = useRef(null);

  // --- CARREGAMENTO DE DADOS ---
  useEffect(() => {
    loadGameData('vocabulary.json')
      .then((jsonData) => {
        setData(jsonData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Erro ao carregar vocabulário.");
        setLoading(false);
      });
  }, []);

  // --- AUDIO HELPER ---
  const stopAllAudio = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    if (recognitionRef.current) recognitionRef.current.abort();
    setIsListening(false);
  };

  // --- NAVIGATION HELPER ---
  const handleBackToMenu = () => {
    triggerAdBreak('next', 'return_menu', () => {
        stopAllAudio();
        setView('menu');
        navigate('/vocabulary', { replace: true });
    }, stopAllAudio);
  };

  // --- LOGICA DE ROTA ---
  useLayoutEffect(() => {
  if (!loading && data.length > 0) {
    if (urlLevel) {
      const safeLevel = Math.min(Math.max(urlLevel, 1), totalLevels || 1);
      setCurrentLevelId(safeLevel);
      setView('game');
      restartInternalState();
      window.scrollTo(0, 0);
    } else {
      setView('menu');
      stopAllAudio();
    }
  }
}, [urlLevel, loading, totalLevels]);

  const restartInternalState = () => {
    stopAllAudio();
    setCurrentWordIndex(0);
    setStats({ correct: 0, wrong: 0 });
    setSpeechRate(1);
    setLevelShuffleKey((prev) => prev + 1);
    resetInputsAndFeedback();
  };

  const currentLevelWords = useMemo(() => {
    if (data.length === 0) return []; 
    const startIndex = (currentLevelId - 1) * WORDS_PER_LEVEL;
    const endIndex = startIndex + WORDS_PER_LEVEL;
    const levelWords = data.slice(startIndex, endIndex); 
    return shuffleArray(levelWords);
  }, [currentLevelId, levelShuffleKey, data]);

  const currentWord = currentLevelWords[currentWordIndex];

  useEffect(() => {
    if (!feedback && view === 'game' && window.innerWidth >= 768) {
        inputRef.current?.focus();
    }
  }, [currentWordIndex, feedback, view]);

  // --- LOGIC ---
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
    setView('game'); // <--- ADICIONE ESTA LINHA
    restartInternalState();
    window.scrollTo(0, 0);
  };

  const nextWord = () => {
    resetInputsAndFeedback();
    if (currentWordIndex + 1 < currentLevelWords.length) {
      setCurrentWordIndex((prev) => prev + 1);
    } else {
      triggerAdBreak('next', 'level_complete', () => setView('result'), stopAllAudio);
    }
  };

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

    setAnswerReport({ provided: providedEval, missing });
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

  // --- AUDIO LOGIC ---
  const speakCurrentWord = () => {
    if (!currentWord?.en) return;
    if (!window.speechSynthesis) return setPronunciationError('Erro áudio');
    
    const utterance = new SpeechSynthesisUtterance(currentWord.en);
    utterance.lang = 'en-US';
    utterance.rate = speechRate;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => { setIsSpeaking(false); setPronunciationError('Erro áudio'); };
    setPronunciationError(null);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const startPronunciationCheck = () => {
    if (!currentWord?.en) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return setPronunciationError('Navegador não suporta');

    if (recognitionRef.current) recognitionRef.current.abort();
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 5;

    const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
    if (SpeechGrammarList) {
      try {
        const grammar = `#JSGF V1.0; grammar words; public <word> = ${currentWord.en};`;
        const list = new SpeechGrammarList();
        list.addFromString(grammar, 1);
        recognition.grammars = list;
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
      if (!results || results.length === 0) return setPronunciationFeedback('wrong');
      
      const alternatives = Array.from(results).map((r) => ({ transcript: r.transcript || '' }));
      const hit = alternatives.some((alt) => isPronunciationMatch(alt.transcript, currentWord.en));
      setPronunciationFeedback(hit ? 'correct' : 'wrong');
    };
    
    recognitionRef.current = recognition;
    recognition.start();
  };
  
  // Função de scroll para a metodologia
  const scrollToEducation = () => {
      if (educationRef.current) {
          educationRef.current.scrollIntoView({ behavior: 'smooth' });
      }
  };

  // ================= RENDER =================

  // 0. LOADING
  if (loading) {
    return (
      <PageShell title="Vocabulary Builder" icon={BookOpen} iconColorClass="bg-rose-100 text-rose-600">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-500 border-t-transparent mb-4"></div>
          <p className="text-slate-500 font-medium">Carregando vocabulário...</p>
        </div>
      </PageShell>
    );
  }

  if (error) {
     return <div className="p-10 text-center text-red-600 font-bold">{error}</div>;
  }

  // 1. MENU (Atualizado com headerActions)
  if (view === 'menu') {
    const levelsArray = Array.from({ length: totalLevels }, (_, i) => i + 1);

    return (
      <PageShell
        title="Vocabulary Builder"
        description={`O jogo ideal para treinar seu vocabulário e aprender as palavras mais usadas do inglês. São ${data.length} termos essenciais divididos em ${totalLevels} níveis.`}
        icon={BookOpen}
        iconColorClass="bg-rose-100 text-rose-600"
        onMethodologyClick={scrollToEducation} // <--- SÓ PASSAR A FUNÇÃO AQUI
      >

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
                      {Math.min(levelId * WORDS_PER_LEVEL, data.length)}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
                    <PlayCircle className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
        </div>
        
        <div ref={educationRef}>
            <VocabularyEducation />
        </div>
      </PageShell>
    );
  }

  // 2. RESULTADO
  if (view === 'result') {
    return (
      <ResultScreen 
        score={stats.correct}
        total={currentLevelWords.length}
        subtitle={`Nível ${currentLevelId}`}
        onRetry={() => triggerAdBreak('next', 'level_retry', restartLevelInternal, stopAllAudio)}
        onBack={handleBackToMenu}
        colorClass="text-rose-500"
        btnColorClass="bg-slate-800 hover:bg-slate-900 shadow-slate-300"
      >
        <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
              <p className="text-4xl font-black text-green-600">{stats.correct}</p>
              <p className="text-xs font-bold text-green-800 uppercase tracking-wider">Acertos</p>
            </div>
            <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
              <p className="text-4xl font-black text-red-500">{stats.wrong}</p>
              <p className="text-xs font-bold text-red-800 uppercase tracking-wider">Erros</p>
            </div>
        </div>
        
        {currentLevelId < totalLevels && (
             <button
                onClick={() => triggerAdBreak('next', `level_complete_${currentLevelId}`, () => navigate(`/vocabulary/level/${currentLevelId + 1}`), stopAllAudio)}
                className="w-full bg-rose-600 text-white py-3.5 rounded-xl font-bold hover:bg-rose-700 transition-colors shadow-lg flex items-center justify-center gap-2 mb-3"
              >
                Próximo Nível <ArrowRight className="w-4 h-4" />
              </button>
        )}
      </ResultScreen>
    );
  }

  // 3. JOGO
  const progressPercentage = (currentWordIndex / currentLevelWords.length) * 100;
  
  if (!currentWord) {
      return (
          <div className="min-h-screen flex items-center justify-center text-slate-400 font-bold gap-2">
            <div className="w-4 h-4 rounded-full bg-slate-400 animate-pulse"></div> Carregando nível...
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col items-center">
      <Helmet>
        <title>{`Nível ${currentLevelId} - EnglishUp`}</title> 
      </Helmet>
      
      {/* HEADER AD */}
      <div className="w-full bg-white border-b border-slate-200 py-2 flex flex-col items-center justify-center relative z-20 shadow-sm min-h-25 md:min-h-27.5">         
         <div className="block md:hidden"><AdUnit key={`mob-top`} slotId="8330331714" width="320px" height="100px" label="Patrocinado"/></div>
         <div className="hidden md:block"><AdUnit slotId="5673552248" width="728px" height="90px" label="Patrocinado"/></div>
      </div>

      <div className="w-full max-w-360 mx-auto flex flex-col xl:flex-row justify-center items-start gap-11 p-4 mt-4">          
          {/* SIDEBAR ESQUERDA */}
          <div className="hidden xl:flex w-80 shrink-0 flex-col gap-4 sticky top-36">
             <AdUnit key={`desk-left`} slotId="5118244396" width="300px" height="600px" label="Patrocinado"/>
          </div>

          {/* ÁREA CENTRAL */}
          <div className="w-full max-w-2xl flex flex-col">
            
            <div className="flex items-center justify-between mb-4 px-2">
              <button onClick={handleBackToMenu} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold transition-colors text-sm uppercase tracking-wide">
                <ArrowLeft className="w-4 h-4" /> Menu
              </button>
              <span className="text-slate-400 font-bold text-sm uppercase tracking-wide">Nível {currentLevelId}</span>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative mb-8">
              <div className="w-full bg-slate-100 h-2">
                <div className="bg-rose-600 h-2 transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }} />
              </div>

              <div className="p-6 md:p-12 text-center">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-widest rounded-full mb-8">
                  <PlayCircle className="w-3 h-3" /> Palavra {currentWordIndex + 1} / {currentLevelWords.length}
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
                      <select value={speechRate} onChange={(e) => setSpeechRate(Number(e.target.value))} className="border border-slate-200 rounded-md px-2 py-1 text-slate-700 bg-white text-xs font-bold">
                        <option value={0.5}>0.5x</option>
                        <option value={0.75}>0.75x</option>
                        <option value={1}>1x</option>
                        <option value={1.25}>1.25x</option>
                      </select>
                    </label>

                    <button type="button" onClick={speakCurrentWord} className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors disabled:opacity-50" disabled={isSpeaking}>
                      {isSpeaking ? 'Reproduzindo...' : 'Ouvir pronuncia'}
                    </button>

                    <button type="button" onClick={startPronunciationCheck} className="px-4 py-2 rounded-lg bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 transition-colors disabled:opacity-50 flex items-center gap-2" disabled={isListening}>
                      <span>{isListening ? 'Ouvindo...' : 'Repetir pronuncia'}</span>
                      <div className={`w-3 h-3 rounded-full transition-all duration-300 border border-white ${isListening ? 'bg-yellow-300 animate-pulse' : pronunciationFeedback === 'correct' ? 'bg-green-400 scale-110' : pronunciationFeedback === 'wrong' ? 'bg-red-500' : 'bg-rose-400/50'}`} />
                    </button>
                  </div>
                  {pronunciationError && <p className="text-xs text-red-500 font-medium">{pronunciationError}</p>}
                </div>

                {/* ÁREA DE RESPOSTA */}
                <div className="max-w-3xl mx-auto mb-8">
                    <div 
                        className={`min-h-17.5 w-full bg-white border-2 rounded-xl flex flex-wrap items-center gap-2 p-3 cursor-text transition-all shadow-sm ${feedback ? (feedback === 'correct' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : (isFocused ? 'border-rose-500 shadow-md' : 'border-slate-200 hover:border-slate-300')}`}
                        onClick={() => !feedback && inputRef.current?.focus()}
                    >
                        {tags.map((tag, idx) => {
                            let tagStyle = "bg-slate-100 border-slate-300 text-slate-700";
                            let icon = null;
                            if (feedback && answerReport) {
                                const result = answerReport.provided.find(p => p.text === tag);
                                if (result?.ok) { tagStyle = "bg-green-100 border-green-400 text-green-800"; icon = <Check className="w-3 h-3 ml-1" />; }
                                else { tagStyle = "bg-red-100 border-red-400 text-red-800 opacity-70 line-through decoration-red-500"; }
                            }
                            return (
                                <span key={idx} className={`px-3 py-1.5 rounded-lg text-lg font-medium border flex items-center animate-scale-in ${tagStyle}`}>
                                    {tag} {icon}
                                    {!feedback && <button onClick={(e) => { e.stopPropagation(); removeTag(idx); }} className="ml-2 text-slate-400 hover:text-slate-600"><X className="w-3 h-3" /></button>}
                                </span>
                            );
                        })}

                        {!feedback && (
                            <input ref={inputRef} type="text" value={typingText} onChange={(e) => setTypingText(e.target.value)} onKeyDown={handleKeyDown} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} className="grow bg-transparent outline-none text-lg font-medium text-slate-800 placeholder:text-slate-300 min-w-35 text-left" placeholder={tags.length === 0 ? "Digite a tradução..." : "Digite outra..."} autoComplete="off" />
                        )}

                        {!feedback && (typingText || tags.length > 0) && (
                             <button onClick={checkAnswer} className="bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors shadow-md p-2 ml-auto" title="Enviar respostas">
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
                          <Check className="w-5 h-5" /> <span className="font-bold">Correto!</span>
                        </div>
                        {answerReport?.missing?.length > 0 && <p className="text-xs text-slate-500 mt-2 text-center">Outras opções: <strong>{answerReport.missing.join(', ')}</strong></p>}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-red-600 mb-6">
                        <div className="flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full mb-2">
                          <X className="w-5 h-5" /> <span className="font-bold">Ops! Não foi dessa vez.</span>
                        </div>
                        <p className="text-slate-500 text-sm mt-1">Respostas corretas: <strong className="text-slate-700">{currentWord.pt.join(', ')}</strong></p>
                      </div>
                    )}

                    <button onClick={nextWord} autoFocus className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold text-white shadow-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mx-auto ${feedback === 'correct' ? 'bg-green-600 hover:bg-green-700 shadow-green-200' : 'bg-slate-800 hover:bg-slate-900 shadow-slate-300'}`}>
                      {currentWordIndex + 1 === currentLevelWords.length ? 'Ver Resultado' : 'Próxima Palavra'} <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* MUDANÇA AQUI: Força 1 coluna dentro do jogo */}
            <VocabularyEducation forceSingleColumn={true} />

            <div className="mt-12 pointer-events-auto flex flex-col items-center">
              <AdUnit slotId="4391086704" width="336px" height="280px" label="Publicidade"/>
            </div>
          </div>

          {/* SIDEBAR DIREITA */}
          <div className="hidden xl:flex w-80 shrink-0 flex-col gap-4 sticky top-36">
             <AdUnit key={`desk-right`} slotId="3805162724" width="300px" height="250px" label="Patrocinado"/>
             <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
                <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                   <Trophy className="w-4 h-4" /> Dica Pro
                </h3>
                <p className="text-sm text-amber-700/80">Tente usar sinônimos quando possível! Isso aumenta sua pontuação oculta.</p>
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

export default VocabularyGame;