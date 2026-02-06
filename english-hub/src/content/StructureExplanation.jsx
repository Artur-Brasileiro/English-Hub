import React from 'react';
import { 
  GitBranch, Shield, Clock, ArrowLeftRight, Flame, Target, 
  CheckCircle, Scale, Heart, Lock, Lightbulb, Sparkles, HelpCircle, BookOpen
} from 'lucide-react';

const StructureExplanation = ({ mode }) => {
  
  // Mapeamento de ícones e cores
  const meta = {
    conditional: { icon: GitBranch, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    concessive: { icon: Shield, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' },
    temporal: { icon: Clock, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200' },
    contrast: { icon: ArrowLeftRight, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200' },
    cause: { icon: Flame, color: 'text-lime-600', bg: 'bg-lime-50', border: 'border-lime-200' },
    purpose: { icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    result: { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    comparison: { icon: Scale, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
    desire: { icon: Heart, color: 'text-fuchsia-500', bg: 'bg-fuchsia-50', border: 'border-fuchsia-200' },
    obligation: { icon: Lock, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
    advice: { icon: Lightbulb, color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200' },
    suggestion: { icon: Sparkles, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    possibility: { icon: HelpCircle, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' },
    
    // Gramáticas (Fallbacks)
    present_perfect: { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    past_perfect: { icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    future_perfect: { icon: CheckCircle, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    questions: { icon: HelpCircle, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200' },
    all_tenses: { icon: Flame, color: 'text-slate-800', bg: 'bg-slate-100', border: 'border-slate-300' },
    mix: { icon: BookOpen, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' }
  };

  // Conteúdo Educativo
  const explanations = {
    conditional: {
      title: "Condicionais (If)",
      description: "A lógica de Causa e Consequência hipotética. Elas podem expressar verdades absolutas, possibilidades reais ou sonhos distantes.",
      structure: "If + [Condição] , [Resultado Provável]",
      examples: [
        { pt: "Se chover, eu fico em casa. (Real)", en: "If it rains, I stay home." },
        { pt: "Se eu tivesse tempo, eu iria. (Imaginário)", en: "If I had time, I would go." },
        { pt: "Se você estudar, vai passar. (Possibilidade)", en: "If you study, you will pass." }
      ]
    },
    concessive: {
      title: "Concessivas (Obstáculos)",
      description: "A arte de dizer que nada vai te impedir. Usamos para expressar que uma ação acontece (ou vai acontecer) APESAR de uma dificuldade ou condição contrária.",
      structure: "Even if / Although + [Obstáculo] , [Ação Principal]",
      tips: [
        "Use 'Even if' (Mesmo se) para hipóteses ou futuro incerto.",
        "Use 'Although' ou 'Even though' (Embora/Apesar de) para fatos reais que já existem.",
        "Dica de Ouro: Se tem 'se' no português (Mesmo se), use 'if' no inglês."
      ],
      examples: [
        { pt: "Mesmo se ela tentar, não vai dar certo. (Hipótese)", en: "Even if she tries, it won't work." },
        { pt: "Embora eu esteja cansado, vou terminar. (Fato Real)", en: "Although I am tired, I will finish." },
        { pt: "Apesar de estar com medo, ele foi. (Passado Real)", en: "Although he was afraid, he went." }
      ]
    },
    temporal: {
      title: "Temporais (Time Clauses)",
      description: "O controle da linha do tempo. Usamos para conectar eventos e dizer EXATAMENTE quando algo vai acontecer, aconteceu ou costuma acontecer.",
      structure: "[Conector de Tempo] + [Evento A] , [Evento B]",
      tips: [
        "A Regra de Ouro: Se a frase for no futuro, JAMAIS use 'will' logo após o conector (When, As soon as). Use o Presente! (Ex: When I go...)",
        "Truque do -ING: Verbos logo após 'Before' e 'After' geralmente ganham -ing. (Ex: Before sleeping).",
        "While = Duração (Enquanto). Until = Limite (Até que)."
      ],
      examples: [
        { pt: "Assim que ele chegar, a gente começa. (Não use 'will arrive')", en: "As soon as he arrives, we will start." },
        { pt: "Antes de sair, apague as luzes. (Truque do -ing)", en: "Before leaving, turn off the lights." },
        { pt: "Enquanto chove, fique em casa. (Duração)", en: "While it is raining, stay home." }
      ]
    },
    contrast: {
      title: "Contraste (But)",
      description: "O choque de realidade. Usamos para unir duas ideias que não 'batem' ou para explicar por que algo não aconteceu como planejado.",
      structure: "[Situação A] , but [Oposição/Problema]",
      examples: [
        { pt: "Eu queria ajudar, mas não tinha tempo. (Desculpa Clássica)", en: "I wanted to help, but I didn't have time." },
        { pt: "Ela é nova, mas é responsável. (Quebra de Preconceito)", en: "She is young, but she is responsible." },
        { pt: "O filme era bom, mas era longo demais. (Ponto Negativo)", en: "The movie was good, but it was too long." }
      ]
    },
    cause: {
      title: "Causa (Because/Since)",
      description: "A justificativa. Usamos para explicar o motivo de algo ter acontecido ou para dar um contexto antes de agir.",
      structure: "[Ação] + because + [Motivo]   OU   Since [Motivo], [Ação]",
      tips: [
        "Use 'Because' para respostas diretas no meio da frase (Por que? Porque...).",
        "Use 'Since' ou 'As' no começo da frase para dizer 'Já que' ou 'Como' (dando um contexto).",
        "Dica: Em inglês escrito, evite começar frases com 'Because'. Prefira 'Since'."
      ],
      examples: [
        { pt: "Eu não fui porque estava doente. (Direto)", en: "I didn't go because I was sick." },
        { pt: "Já que você terminou, pode descansar. (Contexto)", en: "Since you finished, you can rest." },
        { pt: "Como você ajudou, consegui terminar. (Formal)", en: "As you helped, I managed to finish." }
      ]
    },
    purpose: {
      title: "Finalidade (To / So that)",
      description: "O objetivo. Usamos para explicar 'para quê' estamos fazendo algo. É a meta por trás da ação.",
      structure: "[Ação] + to + [Verbo]   OU   [Ação] + so that + [Sujeito + Verbo]",
      tips: [
        "Erro Clássico: Nunca use 'For' antes de verbo! (Errado: For learn. Certo: To learn).",
        "Use 'To' quando a ação for direta (Estudo para aprender).",
        "Use 'So that' (Para que) quando houver uma consequência ou outro sujeito (Falo baixo para que ninguém ouça).",
        "Dica: 'In order to' é apenas uma forma chique de dizer 'To'."
      ],
      examples: [
        { pt: "Eu estudo para conseguir um emprego. (Foco na Ação)", en: "I study to get a job." },
        { pt: "Ela falou baixo para ninguém ouvir. (Consequência)", en: "She spoke quietly so that no one would hear." },
        { pt: "Anotei tudo para não esquecer. (Evitar algo)", en: "I wrote it down so that I wouldn't forget." }
      ]
    },
    result: {
      title: "Resultado (So)",
      description: "A consequência direta. Usamos para mostrar o que aconteceu (ou vai acontecer) como resultado de uma ação anterior.",
      structure: "[Ação/Causa] , so [Resultado]",
      tips: [
        "O 'So' funciona como uma seta (→) que aponta para o efeito: Fiz X, então aconteceu Y.",
        "É o oposto do 'Because'. Use 'So' quando quiser focar no final da história.",
        "Traduz perfeitamente como 'Então' ou 'Por isso'."
      ],
      examples: [
        { pt: "Estudei bastante, então passei. (Consequência)", en: "I studied a lot, so I passed." },
        { pt: "Perdi o ônibus, por isso cheguei atrasado. (Efeito)", en: "I missed the bus, so I arrived late." },
        { pt: "Estava barulho, então não consegui dormir. (Resultado)", en: "It was noisy, so I couldn't sleep." }
      ]
    },
    comparison: {
      title: "Comparação (As...as / Than)",
      description: "O duelo de qualidades. Usamos para dizer se duas coisas estão no mesmo nível ou se uma supera a outra.",
      structure: "as [Adj] as (Igual)   OU   more [Adj] / [Adj]-er than (Maior)",
      tips: [
        "Igualdade: 'Tão... quanto' é sempre 'As... as' (ex: As tall as).",
        "Palavra Curta? Cole o '-er' no final (Fast → Faster than).",
        "Palavra Longa? Use 'more' antes (Expensive → More expensive than).",
        "Cuidado com os rebeldes: 'Good' vira 'Better' e 'Bad' vira 'Worse'."
      ],
      examples: [
        { pt: "Ele é tão educado quanto o irmão. (Igualdade)", en: "He is as polite as his brother." },
        { pt: "Ela corre mais rápido do que eu. (Curto: Fast+er)", en: "She runs faster than me." },
        { pt: "O exercício é mais difícil do que parece. (Longo: More difficult)", en: "The exercise is more difficult than it looks." }
      ]
    },
    desire: {
      title: "Desejo (Wish / Hope)",
      description: "A diferença entre sonhar e torcer. Usamos estruturas diferentes para desejos distantes da realidade (Wish) e para coisas que realmente podem acontecer (Hope).",
      structure: "I wish + [Passado]   OU   I hope + [Presente]",
      tips: [
        "A Regra de Ouro: 'Eu queria' geralmente vira 'I wish'. 'Tomara que' vira 'I hope'.",
        "O Pulo do Gato (Wish): Se é um desejo para agora, o verbo vai para o PASSADO! (Ex: Queria ter → Wish I HAD).",
        "O Pulo do Gato (Hope): Se é uma torcida real, o verbo fica no PRESENTE. (Ex: Tomara que chova → Hope it RAINS).",
        "Dica Extra: Com 'I wish', é elegante usar 'Were' em vez de 'Was' (I wish I were rich)."
      ],
      examples: [
        { pt: "Eu queria ter mais tempo. (Imaginário → Passado)", en: "I wish I had more time." },
        { pt: "Tomara que você consiga. (Real → Presente)", en: "I hope you make it." },
        { pt: "Eu queria que fosse mais simples. (Wish + Were)", en: "I wish it were simpler." }
      ]
    },
    obligation: {
      title: "Obrigação (Have to / Need to)",
      description: "O senso de dever. Usamos para falar de responsabilidades, necessidades urgentes ou regras que precisamos seguir.",
      structure: "[Pessoa] + have to / need to + [Ação]",
      tips: [
        "A Regra do 'S': Se for Ele ou Ela (He/She/It), 'Have' vira 'HAS' e 'Need' vira 'NEEDS'.",
        "Have to = Tenho que (Obrigação externa, dever).",
        "Need to = Preciso (Necessidade pessoal ou urgência).",
        "Dica: Em perguntas, use 'Do' ou 'Does' (Ex: Do you have to go?)."
      ],
      examples: [
        { pt: "Eu tenho que sair agora. (Dever)", en: "I have to leave now." },
        { pt: "Ela precisa tomar remédio. (Necessidade + 3ª Pessoa)", en: "She needs to take medicine." },
        { pt: "Nós precisamos resolver isso. (Urgência)", en: "We need to solve this." }
      ]
    },
    advice: {
      title: "Conselho (Should / 'd Better)",
      description: "A arte de dar sugestões. Usamos para guiar alguém, seja de forma leve, como um aviso importante ou se colocando no lugar da pessoa.",
      structure: "You should / 'd better + [Ação]  OU  If I were you, I would...",
      tips: [
        "Should = Deveria (Conselho amigo, leve).",
        "Had better ('d better) = É melhor você... (Conselho forte, quase um aviso).",
        "If I were you = Se eu fosse você (Use sempre 'Were', nunca 'Was' aqui!).",
        "Dica: O 'Had better' raramente aparece inteiro na fala, vira quase sempre apenas um som de 'd' (You'd better)."
      ],
      examples: [
        { pt: "Você deveria descansar mais. (Sugestão Leve)", en: "You should rest more." },
        { pt: "É melhor você sair cedo. (Aviso Forte)", en: "You'd better leave earlier." },
        { pt: "Se eu fosse você, eu falaria com ela. (Empatia)", en: "If I were you, I would talk to her." }
      ]
    },
    suggestion: {
      title: "Sugestão (Let's / How about)",
      description: "A arte de propor ideias. Usamos para convidar alguém para fazer algo junto ou sugerir uma solução de forma natural.",
      structure: "Let's + [Verbo]   OU   How about + [Verbo com -ING]?",
      tips: [
        "O Segredo do 'How about': O verbo que vem depois dele quase sempre ganha -ING! (Ex: How about goING?).",
        "Let's = Vamos (Direto e inclusivo).",
        "Why don't we/you...? = Que tal a gente/você...? (Uma forma elegante de sugerir).",
        "Shall we...? = Vamos...? (Mais formal e charmoso, usado muito no inglês britânico)."
      ],
      examples: [
        { pt: "Vamos sair mais cedo? (Direto)", en: "Let's leave earlier?" },
        { pt: "Que tal pedir ajuda? (Regra do -ING)", en: "How about asking for help?" },
        { pt: "Que tal a gente tentar de novo? (Alternativa)", en: "Why don't we try again?" }
      ]
    },
    possibility: {
      title: "Possibilidade (Maybe / Might)",
      description: "O terreno da incerteza. Usamos para falar de coisas que têm chance de acontecer, mas não são garantidas.",
      structure: "Maybe + [Frase Completa]   OU   [Pessoa] + might + [Verbo]",
      tips: [
        "A Dança das Cadeiras: 'Maybe' (Talvez) geralmente começa a frase.",
        "O Poderoso 'Might': Use para traduzir 'Pode ser que'. Ele vem sempre DEPOIS da pessoa (I might, She might).",
        "Dica: Nunca use 'to' depois de 'might'. (Errado: I might to go. Certo: I might go)."
      ],
      examples: [
        { pt: "Talvez ele chegue tarde. (Começo)", en: "Maybe he arrives late." },
        { pt: "Pode ser que eu me atrase. (Meio da frase)", en: "I might be late." },
        { pt: "Pode ser que chova. (Probabilidade)", en: "It might rain." }
      ]
    },
    present_perfect: {
      title: "Present Perfect (Have + Particípio)",
      description: "O elo entre o passado e o presente. Usamos para ações que aconteceram num tempo indefinido, experiências de vida ou coisas que começaram lá atrás e continuam até agora.",
      structure: "Subject + have/has + [Particípio / Been + ing]",
      tips: [
        "A Regra de Ouro: Não diga QUANDO aconteceu! Se tiver data (ontem, em 2010), use o Passado Simples. Se o tempo não importa, use o Present Perfect.",
        "3ª Pessoa: He, She e It usam HAS (não Have).",
        "Palavras-chave: Just (acabou de), Already (já), Yet (ainda), Never (nunca).",
        "Continuidade: Para dizer 'Tenho feito' algo (ex: Tenho trabalhado), use 'Have been + verbo com ING'."
      ],
      examples: [
        { pt: "Eu perdi minha carteira. (Resultado agora, sem data)", en: "I have lost my wallet." },
        { pt: "Eu nunca comi sushi. (Experiência de vida)", en: "I have never eaten sushi." },
        { pt: "Eu tenho trabalhado muito. (Ação contínua)", en: "I have been working hard." }
      ]
    },
    past_perfect: {
      title: "Past Perfect (Had + Particípio)",
      description: "O Passado do Passado. Usamos para dizer que uma ação aconteceu ANTES de outra ação no passado. É a 'pré-história' da sua frase.",
      structure: "Subject + had + [Particípio / Been + ing]",
      tips: [
        "A Linha do Tempo: Imagine duas coisas no passado. A que aconteceu PRIMEIRO usa o Past Perfect (Had).",
        "Palavras-chave: Before (antes), After (depois), When (quando), Already (já).",
        "Had = Tinha/Havia. Serve para TODAS as pessoas (I had, She had, They had).",
        "Continuidade: 'Had been doing' enfatiza a duração da ação anterior (Ex: Eu estava esperando há horas = I had been waiting)."
      ],
      examples: [
        { pt: "Quando cheguei, ela já tinha saído. (Ação 1: Saiu. Ação 2: Cheguei)", en: "When I arrived, she had already left." },
        { pt: "Eu nunca tinha visto aquilo antes. (Experiência anterior)", en: "I had never seen that before." },
        { pt: "Eu estava esperando há uma hora quando ele chegou.", en: "I had been waiting for an hour when he arrived." }
      ]
    },
    future_perfect: {
      title: "Future Perfect (Will have + Particípio)",
      description: "O futuro concluído. Usamos para projetar um ponto no futuro e dizer que algo JÁ terá acontecido antes desse momento.",
      structure: "Subject + will have + [Particípio]",
      tips: [
        "A Palavra-Chave 'By': Quase sempre aparece com 'By' (Até) para marcar o prazo limite (Ex: By tomorrow = Até amanhã).",
        "Regra de Ouro: O auxiliar é SEMPRE 'Will have'. Nunca muda para 'Will has', mesmo com He/She.",
        "Tradução: Equivale ao nosso 'Terei feito', 'Terá terminado'."
      ],
      examples: [
        { pt: "Eu terei terminado até amanhã. (Prazo)", en: "I will have finished by tomorrow." },
        { pt: "Ela terá saído quando você chegar. (Conclusão prévia)", en: "She will have left by the time you arrive." },
        { pt: "Nós teremos vivido aqui por 10 anos. (Duração futura)", en: "We will have lived here for ten years." }
      ]
    },
    questions: {
      title: "Questions & Complex Structures",
      description: "Dominar a arte de fazer perguntas vai além do básico. Aqui praticamos estruturas com condicionais ('If'), modais ('Should', 'Must'), sugestões e conectivos de contraste. O foco é a inversão correta e o uso de auxiliares em contextos avançados.",
      structure: "(Wh-Word) + Auxiliar/Modal + Sujeito + Verbo... ?",
      tips: [
        "A Regra de Ouro: Em perguntas, o auxiliar (Do, Did, Will) ou Modal (Can, Should, Would) quase sempre vem ANTES do sujeito.",
        "Condicionais (If): Ao perguntar 'O que você faria se...', usamos 'What WOULD you do if...' (Would + Sujeito).",
        "Preposições no Final: Em inglês, é comum a preposição ir para o final da frase. Ex: 'Para que serve?' vira 'What is it FOR?'.",
        "Modais: Verbos como Can, Could, Should e Must não precisam de 'Do/Does'. Eles mesmos fazem a pergunta (Ex: Should I go?)."
      ],
      examples: [
        { pt: "O que você faria se ganhasse na loteria? (Condicional)", en: "What would you do if you won the lottery?" },
        { pt: "Para que você está economizando dinheiro? (Preposição no final)", en: "What are you saving money for?" },
        { pt: "Você sairia mesmo se estivesse chovendo? (Conectivo 'Even if')", en: "Would you go out even if it was raining?" }
      ]
    }
  };

  const content = explanations[mode];
  const style = meta[mode] || meta.mix;
  const Icon = style.icon;

  if (!content) return null; 

  return (
    <div className={`w-full max-w-2xl mx-auto mt-8 rounded-2xl border-2 ${style.border} ${style.bg} overflow-hidden shadow-sm`}>
      {/* Cabeçalho */}
      <div className="p-6 border-b border-white/50 flex items-start gap-4">
        <div className={`p-3 rounded-xl bg-white shadow-sm shrink-0 ${style.color}`}>
          <Icon size={28} strokeWidth={2.5} />
        </div>
        <div>
          <h3 className={`text-xl font-bold ${style.color}`}>{content.title}</h3>
          <p className="text-slate-600 mt-1 text-sm font-medium leading-relaxed">{content.description}</p>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-8">
        
        {/* Bloco 1: Estrutura */}
        <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">A Fórmula Mestra</span>
            <div className={`font-mono text-lg font-bold ${style.color} bg-white p-4 rounded-xl text-center border-2 border-dashed ${style.border} shadow-sm`}>
              {content.structure}
            </div>
        </div>

        {/* Bloco 2: O Segredo (Dicas) - SÓ RENDERIZA SE 'TIPS' EXISTIR */}
        {content.tips && (
            <div>
            <span className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">
                <Lightbulb size={16} className="text-amber-500" /> O Segredo
            </span>
            <ul className="space-y-3">
                {Array.isArray(content.tips) ? content.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-700 leading-relaxed bg-white/60 p-3 rounded-lg border border-white">
                    <CheckCircle className={`w-5 h-5 shrink-0 ${style.color} mt-0.5`} />
                    <span className="text-sm">{tip}</span>
                    </li>
                )) : (
                    <li className="text-slate-700 bg-white/60 p-3 rounded-lg text-sm">{content.tips}</li>
                )}
            </ul>
            </div>
        )}

        {/* Bloco 3: Exemplos Práticos */}
        <div className="bg-white/40 rounded-xl border border-white p-1">
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">Exemplos Práticos</span>
            <div className="space-y-4">
              {content.examples.map((ex, index) => (
                <div key={index} className="group hover:bg-slate-50 p-3 rounded-lg transition-colors border-b last:border-0 border-slate-100 pb-4 last:pb-0">
                  <p className="text-slate-500 text-sm mb-1 italic">"{ex.pt}"</p>
                  <p className={`font-bold text-base ${style.color} flex items-center gap-2`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50 shrink-0"></span>
                    {ex.en}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StructureExplanation;