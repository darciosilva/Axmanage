import React, { useState } from "react";
import { s23UltraTweaks } from "../data";
import { Tweak } from "../types";
import { Cpu, Battery, Sliders, Volume2, ShieldAlert, Check, Copy, Terminal, Search, Info, Camera, ShieldCheck, Zap, Eye, Tv } from "lucide-react";

interface TweakCatalogProps {
  onSendToTerminal: (command: string) => void;
}

export default function TweakCatalog({ onSendToTerminal }: TweakCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: "all", name: "Todos", icon: Sliders },
    { id: "refresh_rate", name: "Tela & VRR", icon: Tv },
    { id: "performance", name: "Desempenho", icon: Cpu },
    { id: "vulkan", name: "Aceleração Gráfica", icon: Zap },
    { id: "camera", name: "Câmera & Shutter", icon: Camera },
    { id: "audio", name: "Áudio & Dolby", icon: Volume2 },
    { id: "screen_protection", name: "Proteção AMOLED", icon: Eye },
    { id: "axmanager", name: "AxManager", icon: ShieldCheck },
    { id: "debloat", name: "Debloat", icon: Sliders },
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredTweaks = s23UltraTweaks.filter((tweak) => {
    const matchesCategory = selectedCategory === "all" || tweak.category === selectedCategory;
    const matchesSearch =
      tweak.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tweak.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tweak.command.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl" id="tweak-catalog-panel">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-100 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-400" />
            Catálogo de Tweaks e Otimizações Sem Root
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Comandos testados e validados para o Snapdragon 8 Gen 2 do S23 Ultra e integrações do AxManager.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar otimizações..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Categories Horizontal Scroller */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-5 scrollbar-thin scrollbar-thumb-zinc-800">
        {categories.map((cat) => {
          const IconComponent = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/30"
                  : "bg-zinc-950 text-zinc-500 border border-zinc-800/60 hover:text-zinc-200 hover:border-zinc-700"
              }`}
            >
              <IconComponent className="w-3.5 h-3.5" />
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Tweaks Grid */}
      {filteredTweaks.length === 0 ? (
        <div className="text-center py-12 bg-zinc-950 border border-zinc-800 rounded-xl">
          <p className="text-zinc-400 text-xs">Nenhuma otimização encontrada para os critérios selecionados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTweaks.map((tweak) => (
            <div
              key={tweak.id}
              className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-700/80 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400">
                      {tweak.category.toUpperCase()}
                    </span>
                    {tweak.s23Specific && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        S23 ULTRA ONLY
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert className={`w-3.5 h-3.5 ${tweak.impact.safety === 'Alto' ? 'text-blue-400' : 'text-amber-400'}`} />
                    <span className={`text-[10px] font-mono uppercase ${tweak.impact.safety === 'Alto' ? 'text-blue-400' : 'text-amber-400'}`}>
                      {tweak.impact.safety}
                    </span>
                  </div>
                </div>

                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-100">{tweak.title}</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{tweak.description}</p>

                {/* Explanatory Dropdown/Section */}
                <div className="mt-3 bg-zinc-900/60 border border-zinc-800/40 rounded-lg p-2.5 flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-zinc-400 leading-relaxed">{tweak.explanation}</p>
                </div>

                {/* Metrics Meters */}
                <div className="flex items-center gap-4 mt-3 pb-3 border-b border-zinc-900">
                  {tweak.impact.performance !== undefined && (
                    <div className="flex items-center gap-1.5 w-1/2">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest whitespace-nowrap">Perf:</span>
                      <div className="flex gap-0.5 w-full max-w-[60px]">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <div
                            key={val}
                            className={`h-1.5 w-2 rounded-sm ${
                              val <= (tweak.impact.performance || 0) ? "bg-blue-500" : "bg-zinc-800"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {tweak.impact.battery !== undefined && (
                    <div className="flex items-center gap-1.5 w-1/2">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest whitespace-nowrap">Bat:</span>
                      <div className="flex gap-0.5 w-full max-w-[60px]">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <div
                            key={val}
                            className={`h-1.5 w-2 rounded-sm ${
                              val <= (tweak.impact.battery || 0) ? "bg-amber-500" : "bg-zinc-800"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Command and Actions */}
              <div className="mt-4">
                <div className="bg-zinc-900 rounded-lg p-3 font-mono text-[11px] text-zinc-300 relative border border-zinc-800 overflow-x-auto whitespace-pre">
                  {tweak.command}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleCopy(tweak.id, tweak.command)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 text-zinc-300 rounded-lg py-1.5 text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all"
                  >
                    {copiedId === tweak.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-blue-400" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copiar ADB
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => onSendToTerminal(tweak.command)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 hover:border-blue-500/30 rounded-lg py-1.5 text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    Simular
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
