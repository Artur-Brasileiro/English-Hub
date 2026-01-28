import React, { useEffect, useRef, useState } from 'react';

const AdUnit = ({ 
  slotId, 
  width, 
  height, 
  client = "ca-pub-5263755641231811", 
  label = "Publicidade", 
  format = "auto",
  responsive = "true",
  className = "" 
}) => {
  const adRef = useRef(null);
  const adsPushed = useRef(false); 
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  // Estado para controlar se o componente está visível na tela
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Implementação de Lazy Loading com IntersectionObserver [cite: 197, 201]
    // Isso impede que anúncios ocultos (ex: versão desktop rodando no mobile) disparem erros
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Só ativa se estiver visível e tiver tamanho real (>0px)
        if (entry.isIntersecting && entry.boundingClientRect.width > 0) {
          setIsVisible(true);
          observer.disconnect(); // Para de observar assim que ficar visível
        }
      },
      { rootMargin: '100px' } // Carrega um pouco antes de aparecer na tela
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Só executa o push se: 
    // 1. Estiver visível (passou pelo observer)
    // 2. Ainda não tiver sido carregado (adsPushed.current)
    if (!isVisible || typeof window === 'undefined' || !adRef.current || adsPushed.current) {
      return;
    }

    // Proteção extra: Verifica novamente se o slot está vazio
    if (adRef.current.innerHTML.replace(/\s/g, '').length > 0) {
       return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      adsPushed.current = true;
      setIsAdLoaded(true);
    } catch (e) {
      console.error("AdSense Push Error:", e);
    }

  }, [isVisible, slotId]); // Dependência em isVisible ativa o efeito no momento certo

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: height || '280px',
    width: width || '100%',
    minWidth: '250px',
    margin: '20px 0',
    overflow: 'hidden'
  };

  return (
    <div style={containerStyle} className={`ad-unit-wrapper ${className}`} ref={adRef}>
      <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 w-full text-center font-semibold">
        {label}
      </div>

      <div className="relative bg-slate-50 border border-slate-100 flex items-center justify-center"
           style={{ width: width || 'auto', height: height || 'auto', minHeight: height || '250px' }}>
        
        {/* Só renderiza o <ins> se estiver visível. Isso resolve o erro de width=0 [cite: 218] */}
        {isVisible ? (
          <ins 
            className="adsbygoogle"
            style={{ display: 'block', minWidth: width || '250px', minHeight: height || '250px' }}
            data-ad-client={client}
            data-ad-slot={slotId}
            data-ad-format={format}
            data-full-width-responsive={responsive}
            // data-adtest="on" // Descomente para testes locais
          />
        ) : (
          // Placeholder enquanto não está visível (evita CLS)
          <div style={{ width: width || '100%', height: height || '100%' }} />
        )}

        {!isAdLoaded && isVisible && (
             <span className="absolute text-slate-300 text-[10px] font-bold animate-pulse">
                Carregando...
             </span>
        )}
      </div>
    </div>
  );
};

export default React.memo(AdUnit);