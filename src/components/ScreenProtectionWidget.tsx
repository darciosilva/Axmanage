import React, { useState } from "react";
import { Sun, Moon, Eye, Shield, Sliders, Check, Copy, Terminal, Zap, Info } from "lucide-react";

interface ScreenProtectionWidgetProps {
  onSendToTerminal: (command: string) => void;
}

export default function ScreenProtectionWidget({ onSendToTerminal }: ScreenProtectionWidgetProps) {
  const [minHardwareBrightness, setMinHardwareBrightness] = useState<number>(50); // 0-255 scale (50 is ~20%)
  const [softwareOverlayOpacity, setSoftwareOverlayOpacity] = useState<number>(30); // 0-100% shade opacity
  const [vulkanEnabled, setVulkanEnabled] = useState<boolean>(false);
  const [copiedPreset, setCopiedPreset] = useState<string | null>(null);

  const presets = [
    {
      id: "anti_green_standard",
      name: "Brilho Seguro Standard",
      description: "Ideal para o dia a dia. Evita quedas críticas de brilho.",
      hardwareValue: 52, // ~20%
      softwareValue: 0,
      refreshRate: 120,
      command: "adb shell settings put system screen_brightness_mode 0\nadb shell settings put system screen_brightness 52\nadb shell settings put secure min_refresh_rate 120.0",
      explanation: "Fixa o brilho de hardware em ~20% onde a voltagem dos subpixels AMOLED permanece estável. Desativa o auto-brilho e trava em 120Hz para estancar o flicker.",
    },
    {
      id: "reading_night",
      name: "Leitura Noturna (Extra Dim)",
      description: "Brilho seguro + 30% de atenuação por software.",
      hardwareValue: 45, // ~17%
      softwareValue: 30,
      refreshRate: 120,
      command: "adb shell settings put system screen_brightness_mode 0\nadb shell settings put system screen_brightness 45\nadb shell settings put secure min_refresh_rate 120.0",
      explanation: "Mantém a calibração de cor estável no hardware (~17%) e simula um escurecimento noturno via sobreposição de software, garantindo cores fiéis.",
    },
    {
      id: "cinema_max",
      name: "Cinema e Jogos no Escuro",
      description: "Brilho seguro de 25% + 50% de atenuação por software.",
      hardwareValue: 64, // ~25%
      softwareValue: 50,
      refreshRate: 120,
      command: "adb shell settings put system screen_brightness_mode 0\nadb shell settings put system screen_brightness 64\nadb shell settings put secure min_refresh_rate 120.0",
      explanation: "Usa uma voltagem física super limpa (25% de brilho real) no S23 Ultra e atenua o excesso de luz via software, anulando totalmente o esverdeamento das sombras.",
    },
  ];

  const handleApplyPreset = (preset: typeof presets[0]) => {
    setMinHardwareBrightness(preset.hardwareValue);
    setSoftwareOverlayOpacity(preset.softwareValue);
    onSendToTerminal(preset.command);
  };

  const handleCopyCommand = (id: string, command: string) => {
    navigator.clipboard.writeText(command);
    setCopiedPreset(id);
    setTimeout(() => setCopiedPreset(null), 2000);
  };

  const generatedCustomCommand = `adb shell settings put system screen_brightness_mode 0\nadb shell settings put system screen_brightness ${minHardwareBrightness}\nadb shell settings put secure min_refresh_rate 120.0`;

  const handleApplyCustom = () => {
    onSendToTerminal(generatedCustomCommand);
  };

  const handleToggleVulkan = () => {
    const nextState = !vulkanEnabled;
    setVulkanEnabled(nextState);
    if (nextState) {
      onSendToTerminal(
        "adb shell setprop debug.hwui.renderer vulkan\nadb shell setprop debug.renderengine.backend vulkan"
      );
    } else {
      onSendToTerminal(
        "adb shell setprop debug.hwui.renderer opengl\nadb shell setprop debug.renderengine.backend opengl"
      );
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6" id="screen-protection-panel">
      <div>
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-100 flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-400" />
            Proteção S23 Ultra: Prevenção de Tela Verde & VUCAN
          </h2>
          <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-mono">
            ANTI-DEFEITO AMOLED
          </span>
        </div>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
          Telas Dynamic AMOLED 2X operando em 120Hz podem apresentar tons esverdeados ou cintilação em baixo brilho de hardware. 
          O segredo é travar o brilho físico do display em uma voltagem estável e reduzir a luz de forma virtual (por software).
        </p>
      </div>

      {/* Simulator Display Screen representing the S23 screen behavior */}
      <div className="relative h-44 bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden flex flex-col justify-between p-4 shadow-inner">
        {/* Dynamic Software Overlay representing active screen shade protection */}
        <div 
          className="absolute inset-0 bg-black pointer-events-none transition-all duration-300"
          style={{ opacity: softwareOverlayOpacity / 100 }}
        />

        {/* Green tint simulator representation if hardware brightness is low and software shading is off */}
        {minHardwareBrightness < 35 && softwareOverlayOpacity === 0 && (
          <div className="absolute inset-0 bg-emerald-500/15 pointer-events-none animate-pulse flex items-center justify-center">
            <span className="text-[10px] font-mono text-emerald-400 bg-zinc-950/90 px-2 py-1 rounded border border-emerald-500/20">
              ⚠️ Risco de Tela Verde Detectado (Brilho Físico Muito Baixo!)
            </span>
          </div>
        )}

        <div className="flex items-center justify-between z-10">
          <span className="text-[10px] font-mono text-zinc-500">SIMULAÇÃO DE TELA DO S23</span>
          <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
            120Hz Constantes
          </span>
        </div>

        <div className="z-10 text-center py-2">
          <div className="text-2xl font-light tracking-wider text-zinc-100">
            {minHardwareBrightness < 35 && softwareOverlayOpacity === 0 ? "Exibição Cintilante" : "Exibição Estável e Calibrada"}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            Brilho Físico: <strong className="text-white">{Math.round((minHardwareBrightness/255)*100)}%</strong> • Redução por Software: <strong className="text-blue-400">{softwareOverlayOpacity}%</strong>
          </p>
        </div>

        <div className="flex items-center justify-between z-10 text-[10px] text-zinc-500 font-mono">
          <span>{vulkanEnabled ? "API GRÁFICA: VULKAN (VUCAN)" : "API GRÁFICA: OPENGL ES"}</span>
          <span>S23_ULTRA_DISPLAY</span>
        </div>
      </div>

      {/* Vulkan Toggle Card */}
      <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className={`w-4 h-4 ${vulkanEnabled ? 'text-blue-400' : 'text-zinc-500'}`} />
            Forçar Renderização Vulkan (VUCAN)
          </h3>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Habilita as APIs Vulkan para desenhar a interface, reduzindo o uso de CPU e superaquecimento.
          </p>
        </div>
        <button
          onClick={handleToggleVulkan}
          className={`px-4 py-2 text-xs font-bold rounded-md uppercase tracking-wider transition-all cursor-pointer ${
            vulkanEnabled 
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
              : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          {vulkanEnabled ? "ATIVO" : "INATIVO"}
        </button>
      </div>

      {/* Preset Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Presets Anti-Tela Verde (Baixo Brilho)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {presets.map((preset) => (
            <div 
              key={preset.id}
              className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-700 transition-all"
            >
              <div>
                <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">{preset.name}</h4>
                <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">{preset.description}</p>
                <div className="mt-3 bg-zinc-900/40 p-2 rounded text-[10px] text-zinc-500 font-mono space-y-1">
                  <div>Brilho Físico: {Math.round((preset.hardwareValue/255)*100)}%</div>
                  <div>Shade Software: {preset.softwareValue}%</div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleApplyPreset(preset)}
                  className="flex-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Simular
                </button>
                <button
                  onClick={() => handleCopyCommand(preset.id, preset.command)}
                  className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-2 rounded transition-all cursor-pointer text-zinc-400 hover:text-zinc-200"
                  title="Copiar comandos ADB"
                >
                  {copiedPreset === preset.id ? (
                    <Check className="w-3.5 h-3.5 text-blue-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Protection Designer */}
      <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
          Ajuste Fino de Brilho Seguro e Shade Virtual
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-zinc-400 font-medium">Brilho de Hardware Mínimo (display)</span>
              <span className="text-[11px] font-mono text-zinc-200">{Math.round((minHardwareBrightness/255)*100)}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="150" 
              value={minHardwareBrightness}
              onChange={(e) => setMinHardwareBrightness(Number(e.target.value))}
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <p className="text-[10px] text-zinc-500">
              Valores abaixo de 15% (38) podem disparar desvios de calibração AMOLED na One UI.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-zinc-400 font-medium">Filtro de Escurecimento por Software (Shade)</span>
              <span className="text-[11px] font-mono text-zinc-200">{softwareOverlayOpacity}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="90" 
              value={softwareOverlayOpacity}
              onChange={(e) => setSoftwareOverlayOpacity(Number(e.target.value))}
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <p className="text-[10px] text-zinc-500">
              Simula atenuação por software (através de apps adicionais como Extra Dim nativo ou filtros).
            </p>
          </div>
        </div>

        {/* Generated Custom Command Display */}
        <div className="pt-2 border-t border-zinc-900 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Comando ADB Customizado</span>
            <button
              onClick={() => handleCopyCommand("custom", generatedCustomCommand)}
              className="text-[10px] font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              {copiedPreset === "custom" ? "Copiado!" : "Copiar"}
            </button>
          </div>
          <div className="bg-zinc-900 rounded p-2.5 font-mono text-[11px] text-zinc-300 border border-zinc-800 overflow-x-auto whitespace-pre">
            {generatedCustomCommand}
          </div>
          <button
            onClick={handleApplyCustom}
            className="w-full bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Terminal className="w-3.5 h-3.5" />
            Simular Customizado no Console
          </button>
        </div>
      </div>

      {/* Informative advice on software dimming apps */}
      <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 flex gap-3">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-400 leading-relaxed">
          <strong className="text-zinc-200 block mb-0.5">Dica de Ouro do AxManager:</strong>
          Para usar o escurecimento por software no seu S23 Ultra real, ative o recurso nativo da One UI chamado <strong>"Extra Dim" (Ajuste Extra de Brilho)</strong> nas configurações de Acessibilidade, ou utilize aplicativos de filtro de tela na Play Store. Isso bloqueia a voltagem estável da tela e evita a cintilação do verde!
        </div>
      </div>
    </div>
  );
}
