import React from 'react';
import { BookOpen, Zap, Trophy, Target } from 'lucide-react';

const IrregularVerbsEducation = () => (
  <section className="w-full mt-12 px-6 py-10 bg-white rounded-3xl border border-slate-200 shadow-sm text-slate-600 animate-fadeIn">
    {/* Cabeçalho do Artigo */}
    <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
      <div className="bg-orange-100 p-3 rounded-xl text-orange-600 shadow-sm">
        <BookOpen className="w-8 h-8" />
      </div>
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
          Guia Definitivo dos Verbos Irregulares
        </h2>
        <p className="text-slate-500 font-medium mt-1">
          Por que eles são difíceis e como memorizar rápido.
        </p>
      </div>
    </div>
    
    <div className="prose prose-slate max-w-none grid md:grid-cols-2 gap-10 text-left">
      
      {/* Coluna 1: A Lógica */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" /> 
            Pare de decorar em ordem alfabética!
          </h3>
          <p className="text-sm leading-relaxed text-slate-600">
            O maior erro dos estudantes é tentar memorizar a lista de A a Z. O segredo para a fluência é agrupar os verbos por <strong>padrões sonoros</strong>. Nosso cérebro aprende por associação, não por listas frias.
          </p>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Os 3 Grupos de Ouro</h4>
          <ul className="text-sm space-y-3">
            <li className="flex gap-3">
              <span className="font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded text-xs h-fit">1</span>
              <span>
                <strong>Os Invariáveis:</strong> Verbos que nunca mudam. Ex: <em>Cut / Cut / Cut</em> ou <em>Cost / Cost / Cost</em>. Se você errar, ninguém percebe!
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded text-xs h-fit">2</span>
              <span>
                <strong>O som do "T":</strong> Verbos que terminam com som seco de T no passado. Ex: <em>Sleep / Slept / Slept</em>.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded text-xs h-fit">3</span>
              <span>
                <strong>O padrão "N":</strong> Comuns no Particípio. Ex: <em>Speak / Spoke / Spoken</em>.
              </span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Coluna 2: A Aplicação */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-rose-500" /> 
            Onde a maioria erra (Simple Past vs Participle)
          </h3>
          <p className="text-sm leading-relaxed text-slate-600 mb-4">
            Confundir a segunda e a terceira coluna é o erro gramatical mais comum. Entenda a diferença crucial para não travar na hora de falar:
          </p>
          
          <ul className="space-y-4">
            <li className="bg-white border-l-4 border-emerald-400 pl-4 py-1">
              <span className="block text-xs font-bold text-emerald-600 uppercase mb-1">Simple Past (2ª Coluna)</span>
              <p className="text-sm text-slate-700 italic">"I <strong>went</strong> to Brazil last year."</p>
              <p className="text-xs text-slate-400 mt-1">Usado para ações concluídas em um tempo específico.</p>
            </li>
            <li className="bg-white border-l-4 border-indigo-400 pl-4 py-1">
              <span className="block text-xs font-bold text-indigo-600 uppercase mb-1">Past Participle (3ª Coluna)</span>
              <p className="text-sm text-slate-700 italic">"I have <strong>gone</strong> to Brazil many times."</p>
              <p className="text-xs text-slate-400 mt-1">Essencial para tempos perfeitos (Have/Has) e Voz Passiva.</p>
            </li>
          </ul>
        </div>

        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
          <h3 className="text-amber-800 font-bold text-sm mb-2 flex items-center gap-2">
            <Trophy className="w-4 h-4" /> Dica de Estudo: Active Recall
          </h3>
          <p className="text-xs text-amber-700/80 leading-relaxed">
            Este jogo usa o método de "Active Recall". Ao digitar a resposta em vez de apenas ler, você força seu cérebro a recuperar a informação, criando conexões neurais 50% mais fortes do que apenas leitura passiva.
          </p>
        </div>
      </div>

    </div>
  </section>
);

export default IrregularVerbsEducation;