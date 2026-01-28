import { useState, useRef, useCallback } from 'react';

export const useSafeNavigation = () => {
  const [showAdScreen, setShowAdScreen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const startTimeRef = useRef(Date.now());

  // Reinicia o timer (chame isso quando o nível começar/reiniciar)
  const resetTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    setShowAdScreen(false); // Garante que fecha se estiver aberto
  }, []);

  // Solicita navegação (verifica se jogou tempo suficiente)
  const requestNavigation = useCallback((actionFn) => {
    const timeSpentMs = Date.now() - startTimeRef.current;
    const MIN_TIME_FOR_AD = 90000; // 1.5 minutos

    if (timeSpentMs > MIN_TIME_FOR_AD) {
      // Guarda a função que o usuário queria executar (ex: navigate('/home'))
      setPendingAction(() => actionFn);
      setShowAdScreen(true);
    } else {
      // Se foi rápido demais, executa direto
      actionFn();
    }
  }, []);

  // O usuário clicou no botão "Continuar" do anúncio
  const confirmNavigation = useCallback(() => {
    if (pendingAction) {
      pendingAction();
    }
    setPendingAction(null);
    setShowAdScreen(false);
  }, [pendingAction]);

  return {
    showAdScreen,
    requestNavigation,
    confirmNavigation,
    resetTimer
  };
};