import React, { useState, useEffect, useMemo } from 'react';
import { 
  Gamepad2, 
  BookOpen, 
  Mic2, 
  BrainCircuit, 
  Search,
  ChevronRight,
  GraduationCap,
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  XCircle,
  Play,
  Layers,
  Settings,
  ToggleLeft,
  ToggleRight,
  Languages,
  Mic,
  Keyboard
} from 'lucide-react';

// --- DADOS DOS PHRASAL VERBS ---
const PHRASAL_VERBS_DATA = [
  // FASE 1 (1-10)
  { id: 1, verb: "Chip in", meaning: "Contribuir (dinheiro/ajuda)", example: "We all chipped in to buy him a gift." },
  { id: 2, verb: "Go on", meaning: "Continuar / Acontecer", example: "Please go on with your story." },
  { id: 3, verb: "Close down", meaning: "Fechar definitivamente (negócio)", example: "The factory closed down last year." },
  { id: 4, verb: "Give up", meaning: "Desistir / Parar de fazer algo", example: "Don't give up on your dreams." },
  { id: 5, verb: "Look for", meaning: "Procurar", example: "I am looking for my keys." },
  { id: 6, verb: "Run out of", meaning: "Ficar sem (esgotar)", example: "We ran out of milk." },
  { id: 7, verb: "Call off", meaning: "Cancelar", example: "The meeting was called off." },
  { id: 8, verb: "Carry on", meaning: "Continuar fazendo algo", example: "Carry on working while I'm gone." },
  { id: 9, verb: "Get along", meaning: "Ter um bom relacionamento", example: "I get along well with my neighbors." },
  { id: 10, verb: "Break down", meaning: "Parar de funcionar / Desabar emocionalmente", example: "My car broke down on the highway." },
  // FASE 2 (11-20)
  { id: 11, verb: "Bring up", meaning: "Mencionar um assunto / Criar (filhos)", example: "Don't bring up that topic again." },
  { id: 12, verb: "Find out", meaning: "Descobrir", example: "I found out the truth yesterday." },
  { id: 13, verb: "Hold on", meaning: "Aguardar um momento", example: "Hold on a second, please." },
  { id: 14, verb: "Look after", meaning: "Cuidar de alguém/algo", example: "Can you look after my dog?" },
  { id: 15, verb: "Pass out", meaning: "Desmaiar", example: "It was so hot that he passed out." },
  { id: 16, verb: "Put off", meaning: "Adiar", example: "We had to put off the trip." },
  { id: 17, verb: "Turn up", meaning: "Chegar / Aparecer / Aumentar volume", example: "He turned up late to the party." },
  { id: 18, verb: "Watch out", meaning: "Ter cuidado / Prestar atenção", example: "Watch out! There's a car coming." },
  { id: 19, verb: "Work out", meaning: "Exercitar-se / Resolver / Dar certo", example: "Things will work out in the end." },
  { id: 20, verb: "Check in", meaning: "Registrar entrada (hotel/voo)", example: "We checked in at the hotel at 2 PM." },
  // FASE 3 (21-30)
  { id: 21, verb: "Back up", meaning: "Apoiar / Fazer cópia de segurança", example: "Can you back me up in the meeting?" },
  { id: 22, verb: "Blow up", meaning: "Explodir / Ficar com raiva", example: "The car blew up after the crash." },
  { id: 23, verb: "Break in", meaning: "Invadir (propriedade) / Interromper", example: "Thieves broke in while we were away." },
  { id: 24, verb: "Calm down", meaning: "Acalmar-se", example: "You need to calm down before speaking." },
  { id: 25, verb: "Catch up", meaning: "Alcançar / Colocar o papo em dia", example: "Let's meet for coffee to catch up." },
  { id: 26, verb: "Drop off", meaning: "Deixar alguém/algo / Adormecer", example: "I can drop you off at the station." },
  { id: 27, verb: "Figure out", meaning: "Compreender / Encontrar solução", example: "I can't figure out how to fix this." },
  { id: 28, verb: "Get away", meaning: "Escapar / Sair de férias", example: "The robbers managed to get away." },
  { id: 29, verb: "Hang out", meaning: "Passar tempo (lazer)", example: "We used to hang out at the park." },
  { id: 30, verb: "Keep on", meaning: "Continuar (insistentemente)", example: "He kept on talking during the movie." }
];

// --- DADOS DOS VERBOS IRREGULARES ---
const IRREGULAR_VERBS_DATA = [
  // FASE 1
  { id: 1, pt: 'beber', presente: 'drink', passado: 'drank', particípio: 'drunk'},
  { id: 2, pt: 'comer', presente: 'eat', passado: 'ate', particípio: 'eaten'},
  { id: 3, pt: 'ir', presente: 'go', passado: 'went', particípio: 'gone'},
  { id: 4, pt: 'ver', presente: 'see', passado: 'saw', particípio: 'seen'},
  { id: 5, pt: 'escrever', presente: 'write', passado: 'wrote', particípio: 'written'},
  { id: 6, pt: 'quebrar', presente: 'break', passado: 'broke', particípio: 'broken'},
  { id: 7, pt: 'trazer', presente: 'bring', passado: 'brought', particípio: 'brought'},
  { id: 8, pt: 'manter', presente: 'keep', passado: 'kept', particípio: 'kept' },
  { id: 9, pt: 'significar', presente: 'mean', passado: 'meant', particípio: 'meant' },
  { id: 10, pt: 'obter/conseguir', presente: 'get', passado: 'got', particípio: 'gotten' },
  // FASE 2
  { id: 11, pt: 'correr', presente: 'run', passado: 'ran', particípio: 'run' },
  { id: 12, pt: 'dizer', presente: 'say', passado: 'said', particípio: 'said' },
  { id: 13, pt: 'falar', presente: 'speak', passado: 'spoke', particípio: 'spoken' },
  { id: 14, pt: 'colocar', presente: 'put', passado: 'put', particípio: 'put' },
  { id: 15, pt: 'pegar/levar', presente: 'take', passado: 'took', particípio: 'taken' },
  { id: 16, pt: 'começar', presente: 'begin', passado: 'began', particípio: 'begun' },
  { id: 17, pt: 'escolher', presente: 'choose', passado: 'chose', particípio: 'chosen' },
  { id: 18, pt: 'vir', presente: 'come', passado: 'came', particípio: 'come' },
  { id: 19, pt: 'fazer', presente: 'do', passado: 'did', particípio: 'done' },
  { id: 20, pt: 'cair', presente: 'fall', passado: 'fell', particípio: 'fallen' },
  // FASE 3
  { id: 21, pt: 'sentir', presente: 'feel', passado: 'felt', particípio: 'felt' },
  { id: 22, pt: 'voar', presente: 'fly', passado: 'flew', particípio: 'flown' },
  { id: 23, pt: 'esquecer', presente: 'forget', passado: 'forgot', particípio: 'forgotten' },
  { id: 24, pt: 'dar', presente: 'give', passado: 'gave', particípio: 'given' },
  { id: 25, pt: 'ouvir', presente: 'hear', passado: 'heard', particípio: 'heard' },
  { id: 26, pt: 'saber', presente: 'know', passado: 'knew', particípio: 'known' },
  { id: 27, pt: 'sair/deixar', presente: 'leave', passado: 'left', particípio: 'left' },
  { id: 28, pt: 'perder', presente: 'lose', passado: 'lost', particípio: 'lost' },
  { id: 29, pt: 'fazer (criar)', presente: 'make', passado: 'made', particípio: 'made' },
  { id: 30, pt: 'conhecer/encontrar', presente: 'meet', passado: 'met', particípio: 'met' }
];

// --- DADOS DE TRADUÇÃO (Present Perfect) ---
const TRANSLATION_DATA = [
  { id: 1, pt: "Eu tenho trabalhado muito.", en: "I have worked a lot." },
  { id: 2, pt: "Ela tem estudado inglês.", en: "She has studied English." },
  { id: 3, pt: "Nós estivemos lá antes.", en: "We have been there before." },
  { id: 4, pt: "Eles compraram um carro novo (recentemente).", en: "They have bought a new car." },
  { id: 5, pt: "Você já viu esse filme?", en: "Have you seen this movie?" },
  { id: 6, pt: "Eu nunca comi sushi.", en: "I have never eaten sushi." },
  { id: 7, pt: "Ele acabou de sair.", en: "He has just left." },
  { id: 8, pt: "Nós perdemos nossas chaves.", en: "We have lost our keys." },
  { id: 9, pt: "Ela tem morado aqui por dois anos.", en: "She has lived here for two years." },
  { id: 10, pt: "Eu já terminei meu dever de casa.", en: "I have already finished my homework." },
  { id: 11, pt: "Você já esteve no Brasil?", en: "Have you ever been to Brazil?" },
  { id: 12, pt: "O trem ainda não chegou.", en: "The train hasn't arrived yet." },
  { id: 13, pt: "Eu conheço ele desde 2010.", en: "I have known him since 2010." },
  { id: 14, pt: "Ela quebrou a perna.", en: "She has broken her leg." },
  { id: 15, pt: "Nós vendemos nossa casa.", en: "We have sold our house." }
];

const ITEMS_PER_PHASE = 10;

// --- JOGO: PHRASAL VERBS ---
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
        <div className="bg-indigo-600 p-8 text-center min-h-[160px] flex flex-col items-center justify-center">
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

// --- JOGO: IRREGULAR VERBS (MÚLTIPLA ESCOLHA) ---
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
        <div className="bg-orange-500 p-8 text-center min-h-[160px] flex flex-col items-center justify-center">
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

// --- JOGO: TRANSLATION CHALLENGE (INPUT + MIC) ---
const TranslationGame = ({ onBack }) => {
  const [gameState, setGameState] = useState('start'); // start, playing, result
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  
  // State para Input
  const [userAnswer, setUserAnswer] = useState('');
  const [answerStatus, setAnswerStatus] = useState(null); // 'correct', 'incorrect', null
  const [isListening, setIsListening] = useState(false);

  const startGame = () => {
    // Modo contínuo: Embaralha TODOS os dados disponíveis
    const shuffled = [...TRANSLATION_DATA].sort(() => 0.5 - Math.random());
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

  // Função para normalizar texto (remover pontuação para facilitar a comparação)
  const normalizeText = (text) => {
    return text.toLowerCase()
      .replace(/[.,!?;:]/g, '') // remove pontuação
      .replace(/\s+/g, ' ')     // remove espaços extras
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
      alert("Seu navegador não suporta reconhecimento de voz. Tente usar o Google Chrome.");
      return;
    }

    setIsListening(true);
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; // Inglês para tradução
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      // Adiciona ponto final automaticamente se parecer uma frase completa, opcional
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
    return (
      <div className="flex flex-col h-full py-8 px-4 animate-fadeIn max-w-4xl mx-auto items-center justify-center">
        <div className="text-center mb-8">
          <div className="bg-emerald-100 p-6 rounded-full inline-flex mb-6 text-emerald-600">
            <Languages className="w-16 h-16" />
          </div>
          <h2 className="text-4xl font-bold text-slate-800 mb-4">Translation Challenge</h2>
          <p className="text-slate-600 max-w-lg mx-auto mb-8 text-lg">
            Traduza frases do Português para o Inglês, focando no <b>Present Perfect</b>.
            <br/><br/>
            Digite a tradução ou use o microfone para treinar sua pronúncia.
          </p>
          <div className="flex gap-4 justify-center">
             <button onClick={onBack} className="text-slate-400 hover:text-slate-600 font-bold px-6 py-3">
               Voltar
             </button>
             <button 
               onClick={startGame}
               className="bg-emerald-500 text-white px-10 py-4 rounded-full font-bold text-xl hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-200 flex items-center gap-2"
             >
               <Play className="w-6 h-6" /> Começar Agora
             </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'result') {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 px-4 animate-fadeIn">
        <h2 className="text-4xl font-bold text-slate-800 mb-2">Treino Concluído!</h2>
        <div className="text-6xl font-black text-emerald-500 mb-4">{score}/{shuffledQuestions.length}</div>
        <p className="text-slate-600 mb-8 text-center max-w-xs">
          {score === shuffledQuestions.length ? 'Incrível! Você domina o Present Perfect!' : 'Muito bem! Continue praticando as estruturas.'}
        </p>
        <div className="flex gap-4">
          <button onClick={onBack} className="border-2 border-slate-200 text-slate-600 px-6 py-2 rounded-full font-bold hover:bg-slate-50 transition-colors">Sair</button>
          <button onClick={startGame} className="bg-emerald-500 text-white px-6 py-2 rounded-full font-bold hover:bg-emerald-600 transition-colors flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Jogar Novamente</button>
        </div>
      </div>
    );
  }

  const currentItem = shuffledQuestions[currentQuestionIndex];
  
  // Define estilos baseados no status da resposta
  let inputBorderClass = "border-slate-300 focus:border-emerald-500";
  if (answerStatus === 'correct') inputBorderClass = "border-green-500 bg-green-50 text-green-700";
  else if (answerStatus === 'incorrect') inputBorderClass = "border-red-500 bg-red-50 text-red-700";

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="text-slate-400 hover:text-slate-600"><ArrowLeft className="w-6 h-6" /></button>
        <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">Questão {currentQuestionIndex + 1} de {shuffledQuestions.length}</span>
        <div className="w-6"></div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-6">
        <div className="bg-emerald-500 p-8 text-center min-h-[160px] flex flex-col items-center justify-center">
          <span className="text-emerald-100 uppercase tracking-widest text-xs font-bold mb-3">Traduza para Inglês:</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight max-w-lg mx-auto">
            "{currentItem.pt}"
          </h2>
        </div>

        <div className="p-6">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Sua Tradução</label>
          
          <div className="flex gap-2 mb-6">
            <div className="relative flex-grow">
              <textarea 
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={answerStatus !== null}
                placeholder="Digite a frase em inglês..."
                rows={2}
                className={`w-full p-4 rounded-xl border-2 outline-none font-medium text-lg resize-none transition-all ${inputBorderClass}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !answerStatus) {
                    e.preventDefault();
                    checkAnswer();
                  }
                }}
              />
              {/* Ícones de feedback dentro do input */}
              {answerStatus && (
                <div className="absolute right-3 top-3">
                  {answerStatus === 'correct' ? <CheckCircle className="w-6 h-6 text-green-500" /> : <XCircle className="w-6 h-6 text-red-500" />}
                </div>
              )}
            </div>

            <button 
              onClick={handleSpeech}
              disabled={answerStatus !== null}
              className={`p-4 rounded-xl border-2 transition-all h-[88px] w-[88px] flex items-center justify-center ${
                isListening 
                  ? 'bg-red-500 border-red-500 text-white animate-pulse shadow-red-200 shadow-lg' 
                  : 'bg-white border-slate-200 text-slate-400 hover:border-emerald-400 hover:text-emerald-500'
              }`}
              title="Falar tradução (Inglês)"
            >
              <Mic className="w-8 h-8" />
            </button>
          </div>

          {/* Área de Botão de Ação / Feedback */}
          <div className="pt-2">
            {!answerStatus ? (
              <button 
                onClick={checkAnswer} 
                disabled={!userAnswer.trim()}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                  !userAnswer.trim() 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                    : 'bg-slate-800 text-white hover:bg-slate-900 hover:shadow-slate-300'
                }`}
              >
                Verificar
              </button>
            ) : (
              <div className="animate-fadeIn">
                 {answerStatus === 'incorrect' && (
                    <div className="mb-4 bg-red-50 p-4 rounded-xl border border-red-100">
                      <span className="block text-red-400 text-xs font-bold uppercase tracking-wider mb-1">Resposta Correta:</span>
                      <p className="text-red-700 font-bold text-lg">"{currentItem.en}"</p>
                    </div>
                 )}
                 <button 
                  onClick={nextQuestion} 
                  className={`w-full text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-lg ${
                    answerStatus === 'correct' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200' : 'bg-slate-800 hover:bg-slate-900'
                  }`}
                >
                  {currentQuestionIndex < shuffledQuestions.length - 1 ? 'Próxima Frase' : 'Ver Resultados'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL (HUB) ---
const App = () => {
  const [activeGame, setActiveGame] = useState(null); 
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const games = [
    {
      id: 'phrasal',
      title: "Phrasal Verbs Master",
      description: "Aprenda e memorize os verbos compostos mais usados em fases organizadas.",
      category: "Vocabulário",
      difficulty: "Intermediário",
      icon: <BrainCircuit className="w-6 h-6" />,
      color: "bg-indigo-600",
      isReady: true
    },
    {
      id: 'irregular',
      title: "Irregular Verbs",
      description: "Domine as 3 formas dos verbos irregulares: Infinitive, Past e Participle.",
      category: "Gramática",
      difficulty: "Essencial",
      icon: <Gamepad2 className="w-6 h-6" />,
      color: "bg-orange-500",
      isReady: true
    },
    {
      id: 'translation',
      title: "Translation Challenge",
      description: "Traduza frases com Present Perfect usando digitação ou voz (Speaking).",
      category: "Writing & Speaking",
      difficulty: "Avançado",
      icon: <Languages className="w-6 h-6" />,
      color: "bg-emerald-500",
      isReady: true
    }
  ];

  const categories = ['Todos', 'Vocabulário', 'Gramática', 'Writing & Speaking'];

  const filteredGames = games.filter(game => {
    const matchesCategory = activeCategory === 'Todos' || game.category === activeCategory;
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (activeGame === 'phrasal') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <PhrasalVerbsGame onBack={() => setActiveGame(null)} />
      </div>
    );
  }

  if (activeGame === 'irregular') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <IrregularVerbsGame onBack={() => setActiveGame(null)} />
      </div>
    );
  }

  if (activeGame === 'translation') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <TranslationGame onBack={() => setActiveGame(null)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <nav className="bg-white border-b border-slate-200 px-4 py-4 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-slate-800 p-2 rounded-lg">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              EnglishHub
            </h1>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Buscar jogos..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-full text-sm focus:ring-2 focus:ring-slate-500 focus:bg-white outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">
            Escolha seu treino
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Plataforma de acesso rápido. Selecione um jogo e comece a praticar.
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === category
                    ? 'bg-slate-800 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.length > 0 ? (
            filteredGames.map((game) => (
              <div 
                key={game.id} 
                onClick={() => game.isReady ? setActiveGame(game.id) : null}
                className={`group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer ${!game.isReady ? 'opacity-60 grayscale-[0.5]' : ''}`}
              >
                <div className={`h-40 ${game.color} flex items-center justify-center text-white relative`}>
                  <div className="bg-white/20 p-5 rounded-2xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                    {game.icon}
                  </div>
                  {!game.isReady && (
                    <div className="absolute top-3 right-3 bg-black/30 px-2 py-1 rounded text-[10px] font-bold uppercase backdrop-blur-md">
                      Em breve
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex-grow flex flex-col">
                  <div className="mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {game.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
                    {game.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full bg-slate-400`}></div>
                      <span className="text-xs font-medium text-slate-500">{game.difficulty}</span>
                    </div>
                    
                    {game.isReady ? (
                      <span className="flex items-center gap-1 text-slate-800 font-bold text-sm group-hover:translate-x-1 transition-transform">
                        Jogar <ChevronRight className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Em desenvolvimento</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">Nenhum jogo encontrado.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="py-8 text-center text-slate-400 text-sm bg-white border-t border-slate-200">
        © 2025 EnglishHub - Artur (Engenharia da Computação - UEMG)
      </footer>
    </div>
  );
};

export default App;