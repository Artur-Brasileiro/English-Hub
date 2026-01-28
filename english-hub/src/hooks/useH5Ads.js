import { useCallback, useRef } from 'react';

export const useH5Ads = () => {
  const isNavigatingRef = useRef(false);

  // ADICIONADO: novos parâmetros onMute e onUnmute
  const triggerAdBreak = useCallback((type = 'next', name = 'level_complete', onComplete, onMute, onUnmute) => {
    isNavigatingRef.current = false;

    const safeComplete = () => {
      if (!isNavigatingRef.current) {
        isNavigatingRef.current = true;
        // Se o jogo for continuar (ex: replay), precisamos desmutar
        if (onUnmute) onUnmute(); 
        if (onComplete) onComplete();
      }
    };

    if (typeof window.adConfig !== 'function') {
      console.warn("H5 Games API ausente. Navegando direto.");
      safeComplete();
      return;
    }

    const safetyTimer = setTimeout(() => {
      console.log("Timeout do AdSense: Forçando navegação.");
      safeComplete();
    }, 800); 

    try {
      // Configuração inicial
      window.adConfig({
        preloadAdBreaks: 'on', 
        sound: 'on', 
        onReady: () => console.log("AdSense H5 API Ready"),
      });

      // Chamada do anúncio
      window.adConfig({
        name: name,
        type: type, 
        beforeAd: () => {
          console.log("Anúncio vai começar - Mutando áudio");
          // CORREÇÃO CRÍTICA: Parar o som aqui
          if (onMute) onMute(); 
          clearTimeout(safetyTimer);
        },
        afterAd: () => {
          console.log("Anúncio terminou/fechou.");
          safeComplete();
        },
      });
    } catch (error) {
      console.error("Erro ao chamar adConfig:", error);
      safeComplete();
    }
  }, []);

  return { triggerAdBreak };
};