import JurassicCardGenerator from "@/components/JurassicCardGenerator";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function JurassicPage() {
  return (
    <ThemeProvider theme="jurassic">
      <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#2d5016] text-center px-4 py-3 sm:px-6 lg:px-8">
        <JurassicCardGenerator />
      </div>
    </ThemeProvider>
  );
}
