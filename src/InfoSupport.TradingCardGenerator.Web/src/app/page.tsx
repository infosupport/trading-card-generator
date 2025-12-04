import TradingCardGenerator from "./components/TradingCardGenerator";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f0f0f0] dark:bg-[#1a1a1a] text-center p-4 sm:p-6 lg:p-8">
      <TradingCardGenerator />
    </div>
  );
}
