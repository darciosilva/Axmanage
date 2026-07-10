import React, { useState } from "react";
import { s23UltraTweaks } from "../data";
import JSZip from "jszip";
import {
  ShieldCheck,
  Download,
  Code,
  CheckCircle,
  FileText,
  Check,
  Settings,
  Sliders,
  Sparkles,
  RefreshCw,
  Cpu,
  Info
} from "lucide-react";

export default function ZipGenerator() {
  const [pluginId, setPluginId] = useState("com.s23ultra.custom_suite");
  const [pluginName, setPluginName] = useState("S23 Ultra Custom Suite");
  const [pluginVersion, setPluginVersion] = useState("1.0.0");
  const [pluginVersionCode, setPluginVersionCode] = useState("1");
  const [pluginAuthor, setPluginAuthor] = useState("AxManager Suite");
  const [pluginDesc, setPluginDesc] = useState("Otimizações de desempenho, tela e aceleração gráfica para o Galaxy S23 Ultra.");

  const [selectedTweakIds, setSelectedTweakIds] = useState<string[]>(
    s23UltraTweaks.map((t) => t.id) // Select all by default
  );

  const [activePreviewTab, setActivePreviewTab] = useState<"prop" | "sh">("prop");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSuccess, setGenerationSuccess] = useState(false);

  // Toggle selection of individual tweak
  const handleToggleTweak = (id: string) => {
    setSelectedTweakIds((prev) =>
      prev.includes(id) ? prev.filter((tId) => tId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedTweakIds(s23UltraTweaks.map((t) => t.id));
  };

  const handleSelectNone = () => {
    setSelectedTweakIds([]);
  };

  // Properties content (plugin.prop)
  const propContent = `id=${pluginId}
name=${pluginName}
version=${pluginVersion}
versionCode=${pluginVersionCode}
author=${pluginAuthor}
description=${pluginDesc}
`;

  // Generate bash content (main.sh)
  const generateShContent = () => {
    let sh = `#!/system/bin/sh
# =========================================================
# ${pluginName} - AxManager Rootless Plugin
# Criado via AxManager S23 Ultra Suite
# Autor: ${pluginAuthor}
# Versão: ${pluginVersion} (${pluginVersionCode})
# =========================================================

`;

    const selectedTweaks = s23UltraTweaks.filter((t) => selectedTweakIds.includes(t.id));

    if (selectedTweaks.length === 0) {
      sh += "# Nenhum ajuste selecionado para o plugin.\n";
      return sh;
    }

    selectedTweaks.forEach((tweak) => {
      sh += `# ---------------------------------------------------------\n`;
      sh += `# ${tweak.title.toUpperCase()}\n`;
      sh += `# ${tweak.description}\n`;
      sh += `# Impacto - Desempenho: ${tweak.impact.performance || "N/A"}, Bateria: ${tweak.impact.battery || "N/A"}, Segurança: ${tweak.impact.safety}\n`;
      sh += `# ---------------------------------------------------------\n`;

      // Split commands, strip 'adb shell' prefix, and join
      const formattedCommand = tweak.command
        .split("\n")
        .map((line) => {
          let cleaned = line.trim();
          if (cleaned.startsWith("adb shell ")) {
            cleaned = cleaned.substring(10);
          } else if (cleaned.startsWith("adb shell")) {
            cleaned = cleaned.substring(9);
          }
          return cleaned;
        })
        .join("\n");

      sh += `${formattedCommand}\n\n`;
    });

    sh += `# Fim do script de otimização\n`;
    return sh;
  };

  const shContent = generateShContent();

  const handleDownloadZip = async () => {
    setIsGenerating(true);
    try {
      const zip = new JSZip();

      // Pack plugin.prop
      zip.file("plugin.prop", propContent);

      // Pack main.sh
      zip.file("main.sh", shContent);

      // Generate ZIP blob
      const blob = await zip.generateAsync({ type: "blob" });

      // Trigger standard browser download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${pluginId.replace(/\s+/g, "_")}_v${pluginVersion}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setGenerationSuccess(true);
      setTimeout(() => setGenerationSuccess(false), 4000);
    } catch (err) {
      console.error("Erro ao gerar arquivo ZIP do plugin:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6" id="zip-generator-panel">
      {/* Header and Explanation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400 animate-pulse" />
            Gerador de Plugins Customizados para AxManager
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Selecione as otimizações desejadas para empacotar em um arquivo ZIP perfeitamente formatado para o aplicativo AxManager.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Side: Plugin Info Metadata */}
        <div className="xl:col-span-4 bg-zinc-950 p-5 rounded-xl border border-zinc-800/80 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5 pb-2 border-b border-zinc-900">
            <Settings className="w-4 h-4 text-zinc-500" />
            Configuração do Plugin
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">ID do Plugin (Sem espaços)</label>
              <input
                type="text"
                value={pluginId}
                onChange={(e) => setPluginId(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">Nome do Plugin</label>
              <input
                type="text"
                value={pluginName}
                onChange={(e) => setPluginName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">Versão</label>
                <input
                  type="text"
                  value={pluginVersion}
                  onChange={(e) => setPluginVersion(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">Cód. Versão</label>
                <input
                  type="text"
                  value={pluginVersionCode}
                  onChange={(e) => setPluginVersionCode(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">Autor do Plugin</label>
              <input
                type="text"
                value={pluginAuthor}
                onChange={(e) => setPluginAuthor(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">Descrição</label>
              <textarea
                value={pluginDesc}
                onChange={(e) => setPluginDesc(e.target.value)}
                rows={3}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              onClick={handleDownloadZip}
              disabled={isGenerating || selectedTweakIds.length === 0}
              className={`w-full py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
                selectedTweakIds.length === 0
                  ? "bg-zinc-850 text-zinc-600 border border-zinc-800 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20"
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Gerando ZIP...
                </>
              ) : generationSuccess ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  Plugin Baixado!
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Baixar Plugin ZIP
                </>
              )}
            </button>
            {generationSuccess && (
              <p className="text-[10px] text-green-400 text-center mt-2 animate-pulse">
                ZIP exportado com sucesso! Importe-o no AxManager.
              </p>
            )}
            {selectedTweakIds.length === 0 && (
              <p className="text-[10px] text-amber-500 text-center mt-2">
                Selecione pelo menos um ajuste no painel central.
              </p>
            )}
          </div>
        </div>

        {/* Center/Right: Tweaks Selection List */}
        <div className="xl:col-span-4 bg-zinc-950 p-5 rounded-xl border border-zinc-800/80 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-zinc-500" />
                Ajustes Inclusos ({selectedTweakIds.length})
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handleSelectAll}
                  className="text-[10px] font-mono text-blue-400 hover:underline uppercase"
                >
                  Todos
                </button>
                <span className="text-[10px] text-zinc-700">|</span>
                <button
                  onClick={handleSelectNone}
                  className="text-[10px] font-mono text-zinc-500 hover:underline uppercase"
                >
                  Nenhum
                </button>
              </div>
            </div>

            {/* Scrollable list of tweaks */}
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
              {s23UltraTweaks.map((tweak) => {
                const isSelected = selectedTweakIds.includes(tweak.id);
                return (
                  <div
                    key={tweak.id}
                    onClick={() => handleToggleTweak(tweak.id)}
                    className={`p-2.5 rounded border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? "bg-blue-600/5 border-blue-500/30 text-zinc-200"
                        : "bg-zinc-900/40 border-zinc-800/60 text-zinc-400 hover:border-zinc-800 hover:text-zinc-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="mt-0.5 pointer-events-none"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-[11px] font-semibold tracking-wide uppercase block">
                          {tweak.title}
                        </span>
                        <span className="text-[9px] font-mono px-1 bg-zinc-900 rounded border border-zinc-800 shrink-0 text-zinc-500">
                          {tweak.category}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-500 block mt-0.5 line-clamp-1 leading-relaxed">
                        {tweak.description}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800/40 rounded-lg p-2.5 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              <strong>Formato Seguro:</strong> O gerador remove automaticamente qualquer comando <code>adb shell </code> de modo que as instruções rodem nativamente na shell do AxManager sem falhas.
            </p>
          </div>
        </div>

        {/* Right Side: Manifest & Main Script Preview */}
        <div className="xl:col-span-4 bg-zinc-950 p-5 rounded-xl border border-zinc-800/80 flex flex-col h-full space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <Code className="w-4 h-4 text-zinc-500" />
              Visualização dos Arquivos
            </h3>
            <div className="flex bg-zinc-900 p-0.5 rounded border border-zinc-800">
              <button
                onClick={() => setActivePreviewTab("prop")}
                className={`px-2.5 py-1 text-[10px] font-mono uppercase rounded transition-all ${
                  activePreviewTab === "prop"
                    ? "bg-zinc-800 text-blue-400 font-semibold"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                plugin.prop
              </button>
              <button
                onClick={() => setActivePreviewTab("sh")}
                className={`px-2.5 py-1 text-[10px] font-mono uppercase rounded transition-all ${
                  activePreviewTab === "sh"
                    ? "bg-zinc-800 text-blue-400 font-semibold"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                main.sh
              </button>
            </div>
          </div>

          {activePreviewTab === "prop" ? (
            <div className="flex-1 min-h-[300px] flex flex-col">
              <span className="text-[10px] text-zinc-500 font-mono mb-1 block">Metadados de Injeção:</span>
              <pre className="flex-1 bg-zinc-900 rounded-lg p-3.5 border border-zinc-800 font-mono text-[11px] text-blue-300 overflow-auto whitespace-pre leading-relaxed select-all">
                {propContent}
              </pre>
            </div>
          ) : (
            <div className="flex-1 min-h-[300px] flex flex-col">
              <span className="text-[10px] text-zinc-500 font-mono mb-1 block">Roteiro de Comandos Rootless (Sem prefixo ADB):</span>
              <pre className="flex-1 bg-zinc-900 rounded-lg p-3.5 border border-zinc-800 font-mono text-[10px] text-zinc-300 overflow-auto whitespace-pre leading-relaxed max-h-[400px]">
                {shContent}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
