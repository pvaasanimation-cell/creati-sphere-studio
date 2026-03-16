import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CinematicLoader from "@/components/CinematicLoader";
import Index from "./pages/Index";
import About from "./pages/About";
import Works from "./pages/Works";
import Community from "./pages/Community";
import Join from "./pages/Join";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        {!loaded && <CinematicLoader onComplete={() => setLoaded(true)} />}
        <BrowserRouter>
          {loaded && (
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/works" element={<Works />} />
                <Route path="/community" element={<Community />} />
                <Route path="/join" element={<Join />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
