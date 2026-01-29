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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 1. Lazy Loading (Mantido pois resolveu os erros 400)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.boundingClientRect.width > 0) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Se não estiver visível ou sem referência, não faz nada
    if (!isVisible || typeof window === 'undefined' || !adRef.current) {
      return;
    }

    // VERIFICAÇÃO DE SEGURANÇA 1: Já foi processado?
    if (adsPushed.current) {
      setIsAdLoaded(true); // Garante que o texto suma
      return;
    }

    // VERIFICAÇÃO DE SEGURANÇA 2: O slot já tem algo dentro (iframe/script)?
    // O problema anterior era aqui: ele retornava mas não setava o estado.
    if (adRef.current.innerHTML.replace(/\s/g, '').length > 0) {
       console.log(`Slot ${slotId} já populado. Marcando como carregado.`);
       adsPushed.current = true;
       setIsAdLoaded(true);
       return;
    }

    try {
      console.log(`Solicitando anúncio para slot ${slotId}...`);
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      adsPushed.current = true;
      setIsAdLoaded(true);
    } catch (e) {
      console.error("AdSense Push Error:", e);
      // Mesmo com erro, removemos o "Carregando" para não quebrar o layout visualmente
      setIsAdLoaded(true); 
    }

  }, [isVisible, slotId]);

  // Timeout de Segurança (Fallback)
  // Se por algum motivo o script travar, em 2 segundos removemos o "Carregando..."
  useEffect(() => {
    if (isVisible && !isAdLoaded) {
      const timer = setTimeout(() => {
        setIsAdLoaded(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, isAdLoaded]);

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

      <div className="relative bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden"
           style={{ width: width || 'auto', height: height || 'auto', minHeight: height || '250px' }}>
        
        {isVisible ? (
          <ins 
            className="adsbygoogle"
            style={{ display: 'block', minWidth: width || '250px', minHeight: height || '250px' }}
            data-ad-client={client}
            data-ad-slot={slotId}
            data-ad-format={format}
            data-full-width-responsive={responsive}
          />
        ) : (
          <div style={{ width: width || '100%', height: height || '100%' }} />
        )}

        {/* Só mostra "Carregando" se não estiver carregado E estiver visível */}
        {!isAdLoaded && isVisible && (
             <span className="absolute text-slate-300 text-[10px] font-bold animate-pulse pointer-events-none">
                Carregando...
             </span>
        )}
      </div>
    </div>
  );
};

export default React.memo(AdUnit);