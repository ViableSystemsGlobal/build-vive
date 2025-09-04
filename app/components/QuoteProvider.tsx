"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { QuoteModal } from "./QuoteModal";

type QuoteContextType = {
  openQuote: () => void;
  quoteSubmitted: boolean;
  setQuoteSubmitted: (submitted: boolean) => void;
  currentQuoteId: string | null;
  setCurrentQuoteId: (id: string | null) => void;
};

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export function useQuote() {
  const context = useContext(QuoteContext);
  if (context === undefined) {
    throw new Error("useQuote must be used within a QuoteProvider");
  }
  return context;
}

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [currentQuoteId, setCurrentQuoteId] = useState<string | null>(null);

  const openQuote = () => setQuoteOpen(true);

  return (
    <QuoteContext.Provider value={{ 
      openQuote, 
      quoteSubmitted, 
      setQuoteSubmitted,
      currentQuoteId,
      setCurrentQuoteId
    }}>
      {children}
      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </QuoteContext.Provider>
  );
}
