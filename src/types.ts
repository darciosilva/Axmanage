export interface Tweak {
  id: string;
  title: string;
  description: string;
  category: "refresh_rate" | "debloat" | "performance" | "battery" | "audio" | "axmanager" | "camera" | "screen_protection" | "vulkan";
  command: string;
  explanation: string;
  impact: {
    performance?: number; // 1 to 5
    battery?: number;     // 1 to 5
    safety: "Alto" | "Médio" | "Crítico";
  };
  s23Specific: boolean;
}

export interface BugItem {
  line: string | number;
  issue: string;
  severity: "alta" | "media" | "baixa";
  fix: string;
}

export interface AnalysisResult {
  isCompatibleWithoutRoot: boolean;
  compatibilityWarnings: string[];
  detectedBugs: BugItem[];
  s23UltraSpecificOptimizations: string[];
  generalAnalysis: string;
  optimizedScript: string;
}

export interface TerminalLog {
  type: "input" | "output" | "error" | "success";
  text: string;
  timestamp: string;
}
