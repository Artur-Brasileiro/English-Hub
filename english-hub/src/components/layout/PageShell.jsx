import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ArrowDown } from 'lucide-react'; // Importei o ArrowDown
import { useNavigate } from 'react-router-dom';

const PageShell = ({ 
  title, 
  description, 
  icon: Icon, 
  iconColorClass = "bg-slate-100 text-slate-600",
  onMethodologyClick, // <--- NOVA PROP: A função que faz o scroll
  children 
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 animate-fadeIn">
      <Helmet>
        <title>{title} | EnglishUp</title>
        <meta name="description" content={description} />
      </Helmet>

      <div className="max-w-6xl mx-auto text-center">
        
        <div className="mb-8">
          <div className={`${iconColorClass} p-4 rounded-full inline-flex mb-4 shadow-sm`}>
            <Icon className="w-10 h-10 md:w-12 md:h-12" />
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3">
            {title}
          </h1>

          <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-6">
            {description}
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate("/", { replace: true })}
              className="bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-800 px-6 py-2 rounded-full font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar ao Hub Principal
            </button>

            {/* O botão agora mora aqui dentro! */}
            {onMethodologyClick && (
              <button 
                onClick={onMethodologyClick}
                className="bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-800 px-6 py-2 rounded-full font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <ArrowDown className="w-4 h-4" />
                Metodologia
              </button>
            )}
          </div>
        </div>

        <hr className="border-slate-200 mb-8" />

        {children}
      </div>
    </div>
  );
};

export default PageShell;