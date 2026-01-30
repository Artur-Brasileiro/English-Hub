import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-800">
      
      {/* --- SEO E METADADOS --- */}
      <Helmet>
        <title>Fale Conosco - EnglishUp | Suporte e Sugestões</title>
        <meta 
          name="description" 
          content="Entre em contato com a equipe do EnglishUp. Tire dúvidas, envie sugestões de jogos ou reporte erros. Estamos aqui para ajudar." 
        />
      </Helmet>

      <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 text-center">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center justify-center gap-2 text-rose-600 font-bold mb-8 hover:underline mx-auto"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Início
        </button>

        <h1 className="text-3xl font-black mb-4">Fale Conosco</h1>
        <p className="text-slate-600 mb-8">
          Tem alguma dúvida, sugestão de melhoria ou encontrou algum bug nos jogos?
          Entre em contato diretamente com nossa equipe de desenvolvimento.
        </p>

        {/* Card de E-mail */}
        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 inline-block w-full max-w-full">
            <Mail className="w-8 h-8 text-slate-400 mx-auto mb-3" />
            <p className="text-sm text-slate-500 font-bold uppercase tracking-wide mb-1">E-mail para suporte</p>
            <a 
              href="mailto:arturbrasileiro00@gmail.com" 
              className="text-xl md:text-2xl font-black text-indigo-600 hover:text-indigo-700 transition-colors break-all"
            >
              arturbrasileiro00@gmail.com
            </a>
            <p className="text-xs text-slate-400 mt-2">Respondemos em até 24 horas úteis.</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;