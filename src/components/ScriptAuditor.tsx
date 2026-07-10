import React, { useState } from "react";
import { AnalysisResult, BugItem } from "../types";
import { Code2, Play, Sparkles, Check, AlertTriangle, AlertCircle, Copy, HelpCircle, FileText } from "lucide-react";

interface ScriptAuditorProps {
  onSendToTerminal: (command: string) => void;
}

export default function ScriptAuditor({ onSendToTerminal }: ScriptAuditorProps) {
  const [script, setScript] = useState<string>(
    `# Módulo de Customização para Galaxy S23 Ultra - Rootless\n# AxManager & Performance Unlocker\n\n# Ativando alta taxa de quadros\nsu -c "settings put secure peak_refresh_rate 120.0"\nsu -c "settings put secure min_refresh_rate 120.0"\n\n# Ajustar DPI de tela\nwm density 411\n\n# Otimização de RAM no Snapdragon 8 Gen 2\necho "0" > /sys/block/zram0/disksize\n\n# Configurações do AxManager Plugins\nsettings put global install_non_market_apps 1\n\n# Desabilitar telemetria redundante\npm disable-user --user 0 com.samsung.android.rubin.app\npm disable-user com.sec.android.app.billing`
  );
  const [context, setContext] = useState<string>(
    "Quero garantir que o script funcione perfeitamente sem acesso root, corrija as falhas de comandos incorretos e aplique o máximo de desempenho para o S23 Ultra com AxManager."
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedOriginal, setCopiedOriginal] = useState<boolean>(false);
  const [copiedOptimized, setCopiedOptimized] = useState<boolean>(false);

  const handleAnalyze = async () => {
    if (!script.trim()) {
      setError("Por favor, insira o código ou comandos a serem analisados.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze-script", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          script,
          context,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao analisar o script.");
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Ocorreu um erro ao conectar ao servidor de análise de Inteligência Artificial.");
    } finally {
      setLoading(false);
    }
  };

  const loadSampleScript = () => {
    setScript(
      `# Script de Ajuste de Bateria e Dolby\nsu\n# Ativa Dolby de música\nsettings put system dolby_effect_mode 1\n\n# Tenta forçar limitação de bateria térmica\nwrite /sys/class/power_supply/battery/charging_enabled 1\n\n# Desabilitar Knox Geofencing\npm disable-user --user 0 com.samsung.android.ipsgeofence`
    );
    setContext("Ajustar para rodar de forma limpa pelo LADB/Shizuku no meu Galaxy S23 Ultra, sem causar bootloop.");
    setResult(null);
  };

  const copyText = (text: string, setCopied: React.Dispatch<React.SetStateAction<boolean>>) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl" id="script-auditor-panel">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            Auditor de Scripts de Customização (AI)
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Insira seus comandos shell, módulos ou patches. A IA irá auditar compatibilidade rootless, bugs e falhas.
          </p>
        </div>

        <button
          onClick={loadSampleScript}
          className="text-xs text-blue-400 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 px-4 py-2 rounded-md font-semibold uppercase tracking-wider transition-all cursor-pointer self-start sm:self-auto"
        >
          Carregar Exemplo
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Inputs Panel */}
        <div className="xl:col-span-5 flex flex-col gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-blue-400" />
              Código / Script a Analisar
            </label>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Cole aqui seu script ou conjunto de comandos ADB/Shizuku..."
              rows={12}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors resize-y leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-400" />
              Contexto ou Objetivo (Opcional)
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Ex: Quero rodar pelo Shizuku, remover Knox, liberar 120Hz para o S23 Ultra sem root..."
              rows={3}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors resize-none leading-relaxed"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-lg py-2.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-600/10"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analisando com IA...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analisar Código & Corrigir
              </>
            )}
          </button>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 flex items-start gap-2.5 text-xs text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="xl:col-span-7 bg-zinc-950 border border-zinc-800 rounded-xl p-5 flex flex-col min-h-[400px]">
          {!result && !loading && (
            <div className="flex flex-col items-center justify-center m-auto text-center p-6">
              <Code2 className="w-12 h-12 text-zinc-800 mb-3" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Aguardando Análise</h3>
              <p className="text-xs text-zinc-500 mt-1.5 max-w-sm">
                Insira o código do seu módulo ou tweaks ao lado e clique em "Analisar Código" para obter um relatório completo de bugs, segurança e otimizações de sistema.
              </p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center m-auto text-center p-6">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-400 animate-pulse">Relatório em processamento...</h3>
              <p className="text-xs text-zinc-500 mt-1.5 max-w-xs leading-relaxed">
                O Gemini está analisando permissões ADB, flags de telemetria da One UI, compatibilidade de hardware do Snapdragon 8 Gen 2 e configurações do AxManager.
              </p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-5 animate-fade-in text-zinc-200">
              {/* Verdict Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900 border border-zinc-800/60 rounded-lg p-4">
                <div>
                  <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Veredito Sem Root</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {result.isCompatibleWithoutRoot ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <Check className="w-3.5 h-3.5" />
                        Compatível Sem Root
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Requer Correção / Root
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-xs">
                  <span className="text-zinc-500 uppercase tracking-wider font-semibold">Erros:</span>{" "}
                  <span className={`font-mono font-bold ${result.detectedBugs.length > 0 ? "text-amber-400" : "text-blue-400"}`}>
                    {result.detectedBugs.length}
                  </span>
                </div>
              </div>

              {/* Compatibility Warnings */}
              {result.compatibilityWarnings.length > 0 && (
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
                  <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    Barreiras de Root Identificadas
                  </h4>
                  <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1 leading-relaxed">
                    {result.compatibilityWarnings.map((warn, idx) => (
                      <li key={idx}>{warn}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Bugs List */}
              {result.detectedBugs.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Falhas no Sistema & Sintaxe</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {result.detectedBugs.map((bug, idx) => (
                      <div key={idx} className="bg-zinc-900 border-l-2 border-rose-500 rounded-r-lg p-3 text-xs">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-mono font-semibold text-rose-400">
                            {bug.line ? `Linha: ${bug.line}` : "Falha Geral"}
                          </span>
                          <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                            bug.severity === "alta" ? "bg-rose-500/20 text-rose-400" : "bg-amber-500/20 text-amber-400"
                          }`}>
                            {bug.severity}
                          </span>
                        </div>
                        <p className="text-zinc-300 font-medium mb-1">{bug.issue}</p>
                        <p className="text-xs text-zinc-400"><strong className="text-blue-400 uppercase tracking-wider text-[10px] mr-1">Fix:</strong> {bug.fix}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* S23 Specific Optimizations */}
              {result.s23UltraSpecificOptimizations.length > 0 && (
                <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-4">
                  <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-4 h-4" />
                    Ajustes de Desempenho S23 Ultra
                  </h4>
                  <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1 leading-relaxed">
                    {result.s23UltraSpecificOptimizations.map((opt, idx) => (
                      <li key={idx}>{opt}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* General Analysis */}
              <div className="text-xs text-zinc-300 leading-relaxed border-t border-zinc-850 pt-3">
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Visão Geral da IA</h4>
                <div className="whitespace-pre-wrap bg-zinc-900/40 p-3 rounded-lg border border-zinc-800 text-zinc-400 leading-relaxed">
                  {result.generalAnalysis}
                </div>
              </div>

              {/* Optimized Script Section */}
              <div className="border-t border-zinc-800 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Módulo Seguro & Otimizado (Rootless)</h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyText(result.optimizedScript, setCopiedOptimized)}
                      className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                    >
                      {copiedOptimized ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-blue-400" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copiar Código
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => onSendToTerminal(result.optimizedScript)}
                      className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 text-blue-400 hover:text-blue-300 cursor-pointer bg-blue-600/10 px-2 py-1 rounded border border-blue-500/20"
                    >
                      <Play className="w-3 h-3" />
                      Testar
                    </button>
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3.5 font-mono text-[11px] text-zinc-300 max-h-60 overflow-y-auto whitespace-pre leading-relaxed">
                  {result.optimizedScript}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
