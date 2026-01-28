import { useCallback } from 'react';

export const useH5Ads = () => {
  const triggerAdBreak = useCallback((type = 'next', name = 'level_complete', onComplete) => {
    // Verifica se a API do AdSense para jogos está carregada
    if (typeof window.adConfig !== 'function') {
      console.warn("H5 Games API não detectada. Pulando anúncio.");
      if (onComplete) onComplete();
      return;
    }

    // Chama o adBreak nativo do Google 
    window.adConfig({
      preloadAdBreaks: 'on', // Garante pre-loading para evitar latência [cite: 21]
      sound: 'on', // O Google gerencia o mudo automaticamente [cite: 63]
      onReady: () => {
        console.log("AdSense H5 API Ready");
      },
    });

    window.adConfig({
      name: name,
      type: type, // 'start', 'next', 'browse', 'reward'
      beforeAd: () => {
        // Pause o jogo ou pare sons aqui se necessário
        console.log("Anúncio vai começar");
      },
      afterAd: () => {
        // Retome o jogo
        console.log("Anúncio terminou ou foi pulado");
        if (onComplete) onComplete();
      },
    });
  }, []);

  return { triggerAdBreak };
};