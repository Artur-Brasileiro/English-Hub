import React, { useState, useMemo } from 'react';
import { Gamepad2, ToggleLeft, ToggleRight, Layers, ArrowLeft, ChevronRight, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { IRREGULAR_VERBS_DATA } from '../data/gameData';

const ITEMS_PER_PHASE = 10;

const IrregularVerbsGame = ({ onBack }) => {
  const [gameState, setGameState] = useState('config'); // config, playing, result
  const [activePhase, setActivePhase] = useState(1);
  const [selectedModes, setSelectedModes] = useState({ presente: false, passado: true, participio: true });
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const totalPhases = Math.floor(IRREGULAR_VERBS_DATA.length / ITEMS_PER_PHASE);

  // Auxiliar para gerar string de resposta baseada nos modos
  const getAnswerString = (item, modes) => {
    let parts = [];
    if (modes.presente) parts.push(item.presente);
    if (modes.passado) parts.push(item.passado);
    if (modes.participio) parts.push(item.particípio);
    return parts.join(' / ');
  };

  const toggleMode = (mode) => {
    setSelectedModes(prev => ({...prev, [mode]: !prev[mode]}));
  };

  const startGame = (phaseNumber) => {
    // Validação: Pelo menos um modo deve estar selecionado
    if (!selectedModes.presente && !selectedModes.passado && !selectedModes.participio) {
      alert("Selecione pelo menos um tempo verbal para treinar!");
      return;
    }

    setActivePhase(phaseNumber);
    const startIndex = (phaseNumber - 1) * ITEMS_PER_PHASE;
    const endIndex = startIndex + ITEMS_PER_PHASE;
    const phaseQuestions = IRREGULAR_VERBS_DATA.slice(startIndex, endIndex);
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
    
    const currentItem = shuffledQuestions[currentQuestionIndex];
    const correctAnswer = getAnswerString(currentItem, selectedModes);
    
    // Distratores: Pegar outros verbos e formatar na MESMA configuração de modos
    const distractors = IRREGULAR_VERBS_DATA
      .filter(item => item.id !== currentItem.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(item => getAnswerString(item, selectedModes));
    
    return [...distractors, correctAnswer].sort(() => 0.5 - Math.random());
  }, [currentQuestionIndex, shuffledQuestions, selectedModes]);

  const handleAnswer = (answer) => {
    if (selectedAnswer) return; 
    const currentItem = shuffledQuestions[currentQuestionIndex];
    const correctStr = getAnswerString(currentItem, selectedModes);
    
    const correct = answer === correctStr;
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

  // TELA DE CONFIGURAÇÃO (FASES + MODOS)
  if (gameState === 'config') {
    return (
      <div className="flex flex-col h-full py-8 px-4 animate-fadeIn max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="bg-orange-100 p-4 rounded-full inline-flex mb-4 text-orange-600">
            <Gamepad2 className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Irregular Verbs Challenge</h2>
          <p className="text-slate-600 max-w-lg mx-auto mb-6">
            Configure seu treino. Escolha os tempos verbais que deseja testar e selecione a fase.
          </p>

          {/* Configuração de Modos */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-lg mx-auto mb-8">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Tempos Verbais</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {['presente', 'passado', 'participio'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => toggleMode(mode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                    selectedModes[mode] 
                      ? 'bg-orange-100 text-orange-700 border-2 border-orange-500' 
                      : 'bg-slate-50 text-slate-400 border-2 border-slate-200'
                  }`}
                >
                  {selectedModes[mode] ? <ToggleRight className="w-5 h-5"/> : <ToggleLeft className="w-5 h-5"/>}
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
            {!selectedModes.presente && !selectedModes.passado && !selectedModes.participio && (
              <p className="text-red-500 text-xs mt-3 font-bold">Selecione pelo menos um!</p>
            )}
          </div>
        </div>

        {/* Grid de Fases */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {totalPhases > 0 ? (
            Array.from({ length: totalPhases }).map((_, idx) => {
              const phaseNum = idx + 1;
              return (
                <button
                  key={phaseNum}
                  onClick={() => startGame(phaseNum)}
                  className="group relative bg-white border-2 border-slate-200 rounded-2xl p-6 hover:border-orange-500 hover:shadow-lg transition-all text-left"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-orange-100 p-2 rounded-lg group-hover:bg-orange-200 transition-colors">
                      <Layers className="w-6 h-6 text-orange-600" />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {ITEMS_PER_PHASE} Verbs
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-1">Fase {phaseNum}</h3>
                  <p className="text-sm text-slate-500">
                    Verbos {((phaseNum - 1) * ITEMS_PER_PHASE) + 1} a {phaseNum * ITEMS_PER_PHASE}
                  </p>
                  <div className="mt-4 flex items-center text-orange-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Iniciar <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
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

  // TELA DE RESULTADO
  if (gameState === 'result') {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 px-4 animate-fadeIn">
        <h2 className="text-4xl font-bold text-slate-800 mb-2">Treino Concluído!</h2>
        <div className="text-6xl font-black text-orange-500 mb-4">{score}/{shuffledQuestions.length}</div>
        <p className="text-slate-600 mb-8 text-center max-w-xs">
          {score === shuffledQuestions.length ? 'Excelente! Gramática afiada.' : 
           'Continue praticando os verbos irregulares.'}
        </p>
        <div className="flex gap-4">
          <button onClick={() => setGameState('config')} className="border-2 border-slate-200 text-slate-600 px-6 py-2 rounded-full font-bold hover:bg-slate-50 transition-colors">Alterar Config</button>
          <button onClick={() => startGame(activePhase)} className="bg-orange-500 text-white px-6 py-2 rounded-full font-bold hover:bg-orange-600 transition-colors flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Repetir</button>
        </div>
      </div>
    );
  }

  // TELA DO JOGO (QUIZ)
  const currentItem = shuffledQuestions[currentQuestionIndex];
  // Formatar o título da pergunta baseado nos modos selecionados
  const questionTitle = [
    selectedModes.presente && 'Presente',
    selectedModes.passado && 'Passado',
    selectedModes.participio && 'Particípio'
  ].filter(Boolean).join(' + ');

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => setGameState('config')} className="text-slate-400 hover:text-slate-600"><ArrowLeft className="w-6 h-6" /></button>
        <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">Fase {activePhase} • {currentQuestionIndex + 1}/{shuffledQuestions.length}</span>
        <div className="w-6"></div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-6">
        <div className="bg-orange-500 p-8 text-center min-h-40 flex flex-col items-center justify-center">
          <span className="text-orange-100 uppercase tracking-widest text-xs font-bold mb-3">Qual é o {questionTitle} de:</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight max-w-lg mx-auto capitalize">
            "{currentItem.pt}"
          </h2>
        </div>

        <div className="p-6 grid gap-3">
          {currentOptions.map((option, idx) => {
            let btnStyle = "bg-slate-50 border-2 border-slate-200 text-slate-700 hover:border-orange-300 hover:bg-orange-50";
            if (selectedAnswer) {
              const correctStr = getAnswerString(currentItem, selectedModes);
              if (option === correctStr) btnStyle = "bg-green-100 border-2 border-green-500 text-green-800";
              else if (option === selectedAnswer) btnStyle = "bg-red-100 border-2 border-red-500 text-red-800";
              else btnStyle = "bg-slate-50 border-2 border-slate-100 text-slate-400 opacity-50";
            }
            return (
              <button 
                key={idx} 
                onClick={() => handleAnswer(option)} 
                disabled={selectedAnswer !== null} 
                className={`w-full text-left p-4 rounded-xl font-semibold transition-all duration-200 ${btnStyle}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {selectedAnswer && (
          <div className="bg-slate-50 p-6 border-t border-slate-100 animate-fadeIn">
            <div className={`flex items-center gap-2 font-bold mb-2 ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
              {isCorrect ? <CheckCircle className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
              {isCorrect ? 'Correto!' : 'Ops!'}
            </div>
            {/* Feedback com a tabela completa */}
            <div className="grid grid-cols-3 gap-2 text-xs text-center mb-4 bg-white p-3 rounded-lg border border-slate-200">
               <div>
                 <span className="block text-slate-400 font-bold mb-1">Presente</span>
                 <span className="text-slate-800 font-bold">{currentItem.presente}</span>
               </div>
               <div className="border-l border-slate-100">
                 <span className="block text-slate-400 font-bold mb-1">Passado</span>
                 <span className="text-slate-800 font-bold">{currentItem.passado}</span>
               </div>
               <div className="border-l border-slate-100">
                 <span className="block text-slate-400 font-bold mb-1">Particípio</span>
                 <span className="text-slate-800 font-bold">{currentItem.particípio}</span>
               </div>
            </div>
            <button onClick={nextQuestion} className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-900 transition-colors">
              {currentQuestionIndex < shuffledQuestions.length - 1 ? 'Próxima Palavra' : 'Ver Resultado'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IrregularVerbsGame;