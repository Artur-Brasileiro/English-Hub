import React, { useEffect, useRef } from 'react';

const AdUnit = ({ slotId, width, height, label = "Publicidade", className = "" }) => {
  const adRef = useRef(null);

  useEffect(() => {
    try {
      // Verifica se o slot já não está preenchido para evitar duplicação em re-renders do React
      if (window.adsbygoogle && adRef.current && adRef.current.innerHTML === "") {
         (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error("AdSense Push Error", e);
    }
  }, [slotId]); // Adicionado slotId como dependência para suportar mudanças de rota

  // O PDF recomenda containers com min-height e min-width definidos 
  const containerStyle = {
    width: width || '100%',
    minWidth: width || 'auto', // Força reserva de espaço horizontal
    height: height || 'auto',
    minHeight: height || '250px', // Força reserva de espaço vertical (Crucial para CLS)
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '24px 0', // Aumentado margem vertical para segurança [cite: 77]
  };

  return (
    <div style={containerStyle} className={`ad-container ${className}`}>
      {/* Rótulo de Publicidade obrigatório para criar fronteira cognitiva [cite: 79] */}
      <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 w-full text-center font-semibold">
        {label}
      </div>
      
      <div className="bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden relative"
           style={{ width: width || '100%', height: height || 'auto' }}>
        
        {/* Placeholder visual enquanto carrega */}
        <span className="text-slate-300 text-[10px] font-bold absolute pointer-events-none opacity-50 z-0">
             Carregando Anúncio...
        </span>

        <ins className="adsbygoogle relative z-10"
          ref={adRef}
          style={{ display: 'inline-block', width: width || 'auto', height: height || 'auto' }}
          data-ad-client="ca-pub-5263755641231811"
          data-ad-slot={slotId}
          data-adtest="on"
          data-full-width-responsive={!width ? "true" : "false"}
      ></ins>
      </div>
    </div>
  );
};

export default AdUnit;