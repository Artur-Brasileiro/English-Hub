import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const brandName = "EnglishUp";

  const games = [
    {
      id: "vocabulary",
      title: "Daily Vocabulary",
      description: "30 palavras novas por dia para expandir seu vocabulário com consistência.",
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
      description: "Domine os 3 tempos dos verbos irregulares: Past, Present e Future.",
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
      description: "Aprenda e memorize os phrasal verbs mais usados em fases organizadas.",
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
      description: "Traduza frases do dia a dia e treine escrita (digitação ou voz).",
      category: "Writing & Speaking",
      difficulty: "Avançado",
      icon: <Languages className="w-6 h-6" />,
      color: "bg-emerald-500",
      isReady: true,
      badge: "DESAFIO",
      path: "/translation"
    }
  ];

  const categories = ["All", "Vocabulary", "Grammar", "Writing & Speaking"];

  const filteredGames = games.filter((game) => {
    const matchesCategory = activeCategory === "All" || game.category === activeCategory;
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  useEffect(() => {
    document.title = "English Up - Aprenda Inglês Jogando";
  }, []);

  return (
    <div className="min-h-screen text-slate-900 font-sans bg-linear-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Blobs leves no fundo */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 bg-indigo-200/40 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-28 w-80 h-80 bg-emerald-200/35 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 w-96 h-96 bg-rose-200/25 rounded-full blur-3xl" />

      <nav className="bg-white/70 backdrop-blur border-b border-slate-200 px-4 py-4 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <img
              src={logoEnglishUp}
              alt="EnglishUp"
              className="h-16 md:h-20 w-auto object-contain"
            />
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar treinos..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/70 border border-slate-200 rounded-full text-sm focus:ring-2 focus:ring-slate-900/20 focus:border-slate-300 outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12 relative z-0">
        {/* HERO */}
        <section className="mb-10">
          <div className="bg-white/70 backdrop-blur border border-white/60 rounded-3xl shadow-[0_16px_40px_-24px_rgba(0,0,0,0.25)] p-7 md:p-10 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-slate-900/5 rounded-full blur-2xl" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />

            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between relative">
              <div>
                <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-sm">
                  TREINO DIÁRIO • LEVE • EFICIENTE
                </div>

                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-4 leading-tight tracking-tight">
                  Alguns minutos por dia.
                  <span className="text-indigo-600"> Inglês pra vida.</span>
                </h2>

                <p className="text-slate-600 text-base md:text-lg max-w-2xl mt-3">
                  Escolha um treino abaixo e pratique um pouco todos os dias.
                  Simples, direto e feito pra evolução constante.
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-5 text-sm text-slate-600">
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

        {/* Categorias */}
        <div className="flex justify-center mb-10">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${
                  activeCategory === category
                    ? "bg-slate-900 text-white"
                    : "bg-white/70 text-slate-600 border border-slate-200 hover:bg-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.length > 0 ? (
            filteredGames.map((game) => (
              <div
                key={game.id}
                onClick={() => game.isReady ? navigate(game.path) : null}
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
        <div className="max-w-6xl mx-auto px-4 mt-8 pt-6 border-t border-slate-100 text-center md:text-left">
           <p className="text-[10px] text-slate-400 uppercase tracking-wider">
             Feito com ❤️ em Minas Gerais, Brasil.
           </p>
        </div>
      </footer>
    </div>
  );
};

export default HubPage;
