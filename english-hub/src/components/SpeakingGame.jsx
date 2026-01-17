import React, { useState } from 'react';
import { 
  Mic2, ArrowLeft, RefreshCw, CheckCircle, XCircle, Mic, ChevronRight,
  // Novos ícones para as categorias
  Type, Hash, ListOrdered, MicOff, AlertTriangle, Zap, Smartphone 
} from 'lucide-react';
import { SPEAKING_DATA } from '../data/gameData';

const SpeakingGame = ({ onBack }) => {
  const [gameState, setGameState] = useState('menu'); // menu, playing, result
  const [category, setCategory] = useState(null); 
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);

  // Configuração dos Modos de Jogo
  const modes = [
    { 
      id: 'alphabet', 
      label: 'Alphabet', 
      desc: '26 Letras (A-Z)', 
      icon: Type, 
      color: 'text-blue-500', 
      bg: 'hover:border-blue-200 hover:shadow-blue-100' 
    },
    { 
      id: 'numbers', 
      label: 'Numbers', 
      desc: '0-100 & Grandes', 
      icon: Hash, 
      color: 'text-green-500', 
      bg: 'hover:border-green-200 hover:shadow-green-100' 
    },
    { 
      id: 'ordinals', 
      label: 'Ordinals', 
      desc: '1st, 2nd, 3rd...', 
      icon: ListOrdered, 
      color: 'text-purple-500', 
      bg: 'hover:border-purple-200 hover:shadow-purple-100' 
    },
    { 
      id: 'silent_letters', 
      label: 'Silent Letters', 
      desc: 'Knife, Island...', 
      icon: MicOff, 
      color: 'text-slate-500', 
      bg: 'hover:border-slate-300 hover:shadow-slate-100' 
    },
    { 
      id: 'tricky_words', 
      label: 'Tricky Words', 
      desc: 'World, Three...', 
      icon: AlertTriangle, 
      color: 'text-orange-500', 
      bg: 'hover:border-orange-200 hover:shadow-orange-100' 
    },
    { 
      id: 'tongue_twisters', 
      label: 'Twisters', 
      desc: 'Trava-línguas', 
      icon: Zap, 
      color: 'text-yellow-500', 
      bg: 'hover:border-yellow-200 hover:shadow-yellow-100' 
    },
    { 
      id: 'tech_brands', 
      label: 'Tech & Brands', 
      desc: 'Google, WiFi...', 
      icon: Smartphone, 
      color: 'text-indigo-500', 
      bg: 'hover:border-indigo-200 hover:shadow-indigo-100' 
    },
  ];

  const startRound = (selectedCategory) => {
    const data = SPEAKING_DATA[selectedCategory];
    
    if (!data) {
      alert("Categoria ainda não configurada nos dados.");
      return;
    }

    const fullList = [...data]; 
    
    setCategory(selectedCategory);
    setQuestions(fullList);
    setCurrentIndex(0);
    setScore(0);
    setFeedback(null);
    setGameState('playing');
  };

  const handleSpeech = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Navegador sem suporte a voz. Tente usar o Chrome.");
      return;
    }

    setIsListening(true);
    setFeedback(null);
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      const currentItem = questions[currentIndex];
      
      // Remove pontuação final para comparação
      const cleanTranscript = transcript.replace(/[.,!?;:]/g, '');
      const isMatch = currentItem.valid.some(val => val.toLowerCase() === cleanTranscript);

      if (isMatch) {
        setFeedback({ type: 'correct', text: cleanTranscript });
        setScore(s => s + 1);
        setTimeout(() => nextQuestion(true), 1500);
      } else {
        setFeedback({ type: 'error', text: cleanTranscript });
      }
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setFeedback({ type: 'error', text: '...' });
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const nextQuestion = (isAuto = false) => {
    setFeedback(null);
    setIsListening(false);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setGameState('result');
    }
  };

  if (gameState === 'menu') {
    return (
      <div className="flex flex-col h-full py-8 px-4 animate-fadeIn max-w-5xl mx-auto items-center">
        <div className="bg-rose-100 p-6 rounded-full inline-flex mb-6 text-rose-600">
          <Mic2 className="w-16 h-16" />
        </div>
        <h2 className="text-4xl font-bold text-slate-800 mb-4">Pronunciation Lab</h2>
        <p className="text-slate-600 mb-10 text-center max-w-lg text-lg">
          Treine sua pronúncia em categorias específicas.<br/>
          O sistema de voz avaliará se você soa como um nativo.
        </p>
        
        {/* GRID DINÂMICO DE BOTÕES */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-4xl">
          {modes.map((mode) => (
            <button 
              key={mode.id}
              onClick={() => startRound(mode.id)} 
              className={`bg-white border-2 border-slate-100 p-6 rounded-2xl transition-all text-center group flex flex-col items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-lg ${mode.bg}`}
            >
              <div className={`${mode.color} bg-slate-50 p-4 rounded-full group-hover:scale-110 transition-transform`}>
                <mode.icon className="w-8 h-8" />
              </div>
              <div>
                <span className="font-bold text-lg text-slate-700 block leading-tight">{mode.label}</span>
                <span className="text-xs text-slate-400 font-medium mt-1 block">{mode.desc}</span>
              </div>
            </button>
          ))}
        </div>
        
        <button 
          onClick={onBack} 
          className="bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-800 px-6 py-2 rounded-full font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 mx-auto"
        >
            <ArrowLeft className="w-4 h-4" /> Voltar ao Hub Principal
        </button>
      </div>
    );
  }

  if (gameState === 'result') {
    // Busca o label do modo atual para exibir no resultado
    const currentModeLabel = modes.find(m => m.id === category)?.label || category;

    return (
      <div className="flex flex-col items-center justify-center h-full py-12 px-4 animate-fadeIn">
        <h2 className="text-4xl font-bold text-slate-800 mb-2">Treino Finalizado!</h2>
        <div className="text-7xl font-black text-rose-500 mb-2">{score}/{questions.length}</div>
        <div className="bg-rose-50 text-rose-800 px-4 py-1 rounded-full font-bold text-sm uppercase mb-8">
          {currentModeLabel}
        </div>
        <div className="flex gap-4">
          <button onClick={() => setGameState('menu')} className="border-2 border-slate-200 text-slate-600 px-8 py-3 rounded-full font-bold hover:bg-slate-50 transition-colors">Menu</button>
          <button onClick={() => startRound(category)} className="bg-rose-500 text-white px-8 py-3 rounded-full font-bold hover:bg-rose-600 transition-colors flex items-center gap-2"><RefreshCw className="w-5 h-5" /> Repetir</button>
        </div>
      </div>
    );
  }

  const currentItem = questions[currentIndex];

  return (
    <div className="max-w-xl mx-auto py-8 px-4 flex flex-col min-h-150">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => setGameState('menu')} className="text-slate-400 hover:text-slate-600"><ArrowLeft className="w-6 h-6" /></button>
        <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">
           {currentIndex + 1}/{questions.length}
        </span>
        <div className="w-6"></div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden grow flex flex-col relative">
        <div className="grow flex items-center justify-center bg-slate-50 p-10 flex-col">
          {/* Ajusta tamanho da fonte se a palavra for muito grande (tipo 'eleven benevolent elephants') */}
          <span className={`${currentItem.display.length > 15 ? 'text-4xl md:text-5xl' : 'text-6xl md:text-8xl'} font-black text-slate-800 drop-shadow-sm select-none text-center transition-all`}>
            {currentItem.display}
          </span>
          <span className="text-slate-400 text-sm mt-4 font-medium uppercase tracking-widest">Fale em voz alta</span>
        </div>

        <div className="p-8 bg-white border-t border-slate-100 flex flex-col items-center gap-6">
           <div className="h-16 flex items-center justify-center w-full">
             {feedback && (
               <div className={`flex flex-col items-center gap-1 px-6 py-3 rounded-xl text-sm font-bold animate-fadeIn w-full justify-center text-center border-2 ${
                 feedback.type === 'correct' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
               }`}>
                 <div className="flex items-center gap-2">
                    {feedback.type === 'correct' ? <CheckCircle className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
                    <span className="uppercase tracking-wide">{feedback.type === 'correct' ? 'Correto!' : 'Tente Novamente'}</span>
                 </div>
                 <span className="font-normal opacity-80">Você disse: "{feedback.text}"</span>
               </div>
             )}
           </div>

           <button 
             onClick={handleSpeech}
             disabled={isListening || (feedback?.type === 'correct')}
             className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-xl ${
               isListening 
                ? 'bg-rose-500 animate-pulse scale-110 shadow-rose-300' 
                : feedback?.type === 'correct'
                  ? 'bg-green-500 scale-100 shadow-green-200'
                  : 'bg-slate-800 hover:bg-rose-500 hover:scale-105 hover:shadow-rose-200 text-white'
             }`}
           >
             <Mic className="w-10 h-10 text-white" />
           </button>
           
           <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
             {isListening ? 'Ouvindo...' : 'Toque para Falar'}
           </p>
        </div>

        <button 
          onClick={() => nextQuestion(false)}
          className="absolute bottom-6 right-6 text-slate-300 hover:text-slate-500 p-2 hover:bg-slate-100 rounded-full transition-colors"
          title="Pular"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default SpeakingGame;