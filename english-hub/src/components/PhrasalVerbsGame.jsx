import React, { useState, useMemo } from 'react';
import { BrainCircuit, Layers, ArrowLeft, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { PHRASAL_VERBS_DATA } from '../data/gameData';

const ITEMS_PER_PHASE = 10;

const PhrasalVerbsGame = ({ onBack }) => {
  const [gameState, setGameState] = useState('start'); 
  const [activePhase, setActivePhase] = useState(1);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const totalPhases = Math.floor(PHRASAL_VERBS_DATA.length / ITEMS_PER_PHASE);

  const startGame = (phaseNumber) => {
    setActivePhase(phaseNumber);
    const startIndex = (phaseNumber - 1) * ITEMS_PER_PHASE;
    const endIndex = startIndex + ITEMS_PER_PHASE;
    const phaseQuestions = PHRASAL_VERBS_DATA.slice(startIndex, endIndex);
    const shuffled = [...phaseQuestions].sort(() => 0.5 - Math.random());
    
    setShuffledQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setScore(0);
    setGameState('playing');
    resetTurn();
  };

  const resetTurn = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const currentOptions = useMemo(() => {
    if (shuffledQuestions.length === 0) return [];
    
    const currentVerb = shuffledQuestions[currentQuestionIndex];
    const correctAnswer = currentVerb.verb;
    const distractors = PHRASAL_VERBS_DATA
      .filter(item => item.id !== currentVerb.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(item => item.verb);
    
    return [...distractors, correctAnswer].sort(() => 0.5 - Math.random());
  }, [currentQuestionIndex, shuffledQuestions]);

  const handleAnswer = (answer) => {
    if (selectedAnswer) return; 
    const currentVerb = shuffledQuestions[currentQuestionIndex];
    const correct = answer === currentVerb.verb;
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      resetTurn();
    } else {
      setGameState('result');
    }
  };

  if (gameState === 'start') {
    return (
      <div className="flex flex-col h-full py-8 px-4 animate-fadeIn max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="bg-indigo-100 p-4 rounded-full inline-flex mb-4 text-indigo-600">
            <BrainCircuit className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Phrasal Verbs Master</h2>
          <p className="text-slate-600 max-w-lg mx-auto">
            {PHRASAL_VERBS_DATA.length} verbos cadastrados disponíveis em {totalPhases} fases completas.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {totalPhases > 0 ? (
            Array.from({ length: totalPhases }).map((_, idx) => {
              const phaseNum = idx + 1;
              return (
                <button key={phaseNum} onClick={() => startGame(phaseNum)} className="group relative bg-white border-2 border-slate-200 rounded-2xl p-6 hover:border-indigo-500 hover:shadow-lg transition-all text-left">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-indigo-100 transition-colors">
                      <Layers className="w-6 h-6 text-slate-500 group-hover:text-indigo-600" />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{ITEMS_PER_PHASE} Verbs</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-1">Fase {phaseNum}</h3>
                  <p className="text-sm text-slate-500">Verbos {((phaseNum - 1) * ITEMS_PER_PHASE) + 1} a {phaseNum * ITEMS_PER_PHASE}</p>
                </button>
              );
            })
          ) : (
            <div className="col-span-full text-center py-10 text-slate-400">Adicione mais verbos!</div>
          )}
        </div>
        <div className="text-center">
          <button onClick={onBack} className="text-slate-400 hover:text-slate-600 text-sm font-medium flex items-center justify-center gap-2 mx-auto">
            <ArrowLeft className="w-4 h-4" /> Voltar ao Hub
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'result') {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 px-4 animate-fadeIn">
        <h2 className="text-4xl font-bold text-slate-800 mb-2">Resultado da Fase {activePhase}</h2>
        <div className="text-6xl font-black text-indigo-600 mb-4">{score}/{shuffledQuestions.length}</div>
        <div className="flex gap-4">
          <button onClick={() => setGameState('start')} className="border-2 border-slate-200 text-slate-600 px-6 py-2 rounded-full font-bold hover:bg-slate-50 transition-colors">Escolher Fase</button>
          <button onClick={() => startGame(activePhase)} className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Repetir</button>
        </div>
      </div>
    );
  }

  const currentVerb = shuffledQuestions[currentQuestionIndex];
  
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => setGameState('start')} className="text-slate-400 hover:text-slate-600"><ArrowLeft className="w-6 h-6" /></button>
        <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">Fase {activePhase} • {currentQuestionIndex + 1}/{shuffledQuestions.length}</span>
        <div className="w-6"></div>
      </div>
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-6">
        <div className="bg-indigo-600 p-8 text-center min-h-40 flex flex-col items-center justify-center">
          <span className="text-indigo-200 uppercase tracking-widest text-xs font-bold mb-3">Qual phrasal verb significa:</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight max-w-lg mx-auto">"{currentVerb.meaning}"</h2>
        </div>
        <div className="p-6 grid gap-3">
          {currentOptions.map((option, idx) => {
            let btnStyle = "bg-slate-50 border-2 border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50";
            if (selectedAnswer) {
              if (option === currentVerb.verb) btnStyle = "bg-green-100 border-2 border-green-500 text-green-800";
              else if (option === selectedAnswer) btnStyle = "bg-red-100 border-2 border-red-500 text-red-800";
              else btnStyle = "bg-slate-50 border-2 border-slate-100 text-slate-400 opacity-50";
            }
            return <button key={idx} onClick={() => handleAnswer(option)} disabled={selectedAnswer !== null} className={`w-full text-left p-4 rounded-xl font-semibold transition-all duration-200 ${btnStyle}`}>{option}</button>;
          })}
        </div>
        {selectedAnswer && (
          <div className="bg-slate-50 p-6 border-t border-slate-100 animate-fadeIn">
            <div className={`flex items-center gap-2 font-bold mb-2 ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>{isCorrect ? <CheckCircle className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>} {isCorrect ? 'Correto!' : 'Ops!'}</div>
            <p className="text-slate-600 text-sm mb-4"><span className="font-bold text-slate-800">Uso:</span> "{currentVerb.example}"</p>
            <button onClick={nextQuestion} className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-900 transition-colors">{currentQuestionIndex < shuffledQuestions.length - 1 ? 'Próxima' : 'Ver Resultado'}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhrasalVerbsGame;