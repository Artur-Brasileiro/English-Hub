import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { 
  BrainCircuit, 
  Layers, 
  ArrowLeft, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  HelpCircle,
  Puzzle,
  Lightbulb,
  BookOpen,
  
} from 'lucide-react';
import { PHRASAL_VERBS_DATA } from '../data/gameData';

// --- IMPORTS ADSENSE ---
import AdUnit from './ads/AdUnit';
import { useH5Ads } from '../hooks/useH5Ads';

const ITEMS_PER_PHASE = 10;

// --- NOVO COMPONENTE: CONTEXTO EDUCACIONAL ---
const EducationalContext = () => (
  <section className="w-full mt-12 px-6 py-10 bg-white rounded-3xl border border-slate-200 shadow-sm text-slate-600 animate-fadeIn">
    {/* Cabeçalho do Artigo */}
    <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
      <div className="bg-rose-100 p-3 rounded-xl text-rose-600 shadow-sm">
        <Puzzle className="w-8 h-8" />
      </div>
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
          O Segredo dos Phrasal Verbs
        </h2>
        <p className="text-slate-500 font-medium mt-1">
          Como decifrar a lógica por trás das preposições e soar como um nativo.
        </p>
      </div>
    </div>
    
    <div className="prose prose-slate max-w-none grid md:grid-cols-2 gap-10 text-left">
      
      {/* Coluna 1: A Lógica das Partículas */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-amber-500" /> 
            Não traduza, visualize!
          </h3>
          <p className="text-sm leading-relaxed text-slate-600">
            O erro do iniciante é traduzir palavra por palavra. O segredo é entender a <strong>"alma" da preposição</strong>. 
          </p>
          <ul className="text-sm space-y-3 mt-3">
             <li className="flex gap-3">
              <span className="font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded text-xs h-fit">UP</span>
              <span>
                 Geralmente indica <strong>conclusão</strong> ou <strong>aumento</strong>. <br/>
                 Ex: <em>Eat up</em> (comer tudo), <em>Speak up</em> (falar mais alto).
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded text-xs h-fit">OFF</span>
              <span>
                 Indica <strong>separação</strong> ou <strong>saída</strong>. <br/>
                 Ex: <em>Take off</em> (decolar/sair do chão), <em>Cut off</em> (cortar fora).
              </span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Coluna 2: Formalidade e Uso */}
      <div className="space-y-6">
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
            Você pode dizer <em>"Turn <strong>ON</strong> the light"</em> ou <em>"Turn the light <strong>ON</strong>"</em>. Ambos estão certos. O jogo vai te ajudar a notar quais permitem isso.
          </p>
        </div>
      </div>

    </div>
  </section>
);

const PhrasalVerbsGame = ({ onBack }) => {
  const navigate = useNavigate();
  const { levelId } = useParams();

  // --- HOOK ADSENSE ---
  const { triggerAdBreak } = useH5Ads();
  const stopAllAudio = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    // Se houver reconhecimento de voz (isListening), pare-o também:
    if (typeof stopListening === 'function') stopListening(); 
  };

  const [gameState, setGameState] = useState('start'); 
  const [activePhase, setActivePhase] = useState(1);
  const [score, setScore] = useState(0); 
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [phaseQuestions, setPhaseQuestions] = useState([]);
  
  const [userAnswers, setUserAnswers] = useState([]);
  const [feedback, setFeedback] = useState(null); 
  const firstInputRef = useRef(null);
  const totalPhases = Math.ceil(PHRASAL_VERBS_DATA.length / ITEMS_PER_PHASE);

  useEffect(() => {
    if (levelId) {
      const phaseNum = parseInt(levelId, 10);
      if (!isNaN(phaseNum) && phaseNum > 0 && phaseNum <= totalPhases) {
          startGame(phaseNum);
      } else {
          alert("Fase inválida!");
          navigate('/phrasal');
      }
    } else {
      setGameState('start');
    }
  }, [levelId]);

  const startGame = (phaseNumber) => {
    setActivePhase(phaseNumber);
    const startIndex = (phaseNumber - 1) * ITEMS_PER_PHASE;
    const endIndex = startIndex + ITEMS_PER_PHASE;
    const originalQuestions = PHRASAL_VERBS_DATA.slice(startIndex, endIndex);
    
    if (originalQuestions.length === 0) {
      navigate('/phrasal');
      return;
    }

    const shuffledQuestions = [...originalQuestions].sort(() => 0.5 - Math.random());
    
    setPhaseQuestions(shuffledQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setGameState('playing');
    
    if (shuffledQuestions.length > 0) {
      initializeInputs(shuffledQuestions[0]);
    }
    window.scrollTo(0,0);
  };

  const goToLevel = (phaseNum) => {
    navigate(`/phrasal/level/${phaseNum}`);
  };

  const initializeInputs = (verbData) => {
    const count = verbData.definitions.length;
    setUserAnswers(new Array(count).fill(''));
    setFeedback(null);
  };

  useEffect(() => {
    if (gameState === 'playing' && !feedback && firstInputRef.current) {
      setTimeout(() => {
        // Só foca se a tela for maior que 768px
        if (window.innerWidth >= 768) {
          firstInputRef.current?.focus();
        }
      }, 50);
    }
  }, [currentQuestionIndex, gameState, feedback]);

  const handleInputChange = (index, value) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
  };

  const checkAnswer = (e) => {
    e.preventDefault();
    setFeedback('checked');
    const currentVerb = phaseQuestions[currentQuestionIndex];
    const correctMeanings = currentVerb.definitions.map(d => d.meaning.trim().toLowerCase());
    let currentTurnScore = 0;
    userAnswers.forEach(answer => {
      const normalizedAnswer = answer.trim().toLowerCase();
      if (correctMeanings.includes(normalizedAnswer)) currentTurnScore += 1;
    });
    setScore(prev => prev + currentTurnScore);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < phaseQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      initializeInputs(phaseQuestions[nextIndex]);
    } else {
      triggerAdBreak('next', 'phase_complete', () => {
        setGameState('result');
      }, stopAllAudio);
    }
  };

  const getInputStatus = (userValue, correctMeanings) => {
    if (!feedback) return 'neutral';
    const normalizedValue = userValue.trim().toLowerCase();
    if (!normalizedValue) return 'empty';
    if (correctMeanings.includes(normalizedValue)) return 'correct';
    return 'wrong';
  };

  // --- TELA MENU ---
  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 animate-fadeIn">
        <Helmet>
          <title>Exercícios de Phrasal Verbs com Significado | EnglishUp</title>
          <meta 
            name="description" 
            content="Aprenda o significado dos phrasal verbs mais usados em conversas. Jogos gratuitos para memorizar expressões como get up, look for e give up." 
          />
        </Helmet>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="bg-indigo-100 p-4 rounded-full inline-flex mb-4 text-indigo-600 shadow-sm">
              <BrainCircuit className="w-10 h-10 md:w-12 md:h-12" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3">
              Phrasal Verbs Master
            </h1>
            
            <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-6">
              Pare de traduzir ao pé da letra. Aprenda os <strong>phrasal verbs</strong> essenciais 
              para entender filmes, séries e conversas reais em inglês.
            </p>

            <button
              onClick={() => navigate("/")}
              className="bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-800 px-6 py-2 rounded-full font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar ao Hub Principal
            </button>
          </div>

          <hr className="border-slate-200 mb-8" />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {totalPhases > 0 ? (
              Array.from({ length: totalPhases }).map((_, idx) => {
                const phaseNum = idx + 1;
                return (
                  <button 
                    key={phaseNum} 
                    onClick={() => goToLevel(phaseNum)} 
                    className="group relative bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-500 hover:shadow-xl transition-all duration-300 text-left"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-slate-50 p-2.5 rounded-xl group-hover:bg-indigo-50 transition-colors">
                        <Layers className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded-md">
                        {ITEMS_PER_PHASE} Verbs
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">
                      Fase {phaseNum}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">
                      Verbos {((phaseNum - 1) * ITEMS_PER_PHASE) + 1} - {phaseNum * ITEMS_PER_PHASE}
                    </p>
                  </button>
                );
              })
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-slate-400 font-medium flex items-center justify-center gap-2">
                  <HelpCircle className="w-5 h-5" /> Adicione verbos ao arquivo de dados.
                </p>
              </div>
            )}
          </div>

          <EducationalContext />
        </div>
      </div>
    );
  }

  // --- TELA RESULTADO ---
  if (gameState === 'result') {
    const maxScore = phaseQuestions.reduce((acc, curr) => acc + curr.definitions.length, 0);
    const percentage = Math.round((score / maxScore) * 100);
    let message = "Bom começo!";
    if (percentage > 80) message = "Excellent!";
    else if (percentage > 50) message = "Well done!";

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 animate-fadeIn">
        <div className="mb-6">
          <AdUnit slotId="2492081057" width="300px" height="250px" label="Publicidade" />
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 max-w-md w-full text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">{message}</h2>
          <div className="text-5xl font-black text-indigo-600 mb-2">
            {score} <span className="text-2xl text-slate-300">/ {maxScore}</span>
          </div>
          <p className="text-slate-500 mb-8 font-medium">Você concluiu a Fase {activePhase}</p>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => triggerAdBreak('next', 'phase_retry', () => startGame(activePhase), stopAllAudio)} 
              className="bg-indigo-600 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
            >
              <RefreshCw className="w-5 h-5" /> Tentar Novamente
            </button>
            <button 
              onClick={() => triggerAdBreak('next', 'menu_return', () => navigate('/phrasal'), stopAllAudio)} 
              className="bg-white border-2 border-slate-200 text-slate-600 px-6 py-3.5 rounded-xl font-bold hover:bg-slate-100 transition-colors"
            >
              Escolher Outra Fase
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- TELA JOGO ---
  const currentVerb = phaseQuestions[currentQuestionIndex];
  // Segurança para evitar crash se o array estiver vazio por algum motivo
  if (!currentVerb) return <div>Carregando...</div>;
  
  const correctMeaningsLower = currentVerb.definitions.map(d => d.meaning.toLowerCase().trim());

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col items-center">
      
      <Helmet>
        <title>Exercícios de Phrasal Verbs com Significado | EnglishUp</title>
        <meta 
          name="description" 
          content="Aprenda o significado dos phrasal verbs mais usados em conversas. Jogos gratuitos para memorizar expressões como get up, look for e give up." 
        />
      </Helmet>

      {/* 1. HEADER AD */}
      <div className="w-full bg-white border-b border-slate-200 py-2 flex flex-col items-center justify-center relative z-20 shadow-sm min-h-25 md:min-h-27.5">
         <div className="block md:hidden">
            <AdUnit key={`mobile-top-phrasal`} slotId="8330331714" width="320px" height="100px" label="Patrocinado"/>
         </div>
         <div className="hidden md:block">
            <AdUnit slotId="5673552248" width="728px" height="90px" label="Patrocinado"/>
         </div>
      </div>

      {/* 2. LAYOUT WRAPPER (3 COLUNAS) */}
      <div className="w-full max-w-360 mx-auto flex flex-col xl:flex-row justify-center items-start gap-11 p-4 mt-4">
          
          {/* SIDEBAR ESQUERDA */}
          <div className="hidden xl:flex w-80 shrink-0 flex-col gap-4 sticky top-36">
             <AdUnit key={`desktop-left-phrasal`} slotId="5118244396" width="300px" height="600px" label="Patrocinado"/>
          </div>

          {/* AREA CENTRAL */}
          <div className="w-full max-w-xl flex flex-col">
             
             {/* Header Interno */}
             <div className="flex justify-between items-center mb-6 px-2">
                <button 
                  onClick={() => navigate('/phrasal')} 
                  className="text-slate-400 hover:text-slate-600 flex items-center gap-1"
                >
                  <ArrowLeft className="w-5 h-5" /> <span className="text-sm font-bold uppercase tracking-wide">Menu</span>
                </button>
                <div className="text-right">
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mb-1 inline-block">
                    Fase {activePhase}
                  </span>
                  <span className="block text-slate-400 text-xs font-bold tracking-widest">
                    {currentQuestionIndex + 1} / {phaseQuestions.length}
                  </span>
                </div>
             </div>

             {/* Card do Jogo */}
             <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col relative animate-fade-in-up mb-8">
                <div className="bg-indigo-600 p-10 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                  <span className="relative z-10 text-indigo-200 uppercase tracking-widest text-xs font-bold mb-3 block">
                    Traduza o Phrasal Verb
                  </span>
                  <h2 className="relative z-10 text-4xl md:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                    {currentVerb.verb}
                  </h2>
                </div>

                <div className="p-8">
                  <form onSubmit={checkAnswer}>
                    <p className="text-sm text-slate-500 font-bold mb-4 flex items-center gap-2">
                      <BrainCircuit className="w-4 h-4 text-indigo-500" />
                      Escreva {currentVerb.definitions.length} {currentVerb.definitions.length === 1 ? 'significado' : 'significados'}:
                    </p>

                    <div className="space-y-4 mb-8">
                      {userAnswers.map((answer, index) => {
                        const status = getInputStatus(answer, correctMeaningsLower);
                        
                        // --- ESTILO DE BORDA 2PX (Igual aos outros jogos) ---
                        let borderClass = "border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50";
                        let icon = null;

                        if (feedback) {
                          if (status === 'correct') {
                            borderClass = "border-2 border-green-500 bg-green-50 text-green-700";
                            icon = <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-green-500" />;
                          } else if (status === 'wrong') {
                            borderClass = "border-2 border-red-300 bg-red-50 text-red-700 decoration-wavy";
                            icon = <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-red-400" />;
                          } else {
                            borderClass = "border-2 border-slate-200 bg-slate-50";
                          }
                        }

                        return (
                          <div key={index} className="relative group animate-fadeIn">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-sm">
                              {index + 1}.
                            </span>
                            <input
                              ref={index === 0 ? firstInputRef : null}
                              type="text"
                              value={answer}
                              onChange={(e) => handleInputChange(index, e.target.value)}
                              disabled={!!feedback}
                              className={`w-full pl-10 pr-12 py-4 rounded-xl outline-none font-semibold text-lg transition-all ${borderClass}`}
                              placeholder={`Significado ${index + 1}`}
                              autoComplete="off"
                            />
                            {icon}
                          </div>
                        );
                      })}
                    </div>

                    {!feedback ? (
                      <button 
                        type="submit" 
                        disabled={userAnswers.every(a => a.trim() === '')}
                        className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform active:scale-95"
                      >
                        Verificar Respostas
                      </button>
                    ) : (
                      <div className="animate-fadeIn">
                        <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 mb-6">
                          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">
                            Respostas Esperadas:
                          </h4>
                          <div className="space-y-3">
                            {currentVerb.definitions.map((def, i) => (
                              <div key={i} className="flex flex-col bg-white p-3 rounded-xl border border-indigo-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                  <span className="font-bold text-indigo-700">{def.meaning}</span>
                                </div>
                                <p className="text-xs text-slate-500 italic pl-3.5">
                                  "{def.example}"
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <button 
                          onClick={nextQuestion} 
                          type="button"
                          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                          {currentQuestionIndex < phaseQuestions.length - 1 ? 'Próximo Verbo' : 'Ver Resultado'} <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </form>
                </div>
             </div>

             <EducationalContext />

             {/* Quadrado Ad (Desktop) */}
             <div className="mt-40 pointer-events-auto">
                  <AdUnit slotId="4391086704" width="336px" height="280px" label="Publicidade"/>
               </div>
          </div>

          {/* SIDEBAR DIREITA */}
          <div className="hidden xl:flex w-80 shrink-0 flex-col gap-4 sticky top-36">
             <AdUnit key={`desktop-right-phrasal`} slotId="3805162724" width="300px" height="250px" label="Patrocinado"/>
             
             {/* --- DICA PRO --- */}
             <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100 shadow-sm">
                <h3 className="font-bold text-indigo-800 mb-2 flex items-center gap-2">
                   <Lightbulb className="w-4 h-4" /> Dica Pro
                </h3>
                <p className="text-sm text-indigo-700/80 leading-relaxed">
                   Alguns phrasal verbs são separáveis! Você pode dizer <em>"Turn off the lights"</em> ou <em>"Turn the lights off"</em>. O sentido é o mesmo.
                </p>
             </div>
          </div>
      </div>

      {/* 3. MOBILE BOTTOM AD */}
      <div className="xl:hidden w-full flex flex-col items-center pb-8 bg-slate-50 mt-4">
          <div className="h-24 w-full flex items-center justify-center pointer-events-none">
             <span className="text-[10px] text-slate-300 uppercase tracking-widest">--- Publicidade abaixo ---</span>
          </div>
          <AdUnit key={`mobile-bottom-phrasal`} slotId="3477859667" width="300px" height="250px" label="Patrocinado"/>
      </div>

    </div>
  );
};

export default PhrasalVerbsGame;