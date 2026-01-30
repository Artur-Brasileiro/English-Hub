import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, GraduationCap, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-800">
      
      {/* --- SEO E METADADOS --- */}
      <Helmet>
        <title>Sobre o EnglishUp - Quem Somos e Nossa Missão</title>
        <meta 
          name="description" 
          content="Conheça o EnglishUp, uma plataforma 100% gratuita desenvolvida por Artur Brasileiro para ajudar estudantes a aprender inglês sozinhos com jogos rápidos." 
        />
      </Helmet>

      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-rose-600 font-bold mb-8 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Início
        </button>

        <h1 className="text-3xl font-black mb-6">Sobre o EnglishUp</h1>
        
        <div className="space-y-6 text-slate-600 leading-relaxed">
          <p className="text-lg font-medium text-slate-800">
            O EnglishUp é a ferramenta perfeita para você <strong>aprender inglês sozinho</strong>. 
            Uma plataforma 100% gratuita para quem quer evoluir o idioma sem pagar cursos caros.
          </p>

          <p>
            Nosso objetivo é simples: oferecer <strong>exercícios de inglês online</strong> rápidos e diretos. 
            Sabemos que a parte mais difícil é decorar gramática e palavras novas, por isso criamos jogos focados em resolver suas maiores dificuldades:
          </p>

          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li>Dominar os temidos <strong>verbos irregulares</strong>;</li>
            <li>Entender de vez os <strong>phrasal verbs</strong>;</li>
            <li>Expandir seu <strong>vocabulário</strong> diário.</li>
          </ul>

          <p>
            Sem teorias complicadas e sem cadastro. É só entrar e praticar 15 minutos por dia.
          </p>

          <hr className="border-slate-100 my-6" />

          <h2 className="text-xl font-bold text-slate-800 mb-4">Quem Somos</h2>
          
          <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 flex flex-col md:flex-row gap-6 items-start">
            <div className="grow">
              <h3 className="font-bold text-indigo-900 text-lg">Artur Morais Brasileiro</h3>
              <p className="text-indigo-700 text-sm mb-4">Desenvolvedor & Criador</p>
              
              <div className="flex flex-col gap-2 text-sm text-indigo-800/80">
                <div className="flex items-center gap-2">
                   <GraduationCap className="w-4 h-4" />
                   <span>Engenharia da Computação - UEMG</span>
                </div>
                <div className="flex items-center gap-2">
                   <MapPin className="w-4 h-4" />
                   <span>Ituiutaba, MG - Brasil</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm mt-4">
            Criei este projeto para ajudar quem, assim como eu, buscava uma forma prática e gratuita de treinar inglês pela internet.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;