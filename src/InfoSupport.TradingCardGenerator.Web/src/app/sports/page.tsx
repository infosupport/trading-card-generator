import TradingCardGenerator from "@/components/TradingCardGenerator";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function SportsPage() {
  return (
    <ThemeProvider theme="sports">
      <div className="min-h-screen bg-[#f0f0f0] dark:bg-[#1a1a1a] text-center p-4 sm:p-6 lg:p-8">
        <TradingCardGenerator />
      </div>
    </ThemeProvider>
  );
}
