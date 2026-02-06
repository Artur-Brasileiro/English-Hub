import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Gamepad2,
  BrainCircuit,
  Search,
  ChevronRight,
  Languages,
  BookOpen
} from "lucide-react";

import logoEnglishUp from "../assets/englishup-logo.png";

const HubPage = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  const brandName = "EnglishUp";

  const games = [
    {
      id: "vocabulary",
      title: "Daily Vocabulary",
      description: "Aprenda 30 palavras novas por dia. O exercício ideal para expandir seu vocabulário e estudar inglês sozinho.",
      category: "Vocabulary",
      difficulty: "Essencial",
      icon: <BookOpen className="w-6 h-6" />,
      color: "bg-rose-500",
      isReady: true,
      badge: "TREINO DIÁRIO",
      path: "/vocabulary"
    },
    {
      id: "irregular",
      title: "Irregular Verbs",
      description: "Resolva sua dificuldade com verbos irregulares. Treine Past e Participle usando nosso método de memorização.",
      category: "Grammar",
      difficulty: "Essencial",
      icon: <Gamepad2 className="w-6 h-6" />,
      color: "bg-orange-500",
      isReady: true,
      badge: "ESSENCIAL",
      path: "/irregular"
    },
    {
      id: "phrasal",
      title: "Phrasal Verbs Master",
      description: "Domine os phrasal verbs mais usados em conversas e filmes. Entenda o sentido real jogando de graça.",
      category: "Vocabulary",
      difficulty: "Intermediário",
      icon: <BrainCircuit className="w-6 h-6" />,
      color: "bg-indigo-600",
      isReady: true,
      badge: "BOOST",
      path: "/phrasal"
    },
    {
      id: "translation",
      title: "Translation Challenge",
      description: "Exercícios de tradução para destravar a montagem de frases. Teste seu inglês do básico ao avançado.",
      category: "Writing & Speaking",
      difficulty: "Avançado",
      icon: <Languages className="w-6 h-6" />,
      color: "bg-emerald-500",
      isReady: true,
      badge: "DESAFIO",
      path: "/translation"
    }
  ];

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      return game.title.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [searchTerm]);

  const difficultyDot = (difficulty) => {
    switch (difficulty) {
      case "Essencial":
        return "bg-emerald-500";
      case "Intermediário":
        return "bg-amber-500";
      case "Avançado":
        return "bg-indigo-600";
      default:
        return "bg-slate-400";
    }
  };

  return (
    <div className="min-h-screen text-slate-900 font-sans bg-linear-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
      
      {/* --- SEO E METADADOS --- */}
      <Helmet>
        <title>EnglishUp - Aprenda Inglês Jogando | Exercícios Grátis</title>
        <meta 
          name="description" 
          content="Plataforma gratuita para aprender inglês jogando. Exercícios de vocabulário, verbos irregulares, phrasal verbs e tradução. Estude sozinho com Active Recall." 
        />
      </Helmet>

      {/* Blobs leves no fundo */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 bg-indigo-200/40 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-28 w-80 h-80 bg-emerald-200/35 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 w-96 h-96 bg-rose-200/25 rounded-full blur-3xl" />

      {/* --- HEADER COM SLOGAN --- */}
      <nav className="bg-white/70 backdrop-blur border-b border-slate-200 px-4 py-4 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 md:gap-6">
          
          {/* Logo */}
          <img
            src={logoEnglishUp}
            alt="EnglishUp"
            className="h-14 md:h-16 w-auto object-contain"
          />

          {/* Divisória Vertical (apenas desktop) */}
          <div className="hidden md:block w-px h-8 bg-slate-300 rounded-full"></div>

          {/* Slogan */}
          <p className="text-slate-500 font-medium text-sm md:text-base tracking-tight text-center md:text-left">
            Treinar inglês nunca foi tão fácil.
          </p>

        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12 relative z-0">
        {/* HERO */}
        <section className="mb-10">
          <div className="bg-white/70 backdrop-blur border border-white/60 rounded-3xl shadow-[0_16px_40px_-24px_rgba(0,0,0,0.25)] p-7 md:p-10 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-slate-900/5 rounded-full blur-2xl" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />

            {/* Ajuste no container principal para centralizar no mobile (items-center) */}
            <div className="flex flex-col md:flex-row gap-8 items-center justify-between relative">
              
              {/* Ajuste no container de texto para centralizar filhos no mobile */}
              <div className="flex flex-col items-center md:items-start w-full md:w-auto">
                <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-sm">
                  TREINO DIÁRIO • LEVE • EFICIENTE
                </div>

                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-4 leading-tight tracking-tight text-center md:text-left">
                  Alguns minutos por dia.
                  <span className="text-indigo-600"> Inglês pra vida.</span>
                </h2>

                <p className="text-center md:text-left text-slate-600 text-base md:text-lg max-w-2xl mt-3">
                  Exercícios rápidos para aprender inglês de graça. Domine a gramática e verbos essenciais com jogos de repetição espaçada.
                  Simples, direto e sem cadastro.
                </p>

                {/* Ajuste na legenda para centralizar no mobile */}
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-5 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Essencial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Intermediário</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    <span>Avançado</span>
                  </div>
                </div>
              </div>

              {/* Mini-card */}
              <div className="w-full md:w-85 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Meta rápida
                </p>
                <p className="text-xl font-extrabold text-slate-900 mt-1">
                  15 min por dia
                </p>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                  Você não precisa estudar muito. Precisa estudar sempre.
                </p>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Treinos disponíveis</p>
                    <p className="text-lg font-extrabold text-slate-900">{games.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- BARRA DE PESQUISA --- */}
        <div className="flex justify-center mb-10">
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar treinos..."
              className="w-full pl-12 pr-4 py-3.5 bg-white backdrop-blur border border-slate-200 rounded-full text-base focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.length > 0 ? (
            filteredGames.map((game) => (
              <div
                key={game.id}
                onClick={() => game.isReady ? navigate(game.path) : null}
                onMouseEnter={() => {
                  // Isso inicia o download do chunk JS antes do clique
                  if (game.id === 'vocabulary') import('../components/VocabularyGame');
                  if (game.id === 'irregular') import('../components/IrregularVerbsGame');
                  if (game.id === 'phrasal') import('../components/PhrasalVerbsGame');
                  if (game.id === 'translation') import('../components/TranslationGame');
                }}
                className={`group bg-white/80 backdrop-blur rounded-3xl border border-slate-200 overflow-hidden transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1 hover:shadow-xl ${
                  !game.isReady ? "opacity-60 grayscale-[0.5]" : ""
                }`}
              >
                <div className={`h-44 ${game.color} flex items-center justify-center text-white relative`}>
                  {/* badge */}
                  <div className="absolute top-4 left-4 bg-white/20 border border-white/30 backdrop-blur px-3 py-1 rounded-full text-xs font-extrabold tracking-wide">
                    {game.badge}
                  </div>

                  <div className="bg-white/20 p-5 rounded-2xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    {game.icon}
                  </div>
                </div>

                <div className="p-6 grow flex flex-col">
                  <div className="mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {game.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {game.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed mb-6 grow">
                    {game.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${difficultyDot(game.difficulty)}`} />
                      <span className="text-xs font-bold text-slate-500">{game.difficulty}</span>
                    </div>

                    {game.isReady ? (
                      <span className="flex items-center gap-1 text-slate-900 font-extrabold text-sm group-hover:translate-x-1 transition-transform">
                        Jogar <ChevronRight className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Em breve</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="bg-white/70 border border-slate-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Search className="text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">Nenhum treino encontrado.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white/80 backdrop-blur border-t border-slate-200 pt-10 pb-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Lado Esquerdo: Copyright */}
          <div className="text-center md:text-left">
            <p className="text-slate-900 font-bold text-lg">{brandName}</p>
            <p className="text-slate-500 text-sm mt-1">
              © 2026 Artur Brasileiro. Todos os direitos reservados.
            </p>
          </div>

          {/* Lado Direito: Links Institucionais (Exigência AdSense) */}
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-500">
            <button onClick={() => navigate('/about')} className="hover:text-indigo-600 transition-colors">
              Sobre Nós
            </button>
            <button onClick={() => navigate('/privacy')} className="hover:text-indigo-600 transition-colors">
              Política de Privacidade
            </button>
            <button onClick={() => navigate('/contact')} className="hover:text-indigo-600 transition-colors">
              Contato
            </button>
            <a 
              href="https://github.com/Artur-Brasileiro" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-indigo-600 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
        
        {/* Disclamerzinho extra que o Google gosta */}
        <div className="max-w-6xl mx-auto px-4 mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">
            Feito com ❤️ em Minas Gerais, Brasil.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HubPage;