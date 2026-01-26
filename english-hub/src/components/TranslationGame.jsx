import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { 
  Languages, RefreshCw, ArrowLeft, CheckCircle, XCircle, Mic, 
  Clock, History, Layers, FastForward, 
  GitBranch, Shield, ArrowLeftRight, Flame, Target, Scale, Heart, Lock, Lightbulb, Sparkles, HelpCircle, Skull
} from 'lucide-react';
import { TRANSLATION_DATA } from '../data/gameData';

const TranslationGame = ({ onBack }) => {
  const navigate = useNavigate();

  const [gameState, setGameState] = useState('start'); 
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentMode, setCurrentMode] = useState('mix'); 
  
  const [userAnswer, setUserAnswer] = useState('');
  const [answerStatus, setAnswerStatus] = useState(null); 
  const [isListening, setIsListening] = useState(false);

  // --- CONFIGURAÇÃO VISUAL DOS MODOS ---
  const tagMeta = {
    conditional: { label: 'Condicionais', sub: 'If/Se', color: 'bg-amber-500', desc: 'If I had...', example: 'If it rained...', icon: GitBranch },
    concessive: { label: 'Concessivas', sub: 'Even/Embora', color: 'bg-teal-600', desc: 'Even if...', example: 'Even if I go...', icon: Shield },
    temporal: { label: 'Temporais', sub: 'While/When', color: 'bg-cyan-600', desc: 'While/When...', example: 'While he...', icon: Clock },
    contrast: { label: 'Contraste', sub: 'Mas/Porém', color: 'bg-rose-500', desc: '..., but ...', example: 'I wanted, but...', icon: ArrowLeftRight },
    cause: { label: 'Causa', sub: 'Porque', color: 'bg-lime-600', desc: 'Because/As', example: 'Because I...', icon: Flame },
    purpose: { label: 'Finalidade', sub: 'Para que', color: 'bg-emerald-600', desc: 'So that/In order to', example: 'So that...', icon: Target },
    result: { label: 'Resultado', sub: 'Então', color: 'bg-blue-600', desc: 'So/Therefore', example: 'So we...', icon: CheckCircle },
    comparison: { label: 'Comparação', sub: 'Igual a', color: 'bg-violet-600', desc: 'As...as', example: 'As good as...', icon: Scale },
    desire: { label: 'Desejo', sub: 'Quero/Espero', color: 'bg-fuchsia-500', desc: 'I wish/hope', example: 'I wish...', icon: Heart },
    obligation: { label: 'Obrigação', sub: 'Tenho que', color: 'bg-orange-600', desc: 'Have to/Must', example: 'I have to...', icon: Lock },
    advice: { label: 'Conselho', sub: 'Deveria', color: 'bg-sky-600', desc: 'Should/Ought to', example: 'You should...', icon: Lightbulb },
    suggestion: { label: 'Sugestão', sub: 'Que tal', color: 'bg-indigo-600', desc: 'Why don’t we...?', example: 'Why don’t we...', icon: Sparkles },
    possibility: { label: 'Possibilidade', sub: 'Talvez', color: 'bg-slate-600', desc: 'Maybe/It might', example: 'It might...', icon: HelpCircle }
  };

  const tagModes = Object.keys(tagMeta);
  const tagModeList = Object.entries(tagMeta).map(([id, meta]) => ({
    id,
    label: meta.label,
    sub: meta.sub,
    icon: meta.icon || Layers,
    color: meta.color,
    desc: meta.desc
  }));

  const grammarMeta = {
    present_perfect: { label: 'Present Perfect', color: 'bg-blue-500' },
    present_perfect_continuous: { label: 'Present Perfect Continuous', color: 'bg-blue-700' },
    past_perfect: { label: 'Past Perfect', color: 'bg-purple-500' },
    past_perfect_continuous: { label: 'Past Perfect Continuous', color: 'bg-purple-700' },
    future_perfect: { label: 'Future Perfect', color: 'bg-orange-500' },
    future_perfect_continuous: { label: 'Future Perfect Continuous', color: 'bg-orange-700' },
    questions: { label: 'Perguntas', color: 'bg-cyan-600' }
  };

  const grammarModeList = [
    { id: 'present_perfect', label: 'Present Perfect', sub: 'Simple + Continuous', icon: CheckCircle, color: grammarMeta.present_perfect.color, desc: 'I have eaten / been eating' },
    { id: 'past_perfect', label: 'Past Perfect', sub: 'Simple + Continuous', icon: History, color: grammarMeta.past_perfect.color, desc: 'I had eaten / been eating' },
    { id: 'future_perfect', label: 'Future Perfect', sub: 'Simple', icon: FastForward, color: grammarMeta.future_perfect.color, desc: 'I will have eaten' },
    { id: 'questions', label: 'Perguntas', sub: 'Todas em forma de pergunta', icon: HelpCircle, color: grammarMeta.questions.color, desc: 'Have you... ? / Why... ?' }
  ];

  // --- HELPERS ---
  const toArray = (value) => Array.isArray(value) ? value : [];
  const taggedItems = toArray(TRANSLATION_DATA.tagged);
  const allTranslationItems = Object.values(TRANSLATION_DATA).flatMap(toArray);

  const getPrimaryTag = (tags = []) => tags.find((tag) => tagModes.includes(tag));

  // --- LÓGICA DE DETECÇÃO GRAMATICAL ---
  const getGrammarType = (englishSentence) => {
    const sampleSentence = Array.isArray(englishSentence) ? englishSentence[0] : englishSentence;
    if (!sampleSentence || typeof sampleSentence !== 'string') return 'present_perfect';
    const lower = sampleSentence.toLowerCase();
    
    if (/will\s+have\s+been\s+\w+ing/.test(lower)) return 'future_perfect_continuous';
    if (/will\s+have/.test(lower)) return 'future_perfect';
    if (/had\s+been\s+\w+ing/.test(lower)) return 'past_perfect_continuous';
    if (/(have|has|'ve|'s)\s+been\s+\w+ing/.test(lower)) return 'present_perfect_continuous';
    if (/\bhad\b/.test(lower) && !/(have|has|'ve|'s)\s+had/.test(lower)) return 'past_perfect';
    return 'present_perfect';
  };

  const isQuestionSentence = (englishSentence) => {
    const samples = Array.isArray(englishSentence) ? englishSentence : [englishSentence];
    return samples.some((sample) => {
      if (!sample || typeof sample !== 'string') return false;
      const trimmed = sample.trim();
      if (trimmed.endsWith('?')) return true;
      return /^(what|where|when|why|how|who|which|have|has|had|will|do|does|did|is|are|was|were|can|could|would|should|may|might)\b/i.test(trimmed);
    });
  };

  // --- SISTEMA DE CORREÇÃO FLEXÍVEL (REGEX) ---

  // 1. Normaliza a resposta do usuário (remove pontuação, espaços extras, lowercase)
  const normalizeUserAnswer = (text) => {
    return text.toLowerCase()
      .replace(/[.,!?;:]/g, '') // Remove pontuação
      .replace(/\s+/g, ' ')     // Remove espaços duplos
      .trim();
  };

  // 2. Transforma o gabarito em uma expressão regular inteligente
  const createFlexibleRegex = (correctAnswer) => {
    // Limpa a resposta correta base
    const clean = correctAnswer.toLowerCase().replace(/[.,!?;:]/g, '').trim();
    
    // Divide por espaços para analisar token por token
    const tokens = clean.split(/\s+/);
    
    const regexParts = tokens.map((token, index) => {
      let processedToken = token;
      let isOptional = false;

      // Verifica se é opcional: (word)
      if (token.startsWith('(') && token.endsWith(')')) {
        processedToken = token.slice(1, -1); // remove ( )
        isOptional = true;
      }

      // Verifica alternativas: word/other
      if (processedToken.includes('/')) {
        processedToken = `(?:${processedToken.replace(/\//g, '|')})`;
      } else {
        // Escapa caracteres especiais de regex se não for alternativa
        processedToken = processedToken.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }

      // Constrói a parte da regex para este token
      if (index === 0) {
        // Se for a primeira palavra
        return isOptional ? `(?:${processedToken}\\s+)?` : `${processedToken}`;
      } else {
        // Se for palavra subsequente (precisa de espaço antes)
        return isOptional ? `(?:\\s+${processedToken})?` : `\\s+${processedToken}`;
      }
    });

    // Junta tudo. ^ = início, $ = fim.
    return new RegExp(`^${regexParts.join('')}$`, 'i');
  };

  const checkAnswer = () => {
    const currentItem = shuffledQuestions[currentQuestionIndex];
    // Garante que é sempre array para poder iterar
    const possibleAnswers = Array.isArray(currentItem.en) ? currentItem.en : [currentItem.en];
    
    const normalizedUser = normalizeUserAnswer(userAnswer);

    // Verifica se ALGUMA das respostas possíveis bate
    const isCorrect = possibleAnswers.some((correctAnswer) => {
      try {
        const regex = createFlexibleRegex(correctAnswer);
        return regex.test(normalizedUser);
      } catch (e) {
        // Fallback de segurança: comparação exata simples
        console.error("Regex error:", e);
        return normalizedUser === normalizeUserAnswer(correctAnswer);
      }
    });

    setAnswerStatus(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) setScore(s => s + 1);
  };

  // --- FIM DO SISTEMA DE CORREÇÃO ---

  const startGame = (mode) => {
    setCurrentMode(mode);
    let dataToUse = allTranslationItems;
    
    if (tagModes.includes(mode)) {
      dataToUse = taggedItems.filter(item => item.tags && item.tags.includes(mode));
    } else if (mode === 'present_perfect') {
      dataToUse = toArray(TRANSLATION_DATA.present_perfect);
    } else if (mode === 'past_perfect') {
      dataToUse = toArray(TRANSLATION_DATA.past_perfect);
    } else if (mode === 'questions') {
      dataToUse = allTranslationItems.filter(item => isQuestionSentence(item.en));
    } else if (mode !== 'mix' && TRANSLATION_DATA[mode]) {
      dataToUse = toArray(TRANSLATION_DATA[mode]);
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
      setUserAnswer(transcript); // A regex vai limpar a pontuação depois
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

  // --- RENDERS ---

  if (gameState === 'start') {
    const modes = [
      ...tagModeList,
      ...grammarModeList,
      { id: 'mix', label: 'Desafio Total', sub: 'All Tenses', icon: Skull, color: 'bg-emerald-500', desc: 'Mistura tudo!' },
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

          <button
            onClick={() => navigate("/")}
            className="bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-800 px-6 py-2 rounded-full font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao Hub Principal
          </button>
        </div>
      </div>
    );
  }
  
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

  let headerColorClass = 'bg-emerald-500';
  let typeLabel = 'Traduza';

  if (primaryTag && currentMode === 'mix') {
    headerColorClass = tagMeta[primaryTag]?.color ?? headerColorClass;
    typeLabel = tagMeta[primaryTag]?.label ?? typeLabel;
  }
  const questionMeta = tagMeta[questionType] || grammarMeta[questionType];
  if (questionMeta && !(primaryTag && currentMode === 'mix')) {
    headerColorClass = questionMeta.color ?? headerColorClass;
    typeLabel = questionMeta.label ?? typeLabel;
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
                            <li key={answer}>
                              {/* Remove os códigos da exibição visual para ficar mais limpo para o usuário */}
                              "{answer.replace(/[()]/g, '').replace(/\//g, ' ou ')}"
                            </li>
                          ))}
                        </ul>
                      ) : (
                         <p className="text-red-700 font-bold text-lg">"{currentItem.en.replace(/[()]/g, '').replace(/\//g, ' ou ')}"</p>
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