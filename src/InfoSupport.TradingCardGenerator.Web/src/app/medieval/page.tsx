import MedievalCardGenerator from "@/components/MedievalCardGenerator";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function MedievalPage() {
  return (
    <ThemeProvider theme="medieval">
      <div className="min-h-screen bg-gradient-to-b from-[#1c0a00] to-[#7c2d12] text-center p-4 sm:p-6 lg:p-8">
        <MedievalCardGenerator />
      </div>
    </ThemeProvider>
  );
}
