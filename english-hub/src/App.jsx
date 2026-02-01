import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
// --- LAZY IMPORTS (Carregamento sob demanda) ---
// Isso divide o bundle principal em pedaços menores (chunks).
// O navegador só baixa o código do "VocabularyGame" se o usuário entrar nele.

const HubPage = lazy(() => import("./pages/HubPage"));
const VocabularyGame = lazy(() => import("./components/VocabularyGame"));
const IrregularVerbsGame = lazy(() => import("./components/IrregularVerbsGame"));
const PhrasalVerbsGame = lazy(() => import("./components/PhrasalVerbsGame"));
const TranslationGame = lazy(() => import("./components/TranslationGame"));

// Páginas institucionais também podem ser lazy
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Contact = lazy(() => import("./pages/Contact"));

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />

      {/* O Suspense mostra o fallback enquanto o componente lazy está sendo baixado */}
      <Suspense 
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Carregando...</p>
            </div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<HubPage />} />

          {/* Institucional */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />

          {/* Jogos */}
          <Route path="/vocabulary" element={<VocabularyGame />} />
          <Route path="/vocabulary/level/:levelId" element={<VocabularyGame />} /> 
          
          <Route path="/irregular" element={<IrregularVerbsGame />} />
          <Route path="/irregular/level/:levelId" element={<IrregularVerbsGame />} />

          <Route path="/phrasal" element={<PhrasalVerbsGame />} />
          <Route path="/phrasal/level/:levelId" element={<PhrasalVerbsGame />} />
          
          {/* Rotas para o Translation */}
          <Route path="/translation" element={<TranslationGame />} />
          <Route path="/translation/level/:levelId" element={<TranslationGame />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}