import React, { useState } from 'react';
import { 
  Languages, RefreshCw, ArrowLeft, CheckCircle, XCircle, Mic, 
  Clock, Activity, History, Layers, FastForward, PlayCircle
} from 'lucide-react';
import { TRANSLATION_DATA } from '../data/gameData';

const TranslationGame = ({ onBack }) => {
  const [gameState, setGameState] = useState('start'); 
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentMode, setCurrentMode] = useState('mix'); 
  
  const [userAnswer, setUserAnswer] = useState('');
  const [answerStatus, setAnswerStatus] = useState(null); 
  const [isListening, setIsListening] = useState(false);

  // --- LÓGICA DE DETECÇÃO GRAMATICAL AVANÇADA ---
  const getGrammarType = (englishSentence) => {
    const lower = englishSentence.toLowerCase();
    
    // A ORDEM IMPORTA! Verificamos do mais específico para o mais geral.

    // 1. Future Perfect Continuous: "will have been" + ing
    if (/will\s+have\s+been\s+\w+ing/.test(lower)) return 'future_perfect_continuous';

    // 2. Future Perfect Simple: "will have" + particípio (sem been+ing)
    if (/will\s+have/.test(lower)) return 'future_perfect';

    // 3. Past Perfect Continuous: "had been" + ing
    if (/had\s+been\s+\w+ing/.test(lower)) return 'past_perfect_continuous';

    // 4. Present Perfect Continuous: "have/has been" + ing
    if (/(have|has|'ve|'s)\s+been\s+\w+ing/.test(lower)) return 'present_perfect_continuous';

    // 5. Past Perfect Simple: "had" + particípio (sobra o had sozinho)
    // Evita confusão com "have had"
    if (/\bhad\b/.test(lower) && !/(have|has|'ve|'s)\s+had/.test(lower)) return 'past_perfect';

    // 6. Present Perfect Simple: O padrão que sobra
    return 'present_perfect';
  };

  const startGame = (mode) => {
    setCurrentMode(mode);
    
    let dataToUse = TRANSLATION_DATA;
    
    if (mode !== 'mix') {
      dataToUse = TRANSLATION_DATA.filter(item => getGrammarType(item.en) === mode);
    }

    if (dataToUse.length === 0) {
      alert(`Ops! Não encontrei frases suficientes para o modo: ${mode.replace(/_/g, ' ')}. Adicione mais frases desse tipo no seu arquivo de dados.`);
      return;
    }

    const shuffled = [...dataToUse].sort(() => 0.5 - Math.random());
    setShuffledQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setScore(0);
    setGameState('playing');
    resetTurn();
  };

  const resetTurn = () => {
    setUserAnswer('');
    setAnswerStatus(null);
    setIsListening(false);
  };

  const normalizeText = (text) => {
    return text.toLowerCase()
      .replace(/[.,!?;:]/g, '') 
      .replace(/\s+/g, ' ')
      .trim();
  };

  const checkAnswer = () => {
    const currentItem = shuffledQuestions[currentQuestionIndex];
    const normalizedUser = normalizeText(userAnswer);
    const normalizedCorrect = normalizeText(currentItem.en);

    const isCorrect = normalizedUser === normalizedCorrect;
    
    setAnswerStatus(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) setScore(s => s + 1);
  };

  const handleSpeech = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    setIsListening(true);
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserAnswer(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
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
    // Lista completa de modos
    const modes = [
      { id: 'present_perfect', label: 'Present Perfect', sub: 'Simple', icon: CheckCircle, color: 'bg-blue-500', desc: 'I have eaten' },
      { id: 'present_perfect_continuous', label: 'Present Perfect', sub: 'Continuous', icon: Activity, color: 'bg-blue-600', desc: 'I have been eating' },
      
      { id: 'past_perfect', label: 'Past Perfect', sub: 'Simple', icon: History, color: 'bg-purple-500', desc: 'I had eaten' },
      { id: 'past_perfect_continuous', label: 'Past Perfect', sub: 'Continuous', icon: PlayCircle, color: 'bg-purple-600', desc: 'I had been eating' },
      
      { id: 'future_perfect', label: 'Future Perfect', sub: 'Simple', icon: FastForward, color: 'bg-orange-500', desc: 'I will have eaten' },
      // { id: 'future_perfect_continuous', label: 'Future Perfect', sub: 'Continuous', icon: Timer, color: 'bg-orange-600', desc: 'I will have been eating' },
      
      { id: 'mix', label: 'Desafio Total', sub: 'All Tenses', icon: Layers, color: 'bg-emerald-500', desc: 'Mistura tudo!' },
    ];

    return (
      <div className="flex flex-col h-full py-8 px-4 animate-fadeIn max-w-5xl mx-auto items-center justify-center">
        <div className="text-center mb-6 w-full">
          <div className="bg-emerald-100 p-4 rounded-full inline-flex mb-4 text-emerald-600">
            <Languages className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Translation Master</h2>
          <p className="text-slate-600 mb-8">Domine todas as formas dos Tempos Perfeitos.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => startGame(mode.id)}
                className="bg-white p-5 rounded-xl shadow-sm border-2 border-slate-100 hover:border-emerald-400 hover:shadow-md transition-all flex items-center gap-4 text-left group relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-1 h-full ${mode.color}`}></div>
                <div className={`${mode.color} p-3 rounded-lg text-white shadow-sm group-hover:scale-110 transition-transform`}>
                  <mode.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">{mode.label} <span className="font-normal text-slate-500 text-xs block">{mode.sub}</span></h3>
                  <p className="text-slate-400 text-xs italic mt-1">{mode.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* BOTÃO CORRIGIDO: mx-auto centraliza o botão na página */}
          <button 
            onClick={onBack} 
            className="flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 font-bold px-6 py-2 text-sm transition-colors mx-auto"
          >
             <ArrowLeft className="w-5 h-5" /> Voltar ao Hub
           </button>
        </div>
      </div>
    );
  }
  
  // Lógica de visualização no modo RESULT e GAME (similar ao anterior)
  if (gameState === 'result') {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 px-4 animate-fadeIn">
        <h2 className="text-4xl font-bold text-slate-800 mb-2">Treino Concluído!</h2>
        <div className="text-6xl font-black text-emerald-500 mb-4">{score}/{shuffledQuestions.length}</div>
        <div className="bg-emerald-50 text-emerald-800 px-4 py-2 rounded-full font-bold mb-6 text-sm uppercase tracking-wider">
          {currentMode.replace(/_/g, ' ')}
        </div>
        <div className="flex gap-4">
          <button onClick={onBack} className="border-2 border-slate-200 text-slate-600 px-6 py-2 rounded-full font-bold hover:bg-slate-50 transition-colors">Sair</button>
          <button onClick={() => startGame(currentMode)} className="bg-emerald-500 text-white px-6 py-2 rounded-full font-bold hover:bg-emerald-600 transition-colors flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Jogar Novamente</button>
        </div>
      </div>
    );
  }

  const currentItem = shuffledQuestions[currentQuestionIndex];
  const questionType = currentMode === 'mix' ? getGrammarType(currentItem.en) : currentMode;
  
  // Cores dinâmicas para o cartão
  let headerColorClass = 'bg-emerald-500';
  let typeLabel = 'Traduza';

  switch (questionType) {
    case 'present_perfect': headerColorClass = 'bg-blue-500'; typeLabel = 'Present Perfect Simple'; break;
    case 'present_perfect_continuous': headerColorClass = 'bg-blue-700'; typeLabel = 'Present Perfect Continuous'; break;
    case 'past_perfect': headerColorClass = 'bg-purple-500'; typeLabel = 'Past Perfect Simple'; break;
    case 'past_perfect_continuous': headerColorClass = 'bg-purple-700'; typeLabel = 'Past Perfect Continuous'; break;
    case 'future_perfect': headerColorClass = 'bg-orange-500'; typeLabel = 'Future Perfect'; break;
    case 'future_perfect_continuous': headerColorClass = 'bg-orange-700'; typeLabel = 'Future Perfect Continuous'; break;
    default: headerColorClass = 'bg-emerald-500';
  }

  let inputBorderClass = "border-slate-300 focus:border-emerald-500";
  if (answerStatus === 'correct') inputBorderClass = "border-green-500 bg-green-50 text-green-700";
  else if (answerStatus === 'incorrect') inputBorderClass = "border-red-500 bg-red-50 text-red-700";

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => setGameState('start')} className="text-slate-400 hover:text-slate-600 flex items-center gap-1">
          <ArrowLeft className="w-5 h-5" /> <span className="text-sm font-bold">Modos</span>
        </button>
        <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">
          {currentQuestionIndex + 1} / {shuffledQuestions.length}
        </span>
        <div className="w-6"></div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-6">
        <div className={`${headerColorClass} p-8 text-center min-h-40 flex flex-col items-center justify-center transition-colors duration-500`}>
          <span className="text-white/80 uppercase tracking-widest text-xs font-bold mb-3 flex items-center gap-2 justify-center">
            <Clock className="w-4 h-4" /> {typeLabel}
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight max-w-lg mx-auto">
            "{currentItem.pt}"
          </h2>
        </div>

        <div className="p-6">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Sua Tradução</label>
          <div className="flex gap-2 mb-6">
            <div className="relative grow">
              <textarea 
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={answerStatus !== null}
                placeholder="Digite em inglês..."
                rows={2}
                className={`w-full p-4 rounded-xl border-2 outline-none font-medium text-lg resize-none transition-all ${inputBorderClass}`}
                onKeyDown={(e) => {
                   if (e.key === 'Enter' && !e.shiftKey && !answerStatus) {
                     e.preventDefault(); checkAnswer();
                   }
                }}
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
                      <p className="text-red-700 font-bold text-lg">"{currentItem.en}"</p>
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
    </div>
  );
};

export default TranslationGame;