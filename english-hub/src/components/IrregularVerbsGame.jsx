import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import {
  Gamepad2,
  ToggleLeft,
  ToggleRight,
  Layers,
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  XCircle,
  ArrowRight as ArrowRightIcon,
  BookOpen,
  Zap,
  Target,
  Trophy
} from 'lucide-react';
import { IRREGULAR_VERBS_DATA } from '../data/gameData';
import AdUnit from './ads/AdUnit';
import { useH5Ads } from '../hooks/useH5Ads';

const ITEMS_PER_PHASE = 10;

// --- FUNÇÃO UTILITÁRIA DE NORMALIZAÇÃO (Protocolo de Unificação) ---
const normalizeLoose = (text) => {
  return String(text ?? '')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\p{L}\p{N}\s-]/gu, '') // Remove caracteres especiais
    .replace(/\s+/g, ' '); // Remove espaços extras
};

// --- COMPONENTE: CONTEXTO EDUCACIONAL ---
const EducationalContext = () => (
  <section className="w-full mt-12 px-6 py-10 bg-white rounded-3xl border border-slate-200 shadow-sm text-slate-600 animate-fadeIn">
    {/* Cabeçalho do Artigo */}
    <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
      <div className="bg-orange-100 p-3 rounded-xl text-orange-600 shadow-sm">
        <BookOpen className="w-8 h-8" />
      </div>
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
          Guia Definitivo dos Verbos Irregulares
        </h2>
        <p className="text-slate-500 font-medium mt-1">
          Por que eles são difíceis e como memorizar rápido.
        </p>
      </div>
    </div>
    
    <div className="prose prose-slate max-w-none grid md:grid-cols-2 gap-10 text-left">
      
      {/* Coluna 1: A Lógica */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" /> 
            Pare de decorar em ordem alfabética!
          </h3>
          <p className="text-sm leading-relaxed text-slate-600">
            O maior erro dos estudantes é tentar memorizar a lista de A a Z. O segredo para a fluência é agrupar os verbos por <strong>padrões sonoros</strong>. Nosso cérebro aprende por associação, não por listas frias.
          </p>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Os 3 Grupos de Ouro</h4>
          <ul className="text-sm space-y-3">
            <li className="flex gap-3">
              <span className="font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded text-xs h-fit">1</span>
              <span>
                <strong>Os Invariáveis:</strong> Verbos que nunca mudam. Ex: <em>Cut / Cut / Cut</em> ou <em>Cost / Cost / Cost</em>. Se você errar, ninguém percebe!
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded text-xs h-fit">2</span>
              <span>
                <strong>O som do "T":</strong> Verbos que terminam com som seco de T no passado. Ex: <em>Sleep / Slept / Slept</em>.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded text-xs h-fit">3</span>
              <span>
                <strong>O padrão "N":</strong> Comuns no Particípio. Ex: <em>Speak / Spoke / Spoken</em>.
              </span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Coluna 2: A Aplicação */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-rose-500" /> 
            Onde a maioria erra (Simple Past vs Participle)
          </h3>
          <p className="text-sm leading-relaxed text-slate-600 mb-4">
            Confundir a segunda e a terceira coluna é o erro gramatical mais comum. Entenda a diferença crucial para não travar na hora de falar:
          </p>
          
          <ul className="space-y-4">
            <li className="bg-white border-l-4 border-emerald-400 pl-4 py-1">
              <span className="block text-xs font-bold text-emerald-600 uppercase mb-1">Simple Past (2ª Coluna)</span>
              <p className="text-sm text-slate-700 italic">"I <strong>went</strong> to Brazil last year."</p>
              <p className="text-xs text-slate-400 mt-1">Usado para ações concluídas em um tempo específico.</p>
            </li>
            <li className="bg-white border-l-4 border-indigo-400 pl-4 py-1">
              <span className="block text-xs font-bold text-indigo-600 uppercase mb-1">Past Participle (3ª Coluna)</span>
              <p className="text-sm text-slate-700 italic">"I have <strong>gone</strong> to Brazil many times."</p>
              <p className="text-xs text-slate-400 mt-1">Essencial para tempos perfeitos (Have/Has) e Voz Passiva.</p>
            </li>
          </ul>
        </div>

        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
          <h3 className="text-amber-800 font-bold text-sm mb-2 flex items-center gap-2">
            <Trophy className="w-4 h-4" /> Dica de Estudo: Active Recall
          </h3>
          <p className="text-xs text-amber-700/80 leading-relaxed">
            Este jogo usa o método de "Active Recall". Ao digitar a resposta em vez de apenas ler, você força seu cérebro a recuperar a informação, criando conexões neurais 50% mais fortes do que apenas leitura passiva.
          </p>
        </div>
      </div>

    </div>
  </section>
);

const IrregularVerbsGame = ({ onBack }) => {
  const navigate = useNavigate();
  const { levelId } = useParams();
  
  const { triggerAdBreak } = useH5Ads();
  
  // --- PROTOCOLO DE UNIFICAÇÃO: ÁUDIO ---
  const stopAllAudio = () => { 
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    // Safety check para STT
    if (typeof window.stopListening === 'function') {
        window.stopListening();
    }
  };

  const [view, setView] = useState('menu'); // Padronizado: 'menu' | 'game' | 'result'
  const [activePhase, setActivePhase] = useState(1);

  const [selectedModes, setSelectedModes] = useState({
    presente: true,
    passado: true,
    participio: true,
  });

  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [phaseQuestions, setPhaseQuestions] = useState([]);

  const [userAnswers, setUserAnswers] = useState({
    presente: '',
    passado: '',
    participio: '',
  });

  const [feedback, setFeedback] = useState(null);
  const firstInputRef = useRef(null);
  const totalPhases = Math.ceil(IRREGULAR_VERBS_DATA.length / ITEMS_PER_PHASE);

  useEffect(() => {
    if (levelId) {
      const phaseNum = parseInt(levelId, 10);
      if (!isNaN(phaseNum) && phaseNum > 0 && phaseNum <= totalPhases) {
          startGame(phaseNum);
      } else {
          alert("Fase inválida!");
          navigate('/irregular', { replace: true });
      }
    } else {
      setView('menu');
    }
  }, [levelId]);

  // --- PROTOCOLO DE UNIFICAÇÃO: ROTEAMENTO ---
  const handleBackToMenu = () => {
    triggerAdBreak('next', 'return_menu', () => {
        stopAllAudio();
        setView('menu');
        navigate('/irregular', { replace: true });
    }, stopAllAudio);
  };

  const toggleMode = (mode) => {
    setSelectedModes((prev) => ({ ...prev, [mode]: !prev[mode] }));
  };

  const initializeInputs = () => {
    setUserAnswers({ presente: '', passado: '', participio: '' });
    setFeedback(null);
  };

  const startGame = (phaseNumber) => {
    setActivePhase(phaseNumber);
    const startIndex = (phaseNumber - 1) * ITEMS_PER_PHASE;
    const endIndex = startIndex + ITEMS_PER_PHASE;
    const originalQuestions = IRREGULAR_VERBS_DATA.slice(startIndex, endIndex);
    
    if (originalQuestions.length === 0) {
        navigate('/irregular', { replace: true });
        return;
    }

    const shuffledQuestions = [...originalQuestions].sort(() => 0.5 - Math.random());

    setPhaseQuestions(shuffledQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    initializeInputs();
    setView('game');
    window.scrollTo(0,0);
  };

  const goToLevel = (phaseNum) => {
      if (!selectedModes.presente && !selectedModes.passado && !selectedModes.participio) {
        alert('Selecione pelo menos um tempo verbal para treinar!');
        return;
      }
      navigate(`/irregular/level/${phaseNum}`);
  };

  useEffect(() => {
    if (view === 'game' && !feedback && firstInputRef.current) {
      setTimeout(() => {
        // Só foca se a tela for maior que 768px (Tablet/PC)
        if (window.innerWidth >= 768) {
          firstInputRef.current?.focus();
        }
      }, 50);
    }
  }, [currentQuestionIndex, view, feedback]);

  const handleInputChange = (field, value) => {
    setUserAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const checkAnswer = (e) => {
    e.preventDefault();
    if (feedback) return;

    setFeedback('checked');
    const currentVerb = phaseQuestions[currentQuestionIndex];
    let pointsGained = 0;

    // --- PROTOCOLO DE UNIFICAÇÃO: Validação Normalizada ---
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
      triggerAdBreak('next', 'phase_complete', () => {
          setView('result');
      }, stopAllAudio);
    }
  };

  const restartLevel = () => {
     startGame(activePhase); 
  };

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
    
    // Configuração com bordas de 2px (Estilo Vocabulary Game)
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

  // ===========================
  // TELA CONFIG (MENU)
  // ===========================
  if (view === 'menu') {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 animate-fadeIn">
        <Helmet>
          <title>Tabela de Verbos Irregulares e Exercícios | EnglishUp</title>
          <meta 
            name="description" 
            content="Memorize a tabela de verbos irregulares jogando. Exercícios de Past Simple e Participle para aprender inglês sozinho e de graça." 
          />
        </Helmet>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="bg-orange-100 p-4 rounded-full inline-flex mb-4 text-orange-600 shadow-sm">
              <Gamepad2 className="w-10 h-10 md:w-12 md:h-12" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3">
              Irregular Verbs Challenge
            </h1>
            
            <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-6">
              Decore a <strong>tabela de verbos irregulares</strong> de uma vez por todas. 
              Treine Past Simple e Participle e pare de travar na hora de falar.
            </p>
  
            {/* BOTÃO VOLTAR AO HUB (Lógica correta: sai do jogo) */}
            <button
              onClick={() => navigate("/", { replace: true })}
              className="bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-800 px-6 py-2 rounded-full font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar ao Hub Principal
            </button>
          </div>
  
          {/* Divisória idêntica ao Vocabulary Game */}
          <hr className="border-slate-200 mb-8" />
  
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
  
          {/* GRADE DE NÍVEIS */}
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
          
          {/* --- NOVO: Contexto Educacional no Menu --- */}
          <EducationalContext />
        </div>
      </div>
    );
  }

  // ===========================
  // TELA RESULTADO
  // ===========================
  if (view === 'result') {
    const activeModesCount = Object.values(selectedModes).filter(Boolean).length;
    const maxScore = phaseQuestions.length * activeModesCount;

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 animate-fadeIn">
        <div className="mb-6">
          <AdUnit slotId="2492081057" width="300px" height="250px" label="Publicidade" />
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 max-w-md w-full text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Treino Concluído!</h2>
          <div className="text-5xl font-black text-orange-500 mb-2">
            {score} <span className="text-2xl text-slate-300">/ {maxScore}</span>
          </div>
          <p className="text-slate-500 mb-8 font-medium">Você concluiu a Fase {activePhase}</p>

          <div className="flex gap-4 flex-col">
            <button
              onClick={() => triggerAdBreak('next', 'phase_retry', restartLevel, stopAllAudio)}
              className="bg-orange-500 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
            >
              <RefreshCw className="w-5 h-5" /> Repetir Fase
            </button>

            {/* --- CORREÇÃO PROTOCOLO: Roteamento Seguro --- */}
            <button
              onClick={handleBackToMenu}
              className="bg-white border-2 border-slate-200 text-slate-600 px-6 py-3.5 rounded-xl font-bold hover:bg-slate-50 transition-colors"
            >
              Escolher Outra Fase
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===========================
  // TELA JOGO
  // ===========================
  const currentVerb = phaseQuestions[currentQuestionIndex];
  if (!currentVerb) return <div>Carregando...</div>; 

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col items-center">
      <Helmet>
        <title>Tabela de Verbos Irregulares e Exercícios | EnglishUp</title>
        <meta 
          name="description" 
          content="Memorize a tabela de verbos irregulares jogando. Exercícios de Past Simple e Participle para aprender inglês sozinho e de graça." 
        />
      </Helmet>

      {/* 1. HEADER AD */}
      <div className="w-full bg-white border-b border-slate-200 py-2 flex flex-col items-center justify-center relative z-20 shadow-sm min-h-25 md:min-h-27.5">
         <div className="block md:hidden">
            <AdUnit key={`mobile-top-irregular`} slotId="8330331714" width="320px" height="100px" label="Patrocinado"/>
         </div>
         <div className="hidden md:block">
            <AdUnit slotId="5673552248" width="728px" height="90px" label="Patrocinado"/>
         </div>
      </div>

      {/* 2. LAYOUT WRAPPER (3 COLUNAS) */}
      <div className="w-full max-w-360 mx-auto flex flex-col xl:flex-row justify-center items-start gap-11 p-4 mt-4">
          
          {/* SIDEBAR ESQUERDA */}
          <div className="hidden xl:flex w-80 shrink-0 flex-col gap-4 sticky top-36">
             <AdUnit key={`desktop-left-irregular`} slotId="5118244396" width="300px" height="600px" label="Patrocinado"/>
          </div>

          {/* ÁREA CENTRAL */}
          <div className="w-full max-w-xl flex flex-col">
             
             {/* Header do Jogo */}
             <div className="flex justify-between items-center mb-6 px-2">
                {/* --- CORREÇÃO PROTOCOLO: handleBackToMenu --- */}
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

             {/* --- NOVO: Contexto Educacional no Jogo --- */}
             <EducationalContext />

             {/* Anúncio Quadrado (Desktop) */}
             <div className="mt-40 pointer-events-auto">
                <AdUnit slotId="4391086704" width="336px" height="280px" label="Publicidade"/>
             </div>
          </div>

          {/* SIDEBAR DIREITA */}
          <div className="hidden xl:flex w-80 shrink-0 flex-col gap-4 sticky top-36">
             <AdUnit key={`desktop-right-irregular`} slotId="3805162724" width="300px" height="250px" label="Patrocinado"/>
             
             {/* --- NOVO: Dica Pro (Widget) --- */}
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

      {/* 3. MOBILE BOTTOM AD */}
      <div className="xl:hidden w-full flex flex-col items-center pb-8 bg-slate-50 mt-4">
          <div className="h-24 w-full flex items-center justify-center pointer-events-none">
             <span className="text-[10px] text-slate-300 uppercase tracking-widest">--- Publicidade abaixo ---</span>
          </div>
          <AdUnit key={`mobile-bottom-irregular`} slotId="3477859667" width="300px" height="250px" label="Patrocinado"/>
      </div>

    </div>
  );
};

export default IrregularVerbsGame;