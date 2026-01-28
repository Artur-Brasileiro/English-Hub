import React, { useEffect, useRef, useState } from 'react';

const AdUnit = ({ 
  slotId, 
  width, 
  height, 
  client = "ca-pub-5263755641231811", // Seu ID padrão
  label = "Publicidade", 
  format = "auto",
  responsive = "true",
  className = "" 
}) => {
  const adRef = useRef(null);
  // Flag "Secret Weapon" do PDF: Garante execução única independente de re-renders do React [cite: 154, 187]
  const adsPushed = useRef(false); 
  const [isAdLoaded, setIsAdLoaded] = useState(false);

  useEffect(() => {
    // 1. Verificações de Segurança [cite: 158]
    // Se não há window (SSR), ou ref nula, ou se já fizemos push neste componente: PARAR.
    if (typeof window === 'undefined' || !adRef.current || adsPushed.current) {
      return;
    }

    // 2. Proteção contra Slot já preenchido (Defesa contra Strict Mode) [cite: 159]
    if (adRef.current.innerHTML.replace(/\s/g, '').length > 0) {
       console.warn(`AdUnit ${slotId}: Slot já preenchido, abortando.`);
       return;
    }

    try {
      // 3. O Push Único [cite: 163]
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      adsPushed.current = true; // Marca como processado para sempre
      setIsAdLoaded(true);
    } catch (e) {
      console.error("AdSense Push Error:", e);
    }

  }, [slotId]); // Só recria se o slotId mudar, ignorando outros re-renders [cite: 170]

  // Estilização defensiva para evitar CLS (Cumulative Layout Shift) e erro de width=0 [cite: 190]
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: height || '280px', // Altura mínima obrigatória
    width: width || '100%',
    minWidth: '250px',
    margin: '20px 0',
    overflow: 'hidden'
  };

  return (
    <div style={containerStyle} className={`ad-unit-wrapper ${className}`}>
      {/* Rótulo de Publicidade */}
      <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 w-full text-center font-semibold">
        {label}
      </div>

      {/* Container do anúncio */}
      <div className="relative bg-slate-50 border border-slate-100 flex items-center justify-center"
           style={{ width: width || 'auto', height: height || 'auto', minHeight: height || '250px' }}>
        
        {/* Placeholder visual */}
        {!isAdLoaded && (
             <span className="absolute text-slate-300 text-[10px] font-bold animate-pulse">
                Carregando...
             </span>
        )}

        <ins 
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', minWidth: width || '250px', minHeight: height || '250px' }}
          data-ad-client={client} // Deve ser ca-pub- [cite: 179]
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive={responsive}
        />
      </div>
    </div>
  );
};

// React.memo impede que o componente re-renderize se as props (slotId) não mudarem
// Isso é vital dentro do seu jogo onde o usuário digita e atualiza o estado constantemente [cite: 191]
export default React.memo(AdUnit);