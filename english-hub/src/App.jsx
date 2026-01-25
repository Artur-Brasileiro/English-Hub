import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import HubPage from "./pages/HubPage";
import VocabularyGame from "./components/VocabularyGame";
import IrregularVerbsGame from "./components/IrregularVerbsGame";
import PhrasalVerbsGame from "./components/PhrasalVerbsGame";
import TranslationGame from "./components/TranslationGame";
import ScrollToTop from "./ScrollToTop";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<HubPage />} />

        <Route path="/vocabulary" element={<VocabularyGame />} />
        <Route path="/irregular" element={<IrregularVerbsGame />} />
        <Route path="/phrasal" element={<PhrasalVerbsGame />} />
        <Route path="/translation" element={<TranslationGame />} />

        {/* se abrir alguma rota errada, volta pro hub */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
