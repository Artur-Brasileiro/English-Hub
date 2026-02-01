import React from 'react';
import { PenTool, BrainCircuit, ShieldCheck } from 'lucide-react';

const TranslationEducation = () => (
  <section className="w-full mt-12 px-6 py-10 bg-white rounded-3xl border border-slate-200 shadow-sm text-slate-600 animate-fadeIn">
    {/* Cabeçalho do Artigo */}
    <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
      <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600 shadow-sm">
        <PenTool className="w-8 h-8" />
      </div>
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
          Destravando a Fala com "Engenharia Reversa"
        </h2>
        <p className="text-slate-500 font-medium mt-1">
          Como parar de traduzir mentalmente treinando... tradução?
        </p>
      </div>
    </div>
    
    <div className="prose prose-slate max-w-none grid md:grid-cols-2 gap-10 text-left">
      
      {/* Coluna 1: Sintaxe e Chunking */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-emerald-500" /> 
            Automatizando a Estrutura (Sintaxe)
          </h3>
          <p className="text-sm leading-relaxed text-slate-600">
            O maior travamento na hora de falar vem da dúvida: <em>"Onde eu coloco o 'do'? O adjetivo vem antes?"</em>. Este exercício repete estruturas gramaticais até que elas se tornem instintivas.
          </p>
          <p className="text-sm leading-relaxed text-slate-600 mt-2">
            Ao resolver o desafio rápido, você treina seu cérebro a <strong>montar o esqueleto da frase</strong> sem pensar nas regras, simulando a pressão de uma conversa real.
          </p>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">O Segredo: Chunking</h4>
          <p className="text-sm leading-relaxed text-slate-600 mb-3">
            Poliglotas não traduzem palavra por palavra. Eles traduzem <strong>blocos de significado</strong> (Chunks).
          </p>
          <ul className="text-sm space-y-3">
            <li className="flex gap-3">
              <span className="font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded text-xs h-fit">Erro</span>
              <span className="text-slate-500 line-through decoration-rose-500">
                How (como) + old (velho) + are (é) + you (você)?
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded text-xs h-fit">Acerto</span>
              <span className="font-medium text-slate-700">
                [How old are you] = [Qual sua idade]
              </span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Coluna 2: Laboratório e Dicas */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-rose-500" /> 
            O Laboratório de Erros
          </h3>
          <p className="text-sm leading-relaxed text-slate-600">
            Na vida real, o medo de errar trava sua fala. Aqui, o erro é seu aliado. Tentar montar a frase e ver a correção imediata ajusta seu modelo mental muito mais rápido do que uma aula teórica. <strong>Use este espaço para errar sem vergonha.</strong>
          </p>
        </div>

        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
          <h3 className="text-emerald-900 font-bold text-sm mb-2 flex items-center gap-2">
            <PenTool className="w-4 h-4" /> Dica de Estudo
          </h3>
          <p className="text-xs text-emerald-800/80 leading-relaxed">
            Escreva as frases que você errou em um caderno. O ato físico de escrever à mão ativa áreas motoras do cérebro que reforçam a memorização da ortografia correta (spelling).
          </p>
        </div>
      </div>

    </div>
  </section>
);

export default TranslationEducation;