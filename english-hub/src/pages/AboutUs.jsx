import React from 'react';
import { ArrowLeft, GraduationCap, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-800">
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
            O EnglishUp é uma plataforma de educação gamificada focada em tornar o aprendizado de inglês técnico e cotidiano acessível, rápido e divertido.
          </p>

          <p>
            Nossa missão é combater a "curva do esquecimento" através de mecânicas de <strong>Active Recall</strong> (Recuperação Ativa) e Repetição Espaçada. Acreditamos que 15 minutos de prática diária valem mais do que horas de estudo passivo.
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
            Este projeto nasceu da necessidade de unir tecnologia web moderna com metodologias de ensino eficazes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;