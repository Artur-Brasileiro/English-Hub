import React, { useState, useEffect, useRef } from 'react';
import { BrainCircuit, Layers, ArrowLeft, RefreshCw, CheckCircle, XCircle, ArrowRight, HelpCircle } from 'lucide-react';
import { PHRASAL_VERBS_DATA } from '../data/gameData';

const ITEMS_PER_PHASE = 10;

const PhrasalVerbsGame = ({ onBack }) => {
  const [gameState, setGameState] = useState('start'); 
  const [activePhase, setActivePhase] = useState(1);
  const [score, setScore] = useState(0); 
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [phaseQuestions, setPhaseQuestions] = useState([]);
  
  // Estados do Turno Atual
  const [userAnswers, setUserAnswers] = useState([]);
  const [feedback, setFeedback] = useState(null); 
  const firstInputRef = useRef(null);

  const totalPhases = Math.ceil(PHRASAL_VERBS_DATA.length / ITEMS_PER_PHASE);

  // --- LÓGICA DE INICIALIZAÇÃO ---

  const startGame = (phaseNumber) => {
    setActivePhase(phaseNumber);
    const startIndex = (phaseNumber - 1) * ITEMS_PER_PHASE;
    const endIndex = startIndex + ITEMS_PER_PHASE;
    
    // 1. Pega os verbos fixos desta fase (ex: 1 ao 10)
    const originalQuestions = PHRASAL_VERBS_DATA.slice(startIndex, endIndex);
    
    // 2. Cria uma cópia e embaralha a ordem APENAS desses 10
    const shuffledQuestions = [...originalQuestions].sort(() => 0.5 - Math.random());
    
    setPhaseQuestions(shuffledQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setGameState('playing');
    
    if (shuffledQuestions.length > 0) {
      initializeInputs(shuffledQuestions[0]);
    }
  };

  const initializeInputs = (verbData) => {
    const count = verbData.definitions.length;
    setUserAnswers(new Array(count).fill(''));
    setFeedback(null);
  };

  useEffect(() => {
    if (gameState === 'playing' && !feedback && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [currentQuestionIndex, gameState, feedback]);

  // --- LÓGICA DE JOGO ---

  const handleInputChange = (index, value) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
  };

  const checkAnswer = (e) => {
    e.preventDefault();
    setFeedback('checked');

    const currentVerb = phaseQuestions[currentQuestionIndex];
    // Lista de significados corretos normalizados
    const correctMeanings = currentVerb.definitions.map(d => d.meaning.trim().toLowerCase());
    
    let currentTurnScore = 0;
    
    userAnswers.forEach(answer => {
      const normalizedAnswer = answer.trim().toLowerCase();
      if (correctMeanings.includes(normalizedAnswer)) {
        currentTurnScore += 1;
      }
    });

    setScore(prev => prev + currentTurnScore);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < phaseQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      initializeInputs(phaseQuestions[nextIndex]);
    } else {
      setGameState('result');
    }
  };

  // Retorna o status de cada input individualmente
  const getInputStatus = (userValue, correctMeanings) => {
    if (!feedback) return 'neutral';
    const normalizedValue = userValue.trim().toLowerCase();
    
    if (!normalizedValue) return 'empty';
    if (correctMeanings.includes(normalizedValue)) return 'correct';
    return 'wrong';
  };

  // --- TELAS ---

  if (gameState === 'start') {
    return (
      <div className="flex flex-col h-full py-8 px-4 animate-fadeIn max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="bg-indigo-100 p-5 rounded-full inline-flex mb-4 text-indigo-600 shadow-sm">
            <BrainCircuit className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 mb-3">Phrasal Verbs Master</h2>
          <p className="text-slate-600 text-lg max-w-lg mx-auto leading-relaxed">
            Escreva os significados corretos. Se um verbo tiver múltiplos sentidos, você precisará acertar todos!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-8">
          {totalPhases > 0 ? (
            Array.from({ length: totalPhases }).map((_, idx) => {
              const phaseNum = idx + 1;
              return (
                <button 
                  key={phaseNum} 
                  onClick={() => startGame(phaseNum)} 
                  className="group relative bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-slate-50 p-2.5 rounded-xl group-hover:bg-indigo-50 transition-colors">
                      <Layers className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded-md">
                      {ITEMS_PER_PHASE} Verbs
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">
                    Fase {phaseNum}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">
                    Verbos {((phaseNum - 1) * ITEMS_PER_PHASE) + 1} - {phaseNum * ITEMS_PER_PHASE}
                  </p>
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

        <div className="text-center mt-auto">
          <button onClick={onBack} className="text-slate-400 hover:text-slate-600 text-sm font-bold flex items-center justify-center gap-2 mx-auto transition-colors px-6 py-3 rounded-full hover:bg-slate-100">
            <ArrowLeft className="w-4 h-4" /> Voltar ao Hub
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'result') {
    const maxScore = phaseQuestions.reduce((acc, curr) => {
      // Conta o número de definições
      return acc + curr.definitions.length;
    }, 0);

    const percentage = Math.round((score / maxScore) * 100);
    
    let message = "Bom começo!";
    if (percentage > 80) message = "Excellent!";
    else if (percentage > 50) message = "Well done!";

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 animate-fadeIn">
        <div className="text-center bg-white p-10 rounded-3xl shadow-xl border border-slate-100 max-w-md w-full">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">{message}</h2>
          <p className="text-slate-500 mb-8 font-medium">Você concluiu a Fase {activePhase}</p>
          
          <div className="relative w-40 h-40 mx-auto mb-8 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
              <path className="text-indigo-600" strokeDasharray={`${percentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black text-indigo-600">{score}</span>
              <span className="text-xs font-bold text-slate-400 uppercase">de {maxScore} pts</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => startGame(activePhase)} 
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" /> Tentar Novamente
            </button>
            <button 
              onClick={() => setGameState('start')} 
              className="w-full bg-slate-50 text-slate-600 py-3.5 rounded-xl font-bold hover:bg-slate-100 transition-colors border border-slate-200"
            >
              Escolher Outra Fase
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDERIZAÇÃO DO JOGO (PLAYING) ---
  
  const currentVerb = phaseQuestions[currentQuestionIndex];
  const correctMeaningsLower = currentVerb.definitions.map(d => d.meaning.toLowerCase().trim());

  return (
    <div className="max-w-xl mx-auto py-6 px-4 flex flex-col min-h-screen md:min-h-[80vh]">
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={() => setGameState('start')} 
          className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-end">
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider mb-1">
            Fase {activePhase}
          </span>
          <span className="text-slate-400 text-xs font-bold tracking-widest">
            {currentQuestionIndex + 1} / {phaseQuestions.length}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col relative animate-fade-in-up">
        
        <div className="bg-indigo-600 p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <span className="relative z-10 text-indigo-200 uppercase tracking-widest text-xs font-bold mb-3 block">
            Traduza o Phrasal Verb
          </span>
          <h2 className="relative z-10 text-4xl md:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-md">
            {currentVerb.verb}
          </h2>
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
                let borderClass = "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50";
                let icon = null;

                if (feedback) {
                  if (status === 'correct') {
                    borderClass = "border-green-500 bg-green-50 text-green-700";
                    icon = <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-green-500" />;
                  } else if (status === 'wrong') {
                    borderClass = "border-red-300 bg-red-50 text-red-700 decoration-wavy";
                    icon = <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-red-400" />;
                  } else {
                     borderClass = "border-slate-200 bg-slate-50";
                  }
                }

                return (
                  <div key={index} className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-sm">
                      {index + 1}.
                    </span>
                    <input
                      ref={index === 0 ? firstInputRef : null}
                      type="text"
                      value={answer}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      disabled={!!feedback}
                      className={`w-full pl-10 pr-12 py-4 rounded-xl border-2 outline-none font-semibold text-lg transition-all ${borderClass}`}
                      placeholder={`Significado ${index + 1}`}
                      autoComplete="off"
                    />
                    {icon}
                  </div>
                );
              })}
            </div>

            {!feedback ? (
              <button 
                type="submit" 
                disabled={userAnswers.every(a => a.trim() === '')}
                className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform active:scale-95"
              >
                Verificar Respostas
              </button>
            ) : (
              <div className="animate-fadeIn">
                <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 mb-6">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">
                    Respostas Esperadas:
                  </h4>
                  <div className="space-y-3">
                    {/* Renderiza cada definição com seu exemplo específico */}
                    {currentVerb.definitions.map((def, i) => (
                      <div key={i} className="flex flex-col bg-white p-3 rounded-xl border border-indigo-100 shadow-sm">
                         <div className="flex items-center gap-2 mb-1">
                           <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                           <span className="font-bold text-indigo-700">{def.meaning}</span>
                         </div>
                         <p className="text-xs text-slate-500 italic pl-3.5">
                           "{def.example}"
                         </p>
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
    </div>
  );
};

export default PhrasalVerbsGame;