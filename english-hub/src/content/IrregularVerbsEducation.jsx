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
      
      {/* Coluna 1: O Hack dos 70% + Tríade */}
      <div className="space-y-6 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" /> 
            O "Hack" dos 70%
          </h3>
          {/* TEXTO EXPANDIDO AQUI 👇 */}
          <p className="text-sm leading-relaxed text-slate-600">
            Existe uma assimetria enorme no inglês: embora existam milhares de verbos regulares (aqueles terminados em <em>-ed</em>), os <strong>verbos irregulares dominam cerca de 70% das conversas reais</strong>. Isso ocorre porque as ações mais antigas e essenciais da humanidade (como <em>ser, ir, comer, ter</em>) resistiram à padronização gramatical ao longo dos séculos. 
            <br /><br />
            Dominar essa lista restrita não é apenas estudo, é <strong>inteligência estratégica</strong>: você resolve a maior parte dos problemas de comunicação cotidiana investindo uma fração do esforço necessário para decorar todo o resto.
          </p>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">O Poder da Tríade</h4>
          <p className="text-sm leading-relaxed text-slate-600 mb-3">
            Por que o jogo pede as 3 formas juntas?
          </p>
          <ul className="text-sm space-y-3">
            <li className="flex gap-3">
              <span className="font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded text-xs h-fit">Fluxo</span>
              <span>
                Ao memorizar a sequência rítmica (ex: <em>Drink-Drank-Drunk</em>), você cria um "trilho sonoro". Quando precisar do passado, seu cérebro puxa a sequência inteira automaticamente, evitando travamentos.
              </span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Coluna 2: A Aplicação (Mantida) */}
      <div className="space-y-6 flex flex-col justify-between h-full">
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

        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
          <h3 className="text-indigo-900 font-bold text-sm mb-2 flex items-center gap-2">
            <Trophy className="w-4 h-4" /> Macete: As Palavras-Gatilho
          </h3>
          <p className="text-xs text-indigo-800/80 leading-relaxed">
            Na dúvida de qual usar? Procure pistas na frase. Se tiver data definida ("Yesterday", "Last night", "In 1999"), use a <strong>2ª Coluna</strong>. Se tiver "Have/Has" ou falar de experiência de vida ("Ever", "Never"), vá direto para a <strong>3ª Coluna</strong>.
          </p>
        </div>
      </div>

    </div>
  </section>
);

export default IrregularVerbsEducation;