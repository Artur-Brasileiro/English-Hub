import React from 'react';
import { RefreshCw, ArrowLeft, Trophy } from 'lucide-react';
import AdUnit from '../ads/AdUnit';

/**
 * Tela de Resultado Padronizada.
 * * @param {number} score - Pontuação do usuário.
 * @param {number} total - Total de questões.
 * @param {string} subtitle - Subtítulo (ex: "Nível 5" ou "Modo: Mix").
 * @param {function} onRetry - Função para jogar novamente.
 * @param {function} onBack - Função para voltar ao menu.
 * @param {string} title - (Opcional) Título principal. Padrão: "Treino Concluído!".
 * @param {string} colorClass - (Opcional) Classe de cor do texto do score (ex: "text-emerald-500").
 * @param {string} btnColorClass - (Opcional) Classe de cor do botão principal (ex: "bg-emerald-500 hover:bg-emerald-600").
 * @param {ReactNode} children - (Opcional) Conteúdo extra (ex: grid de acertos/erros do VocabularyGame).
 */
const ResultScreen = ({ 
  score, 
  total, 
  subtitle, 
  onRetry, 
  onBack,
  title = "Treino Concluído!",
  colorClass = "text-emerald-500", 
  btnColorClass = "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200",
  children
}) => {
  
  // Cálculo simples de porcentagem para mensagem de incentivo
  const percentage = Math.round((score / total) * 100) || 0;
  const isPerfect = percentage === 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 py-12 px-4 animate-fadeIn">
      
      {/* 1. Espaço reservado para Anúncio (Previne Layout Shift - CLS) */}
      <div className="mb-6 min-h-62.5 w-full flex justify-center">
        <AdUnit slotId="2492081057" width="300px" height="250px" label="Publicidade" />
      </div>

      {/* 2. Card Principal */}
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100 max-w-md w-full text-center relative overflow-hidden">
        
        {/* Efeito visual para pontuação perfeita */}
        {isPerfect && (
          <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-yellow-300 via-yellow-500 to-yellow-300 animate-shimmer"></div>
        )}

        <div className="mb-6">
           {isPerfect ? (
             <div className="inline-flex p-4 rounded-full bg-yellow-100 text-yellow-600 mb-4 shadow-sm animate-bounce-slow">
               <Trophy className="w-8 h-8" />
             </div>
           ) : null}
           <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-1">{title}</h2>
           {subtitle && <p className="text-slate-400 font-medium uppercase tracking-wider text-xs">{subtitle}</p>}
        </div>

        {/* Placar Grande */}
        <div className={`text-6xl font-black mb-6 ${colorClass}`}>
          {score}
          <span className="text-3xl text-slate-300 font-bold">/{total}</span>
        </div>

        {/* 3. Área para Conteúdo Extra (Ex: Stats do Vocabulary) */}
        {children && (
          <div className="mb-8 animate-fadeIn">
            {children}
          </div>
        )}

        {/* 4. Botões de Ação */}
        <div className="flex flex-col gap-3 w-full">
          <button 
            onClick={onRetry} 
            className={`w-full text-white px-6 py-4 rounded-xl font-bold transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-lg ${btnColorClass}`}
          >
            <RefreshCw className="w-5 h-5" /> Jogar Novamente
          </button>
          
          <button 
            onClick={onBack} 
            className="w-full bg-white border-2 border-slate-200 text-slate-600 px-6 py-4 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" /> Escolher Outro Nível
          </button>
        </div>

      </div>
    </div>
  );
};

export default ResultScreen;