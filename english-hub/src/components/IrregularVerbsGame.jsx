import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import {
  Gamepad2, ToggleLeft, ToggleRight, Layers, ArrowLeft,
  ArrowRight as ArrowRightIcon, CheckCircle, XCircle, Trophy
} from 'lucide-react';

import { loadGameData } from '../utils/dataLoader';

import AdUnit from './ads/AdUnit';
import { useH5Ads } from '../hooks/useH5Ads';
import PageShell from './layout/PageShell';
import ResultScreen from './shared/ResultScreen';
import IrregularVerbsEducation from '../content/IrregularVerbsEducation';
import { normalizeLoose } from '../utils/textUtils';
import { shuffleArray } from '../utils/arrayUtils';

const ITEMS_PER_PHASE = 10;

const IrregularVerbsGame = ({ onBack }) => {
  const navigate = useNavigate();
  const { levelId } = useParams();
  const { triggerAdBreak } = useH5Ads();
  
  // --- STATE ---
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
  
  // Configuração dos modos
  const [selectedModes, setSelectedModes] = useState({
    presente: true,
    passado: true,
    participio: true,
  });

  const [userAnswers, setUserAnswers] = useState({
    presente: '',
    passado: '',
    participio: '',
  });

  const [feedback, setFeedback] = useState(null);
  
  // Total de fases agora depende do data carregado
  const totalPhases = data.length > 0 ? Math.ceil(data.length / ITEMS_PER_PHASE) : 0;

  // --- EFFECT: Carregar Dados ---
  useEffect(() => {
    loadGameData('irregular-verbs.json')
      .then((jsonData) => {
        setData(jsonData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Erro ao carregar verbos irregulares.");
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
        navigate('/irregular', { replace: true });
    }, stopAllAudio);
  };

  // --- LOGICA DE ROTA ---
  useLayoutEffect(() => {
    // Só processa a rota se os dados já chegaram
    if (!loading && data.length > 0) {
      if (levelId) {
        const phaseNum = parseInt(levelId, 10);
        if (!isNaN(phaseNum) && phaseNum > 0 && phaseNum <= totalPhases) {
            startGame(phaseNum);
        } else {
            navigate('/irregular', { replace: true });
        }
      } else {
        setView('menu');
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
  const toggleMode = (mode) => {
    setSelectedModes((prev) => ({ ...prev, [mode]: !prev[mode] }));
  };

  const startGame = (phaseNumber) => {
    if (data.length === 0) return;

    setActivePhase(phaseNumber);
    const startIndex = (phaseNumber - 1) * ITEMS_PER_PHASE;
    const endIndex = startIndex + ITEMS_PER_PHASE;
    const originalQuestions = data.slice(startIndex, endIndex); 
    
    if (originalQuestions.length === 0) {
        navigate('/irregular', { replace: true });
        return;
    }

    setPhaseQuestions(shuffleArray(originalQuestions));
    setCurrentQuestionIndex(0);
    setScore(0);
    initializeInputs();
    setView('game');
    window.scrollTo(0,0);
  };

  const initializeInputs = () => {
    setUserAnswers({ presente: '', passado: '', participio: '' });
    setFeedback(null);
  };

  const goToLevel = (phaseNum) => {
      if (!selectedModes.presente && !selectedModes.passado && !selectedModes.participio) {
        alert('Selecione pelo menos um tempo verbal para treinar!');
        return;
      }
      navigate(`/irregular/level/${phaseNum}`);
  };

  const handleInputChange = (field, value) => {
    setUserAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const checkAnswer = (e) => {
    e.preventDefault();
    if (feedback) return;

    setFeedback('checked');
    const currentVerb = phaseQuestions[currentQuestionIndex];
    let pointsGained = 0;

    if (selectedModes.presente && normalizeLoose(userAnswers.presente) === normalizeLoose(currentVerb.presente)) pointsGained++;
    if (selectedModes.passado && normalizeLoose(userAnswers.passado) === normalizeLoose(currentVerb.passado)) pointsGained++;
    if (selectedModes.participio && normalizeLoose(userAnswers.participio) === normalizeLoose(currentVerb.particípio)) pointsGained++;

    setScore((prev) => prev + pointsGained);
  };

  const nextQuestion = (e) => {
    if (e) e.preventDefault();

    if (currentQuestionIndex < phaseQuestions.length - 1) {
      initializeInputs();
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      triggerAdBreak('next', 'phase_complete', () => setView('result'), stopAllAudio);
    }
  };

  const restartLevel = () => startGame(activePhase);

  const getInputStatus = (modeKey, correctValue) => {
    if (!feedback) return 'neutral';
    const userValue = normalizeLoose(userAnswers[modeKey]);
    const correct = normalizeLoose(correctValue);
    
    if (!userValue) return 'empty';
    if (userValue === correct) return 'correct';
    return 'wrong';
  };

  const renderInputField = (modeKey, label, correctValue, isFirst) => {
    const status = getInputStatus(modeKey, correctValue);
    
    let borderClass = 'border-2 border-slate-200 bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-50';
    let icon = null;

    if (feedback) {
      if (status === 'correct') {
        borderClass = 'border-2 border-green-500 bg-green-50 text-green-700';
        icon = <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />;
      } else if (status === 'wrong' || status === 'empty') {
        borderClass = 'border-2 border-red-300 bg-red-50 text-red-700';
        icon = <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" />;
      }
    }

    return (
      <div key={`${modeKey}-${currentQuestionIndex}`} className="relative mb-4 animate-fadeIn">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
          {label}
        </label>
        <div className="relative">
          <input
            ref={isFirst ? firstInputRef : null}
            type="text"
            value={userAnswers[modeKey]}
            onChange={(e) => handleInputChange(modeKey, e.target.value)}
            placeholder="Digite..."
            className={`w-full p-4 text-center text-lg font-medium rounded-xl outline-none transition-all shadow-sm focus:placeholder-transparent ${borderClass}`}
            disabled={feedback !== null}
          />
          {icon}
        </div>
        {feedback && (status === 'wrong' || status === 'empty') && (
          <div className="text-xs text-red-500 font-bold mt-2 ml-1 flex items-center gap-1 animate-fadeIn">
             <span>Resposta:</span> <span className="text-red-600">{correctValue}</span>
          </div>
        )}
      </div>
    );
  };

  // ================= RENDER =================

  // 0. LOADING
  if (loading) {
    return (
      <PageShell title="Irregular Verbs Challenge" icon={Gamepad2} iconColorClass="bg-orange-100 text-orange-600">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent mb-4"></div>
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
        title="Irregular Verbs Challenge"
        description="Decore a tabela de verbos irregulares de uma vez por todas. Treine Past Simple e Participle e pare de travar na hora de falar."
        icon={Gamepad2}
        iconColorClass="bg-orange-100 text-orange-600"
        onMethodologyClick={scrollToEducation} // 3. Passando a função
      >
          {/* Seletor de Modos */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-lg mx-auto mb-12">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Modos de Treino
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {['presente', 'passado', 'participio'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => toggleMode(mode)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all ${
                    selectedModes[mode]
                      ? 'bg-orange-50 text-orange-700 border border-orange-400 shadow-sm'
                      : 'bg-white text-slate-400 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {selectedModes[mode] ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
            {!selectedModes.presente && !selectedModes.passado && !selectedModes.participio && (
              <p className="text-red-500 text-xs mt-3 font-bold">Selecione pelo menos um!</p>
            )}
          </div>
  
          {/* Grade de Níveis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {totalPhases > 0 ? (
              Array.from({ length: totalPhases }).map((_, idx) => {
                const phaseNum = idx + 1;
                return (
                  <button
                    key={phaseNum}
                    onClick={() => goToLevel(phaseNum)}
                    className="group relative bg-white border border-slate-200 rounded-2xl p-6 hover:border-orange-400 hover:shadow-lg transition-all text-left"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-orange-50 p-2.5 rounded-lg group-hover:bg-orange-100 transition-colors text-orange-600">
                        <Layers className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded-md">
                        {ITEMS_PER_PHASE} Verbs
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Fase {phaseNum}</h3>
                    <p className="text-sm text-slate-500">
                      Verbos {(phaseNum - 1) * ITEMS_PER_PHASE + 1} - {phaseNum * ITEMS_PER_PHASE}
                    </p>
                  </button>
                );
              })
            ) : (
              <div className="col-span-full text-center py-10 text-slate-400">Adicione mais verbos!</div>
            )}
          </div>
          
          {/* 4. Wrapper da Ref */}
          <div ref={educationRef}>
             <IrregularVerbsEducation />
          </div>
      </PageShell>
    );
  }

  // 2. RESULTADO (MANTIDO IGUAL)
  if (view === 'result') {
    const activeModesCount = Object.values(selectedModes).filter(Boolean).length;
    const maxScore = phaseQuestions.length * activeModesCount;

    return (
      <ResultScreen 
        score={score}
        total={maxScore}
        subtitle={`Fase ${activePhase}`}
        onRetry={() => triggerAdBreak('next', 'phase_retry', restartLevel, stopAllAudio)}
        onBack={handleBackToMenu}
        colorClass="text-orange-500"
        btnColorClass="bg-orange-500 hover:bg-orange-600 shadow-orange-200"
      />
    );
  }

  // 3. JOGO
  const currentVerb = phaseQuestions[currentQuestionIndex];
  if (!currentVerb) return <div>Carregando...</div>; 

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col items-center">
      
      <Helmet>
        <title>{`Fase ${activePhase} | Irregular Verbs - EnglishUp`}</title>
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
             
             <div className="flex justify-between items-center mb-6 px-2">
                <button onClick={handleBackToMenu} className="text-slate-400 hover:text-slate-600 flex items-center gap-1">
                  <ArrowLeft className="w-5 h-5" /> <span className="text-sm font-bold uppercase tracking-wide">Menu</span>
                </button>
                <div className="text-right">
                  <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full mb-1 inline-block">
                    Fase {activePhase}
                  </span>
                  <span className="block text-slate-400 text-xs font-bold tracking-widest">
                    {currentQuestionIndex + 1} / {phaseQuestions.length}
                  </span>
                </div>
              </div>

              {/* Card do Jogo */}
              <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col animate-fade-in-up mb-8">
                <div className="bg-orange-500 p-8 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                  <span className="relative z-10 text-orange-100 uppercase tracking-widest text-xs font-bold mb-2 block">
                    Traduzir
                  </span>
                  <h2 className="relative z-10 text-4xl font-black text-white capitalize">{currentVerb.pt}</h2>
                </div>

                <div className="p-6 md:p-8">
                  <form onSubmit={checkAnswer}>
                    {selectedModes.presente && renderInputField('presente', 'Presente', currentVerb.presente, true)}
                    {selectedModes.passado && renderInputField('passado', 'Passado', currentVerb.passado, !selectedModes.presente)}
                    {selectedModes.participio && renderInputField('participio', 'Particípio', currentVerb.particípio, !selectedModes.presente && !selectedModes.passado)}

                    {!feedback ? (
                      <button
                        key="btn-verificar"
                        type="submit"
                        className="w-full mt-4 bg-slate-800 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-900 transition-all shadow-lg hover:shadow-xl transform active:scale-95"
                      >
                        Verificar
                      </button>
                    ) : (
                      <button
                        key="btn-proximo"
                        type="button"
                        onClick={nextQuestion}
                        className="w-full mt-4 bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg flex items-center justify-center gap-2"
                      >
                        {currentQuestionIndex < phaseQuestions.length - 1 ? 'Próximo Verbo' : 'Ver Resultado'}{' '}
                        <ArrowRightIcon className="w-5 h-5" />
                      </button>
                    )}
                  </form>
                </div>
              </div>

             {/* MUDANÇA AQUI: Força 1 coluna dentro do jogo */}
             <IrregularVerbsEducation forceSingleColumn={true} />

             <div className="mt-12 pointer-events-auto flex flex-col items-center">
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
                   Alguns verbos repetem o Passado e Particípio. Foque nesses padrões e aprenda o dobro na metade do tempo!
                </p>
             </div>
          </div>
      </div>

      {/* MOBILE BOTTOM AD */}
      <div className="xl:hidden w-full flex flex-col items-center pb-8 bg-slate-50 mt-4 min-h-62.5">
          <AdUnit key={`mob-bot`} slotId="3477859667" width="300px" height="250px" label="Patrocinado"/>
      </div>

    </div>
  );
};

export default IrregularVerbsGame;