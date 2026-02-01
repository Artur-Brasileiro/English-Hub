import React from 'react';
import { BookOpen, Lightbulb, ArrowRight, Layers, Star, Quote } from 'lucide-react';

const EXPLANATIONS = {
  // --- TEMPOS VERBAIS ---
  present_perfect: {
    title: "Present Perfect",
    description: "O elo entre o passado e o agora. Usamos para experiências de vida ou ações que impactam o presente. O foco está no FATO, não na DATA.",
    structure: "Sujeito + HAVER (Auxiliar) + Ação (Particípio)",
    tips: "O segredo não é traduzir como 'tem feito', mas entender o sentido. 'I have lost' não é 'eu tenho perdido', é 'eu perdi' (e estou sem agora).",
    examples: [
      { pt: "Eu perdi minha carteira (e ainda não achei).", en: "I have lost my wallet." },
      { pt: "Ela nunca comeu sushi na vida.", en: "She has never eaten sushi." }
    ]
  },
  past_perfect: {
    title: "Past Perfect",
    description: "A linha do tempo do passado. Usamos para deixar claro que uma ação aconteceu ANTES de outra ação que já passou.",
    structure: "Sujeito + TINHA (Had) + Ação (Particípio)",
    tips: "É essencial para contar histórias. Ele organiza a sequência dos fatos: primeiro o Past Perfect, depois o resto.",
    examples: [
      { pt: "Quando cheguei, ela já tinha saído.", en: "When I arrived, she had already left." },
      { pt: "Eu notei que tinha esquecido a chave.", en: "I noticed I had forgotten the key." }
    ]
  },
  future_perfect: {
    title: "Future Perfect",
    description: "Uma projeção para o futuro. Você se imagina lá na frente, olhando para trás, vendo uma ação já concluída.",
    structure: "Sujeito + TERÁ (Will Have) + Ação (Particípio)",
    tips: "Sempre procure por marcos de tempo como 'by tomorrow' (até amanhã) ou 'by 2030'. Eles são o gatilho desse tempo.",
    examples: [
      { pt: "Até amanhã, eu terei terminado tudo.", en: "By tomorrow, I will have finished everything." },
      { pt: "Em dezembro, nós teremos casado há 10 anos.", en: "In December, we will have been married for 10 years." }
    ]
  },

  // --- ESTRUTURAS LÓGICAS ---
  conditional: {
    title: "Condicionais (If)",
    description: "A lógica de Causa e Consequência hipotética. Elas podem expressar verdades absolutas, possibilidades reais ou sonhos distantes.",
    structure: "If + [Condição] , [Resultado Provável]",
    tips: "A estrutura é flexível! Se a condição for real (Presente), o resultado é real (Futuro). Se a condição for imaginária (Passado), o resultado é hipotético (Would).",
    examples: [
      { pt: "Se chover, eu fico em casa. (Real)", en: "If it rains, I stay home." },
      { pt: "Se eu tivesse tempo, eu iria. (Imaginário)", en: "If I had time, I would go." },
      { pt: "Se você estudar, vai passar. (Possibilidade)", en: "If you study, you will pass." }
    ]
  },
  purpose: {
    title: "Finalidade (O Motivo)",
    description: "Como explicamos o 'Para quê' fazemos algo. Em inglês, a estrutura muda dependendo se usamos um verbo ou uma frase completa.",
    structure: "Ação + TO / IN ORDER TO + Objetivo",
    tips: "O erro número 1 de brasileiros é usar 'For' + Verbo (ex: For learn). Esqueça isso! Para indicar propósito com verbo, use 'To learn'.",
    examples: [
      { pt: "Eu estudo para aprender.", en: "I study to learn." },
      { pt: "Eu saí cedo para não me atrasar.", en: "I left early in order not to be late." },
      { pt: "Fiz isso para que você entendesse.", en: "I did it so that you could understand." }
    ]
  },
  contrast: {
    title: "Contraste e Oposição",
    description: "Conectar duas ideias que parecem não combinar ou que se opõem diretamente.",
    structure: "[Ideia A] + MAS/PORÉM + [Ideia B]",
    tips: "'But' é o coringa. 'However' é elegante e formal. Lembre-se: o contraste quebra a expectativa criada na primeira parte da frase.",
    examples: [
      { pt: "É caro, mas vale a pena.", en: "It is expensive, but it is worth it." },
      { pt: "Eu queria ir; entretanto, estou cansado.", en: "I wanted to go; however, I am tired." }
    ]
  },
  concessive: {
    title: "Concessão (Apesar de)",
    description: "Indica insistência ou resistência. Algo acontece MESMO existindo um problema ou obstáculo.",
    structure: "EMBORA (Although) + [Situação Ruim], [Ação]",
    tips: "Cuidado com o encaixe: 'Although' pede uma frase completa (sujeito + verbo). 'Despite' pede apenas um conceito (substantivo).",
    examples: [
      { pt: "Embora estivesse chovendo, nós fomos.", en: "Although it was raining, we went." },
      { pt: "Apesar da chuva, nós fomos.", en: "Despite the rain, we went." }
    ]
  },
  temporal: {
    title: "Temporais (Quando/Enquanto)",
    description: "A cola que une dois eventos no tempo, mostrando se aconteceram juntos ou em sequência.",
    structure: "[Ação 1] + QUANDO/ENQUANTO + [Ação 2]",
    tips: "Em inglês, quando falamos do futuro com 'When', não usamos 'Will' logo depois dele. Dizemos 'When I arrive' (Quando eu chegar), e não 'When I will arrive'.",
    examples: [
      { pt: "Me ligue quando você chegar.", en: "Call me when you arrive." },
      { pt: "Enquanto eu cozinhava, ele lia.", en: "While I was cooking, he was reading." }
    ]
  },
  cause: {
    title: "Causa (Porquê)",
    description: "A justificativa. Conecta o resultado à sua origem.",
    structure: "[Resultado] + PORQUE/JÁ QUE + [Motivo]",
    tips: "Além do 'Because', use 'Since' ou 'As' para soar mais sofisticado quando quiser dizer 'Já que' ou 'Como'.",
    examples: [
      { pt: "Não fui porque estava doente.", en: "I didn't go because I was sick." },
      { pt: "Já que você está aqui, ajude.", en: "Since you are here, help." }
    ]
  },
  result: {
    title: "Resultado (Consequência)",
    description: "O caminho inverso da causa. Apresentamos o fato primeiro e a consequência depois.",
    structure: "[Fato] + ENTÃO/POR ISSO + [Consequência]",
    tips: "'So' é o rei da conversação. 'That's why' (é por isso que) dá muita ênfase à explicação.",
    examples: [
      { pt: "Estava frio, então fechei a janela.", en: "It was cold, so I closed the window." },
      { pt: "Eu esqueci, por isso voltei.", en: "I forgot, that's why I came back." }
    ]
  },
  comparison: {
    title: "Comparação",
    description: "Colocar duas coisas na balança para medir qualidades.",
    structure: "Elemento A + [MAIS/MENOS/IGUAL] + Elemento B",
    tips: "A regra de ouro: Palavra pequena ganha final '-er' (faster). Palavra grande ganha 'more' antes (more expensive).",
    examples: [
      { pt: "Este carro é mais rápido que aquele.", en: "This car is faster than that one." },
      { pt: "Ela é tão alta quanto eu.", en: "She is as tall as me." },
      { pt: "Isso é mais interessante.", en: "This is more interesting." }
    ]
  },
  desire: {
    title: "Desejo e Esperança",
    description: "Expressar o que queremos que aconteça. Em inglês, separamos o 'desejo impossível' da 'esperança real'.",
    structure: "I WISH (Desejo Irreal) / I HOPE (Esperança Real)",
    tips: "Se é impossível agora, use 'I wish' + passado (queria que fosse). Se é possível no futuro, use 'I hope' + presente.",
    examples: [
      { pt: "Queria ser mais alto (mas não sou).", en: "I wish I were taller." },
      { pt: "Espero que você passe na prova.", en: "I hope you pass the test." }
    ]
  },
  obligation: {
    title: "Obrigação e Necessidade",
    description: "O peso do dever. Varia desde uma ordem forte até uma necessidade pessoal.",
    structure: "Sujeito + TEM QUE / PRECISA + Ação",
    tips: "'Must' soa muito forte ou formal (regra). 'Have to' é o que usamos todo dia para responsabilidades externas.",
    examples: [
      { pt: "Você tem que ir agora.", en: "You have to go now." },
      { pt: "Eu preciso dormir.", en: "I need to sleep." }
    ]
  },
  advice: {
    title: "Conselho e Recomendação",
    description: "Sugerir o melhor caminho sem impor uma ordem.",
    structure: "Sujeito + DEVERIA (Should) + Ação",
    tips: "Para soar como um aviso amigável mas firme, use 'You'd better' (É melhor você...).",
    examples: [
      { pt: "Você deveria falar com ela.", en: "You should talk to her." },
      { pt: "É melhor você não se atrasar.", en: "You had better not be late." }
    ]
  },
  suggestion: {
    title: "Sugestão e Convite",
    description: "Maneiras de convidar alguém para fazer algo junto ou dar uma ideia.",
    structure: "QUE TAL... / VAMOS...",
    tips: "Memorize o padrão: Depois de 'Let's', use o verbo normal. Depois de 'How about', use o verbo com -ING.",
    examples: [
      { pt: "Vamos comer pizza?", en: "Let's eat pizza." },
      { pt: "Que tal irmos ao cinema?", en: "How about going to the cinema?" }
    ]
  },
  possibility: {
    title: "Possibilidade",
    description: "O terreno da incerteza. Quando não sabemos se algo vai acontecer ou não.",
    structure: "Sujeito + PODE SER QUE (May/Might) + Ação",
    tips: "Não tente traduzir 'Pode ser que' ao pé da letra. Use 'It might' ou 'He may'. É muito mais natural.",
    examples: [
      { pt: "Pode ser que chova.", en: "It might rain." },
      { pt: "Talvez ela esteja em casa.", en: "She may be at home." }
    ]
  }
};

const StructureExplanation = ({ mode }) => {
  const content = EXPLANATIONS[mode];

  if (!content) return null;

  return (
    <section className="w-full mt-8 mb-12 animate-fadeIn">
      <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200">
        
        {/* 1. CABEÇALHO (Full Width) */}
        <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
               <BookOpen className="w-48 h-48" />
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Guia de Estrutura
                    </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-4">
                    {content.title}
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed max-w-3xl">
                    {content.description}
                </p>
            </div>
        </div>

        {/* 2. CORPO (Coluna Única Vertical) */}
        <div className="p-6 md:p-8 flex flex-col gap-8 bg-slate-50">
            
            {/* Bloco A: Lógica/Estrutura */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-emerald-600 font-bold text-sm uppercase tracking-wide">
                    <Layers className="w-5 h-5" /> Como funciona?
                </div>
                <div className="bg-slate-100 p-6 rounded-xl border border-slate-200 text-center">
                    <p className="text-slate-800 font-medium text-lg md:text-xl">
                        {content.structure}
                    </p>
                </div>
            </div>

            {/* Bloco B: Pulo do Gato (Se existir) */}
            {content.tips && (
                <div className="bg-amber-50 p-6 md:p-8 rounded-2xl border border-amber-100 shadow-sm relative">
                    <div className="flex items-start gap-4">
                        <div className="bg-amber-500 text-white p-2 rounded-lg shadow-md shrink-0 mt-1">
                            <Star className="w-6 h-6 fill-current" />
                        </div>
                        <div>
                            <h4 className="text-amber-900 font-bold text-lg mb-2">O Pulo do Gato</h4>
                            <p className="text-amber-800/90 leading-relaxed text-base">
                                {content.tips}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Bloco C: Exemplos */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                 <div className="flex items-center gap-2 mb-6 text-indigo-600 font-bold text-sm uppercase tracking-wide">
                    <Quote className="w-5 h-5" /> Na Prática
                </div>
                
                <div className="space-y-6">
                    {content.examples.map((ex, idx) => (
                        <div key={idx} className="group">
                            <p className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-700 transition-colors">
                                "{ex.en}"
                            </p>
                            <div className="flex items-center gap-2 text-slate-500 text-base font-medium">
                                <ArrowRight className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span>{ex.pt}</span>
                            </div>
                            {idx < content.examples.length - 1 && (
                                <div className="w-full border-t border-slate-100 mt-6"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </section>
  );
};

export default StructureExplanation;