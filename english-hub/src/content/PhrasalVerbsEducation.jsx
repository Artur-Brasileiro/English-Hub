import React from 'react';
import { Puzzle, BrainCircuit, BookOpen, Layers } from 'lucide-react';

// 1. Recebe a prop
const PhrasalVerbsEducation = ({ forceSingleColumn = false }) => (
  <section className="w-full mt-12 px-6 py-10 bg-white rounded-3xl border border-slate-200 shadow-sm text-slate-600 animate-fadeIn">
    {/* Cabeçalho */}
    <div className="flex items-start gap-4 mb-8 border-b border-slate-100 pb-6">
      <div className="bg-rose-100 p-3 rounded-xl text-rose-600 shadow-sm mt-1">
        <Puzzle className="w-8 h-8" />
      </div>
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
          O Segredo dos Phrasal Verbs
        </h2>
        <p className="text-slate-500 font-medium mt-1 ">
          Como decifrar a lógica por trás das preposições e soar como um nativo.
        </p>
      </div>
    </div>
    
    {/* 2. Aplica a lógica condicional */}
    <div className={`prose prose-slate max-w-none grid gap-10 text-left ${forceSingleColumn ? '' : 'md:grid-cols-2'}`}>
      
      {/* Coluna 1: A Lógica das Partículas */}
      <div className="space-y-6 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-amber-500" /> 
            Não traduza, visualize!
          </h3>
          <p className="text-sm leading-relaxed text-slate-600">
            O erro clássico é tentar traduzir "Give Up" procurando o sentido de "dar". Esqueça o verbo principal! O segredo dos Phrasal Verbs está na <strong>lógica da partícula</strong> (a preposição). <br/><br/>
            Ao visualizar o movimento ou a metáfora que a preposição carrega (como "Up" indicando limite/término ou "Out" indicando expansão), você para de decorar listas aleatórias e começa a deduzir os significados intuitivamente, como um nativo faria.
          </p>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Exemplos de Lógica</h4>
          <ul className="text-sm space-y-3">
             <li className="flex gap-3">
              <span className="font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded text-xs h-fit w-12 text-center shrink-0">UP</span>
              <span>
                 Geralmente indica <strong>conclusão</strong> ou <strong>aumento</strong>. <br/>
                 Ex: <em>Eat up</em> (comer tudo), <em>Speak up</em> (falar mais alto).
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded text-xs h-fit w-12 text-center shrink-0">OFF</span>
              <span>
                 Indica <strong>separação</strong> ou <strong>saída</strong>. <br/>
                 Ex: <em>Take off</em> (decolar/sair do chão), <em>Cut off</em> (cortar fora).
              </span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Coluna 2: Formalidade e Uso */}
      <div className="space-y-6 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" /> 
            Nativo vs. Livro Didático
          </h3>
          <p className="text-sm leading-relaxed text-slate-600 mb-4">
            Em ambientes formais, usamos verbos únicos (latinos). Na rua, usamos Phrasal Verbs. Dominar essa troca é o que define a fluência.
          </p>
          
          <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
             <table className="w-full text-sm text-left">
               <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-xs">
                 <tr>
                   <th className="px-4 py-2">Phrasal Verb (Fala)</th>
                   <th className="px-4 py-2">Formal (Escrita)</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-200">
                 <tr>
                   <td className="px-4 py-2 text-rose-600 font-bold">Give up</td>
                   <td className="px-4 py-2 text-slate-600">Surrender / Quit</td>
                 </tr>
                 <tr>
                   <td className="px-4 py-2 text-rose-600 font-bold">Find out</td>
                   <td className="px-4 py-2 text-slate-600">Discover</td>
                 </tr>
                 <tr>
                    <td className="px-4 py-2 text-rose-600 font-bold">Put off</td>
                    <td className="px-4 py-2 text-slate-600">Postpone</td>
                 </tr>
               </tbody>
             </table>
          </div>
        </div>

        <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
          <h3 className="text-rose-900 font-bold text-sm mb-2 flex items-center gap-2">
            <Layers className="w-4 h-4" /> Dica de Ouro: Separáveis
          </h3>
          <p className="text-xs text-rose-800/80 leading-relaxed">
            Alguns phrasal verbs aceitam o objeto no meio! <br/>
            Você pode dizer <em>"Turn <strong>ON</strong> the light"</em> ou <em>"Turn the light <strong>ON</strong>"</em>. Ambos estão certos. O jogo vai te dar exemplos e te mostrar quais permitem isso.
          </p>
        </div>
      </div>

    </div>
  </section>
);
 
export default PhrasalVerbsEducation;