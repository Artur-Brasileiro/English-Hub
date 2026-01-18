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

  const tagMeta = {
    conditional: { label: 'Condicionais', color: 'bg-amber-500', desc: 'If I had...', example: 'If it rained...' },
    concessive: { label: 'Concessivas', color: 'bg-teal-600', desc: 'Even if...', example: 'Even if I go...' },
    temporal: { label: 'Temporais', color: 'bg-cyan-600', desc: 'While/When...', example: 'While he...' },
    contrast: { label: 'Contraste', color: 'bg-rose-500', desc: '..., but ...', example: 'I wanted, but...' },
    cause: { label: 'Causa', color: 'bg-lime-600', desc: 'Because/As', example: 'Because I...' },
    purpose: { label: 'Finalidade', color: 'bg-emerald-600', desc: 'So that/In order to', example: 'So that...' },
    result: { label: 'Resultado', color: 'bg-blue-600', desc: 'So/Therefore', example: 'So we...' },
    comparison: { label: 'Comparação', color: 'bg-violet-600', desc: 'As...as', example: 'As good as...' },
    desire: { label: 'Desejo', color: 'bg-fuchsia-500', desc: 'I wish/hope', example: 'I wish...' },
    obligation: { label: 'Obrigação', color: 'bg-orange-600', desc: 'Have to/Must', example: 'I have to...' },
    advice: { label: 'Conselho', color: 'bg-sky-600', desc: 'Should/Ought to', example: 'You should...' },
    suggestion: { label: 'Sugestão', color: 'bg-indigo-600', desc: 'Why don’t we...?', example: 'Why don’t we...' },
    possibility: { label: 'Possibilidade', color: 'bg-slate-600', desc: 'Maybe/It might', example: 'It might...' }
  };

  const tagModes = Object.keys(tagMeta);

  const getPrimaryTag = (tags = []) => tags.find((tag) => tagModes.includes(tag));

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
    
    if (tagModes.includes(mode)) {
      dataToUse = TRANSLATION_DATA.filter(item => item.tags && item.tags.includes(mode));
    } else if (mode === 'present_perfect') {
      dataToUse = TRANSLATION_DATA.filter(item => {
        const grammarType = getGrammarType(item.en);
        return grammarType === 'present_perfect' || grammarType === 'present_perfect_continuous';
      });
    } else if (mode === 'past_perfect') {
      dataToUse = TRANSLATION_DATA.filter(item => {
        const grammarType = getGrammarType(item.en);
        return grammarType === 'past_perfect' || grammarType === 'past_perfect_continuous';
      });
    } else if (mode !== 'mix') {
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
      .replace(/[’']/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const checkAnswer = () => {
    const currentItem = shuffledQuestions[currentQuestionIndex];
    const normalizedUser = normalizeText(userAnswer);
    const acceptedAnswers = Array.isArray(currentItem.en) ? currentItem.en : [currentItem.en];
    const normalizedAccepted = acceptedAnswers.map((answer) => normalizeText(answer));

    const isCorrect = normalizedAccepted.includes(normalizedUser);
    
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
       
      { id: 'conditional', label: tagMeta.conditional.label, sub: 'If/Se', icon: Layers, color: tagMeta.conditional.color, desc: tagMeta.conditional.desc },
      { id: 'concessive', label: tagMeta.concessive.label, sub: 'Even/Embora', icon: Layers, color: tagMeta.concessive.color, desc: tagMeta.concessive.desc },
      { id: 'temporal', label: tagMeta.temporal.label, sub: 'While/When', icon: Layers, color: tagMeta.temporal.color, desc: tagMeta.temporal.desc },
      { id: 'contrast', label: tagMeta.contrast.label, sub: 'Mas/Porém', icon: Layers, color: tagMeta.contrast.color, desc: tagMeta.contrast.desc },
      { id: 'cause', label: tagMeta.cause.label, sub: 'Porque', icon: Layers, color: tagMeta.cause.color, desc: tagMeta.cause.desc },
      { id: 'purpose', label: tagMeta.purpose.label, sub: 'Para que', icon: Layers, color: tagMeta.purpose.color, desc: tagMeta.purpose.desc },
      { id: 'result', label: tagMeta.result.label, sub: 'Então', icon: Layers, color: tagMeta.result.color, desc: tagMeta.result.desc },
      { id: 'comparison', label: tagMeta.comparison.label, sub: 'Igual a', icon: Layers, color: tagMeta.comparison.color, desc: tagMeta.comparison.desc },
      { id: 'desire', label: tagMeta.desire.label, sub: 'Quero/Espero', icon: Layers, color: tagMeta.desire.color, desc: tagMeta.desire.desc },
      { id: 'obligation', label: tagMeta.obligation.label, sub: 'Tenho que', icon: Layers, color: tagMeta.obligation.color, desc: tagMeta.obligation.desc },
      { id: 'advice', label: tagMeta.advice.label, sub: 'Deveria', icon: Layers, color: tagMeta.advice.color, desc: tagMeta.advice.desc },
      { id: 'suggestion', label: tagMeta.suggestion.label, sub: 'Que tal', icon: Layers, color: tagMeta.suggestion.color, desc: tagMeta.suggestion.desc },
      { id: 'possibility', label: tagMeta.possibility.label, sub: 'Talvez', icon: Layers, color: tagMeta.possibility.color, desc: tagMeta.possibility.desc },

      { id: 'present_perfect', label: 'Present Perfect', sub: 'Simple + Continuous', icon: CheckCircle, color: 'bg-blue-500', desc: 'I have eaten / been eating' },
      { id: 'past_perfect', label: 'Past Perfect', sub: 'Simple + Continuous', icon: History, color: 'bg-purple-500', desc: 'I had eaten / been eating' },
      
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
          <p className="text-slate-600 mb-8">Treine tempos perfeitos e frases do dia a dia por tipo.</p>

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
            className="bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-800 px-6 py-2 rounded-full font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 mx-auto"
          >
              <ArrowLeft className="w-4 h-4" /> Voltar ao Hub Principal
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
  const primaryTag = getPrimaryTag(currentItem.tags);
  const shouldResolveGrammar = currentMode === 'mix' || currentMode === 'present_perfect' || currentMode === 'past_perfect';
  const questionType = shouldResolveGrammar && !primaryTag ? getGrammarType(currentItem.en) : currentMode;

  // Cores dinâmicas para o cartão
  let headerColorClass = 'bg-emerald-500';
  let typeLabel = 'Traduza';

  if (primaryTag && currentMode === 'mix') {
    headerColorClass = tagMeta[primaryTag]?.color ?? headerColorClass;
    typeLabel = tagMeta[primaryTag]?.label ?? typeLabel;
  }

  switch (questionType) {
    case 'conditional': headerColorClass = tagMeta.conditional.color; typeLabel = tagMeta.conditional.label; break;
    case 'concessive': headerColorClass = tagMeta.concessive.color; typeLabel = tagMeta.concessive.label; break;
    case 'temporal': headerColorClass = tagMeta.temporal.color; typeLabel = tagMeta.temporal.label; break;
    case 'contrast': headerColorClass = tagMeta.contrast.color; typeLabel = tagMeta.contrast.label; break;
    case 'cause': headerColorClass = tagMeta.cause.color; typeLabel = tagMeta.cause.label; break;
    case 'purpose': headerColorClass = tagMeta.purpose.color; typeLabel = tagMeta.purpose.label; break;
    case 'result': headerColorClass = tagMeta.result.color; typeLabel = tagMeta.result.label; break;
    case 'comparison': headerColorClass = tagMeta.comparison.color; typeLabel = tagMeta.comparison.label; break;
    case 'desire': headerColorClass = tagMeta.desire.color; typeLabel = tagMeta.desire.label; break;
    case 'obligation': headerColorClass = tagMeta.obligation.color; typeLabel = tagMeta.obligation.label; break;
    case 'advice': headerColorClass = tagMeta.advice.color; typeLabel = tagMeta.advice.label; break;
    case 'suggestion': headerColorClass = tagMeta.suggestion.color; typeLabel = tagMeta.suggestion.label; break;
    case 'possibility': headerColorClass = tagMeta.possibility.color; typeLabel = tagMeta.possibility.label; break;
    case 'present_perfect': headerColorClass = 'bg-blue-500'; typeLabel = 'Present Perfect'; break;
    case 'present_perfect_continuous': headerColorClass = 'bg-blue-700'; typeLabel = 'Present Perfect Continuous'; break;
    case 'past_perfect': headerColorClass = 'bg-purple-500'; typeLabel = 'Past Perfect'; break;
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
                      {Array.isArray(currentItem.en) ? (
                        <ul className="text-red-700 font-bold text-lg space-y-1">
                          {currentItem.en.map((answer) => (
                            <li key={answer}>"{answer}"</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-red-700 font-bold text-lg">"{currentItem.en}"</p>
                      )}                
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