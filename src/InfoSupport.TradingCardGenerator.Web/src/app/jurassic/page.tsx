import JurassicCardGenerator from "@/components/JurassicCardGenerator";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function JurassicPage() {
  return (
    <ThemeProvider theme="jurassic">
      <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#2d5016] text-center p-4 sm:p-6 lg:p-8">
        <JurassicCardGenerator />
      </div>
    </ThemeProvider>
  );
}
