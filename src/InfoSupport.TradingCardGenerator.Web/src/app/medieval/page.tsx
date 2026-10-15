import MedievalCardGenerator from "@/components/MedievalCardGenerator";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function MedievalPage() {
  return (
    <ThemeProvider theme="medieval">
      <div className="min-h-screen bg-gradient-to-b from-[#1c0a00] to-[#7c2d12] text-center px-4 py-3 sm:px-6 lg:px-8">
        <MedievalCardGenerator />
      </div>
    </ThemeProvider>
  );
}
