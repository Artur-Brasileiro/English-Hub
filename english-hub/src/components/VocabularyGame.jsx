import React, { useState } from 'react';
import { VOCABULARY_DATA } from '../data/gameData';
import { 
  ArrowRight, 
  Check, 
  X, 
  Trophy, 
  ArrowLeft, 
  BookOpen, 
  Star,
  PlayCircle,
  LayoutGrid
} from 'lucide-react';

const VocabularyGame = ({ onBack }) => {
  // Estados de navegação interna
  const [view, setView] = useState('menu'); // 'menu' | 'game' | 'result'
  
  // Estados do Jogo
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null); // 'correct', 'wrong', null
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });
  
  // Pega os dados do nível selecionado
  const currentLevel = VOCABULARY_DATA.find(l => l.id === currentLevelId) || VOCABULARY_DATA[0];
  const currentWord = currentLevel.words[currentWordIndex];

  // --- FUNÇÕES DE NAVEGAÇÃO ---

  const enterLevel = (levelId) => {
    setCurrentLevelId(levelId);
    setCurrentWordIndex(0);
    setStats({ correct: 0, wrong: 0 });
    setFeedback(null);
    setUserInput('');
    setView('game');
  };

  const returnToMenu = () => {
    setView('menu');
  };

  const nextWord = () => {
    setUserInput('');
    setFeedback(null);
    if (currentWordIndex + 1 < currentLevel.words.length) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      setView('result');
    }
  };

  const checkAnswer = (e) => {
    e.preventDefault();
    if (feedback) return;

    const possibleAnswers = currentWord.pt.map(a => a.toLowerCase().trim());
    const userAnswer = userInput.toLowerCase().trim();

    if (possibleAnswers.includes(userAnswer)) {
      setFeedback('correct');
      setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setFeedback('wrong');
      setStats(prev => ({ ...prev, wrong: prev.wrong + 1 }));
    }
  };

  // --- TELAS DO COMPONENTE ---

  // 1. TELA DE SELEÇÃO DE NÍVEIS (MENU)
  if (view === 'menu') {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 animate-fade-in">
        <div className="max-w-6xl mx-auto">
          
          {/* Header Centralizado */}
          <div className="text-center mb-12">
            <div className="bg-blue-100 p-4 rounded-full inline-flex mb-4 text-blue-600 shadow-sm">
               <BookOpen className="w-10 h-10 md:w-12 md:h-12" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3">
               Vocabulary Builder
            </h1>
            
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
               Expanda seu vocabulário técnico e geral com desafios diários de 30 palavras.
            </p>
          </div>

          {/* Grid de Níveis */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {VOCABULARY_DATA.map((level) => (
              <div 
                key={level.id}
                onClick={() => enterLevel(level.id)}
                className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer relative overflow-hidden"
              >
                {/* Efeito de hover no fundo */}
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <LayoutGrid className="w-24 h-24 text-blue-600" />
                </div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Nível {level.id}
                    </span>
                    <Star className="w-5 h-5 text-slate-300 group-hover:text-yellow-400 transition-colors" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {level.title}
                  </h3>
                  
                  <p className="text-slate-500 text-sm mb-6">
                    {level.words.length} palavras essenciais
                  </p>

                  <div className="flex items-center gap-2 text-sm font-bold text-blue-600 group-hover:translate-x-2 transition-transform">
                    Iniciar Desafio <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}

            {/* Card de "Em Breve" */}
            <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-6 flex flex-col justify-center items-center text-center opacity-70 hover:opacity-100 transition-opacity">
              <div className="bg-slate-200 p-3 rounded-full mb-3">
                <LayoutGrid className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-base font-bold text-slate-500">Próximos Dias</h3>
              <p className="text-xs text-slate-400 mt-1">Novas listas em breve...</p>
            </div>
          </div>

          {/* Botão de Voltar ao Hub (AGORA NO FINAL) */}
          <button onClick={onBack} className="text-slate-400 hover:text-slate-600 text-sm font-medium flex items-center justify-center gap-2 mx-auto transition-colors">
             <ArrowLeft className="w-4 h-4" /> Voltar ao Hub
          </button>

        </div>
      </div>
    );
  }

  // 2. TELA DE RESULTADO
  if (view === 'result') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 text-center max-w-lg w-full">
          <div className="w-24 h-24 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Trophy className="w-12 h-12" />
          </div>
          
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Desafio Concluído!</h2>
          <p className="text-slate-500 mb-8">Você finalizou o <strong>{currentLevel.title}</strong></p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
              <p className="text-4xl font-black text-green-600">{stats.correct}</p>
              <p className="text-xs font-bold text-green-800 uppercase tracking-wider">Acertos</p>
            </div>
            <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
              <p className="text-4xl font-black text-red-500">{stats.wrong}</p>
              <p className="text-xs font-bold text-red-800 uppercase tracking-wider">Erros</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => enterLevel(currentLevelId)}
              className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              Jogar Novamente
            </button>
            <button 
              onClick={returnToMenu}
              className="w-full py-3.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Escolher Outro Nível
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. TELA DO JOGO (PLAYING)
  const progressPercentage = ((currentWordIndex) / currentLevel.words.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 p-4 font-sans text-slate-800 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        {/* Header do Jogo */}
        <div className="flex items-center justify-between mb-8 pt-4">
            <button onClick={returnToMenu} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold transition-colors text-sm uppercase tracking-wide">
                <ArrowLeft className="w-4 h-4" /> Sair
            </button>
            <span className="text-slate-400 font-bold text-sm uppercase tracking-wide">
              {currentLevel.title}
            </span>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative">
          {/* Barra de Progresso */}
          <div className="w-full bg-slate-100 h-2">
            <div 
              className="bg-blue-600 h-2 transition-all duration-500 ease-out" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          <div className="p-8 md:p-12 text-center">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest rounded-full mb-8">
              <PlayCircle className="w-3 h-3" /> Palavra {currentWordIndex + 1} / {currentLevel.words.length}
            </span>

            <div className="mb-10">
              <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-2">
                {currentWord.en}
              </h1>
              <p className="text-slate-400 text-sm font-medium italic">Como se diz isso em português?</p>
            </div>

            <form onSubmit={checkAnswer} className="max-w-md mx-auto relative mb-8">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Digite a tradução..."
                className={`w-full p-4 text-center text-xl font-medium border-2 rounded-xl outline-none transition-all shadow-sm
                  ${feedback === 'correct' ? 'border-green-500 bg-green-50 text-green-700' : 
                    feedback === 'wrong' ? 'border-red-500 bg-red-50 text-red-700' : 
                    'border-slate-200 focus:border-blue-500 focus:shadow-md'}`}
                disabled={feedback !== null}
                autoFocus
              />
              {!feedback && userInput.trim() && (
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                      <ArrowRight className="w-5 h-5" />
                  </button>
              )}
            </form>

            {/* Área de Feedback */}
            {feedback && (
              <div className="animate-fade-in-up">
                {feedback === 'correct' ? (
                  <div className="flex flex-col items-center text-green-600 mb-6">
                    <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full mb-2">
                      <Check className="w-5 h-5" />
                      <span className="font-bold">Correto!</span>
                    </div>
                  </div>
                ) : (
                  <div className="mb-8 bg-red-50 p-4 rounded-2xl border border-red-100">
                    <div className="flex items-center justify-center gap-2 text-red-500 mb-2">
                       <X className="w-5 h-5" />
                       <span className="font-bold">Ops!</span>
                    </div>
                    <p className="text-slate-600 text-sm">
                      A resposta era: <strong className="text-slate-900 text-lg block mt-1">{currentWord.pt[0]}</strong>
                    </p>
                    <p className="text-slate-400 text-xs mt-2">(Aceita também: {currentWord.pt.slice(1).join(", ")})</p>
                  </div>
                )}

                <button 
                  onClick={nextWord}
                  className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold text-white shadow-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mx-auto
                    ${feedback === 'correct' ? 'bg-green-600 hover:bg-green-700 shadow-green-200' : 'bg-slate-800 hover:bg-slate-900 shadow-slate-300'}`}
                >
                  {currentWordIndex + 1 === currentLevel.words.length ? 'Ver Resultado' : 'Próxima Palavra'} <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabularyGame;