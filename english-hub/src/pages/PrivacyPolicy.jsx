import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-800">
      
      {/* --- SEO E METADADOS --- */}
      <Helmet>
        <title>Política de Privacidade - EnglishUp</title>
        <meta 
          name="description" 
          content="Política de Privacidade do EnglishUp. Saiba como coletamos dados, utilizamos cookies e gerenciamos a publicidade via Google AdSense." 
        />
      </Helmet>

      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-rose-600 font-bold mb-8 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Início
        </button>

        <h1 className="text-3xl font-black mb-6">Política de Privacidade</h1>
        
        <div className="prose prose-slate max-w-none text-sm text-slate-600">
          <p>Última atualização: Janeiro de 2026</p>

          <h3>1. Introdução</h3>
          <p>
            Bem-vindo ao EnglishUp. A sua privacidade é importante para nós. Esta política explica como coletamos, 
            usamos e protegemos suas informações ao visitar nosso site.
          </p>

          <h3>2. Coleta de Dados e Cookies (Google AdSense)</h3>
          <p>
            Utilizamos fornecedores terceiros, incluindo o Google, que usam cookies para veicular anúncios com base 
            nas visitas anteriores do usuário ao nosso site ou a outros sites na internet.
          </p>
          <ul>
            <li>
              O uso de cookies de publicidade pelo Google permite que ele e seus parceiros veiculem anúncios para 
              nossos usuários com base em suas visitas aos nossos sites e/ou outros sites na Internet.
            </li>
            <li>
              Os usuários podem optar por desativar a publicidade personalizada acessando as{" "}
              <a 
                href="https://www.google.com/settings/ads" 
                target="_blank" 
                rel="noopener noreferrer nofollow" 
                className="text-indigo-600 hover:underline"
              >
                Configurações de Anúncios
              </a>.
            </li>
          </ul>

          <h3>3. Arquivos de Log</h3>
          <p>
            Como muitos outros sites, o EnglishUp faz uso de arquivos de log. As informações dentro dos arquivos de log 
            incluem endereços IP, tipo de navegador, provedor de serviços de Internet (ISP), carimbo de data/hora, 
            páginas de referência/saída e número de cliques para analisar tendências e administrar o site.
          </p>

          <h3>4. Consentimento</h3>
          <p>Ao usar nosso site, você concorda com nossa Política de Privacidade e concorda com seus termos.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;