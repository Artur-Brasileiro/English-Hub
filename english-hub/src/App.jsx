import React, { useState } from 'react';
import { 
  Gamepad2, 
  Mic2, 
  BrainCircuit, 
  Search,
  ChevronRight,
  GraduationCap,
  Languages,
  BookOpen
} from 'lucide-react';

// Importando os componentes
import PhrasalVerbsGame from './components/PhrasalVerbsGame';
import IrregularVerbsGame from './components/IrregularVerbsGame';
import TranslationGame from './components/TranslationGame';
import SpeakingGame from './components/SpeakingGame';
import VocabularyGame from './components/VocabularyGame';

const App = () => {
  const [activeGame, setActiveGame] = useState(null); 
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const games = [
    {
      id: 'vocabulary',
      title: "Daily Vocabulary",
      description: "30 palavras novas por dia para expandir seu vocabulário.",
      category: "Vocabulary",
      difficulty: "Essencial",
      icon: <BookOpen className="w-6 h-6" />,
      color: "bg-gray-600",
      isReady: true
    },
    {
      id: 'irregular',
      title: "Irregular Verbs",
      description: "Domine as 3 formas dos verbos irregulares: Infinitive, Past e Participle.",
      category: "Grammar",
      difficulty: "Essencial",
      icon: <Gamepad2 className="w-6 h-6" />,
      color: "bg-orange-500",
      isReady: true
    },
    {
      id: 'phrasal',
      title: "Phrasal Verbs Master",
      description: "Aprenda e memorize os verbos compostos mais usados em fases organizadas.",
      category: "Vocabulary",
      difficulty: "Intermediário",
      icon: <BrainCircuit className="w-6 h-6" />,
      color: "bg-indigo-600",
      isReady: true
    },
    {
      id: 'translation',
      title: "Translation Challenge",
      description: "Traduza frases do dia a dia e tempos perfeitos com digitação ou voz.",
      category: "Writing & Speaking",
      difficulty: "Avançado",
      icon: <Languages className="w-6 h-6" />,
      color: "bg-emerald-500",
      isReady: true
    },
    {
      id: 'speaking',
      title: "Pronunciation Lab",
      description: "Treine sua fala com o Alfabeto, Números e Ordinais.",
      category: "Speaking",
      difficulty: "Iniciante",
      icon: <Mic2 className="w-6 h-6" />, 
      color: "bg-rose-500",
      isReady: true
    }
  ];

  const categories = ['All', 'Vocabulary', 'Grammar', 'Writing & Speaking', 'Speaking'];

  const filteredGames = games.filter(game => {
    const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Renderização Condicional
  if (activeGame === 'vocabulary') {
    return <VocabularyGame onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === 'phrasal') {
    return <PhrasalVerbsGame onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === 'irregular') {
    return <IrregularVerbsGame onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === 'translation') {
    return <TranslationGame onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === 'speaking') {
    return <SpeakingGame onBack={() => setActiveGame(null)} />;
  }

  // Renderização do Menu (Hub)
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
                </div>
                
                <div className="p-6 grow flex flex-col">
                  <div className="mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {game.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 grow">
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