import React, { useState, useEffect, useRef } from "react";
import { TerminalLog } from "../types";
import { Terminal, Trash2, HelpCircle, ArrowRight, Play, Cpu, CheckCircle } from "lucide-react";

interface TerminalSimulatorProps {
  incomingCommand: string | null;
  clearIncomingCommand: () => void;
}

export default function TerminalSimulator({ incomingCommand, clearIncomingCommand }: TerminalSimulatorProps) {
  const [logs, setLogs] = useState<TerminalLog[]>([
    {
      type: "success",
      text: "Servidor Shizuku conectado com sucesso no Galaxy S23 Ultra (SM-S918B).",
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      type: "output",
      text: "Processador: Snapdragon 8 Gen 2 for Galaxy (8 núcleos - 3.36 GHz max)",
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      type: "output",
      text: "One UI detectada: Versão 6.1 (Rootless Mode). Pronto para depuração ADB.",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputValue, setInputValue] = useState<string>("");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Execute an incoming command from external catalog or AI auditor
  useEffect(() => {
    if (incomingCommand) {
      executeCommandLines(incomingCommand);
      clearIncomingCommand();
    }
  }, [incomingCommand]);

  const executeCommandLines = (multiLineCommand: string) => {
    const lines = multiLineCommand.split("\n").filter((line) => line.trim() !== "");
    let currentLogs = [...logs];

    lines.forEach((line, index) => {
      setTimeout(() => {
        const cleanLine = line.trim();
        const timestamp = new Date().toLocaleTimeString();

        // 1. Add input log
        setLogs((prev) => [...prev, { type: "input", text: cleanLine, timestamp }]);

        // 2. Process simulation response
        setTimeout(() => {
          const outputs = simulateCommandResponse(cleanLine);
          setLogs((prev) => [...prev, ...outputs]);
        }, 300);
      }, index * 600); // Stagger line execution
    });
  };

  const simulateCommandResponse = (command: string): TerminalLog[] => {
    const timestamp = new Date().toLocaleTimeString();
    const cmd = command.toLowerCase().trim();

    if (cmd === "help" || cmd === "ajuda") {
      return [
        {
          type: "output",
          text: "Lista de Comandos Simulados Disponíveis:\n- clear | limpar : Limpa todo o console\n- diagnostics : Roda análise de hardware do S23 Ultra\n- adb shell pm list : Lista os pacotes instalados simulados\n- xmanager-status : Confirma integridade do app X-Manager",
          timestamp,
        },
      ];
    }

    if (cmd === "clear" || cmd === "limpar") {
      setTimeout(() => setLogs([]), 50);
      return [];
    }

    if (cmd === "diagnostics") {
      return [
        { type: "success", text: "[DIAGNOSTICS] S23 Ultra Status: EXCELENTE", timestamp },
        { type: "output", text: "-> Frequência de Tela Atual: Dinâmica (24Hz - 120Hz)", timestamp },
        { type: "output", text: "-> RAM Livre: 5.4 GB / 12 GB físicos (Sem swap virtual)", timestamp },
        { type: "output", text: "-> Dolby Atmos: Ativado (Perfil de Música)", timestamp },
        { type: "output", text: "-> Knox Status: Integridade Intacta (0x0 - Rootless)", timestamp },
      ];
    }

    if (cmd.includes("xmanager-status")) {
      return [
        { type: "success", text: "[XMANAGER] Assinatura externa ativada. Sideload liberado.", timestamp },
        { type: "output", text: "-> Cache TCP de Streaming: Otimizado para fones LDAC/AptX HD", timestamp },
        { type: "output", text: "-> Pacotes do Spotify Modificado: Sem restrições de Play Protect", timestamp },
      ];
    }

    if (cmd.includes("su ") || cmd === "su") {
      return [
        {
          type: "error",
          text: "[ERROR] Permissão Negada: S23 Ultra requer bootloader desbloqueado para rodar 'su' (Root).",
          timestamp,
        },
        {
          type: "error",
          text: "-> RECOMENDAÇÃO: Utilize comandos sem root baseados em 'adb shell settings' ou via Shizuku.",
          timestamp,
        },
      ];
    }

    if (cmd.includes("/sys/") || cmd.includes("echo") && cmd.includes(">")) {
      return [
        {
          type: "error",
          text: `[ERROR] Falha de Gravação: Escrita direta em '${command.split(">")[1]?.trim() || "partições protegidas"}' é bloqueada sem root.`,
          timestamp,
        },
        {
          type: "output",
          text: "-> Dica: Ajustes de hardware em partições de sistema (/sys, /system, /data) não são permitidos em aparelhos sem root.",
          timestamp,
        },
      ];
    }

    if (cmd.includes("settings put secure")) {
      const settingName = command.split("settings put secure")[1]?.trim()?.split(" ")[0] || "setting";
      const value = command.split("settings put secure")[1]?.trim()?.split(" ")[1] || "valor";
      return [
        {
          type: "success",
          text: `[ADB SECURE] Configuração '${settingName}' atualizada para: ${value}`,
          timestamp,
        },
        {
          type: "output",
          text: `-> Configuração gravada com sucesso via Shizuku API (Sem Root).`,
          timestamp,
        },
      ];
    }

    if (cmd.includes("settings put global")) {
      const settingName = command.split("settings put global")[1]?.trim()?.split(" ")[0] || "setting";
      const value = command.split("settings put global")[1]?.trim()?.split(" ")[1] || "valor";
      return [
        {
          type: "success",
          text: `[ADB GLOBAL] Configuração global '${settingName}' alterada para: ${value}`,
          timestamp,
        },
      ];
    }

    if (cmd.includes("pm disable-user")) {
      const pkg = command.split("--user 0")[1]?.trim() || command.split("disable-user")[1]?.trim() || "pacote";
      return [
        {
          type: "success",
          text: `[DEBLOAT] Pacote '${pkg}' desativado de forma segura para o Usuário 0.`,
          timestamp,
        },
        {
          type: "output",
          text: "-> Aplicativo ocultado e congelado. Não consome CPU/RAM.",
          timestamp,
        },
      ];
    }

    if (cmd.includes("pm list") || cmd.includes("pm list packages")) {
      return [
        { type: "output", text: "package:com.samsung.android.bixby.agent (Congelado)", timestamp },
        { type: "output", text: "package:com.spotify.music (X-Manager Patch Ativo)", timestamp },
        { type: "output", text: "package:com.samsung.android.ipsgeofence (Congelado)", timestamp },
        { type: "output", text: "package:com.samsung.android.rubin.app (Congelado)", timestamp },
      ];
    }

    // Default catch-all
    return [
      {
        type: "success",
        text: `Comando executado com sucesso: ${command}`,
        timestamp,
      },
    ];
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      executeCommandLines(inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-2xl flex flex-col h-[400px]" id="terminal-simulator-panel">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-400" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">ADB Emulator</span>
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-pulse" />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => executeCommandLines("diagnostics")}
            className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 px-2.5 py-1 rounded text-[10px] text-zinc-300 font-mono transition-all cursor-pointer"
          >
            <Cpu className="w-3 h-3 text-blue-400" />
            Diag
          </button>
          <button
            onClick={() => setLogs([])}
            className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 px-2.5 py-1 rounded text-[10px] text-zinc-500 hover:text-rose-400 transition-all cursor-pointer"
            title="Limpar Console"
          >
            <Trash2 className="w-3 h-3" />
            Limpar
          </button>
        </div>
      </div>

      {/* Terminal Viewport */}
      <div className="flex-1 overflow-y-auto font-mono text-xs space-y-2 pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
        {logs.length === 0 && (
          <div className="text-zinc-600 text-center py-16">
            Console limpo. Digite um comando ou simule um tweak do catálogo acima.
          </div>
        )}
        {logs.map((log, idx) => (
          <div key={idx} className="leading-relaxed">
            {log.type === "input" && (
              <div className="text-zinc-500">
                <span className="text-blue-500 font-bold">[S23_ULTRA:/]$</span> {log.text}
              </div>
            )}
            {log.type === "output" && (
              <div className="text-zinc-300 whitespace-pre-wrap">{log.text}</div>
            )}
            {log.type === "success" && (
              <div className="text-blue-400 flex items-start gap-1">
                <span className="font-semibold select-none font-mono text-[10px] uppercase bg-blue-500/10 px-1 py-0.5 rounded border border-blue-500/20">SUCCESS</span>
                <span className="whitespace-pre-wrap text-zinc-300">{log.text}</span>
              </div>
            )}
            {log.type === "error" && (
              <div className="text-rose-400 flex items-start gap-1">
                <span className="font-semibold select-none font-mono text-[10px] uppercase bg-rose-500/10 px-1 py-0.5 rounded border border-rose-500/20">ERROR</span>
                <span className="whitespace-pre-wrap text-rose-300">{log.text}</span>
              </div>
            )}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Command input footer */}
      <div className="border-t border-zinc-900 pt-3 mt-3 flex items-center gap-2">
        <span className="text-blue-500 font-mono text-xs font-bold shrink-0">[S23:/]$</span>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Digite um comando (ex: 'diagnostics')...."
          className="flex-1 bg-transparent border-none text-xs font-mono text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-0"
        />
        <button
          onClick={() => {
            if (inputValue.trim()) {
              executeCommandLines(inputValue);
              setInputValue("");
            }
          }}
          className="bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 hover:border-blue-500/40 text-blue-400 px-3 py-1 rounded text-[10px] font-mono transition-all cursor-pointer"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
