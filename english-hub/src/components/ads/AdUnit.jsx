import React, { useEffect, useRef } from 'react';

const AdUnit = ({ slotId, width, height, label = "Publicidade", className = "" }) => {
  const adRef = useRef(null);

  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        setTimeout(() => {
          if (adRef.current && adRef.current.innerHTML === "") {
             (window.adsbygoogle = window.adsbygoogle || []).push({});
          }
        }, 100);
      }
    } catch (e) {
      console.error("AdSense Push Error", e);
    }
  }, []);

  const containerStyle = {
    width: width || '100%',
    height: height || 'auto',
    minHeight: height || '250px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '16px 0',
  };

  return (
    <div style={containerStyle} className={`ad-container ${className}`}>
      <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 w-full text-center">
        {label}
      </div>
      
      <div className="bg-slate-100 border border-slate-200 border-dashed flex items-center justify-center overflow-hidden relative"
           style={{ width: width || '100%', height: height || 'auto' }}>
        
        <span className="text-slate-300 text-[10px] font-bold absolute pointer-events-none opacity-50">
             Carregando...
        </span>

        <ins className="adsbygoogle"
             ref={adRef}
             style={{ display: 'inline-block', width: width || 'auto', height: height || 'auto' }}
             data-ad-client="ca-pub-SEU_ID_DO_CLIENTE" // <--- Configure aqui ou via ENV
             data-ad-slot={slotId}
             data-full-width-responsive={!width ? "true" : "false"}
        ></ins>
      </div>
    </div>
  );
};

export default AdUnit;