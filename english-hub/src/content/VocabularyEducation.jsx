import React from 'react';
import { ShieldCheck, Info, BrainCircuit, BookOpen } from 'lucide-react';

const VocabularyEducation = () => (
  <section className="w-full mt-12 px-6 py-10 bg-white rounded-3xl border border-slate-200 shadow-sm text-slate-600 animate-fadeIn">
    {/* Cabeçalho */}
    <div className="flex items-start gap-4 mb-8 border-b border-slate-100 pb-6">
      <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600 shadow-sm mt-1">
        <BookOpen className="w-8 h-8" />
      </div>
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
          Como expandir seu Vocabulário em Inglês
        </h2>
        <p className="text-slate-500 font-medium mt-1">
          A ciência por trás da memorização e a importância da constância.
        </p>
      </div>
    </div>
    
    <div className="prose prose-slate max-w-none grid md:grid-cols-2 gap-10 text-left">
      {/* Coluna Esquerda */}
      <div className="space-y-6 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" /> 
            Active Recall: O fim do "decoreba"
          </h3>
          <p className="text-sm leading-relaxed text-slate-600">
            Ler listas de palavras cria apenas uma ilusão de competência (o famoso "branco" na hora de falar). Este jogo força seu cérebro a fazer o oposto: ele exige que você <strong>busque a informação</strong> ativamente na memória sem pistas visuais. É esse esforço cognitivo, conhecido como "dificuldade desejável", que fortalece as conexões neurais e move a palavra da memória de curto prazo para a de longo prazo de forma definitiva.
          </p>
        </div>

        {/* ALTERAÇÃO AQUI 👇: Trocado por "O Poder da Constância" */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">O Poder da Constância</h4>
          <p className="text-sm leading-relaxed text-slate-600 mb-3">
            A neurociência confirma: é muito mais eficiente praticar <strong>5 minutos todos os dias</strong> do que estudar por horas uma única vez na semana.
          </p>
          <ul className="text-sm space-y-3">
            <li className="flex gap-3">
              <span className="font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded text-xs h-fit">Hábito</span>
              <span>
                A frequência diária sinaliza para o seu cérebro que esse vocabulário é uma informação prioritária, acelerando a memorização natural sem causar cansaço mental.
              </span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Coluna Direita (Mantida) */}
      <div className="space-y-6 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-500" /> 
            Os Pilares da Memorização
          </h3>
          <p className="text-sm leading-relaxed text-slate-600 mb-4">
            Não adianta jogar uma vez e parar. Para garantir que o vocabulário "grude", siga este roteiro:
          </p>
          
          <ul className="space-y-4">
            <li className="bg-white border-l-4 border-indigo-400 pl-4 py-1">
              <span className="block text-xs font-bold text-indigo-600 uppercase mb-1">Associação Sonora</span>
              <p className="text-sm text-slate-700">Sempre repita a palavra em voz alta após acertar. O cérebro grava melhor o que o ouvido escuta.</p>
            </li>
            <li className="bg-white border-l-4 border-rose-400 pl-4 py-1">
              <span className="block text-xs font-bold text-rose-600 uppercase mb-1">Contextualização</span>
              <p className="text-sm text-slate-700">A palavra <em>"Run"</em> pode ser "correr" ou "administrar" (run a business). Tente criar frases mentais.</p>
            </li>
          </ul>
        </div>

        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
          <h3 className="text-indigo-900 font-bold text-sm mb-2 flex items-center gap-2">
            <BrainCircuit className="w-4 h-4" /> Dica Pro: Spaced Repetition
          </h3>
          <p className="text-xs text-indigo-800/80 leading-relaxed">
            O cérebro esquece 50% do que aprendeu em 24h. Volte neste jogo amanhã e tente superar seu recorde. Revisitando o conteúdo em intervalos, você combate a "Curva do Esquecimento".
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default VocabularyEducation;