import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import HubPage from "./pages/HubPage"; // Ou onde estiver seu HubPage
import VocabularyGame from "./components/VocabularyGame";
import IrregularVerbsGame from "./components/IrregularVerbsGame";
import PhrasalVerbsGame from "./components/PhrasalVerbsGame";
import TranslationGame from "./components/TranslationGame";
import ScrollToTop from "./ScrollToTop";

// --- NOVOS IMPORTS ---
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<HubPage />} />

        {/* --- NOVAS ROTAS INSTITUCIONAIS --- */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />

        {/* Rotas dos Jogos */}
        <Route path="/vocabulary" element={<VocabularyGame />} />
        <Route path="/vocabulary/level/:levelId" element={<VocabularyGame />} /> 
        
        <Route path="/irregular" element={<IrregularVerbsGame />} />
        <Route path="/phrasal" element={<PhrasalVerbsGame />} />
        <Route path="/translation" element={<TranslationGame />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}