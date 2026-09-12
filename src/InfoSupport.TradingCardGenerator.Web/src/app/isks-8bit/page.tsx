import Isks8BitCardGenerator from "@/components/Isks8BitCardGenerator";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function Isks8BitPage() {
  return (
    <ThemeProvider theme="isks-8bit">
      <div className="min-h-screen bg-gradient-to-b from-[#431407] via-[#7c2d12] to-[#c2410c] text-center p-4 sm:p-6 lg:p-8">
        <Isks8BitCardGenerator />
      </div>
    </ThemeProvider>
  );
}
