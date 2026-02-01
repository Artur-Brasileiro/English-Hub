import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Componente de Layout Padrão para as telas de Menu/Home dos jogos.
 * Centraliza SEO, Container principal, Cabeçalho e Botão de Voltar.
 * * @param {string} title - Título principal da página (H1).
 * @param {string} description - Descrição (subtítulo) e meta description para SEO.
 * @param {ElementType} icon - Componente de ícone (Lucide-React).
 * @param {string} iconColorClass - Classes do Tailwind para cor do ícone e fundo (ex: "bg-emerald-100 text-emerald-600").
 * @param {ReactNode} children - O conteúdo específico da página (grids, menus, etc).
 */
const PageShell = ({ 
  title, 
  description, 
  icon: Icon, 
  iconColorClass = "bg-slate-100 text-slate-600", // Cor padrão (cinza) se nenhuma for passada
  children 
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 animate-fadeIn">
      {/* 1. SEO Centralizado */}
      <Helmet>
        <title>{title} | EnglishUp</title>
        <meta name="description" content={description} />
      </Helmet>

      {/* 2. Container Centralizado */}
      <div className="max-w-6xl mx-auto text-center">
        
        {/* 3. Cabeçalho Padrão */}
        <div className="mb-8">
          {/* Ícone com círculo colorido */}
          <div className={`${iconColorClass} p-4 rounded-full inline-flex mb-4 shadow-sm`}>
            <Icon className="w-10 h-10 md:w-12 md:h-12" />
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3">
            {title}
          </h1>

          <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-6">
            {description}
          </p>
          
          {/* Botão Voltar ao Hub (Padronizado com replace: true) */}
          <button
            onClick={() => navigate("/", { replace: true })}
            className="bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-800 px-6 py-2 rounded-full font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao Hub Principal
          </button>
        </div>

        {/* Divisória Padrão */}
        <hr className="border-slate-200 mb-8" />

        {/* 4. Conteúdo Específico da Página (Menu de Níveis, etc.) */}
        {children}
      </div>
    </div>
  );
};

export default PageShell;