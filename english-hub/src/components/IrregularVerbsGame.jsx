import React, { useState, useEffect, useRef } from 'react';
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
} from 'lucide-react';
import { IRREGULAR_VERBS_DATA } from '../data/gameData';

const ITEMS_PER_PHASE = 10;

const IrregularVerbsGame = ({ onBack }) => {
  const [gameState, setGameState] = useState('config');
  const [activePhase, setActivePhase] = useState(1);

  // "presente" começa como true
  const [selectedModes, setSelectedModes] = useState({
    presente: true,
    passado: true,
    participio: true,
  });

  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [phaseQuestions, setPhaseQuestions] = useState([]);

  // respostas do usuário por campo
  const [userAnswers, setUserAnswers] = useState({
    presente: '',
    passado: '',
    participio: '',
  });

  // null = ainda não verificou
  // 'checked' = já verificou
  const [feedback, setFeedback] = useState(null);

  const firstInputRef = useRef(null);
  const totalPhases = Math.ceil(IRREGULAR_VERBS_DATA.length / ITEMS_PER_PHASE);

  const toggleMode = (mode) => {
    setSelectedModes((prev) => ({ ...prev, [mode]: !prev[mode] }));
  };

  const initializeInputs = () => {
    setUserAnswers({ presente: '', passado: '', participio: '' });
    setFeedback(null);
  };

  const startGame = (phaseNumber) => {
    if (!selectedModes.presente && !selectedModes.passado && !selectedModes.participio) {
      alert('Selecione pelo menos um tempo verbal para treinar!');
      return;
    }

    setActivePhase(phaseNumber);

    const startIndex = (phaseNumber - 1) * ITEMS_PER_PHASE;
    const endIndex = startIndex + ITEMS_PER_PHASE;

    const originalQuestions = IRREGULAR_VERBS_DATA.slice(startIndex, endIndex);
    const shuffledQuestions = [...originalQuestions].sort(() => 0.5 - Math.random());

    setPhaseQuestions(shuffledQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);

    initializeInputs();
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState === 'playing' && !feedback && firstInputRef.current) {
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 50);
    }
  }, [currentQuestionIndex, gameState, feedback]);

  const handleInputChange = (field, value) => {
    setUserAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const checkAnswer = (e) => {
    e.preventDefault();
    if (feedback) return;

    setFeedback('checked');

    const currentVerb = phaseQuestions[currentQuestionIndex];
    let pointsGained = 0;

    if (selectedModes.presente) {
      if (userAnswers.presente.trim().toLowerCase() === currentVerb.presente.toLowerCase()) {
        pointsGained++;
      }
    }

    if (selectedModes.passado) {
      if (userAnswers.passado.trim().toLowerCase() === currentVerb.passado.toLowerCase()) {
        pointsGained++;
      }
    }

    if (selectedModes.participio) {
      if (
        userAnswers.participio.trim().toLowerCase() ===
        String(currentVerb.particípio).toLowerCase()
      ) {
        pointsGained++;
      }
    }

    setScore((prev) => prev + pointsGained);
  };

  const nextQuestion = (e) => {
    if (e) e.preventDefault();

    if (currentQuestionIndex < phaseQuestions.length - 1) {
      initializeInputs();
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setGameState('result');
    }
  };

  const getInputStatus = (modeKey, correctValue) => {
    if (!feedback) return 'neutral';

    const userValue = (userAnswers[modeKey] ?? '').trim().toLowerCase();
    const correct = String(correctValue ?? '').toLowerCase();

    if (!userValue) return 'empty';
    if (userValue === correct) return 'correct';
    return 'wrong';
  };

  const renderInputField = (modeKey, label, correctValue, isFirst) => {
    const status = getInputStatus(modeKey, correctValue);

    let borderClass =
      'border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50';
    let icon = null;

    if (feedback) {
      if (status === 'correct') {
        borderClass = 'border-green-500 bg-green-50 text-green-700';
        icon = (
          <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
        );
      } else if (status === 'wrong' || status === 'empty') {
        borderClass = 'border-red-300 bg-red-50 text-red-700';
        icon = (
          <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" />
        );
      }
    }

    return (
      <div key={`${modeKey}-${currentQuestionIndex}`} className="relative mb-4 animate-fadeIn">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">
          {label}
        </label>

        <div className="relative">
          <input
            ref={isFirst ? firstInputRef : null}
            type="text"
            value={userAnswers[modeKey]}
            onChange={(e) => handleInputChange(modeKey, e.target.value)}
            placeholder="Digite a tradução..."
            className={`w-full p-4 text-center text-xl font-medium border-2 rounded-xl outline-none transition-all shadow-sm focus:placeholder-transparent ${borderClass}`}
            disabled={feedback !== null}
          />
          {icon}
        </div>

        {/* Mostra a resposta correta se estiver errado OU vazio */}
        {feedback && (status === 'wrong' || status === 'empty') && (
          <div className="text-xs text-red-500 font-bold mt-1 ml-1">
            Resposta: {correctValue}
          </div>
        )}
      </div>
    );
  };

  // ===========================
  // TELA CONFIG
  // ===========================
  if (gameState === 'config') {
    return (
      <div className="flex flex-col h-full py-8 px-4 animate-fadeIn max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="bg-orange-100 p-4 rounded-full inline-flex mb-4 text-orange-600">
            <Gamepad2 className="w-12 h-12" />
          </div>

          <h2 className="text-3xl font-bold text-slate-800 mb-2">Irregular Verbs Challenge</h2>

          <p className="text-slate-600 max-w-lg mx-auto mb-6">
            Configure seu treino. Digite as formas verbais corretas para vencer.
          </p>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-lg mx-auto mb-8">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
              Quais formas treinar?
            </h3>

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
                  {selectedModes[mode] ? (
                    <ToggleRight className="w-5 h-5" />
                  ) : (
                    <ToggleLeft className="w-5 h-5" />
                  )}
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>

            {!selectedModes.presente && !selectedModes.passado && !selectedModes.participio && (
              <p className="text-red-500 text-xs mt-3 font-bold">Selecione pelo menos um!</p>
            )}
          </div>
        </div>

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
                    Verbos {(phaseNum - 1) * ITEMS_PER_PHASE + 1} - {phaseNum * ITEMS_PER_PHASE}
                  </p>
                </button>
              );
            })
          ) : (
            <div className="col-span-full text-center py-10 text-slate-400">Adicione mais verbos!</div>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={onBack}
            className="bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-800 px-6 py-2 rounded-full font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao Hub Principal
          </button>
        </div>
      </div>
    );
  }

  // ===========================
  // TELA RESULTADO
  // ===========================
  if (gameState === 'result') {
    const activeModesCount = Object.values(selectedModes).filter(Boolean).length;
    const maxScore = phaseQuestions.length * activeModesCount;

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 animate-fadeIn">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 max-w-md w-full text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Treino Concluído!</h2>

          <div className="text-5xl font-black text-orange-500 mb-2">
            {score} <span className="text-2xl text-slate-300">/ {maxScore}</span>
          </div>

          <p className="text-slate-500 mb-8 font-medium">Você concluiu a Fase {activePhase}</p>

          <div className="flex gap-4 flex-col">
            <button
              onClick={() => startGame(activePhase)}
              className="bg-orange-500 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
            >
              <RefreshCw className="w-5 h-5" /> Repetir Fase
            </button>

            <button
              onClick={() => setGameState('config')}
              className="bg-slate-50 text-slate-600 px-6 py-3.5 rounded-xl font-bold hover:bg-slate-100 transition-colors border border-slate-200"
            >
              Alterar Configurações
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

  return (
    <div className="max-w-xl mx-auto py-6 px-4 flex flex-col min-h-screen md:min-h-[80vh]">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => setGameState('config')} className="text-slate-400 hover:text-slate-600">
          <ArrowLeft className="w-6 h-6" />
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

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col animate-fade-in-up">
        <div className="bg-orange-500 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

          <span className="relative z-10 text-orange-100 uppercase tracking-widest text-xs font-bold mb-2 block">
            Verbo em Português
          </span>

          <h2 className="relative z-10 text-4xl font-black text-white capitalize">{currentVerb.pt}</h2>
        </div>

        <div className="p-8">
          <form onSubmit={checkAnswer}>
            {selectedModes.presente && renderInputField('presente', 'Presente', currentVerb.presente, true)}
            {selectedModes.passado &&
              renderInputField('passado', 'Passado', currentVerb.passado, !selectedModes.presente)}
            {selectedModes.participio &&
              renderInputField(
                'participio',
                'Particípio',
                currentVerb.particípio,
                !selectedModes.presente && !selectedModes.passado
              )}

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
    </div>
  );
};

export default IrregularVerbsGame;
