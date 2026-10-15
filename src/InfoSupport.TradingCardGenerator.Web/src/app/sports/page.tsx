import TradingCardGenerator from "@/components/TradingCardGenerator";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function SportsPage() {
  return (
    <ThemeProvider theme="sports">
      <div className="min-h-screen bg-[#f0f0f0] dark:bg-[#1a1a1a] text-center px-4 py-3 sm:px-6 lg:px-8">
        <TradingCardGenerator />
      </div>
    </ThemeProvider>
  );
}
