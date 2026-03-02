import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GovHeader from "@/components/GovHeader";
import PhaseBanner from "@/components/PhaseBanner";
import GovFooter from "@/components/GovFooter";
import NewcoReadiness from "@/pages/NewcoReadiness";
import About from "@/pages/About";
import Model from "@/pages/Model";
import Examples from "@/pages/Examples";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <GovHeader />
          <PhaseBanner />
          <main className="flex-1" id="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/newco-readiness" replace />} />
              <Route path="/newco-readiness" element={<NewcoReadiness />} />
              <Route path="/newco-readiness/about" element={<About />} />
              <Route path="/newco-readiness/model" element={<Model />} />
              <Route path="/newco-readiness/examples" element={<Examples />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <GovFooter />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
