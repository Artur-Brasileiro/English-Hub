import React from 'react';
import { PenTool, BrainCircuit, ShieldCheck } from 'lucide-react';

const TranslationEducation = () => (
  <section className="w-full mt-12 px-6 py-10 bg-white rounded-3xl border border-slate-200 shadow-sm text-slate-600 animate-fadeIn">
    {/* Cabeçalho com alinhamento ajustado (items-start) para manter o padrão */}
    <div className="flex items-start gap-4 mb-8 border-b border-slate-100 pb-6">
      <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600 shadow-sm mt-1">
        <PenTool className="w-8 h-8" />
      </div>
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
          Como parar de traduzir mentalmente?
        </h2>
        <p className="text-slate-500 font-medium mt-1">
          Destravando a Fala com "Engenharia Reversa"
        </p>
      </div>
    </div>
    
    <div className="prose prose-slate max-w-none grid md:grid-cols-2 gap-10 text-left">
      
      {/* Coluna 1: Sintaxe e Chunking 
          ALTERAÇÃO: Flexbox para alinhar altura
      */}
      <div className="space-y-6 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-emerald-500" /> 
            Automatizando a Estrutura (Sintaxe)
          </h3>
          <p className="text-sm leading-relaxed text-slate-600">
            O maior travamento na hora de falar vem da dúvida: <em>"Onde eu coloco o 'do'? O adjetivo vem antes?" "Nessa frase eu uso 'is' ou 'are'?" "Eu uso 'do' ou 'does'?"</em>. Este exercício repete estruturas gramaticais até que elas se tornem instintivas.
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
              {/* ALTERAÇÃO: Largura fixa (w-16) e texto centralizado */}
              <span className="font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded text-xs h-fit w-16 text-center shrink-0">Erro</span>
              <span className="text-slate-500 line-through decoration-rose-500">
                How (como) + old (velho) + are (é) + you (você)?
              </span>
            </li>
            <li className="flex gap-3">
              {/* ALTERAÇÃO: Largura fixa (w-16) e texto centralizado */}
              <span className="font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded text-xs h-fit w-16 text-center shrink-0">Acerto</span>
              <span className="font-medium text-slate-700">
                [How old are you] = [Qual sua idade]
              </span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Coluna 2: Laboratório e Dicas 
          ALTERAÇÃO: Flexbox para alinhar altura
      */}
      <div className="space-y-6 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-rose-500" /> 
            O Laboratório de Erros
          </h3>
          {/* TEXTO EXPANDIDO AQUI 👇 */}
          <p className="text-sm leading-relaxed text-slate-600">
            Na vida real, o medo de ser julgado bloqueia sua fala antes mesmo dela sair. Aqui, o erro é seu maior aliado e ferramenta de calibração. <br/><br/>
            Ao tentar montar a frase e receber a correção imediata, seu cérebro realiza um <strong>ajuste fino instantâneo</strong> (feedback loop), corrigindo a lógica gramatical muito mais rápido do que estudando regras abstratas em livros. Use este espaço seguro para errar quantas vezes for necessário até que a estrutura correta se torne natural.
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