import IsksCardGenerator from "@/components/IsksCardGenerator";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function IsksPage() {
  return (
    <ThemeProvider theme="isks">
      <div className="min-h-screen bg-gradient-to-b from-[#3f4a5a] to-[#1e3a8a] text-center p-4 sm:p-6 lg:p-8">
        <IsksCardGenerator />
      </div>
    </ThemeProvider>
  );
}
