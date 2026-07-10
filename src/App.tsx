import React, { useState } from "react";
import TweakCatalog from "./components/TweakCatalog";
import ScriptAuditor from "./components/ScriptAuditor";
import TerminalSimulator from "./components/TerminalSimulator";
import ScreenProtectionWidget from "./components/ScreenProtectionWidget";
import { motion } from "motion/react";
import {
  Smartphone,
  Cpu,
  Battery,
  ShieldCheck,
  Terminal as TerminalIcon,
  Sparkles,
  BookOpen,
  Volume2,
  Tv,
  ExternalLink,
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"auditor" | "tweaks">("auditor");
  const [terminalCommand, setTerminalCommand] = useState<string | null>(null);

  // Stats dynamically simulated
  const [vrrMode, setVrrMode] = useState<string>("Dinâmico (24Hz - 120Hz)");
  const [ramPlus, setRamPlus] = useState<string>("4GB (Virtual)");
  const [dolbyStatus, setDolbyStatus] = useState<string>("Desativado");
  const [debloatCount, setDebloatCount] = useState<number>(0);

  const handleSendToTerminal = (command: string) => {
    setTerminalCommand(command);

    // Dynamically update simulated visual dashboard stats based on run commands
    if (command.includes("peak_refresh_rate 96")) {
      setVrrMode("Otimizado (24Hz - 96Hz)");
    } else if (command.includes("peak_refresh_rate 120") && command.includes("min_refresh_rate 120")) {
      setVrrMode("Forçado (120Hz Fixo)");
    } else if (command.includes("ram_expand_size_list 0")) {
      setRamPlus("Desativado (RAM Pura)");
    } else if (command.includes("dolby_effect_mode 1")) {
      setDolbyStatus("Ativado (Música HQ)");
    }

    if (command.includes("pm disable-user")) {
      // Extract number of disabled apps from lines
      const count = command.split("\n").filter((l) => l.includes("pm disable-user")).length;
      setDebloatCount((prev) => Math.min(prev + count, 18));
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans" id="app-root-container">
      {/* Top Navigation Bar in Elegant Dark Spec */}
      <nav className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 sm:px-8 bg-zinc-900/50 sticky top-0 z-45 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-10 h-8 bg-blue-600 rounded flex items-center justify-center font-bold italic shadow-lg shadow-blue-900/20 text-xs text-white">Ax</div>
          <h1 className="text-sm sm:text-lg font-semibold tracking-tight uppercase">
            AxManager <span className="text-zinc-500 font-normal">// S23 Ultra Edition</span>
          </h1>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden md:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            <span className="text-xs uppercase tracking-widest text-zinc-400">System Status: Optimal</span>
          </div>
          <div className="hidden md:block h-4 w-px bg-zinc-800"></div>
          <span className="text-xs font-mono text-blue-400 uppercase tracking-tighter">No-Root Environment</span>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* Device Real-Time Virtual Dashboard */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="hardware-dashboard">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Frequência VRR</span>
            <div className="flex items-end justify-between mt-3">
              <span className="text-xl sm:text-2xl font-light tracking-tight">{vrrMode}</span>
              <span className="text-blue-500 text-[10px] font-mono">ACTIVE</span>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">RAM Plus Virtual</span>
            <div className="flex items-end justify-between mt-3">
              <span className="text-xl sm:text-2xl font-light tracking-tight">{ramPlus}</span>
              <span className="text-blue-500 text-[10px] font-mono">STABLE</span>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Dolby Atmos (System)</span>
            <div className="flex items-end justify-between mt-3">
              <span className="text-xl sm:text-2xl font-light tracking-tight">{dolbyStatus}</span>
              <span className="text-blue-500 text-[10px] font-mono">HQ MUSIC</span>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Debloat Seguro</span>
            <div className="flex items-end justify-between mt-3">
              <span className="text-xl sm:text-2xl font-light tracking-tight">
                {debloatCount > 0 ? `${debloatCount} apps` : "Limpo"}
              </span>
              <span className="text-blue-500 text-[10px] font-mono">OPTIMIZED</span>
            </div>
          </div>
        </section>

        {/* Feature Tabs selection */}
        <div className="flex border-b border-zinc-800">
          <button
            onClick={() => setActiveTab("auditor")}
            className={`px-6 py-3.5 text-xs uppercase tracking-widest font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "auditor"
                ? "border-blue-600 text-blue-400"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Análise e Auditoria com IA
          </button>
          <button
            onClick={() => setActiveTab("tweaks")}
            className={`px-6 py-3.5 text-xs uppercase tracking-widest font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "tweaks"
                ? "border-blue-600 text-blue-400"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Cpu className="w-4 h-4" />
            Catálogo de Ajustes S23
          </button>
        </div>

        {/* Workspace Layout: Left Content, Right Live Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            {activeTab === "auditor" ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ScriptAuditor onSendToTerminal={handleSendToTerminal} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TweakCatalog onSendToTerminal={handleSendToTerminal} />
              </motion.div>
            )}

            {/* Screen Protection & Anti-Green Tint Widget */}
            <ScreenProtectionWidget onSendToTerminal={handleSendToTerminal} />
          </div>

          {/* Right column: Terminal Simulator always visible on large screen */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24">
              <TerminalSimulator
                incomingCommand={terminalCommand}
                clearIncomingCommand={() => setTerminalCommand(null)}
              />

              {/* Extra info widget: AxManager Support in Elegant Dark */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mt-6">
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  AxManager Plugins Sem Root
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  O AxManager permite gerenciar e injetar plugins de customização e melhorias sem privilégios de superusuário (su).
                  Para evitar problemas de segurança ou detecções de Play Protect no Snapdragon 8 Gen 2, aplique as desativações de assinatura inclusas.
                </p>
                <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <a
                    href="https://github.com/fahrez182/AxManager"
                    target="_blank"
                    referrerPolicy="no-referrer"
                    className="text-xs font-semibold uppercase tracking-wider text-blue-400 hover:text-blue-300 flex items-center gap-1 hover:underline"
                  >
                    Repositório Oficial
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-[10px] font-mono text-zinc-600">v1.0-STABLE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Android Guides Section in Elegant Dark style */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6" id="documentation-section">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-300 flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-blue-400" />
            Guia de Uso: Como aplicar comandos no Galaxy S23 Ultra sem Root
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800/80">
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-2">MÉTODO 1: LADB (Do S23)</div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Utilize o aplicativo LADB (Local ADB Shell). Ative a <strong>Depuração sem fio</strong> nas Opções do Desenvolvedor, faça o emparelhamento em tela dividida usando a porta e código de pareamento, e cole os comandos acima diretamente no terminal do aplicativo.
              </p>
            </div>

            <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800/80">
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-2">MÉTODO 2: SHIZUKU (Prático)</div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                O Shizuku concede privilégios ADB diretamente para aplicativos como App Manager ou Termux. Inicie o serviço Shizuku via depuração sem fio e use um terminal compatível (como o Termux-Shizuku) para rodar os scripts otimizados sem precisar de PC.
              </p>
            </div>

            <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800/80">
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-2">MÉTODO 3: ADB pelo Computador</div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Conecte seu S23 Ultra ao PC via USB. Ative a Depuração USB, abra o terminal (Prompt, PowerShell ou Bash) na pasta das Platform Tools e execute os comandos adicionando o prefixo <code>adb shell</code> antes de cada instrução.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer in Elegant Dark style */}
      <footer className="border-t border-zinc-800 bg-zinc-950 py-6 text-center text-xs text-zinc-600 font-mono uppercase tracking-wider">
        <p>Galaxy S23 Ultra (Snapdragon 8 Gen 2) Customizer Suite & Auditor • Sem Root</p>
      </footer>
    </div>
  );
}
