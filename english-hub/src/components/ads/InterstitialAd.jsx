import React, { useEffect } from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import AdUnit from './AdUnit';

const InterstitialAd = ({ onConfirm, slotId }) => {
  // Carrega o anúncio quando o modal monta
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) { console.error(e); }
  }, []);

  return (
    <div className="fixed inset-0 min-h-screen bg-slate-900/95 flex items-center justify-center p-4 animate-fade-in z-50">
      <div className="bg-white rounded-3xl shadow-2xl py-10 px-6 md:py-14 md:px-8 text-center max-w-md w-full relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500" />
        
        <div className="mb-6">
           <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
              <Heart className="w-8 h-8 fill-current" />
           </div>
           <h2 className="text-2xl font-bold text-slate-800">Apoie o EnglishUp!</h2>
           <p className="text-slate-500 text-sm mt-2 leading-relaxed">
             Manter o site online e gratuito tem custos. <br/>Obrigado por visualizar nossos anúncios.
           </p>
        </div>

        <div className="flex items-center justify-center mb-8">
           <AdUnit slotId={slotId} width="300px" height="250px" label="Publicidade" />
        </div>

        <button
          onClick={onConfirm}
          className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all transform hover:scale-[1.02] shadow-lg shadow-slate-300 flex items-center justify-center gap-2 group"
        >
          Continuar para o Jogo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-[10px] text-slate-400 mt-6">
          Ao clicar em continuar, você será redirecionado.
        </p>
      </div>
    </div>
  );
};

export default InterstitialAd;