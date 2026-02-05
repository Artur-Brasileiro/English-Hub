import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { 
  BrainCircuit, Layers, ArrowLeft, ArrowRight, 
  CheckCircle, XCircle, HelpCircle, Lightbulb
} from 'lucide-react';

import { loadGameData } from '../utils/dataLoader';

import AdUnit from './ads/AdUnit';
import { useH5Ads } from '../hooks/useH5Ads';
import PageShell from './layout/PageShell';
import ResultScreen from './shared/ResultScreen';
import PhrasalVerbsEducation from '../content/PhrasalVerbsEducation';
import { normalizeLoose } from '../utils/textUtils';
import { shuffleArray } from '../utils/arrayUtils';

const ITEMS_PER_PHASE = 10;

const PhrasalVerbsGame = ({ onBack }) => {
  const navigate = useNavigate();
  const { levelId } = useParams();
  const { triggerAdBreak } = useH5Ads();

  // --- REFS & STATES ---
  const firstInputRef = useRef(null);
  const educationRef = useRef(null); // 1. Ref para a metodologia
  
  // States de Dados Assíncronos
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [view, setView] = useState('menu'); 
  const [activePhase, setActivePhase] = useState(1);
  const [score, setScore] = useState(0); 
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [phaseQuestions, setPhaseQuestions] = useState([]);
  
  const [userAnswers, setUserAnswers] = useState([]);
  const [feedback, setFeedback] = useState(null); 
  
  const totalPhases = data.length > 0 ? Math.ceil(data.length / ITEMS_PER_PHASE) : 0;

  // --- EFFECT: Carregar Dados ---
  useEffect(() => {
    loadGameData('phrasal-verbs.json')
      .then((jsonData) => {
        setData(jsonData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Erro ao carregar Phrasal Verbs.");
        setLoading(false);
      });
  }, []);

  // --- AUDIO CONTROL ---
  const stopAllAudio = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (typeof window.stopListening === 'function') window.stopListening();
  };

  // --- NAVIGATION ---
  const handleBackToMenu = () => {
    triggerAdBreak('next', 'return_menu', () => {
        stopAllAudio();
        setView('menu');
        navigate('/phrasal', { replace: true });
    }, stopAllAudio);
  };

  // --- LOGICA DE ROTA ---
  useLayoutEffect(() => {
    if (!loading && data.length > 0) {
      if (levelId) {
        const phaseNum = parseInt(levelId, 10);
        if (!isNaN(phaseNum) && phaseNum > 0 && phaseNum <= totalPhases) {
            startGame(phaseNum);
        } else {
            navigate('/phrasal', { replace: true });
        }
      } else {
        setView('menu');
        stopAllAudio();
      }
    }
  }, [levelId, loading, totalPhases]); 

  useEffect(() => {
    if (view === 'game' && !feedback && firstInputRef.current && window.innerWidth >= 768) {
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
  }, [currentQuestionIndex, view, feedback]);

  // 2. Função de Scroll
  const scrollToEducation = () => {
    if (educationRef.current) {
      educationRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // --- GAME LOGIC ---
  const startGame = (phaseNumber) => {
    if (data.length === 0) return;

    setActivePhase(phaseNumber);
    const startIndex = (phaseNumber - 1) * ITEMS_PER_PHASE;
    const endIndex = startIndex + ITEMS_PER_PHASE;
    const originalQuestions = data.slice(startIndex, endIndex); 
    
    if (originalQuestions.length === 0) {
      navigate('/phrasal', { replace: true });
      return;
    }

    const shuffledQuestions = shuffleArray(originalQuestions);
    
    setPhaseQuestions(shuffledQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setView('game');
    
    if (shuffledQuestions.length > 0) {
      initializeInputs(shuffledQuestions[0]);
    }
    window.scrollTo(0,0);
  };

  const initializeInputs = (verbData) => {
    setUserAnswers(new Array(verbData.definitions.length).fill(''));
    setFeedback(null);
  };

  const handleInputChange = (index, value) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
  };

  const checkAnswer = (e) => {
    e.preventDefault();
    if (feedback) return;

    setFeedback('checked');
    const currentVerb = phaseQuestions[currentQuestionIndex];
    const correctMeanings = currentVerb.definitions.map(d => normalizeLoose(d.meaning));
    
    let currentTurnScore = 0;
    userAnswers.forEach(answer => {
      if (correctMeanings.includes(normalizeLoose(answer))) currentTurnScore += 1;
    });
    setScore(prev => prev + currentTurnScore);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < phaseQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      initializeInputs(phaseQuestions[nextIndex]);
    } else {
      triggerAdBreak('next', 'phase_complete', () => setView('result'), stopAllAudio);
    }
  };

  const getInputStatus = (userValue, correctMeanings) => {
    if (!feedback) return 'neutral';
    const val = normalizeLoose(userValue);
    if (!val) return 'empty';
    return correctMeanings.includes(val) ? 'correct' : 'wrong';
  };

  // ================= RENDER =================

  // 0. LOADING
  if (loading) {
    return (
      <PageShell title="Phrasal Verbs Master" icon={BrainCircuit} iconColorClass="bg-indigo-100 text-indigo-600">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent mb-4"></div>
          <p className="text-slate-500 font-medium">Carregando verbos...</p>
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
        title="Phrasal Verbs Master"
        description="Pare de traduzir ao pé da letra. Aprenda os phrasal verbs essenciais para entender filmes, séries e conversas reais em inglês."
        icon={BrainCircuit}
        iconColorClass="bg-indigo-100 text-indigo-600"
        onMethodologyClick={scrollToEducation} // 3. Passando a função
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {totalPhases > 0 ? (
              Array.from({ length: totalPhases }).map((_, idx) => {
                const phaseNum = idx + 1;
                return (
                  <button 
                    key={phaseNum} 
                    onClick={() => navigate(`/phrasal/level/${phaseNum}`)} 
                    className="group relative bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-500 hover:shadow-xl transition-all duration-300 text-left"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-slate-50 p-2.5 rounded-xl group-hover:bg-indigo-50 transition-colors">
                        <Layers className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded-md">
                        {ITEMS_PER_PHASE} Verbs
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">
                      Fase {phaseNum}
                    </h3>
                  </button>
                );
              })
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-slate-400 font-medium flex items-center justify-center gap-2">
                  <HelpCircle className="w-5 h-5" /> Adicione verbos ao arquivo de dados.
                </p>
              </div>
            )}
        </div>
        
        {/* 4. Wrapper com Ref */}
        <div ref={educationRef}>
            <PhrasalVerbsEducation />
        </div>
      </PageShell>
    );
  }

  // 2. RESULTADO
  if (view === 'result') {
    const maxScore = phaseQuestions.reduce((acc, curr) => acc + curr.definitions.length, 0);
    const percentage = Math.round((score / maxScore) * 100);
    let message = percentage > 80 ? "Excellent!" : percentage > 50 ? "Well done!" : "Bom começo!";

    return (
      <ResultScreen 
        title={message}
        score={score}
        total={maxScore}
        subtitle={`Fase ${activePhase}`}
        onRetry={() => triggerAdBreak('next', 'retry', () => startGame(activePhase), stopAllAudio)}
        onBack={handleBackToMenu}
        colorClass="text-indigo-600"
        btnColorClass="bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
      />
    );
  }

  // 3. JOGO
  const currentVerb = phaseQuestions[currentQuestionIndex];
  if (!currentVerb) return <div>Carregando...</div>;
  const correctMeaningsLower = currentVerb.definitions.map(d => normalizeLoose(d.meaning));

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col items-center">
      <Helmet>
        <title>{`Fase ${activePhase} | Phrasal Verbs - EnglishUp`}</title>
      </Helmet>

      {/* HEADER AD */}
      <div className="w-full bg-white border-b border-slate-200 py-2 flex flex-col items-center justify-center relative z-20 shadow-sm min-h-25">
         <div className="block md:hidden"><AdUnit key="mob-top" slotId="8330331714" width="320px" height="100px" label="Patrocinado"/></div>
         <div className="hidden md:block"><AdUnit slotId="5673552248" width="728px" height="90px" label="Patrocinado"/></div>
      </div>

      <div className="w-full max-w-7xl mx-auto flex flex-col xl:flex-row justify-center items-start gap-8 p-4 mt-4">
          
          {/* SIDEBAR ESQUERDA */}
          <div className="hidden xl:flex w-80 shrink-0 flex-col gap-4 sticky top-36">
             <AdUnit key="desk-left" slotId="5118244396" width="300px" height="600px" label="Patrocinado"/>
          </div>

          {/* AREA CENTRAL */}
          <div className="w-full max-w-2xl flex flex-col">
             
             <div className="flex justify-between items-center mb-6 px-2">
                <button onClick={handleBackToMenu} className="text-slate-400 hover:text-slate-600 flex items-center gap-1">
                  <ArrowLeft className="w-5 h-5" /> <span className="text-sm font-bold uppercase tracking-wide">Menu</span>
                </button>
                <div className="text-right">
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mb-1 inline-block">Fase {activePhase}</span>
                  <span className="block text-slate-400 text-xs font-bold tracking-widest">{currentQuestionIndex + 1} / {phaseQuestions.length}</span>
                </div>
             </div>

             <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col relative mb-8">
                <div className="bg-indigo-600 p-10 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                  <span className="relative z-10 text-indigo-200 uppercase tracking-widest text-xs font-bold mb-3 block">Traduza o Phrasal Verb</span>
                  <h2 className="relative z-10 text-4xl md:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-md">{currentVerb.verb}</h2>
                </div>

                <div className="p-8">
                  <form onSubmit={checkAnswer}>
                    <p className="text-sm text-slate-500 font-bold mb-4 flex items-center gap-2">
                      <BrainCircuit className="w-4 h-4 text-indigo-500" />
                      Escreva {currentVerb.definitions.length} {currentVerb.definitions.length === 1 ? 'significado' : 'significados'}:
                    </p>

                    <div className="space-y-4 mb-8">
                      {userAnswers.map((answer, index) => {
                        const status = getInputStatus(answer, correctMeaningsLower);
                        
                        let borderClass = "border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50";
                        if (feedback) {
                          if (status === 'correct') borderClass = "border-2 border-green-500 bg-green-50 text-green-700";
                          else if (status === 'wrong') borderClass = "border-2 border-red-300 bg-red-50 text-red-700 decoration-wavy";
                          else borderClass = "border-2 border-slate-200 bg-slate-50";
                        }

                        return (
                          <div key={index} className="relative group animate-fadeIn">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-sm">{index + 1}.</span>
                            <input
                              ref={index === 0 ? firstInputRef : null}
                              type="text"
                              value={answer}
                              onChange={(e) => handleInputChange(index, e.target.value)}
                              disabled={!!feedback}
                              className={`w-full pl-10 pr-12 py-4 rounded-xl outline-none font-semibold text-lg transition-all ${borderClass}`}
                              placeholder={`Significado ${index + 1}`}
                              autoComplete="off"
                            />
                            {feedback && status === 'correct' && <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-green-500" />}
                            {feedback && status === 'wrong' && <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-red-400" />}
                          </div>
                        );
                      })}
                    </div>

                    {!feedback ? (
                      <button 
                        type="submit" 
                        disabled={userAnswers.every(a => a.trim() === '')}
                        className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95"
                      >
                        Verificar Respostas
                      </button>
                    ) : (
                      <div className="animate-fadeIn">
                        <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 mb-6">
                          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">Respostas Esperadas:</h4>
                          <div className="space-y-3">
                            {currentVerb.definitions.map((def, i) => (
                              <div key={i} className="flex flex-col bg-white p-3 rounded-xl border border-indigo-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                  <span className="font-bold text-indigo-700">{def.meaning}</span>
                                </div>
                                <p className="text-xs text-slate-500 italic pl-3.5">"{def.example}"</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <button 
                          onClick={nextQuestion} 
                          type="button"
                          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                          {currentQuestionIndex < phaseQuestions.length - 1 ? 'Próximo Verbo' : 'Ver Resultado'} <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </form>
                </div>
             </div>
             
             {/* MUDANÇA AQUI: forçar 1 coluna dentro do jogo */}
             <PhrasalVerbsEducation forceSingleColumn={true} />

             <div className="mt-12 pointer-events-auto flex flex-col items-center">
                <AdUnit slotId="4391086704" width="336px" height="280px" label="Publicidade"/>
             </div>
          </div>

          {/* SIDEBAR DIREITA */}
          <div className="hidden xl:flex w-80 shrink-0 flex-col gap-4 sticky top-36">
             <AdUnit key="desk-right" slotId="3805162724" width="300px" height="250px" label="Patrocinado"/>
             <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100 shadow-sm">
                <h3 className="font-bold text-indigo-800 mb-2 flex items-center gap-2">
                   <Lightbulb className="w-4 h-4" /> Dica Pro
                </h3>
                <p className="text-sm text-indigo-700/80 leading-relaxed">
                   Alguns phrasal verbs são separáveis! Você pode dizer <em>"Turn off the lights"</em> ou <em>"Turn the lights off"</em>.
                </p>
             </div>
          </div>
      </div>

      {/* MOBILE AD */}
      <div className="xl:hidden w-full flex flex-col items-center pb-8 bg-slate-50 mt-4 min-h-62.5">
          <AdUnit key="mob-bot" slotId="3477859667" width="300px" height="250px" label="Patrocinado"/>
      </div>
    </div>
  );
};

export default PhrasalVerbsGame;