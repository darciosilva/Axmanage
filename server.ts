import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header as required by guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Server-side API endpoint for analyzing S23 Ultra / AxManager scripts
app.post("/api/analyze-script", async (req, res) => {
  try {
    const { script, context } = req.body;

    if (!script) {
      return res.status(400).json({ error: "O código ou script é obrigatório para análise." });
    }

    const systemInstruction = `Você é um Engenheiro de Sistemas Android especializado na otimização de dispositivos Samsung (com foco no Galaxy S23 Ultra - Snapdragon 8 Gen 2 for Galaxy) e modificações sem root (utilizando ADB, Shizuku, LADB, App Manager, MT Manager ou AxManager para pacotes rootless).
Seu objetivo é auditar, otimizar e corrigir o script ou comandos enviados pelo usuário.

Analise detalhadamente o código fornecido com base nas seguintes diretrizes:
1. **Compatibilidade Rootless (Sem Root)**: Verifique se o script tenta usar privilégios de superusuário ('su', montagem de partição rw, alteração direta em /system ou /data que necessitam de root). Se encontrar, aponte esses comandos e sugira alternativas via Shizuku/ADB Shell (usando 'settings put', 'cmd', 'pm' ou 'wm' que funcionam sem root).
2. **Especificidades do Galaxy S23 Ultra**: O dispositivo possui processador Snapdragon 8 Gen 2, tela Dynamic AMOLED 2X de 120Hz (com VRR inteligente de 1Hz a 120Hz), 8/12GB de RAM e bateria de 5000mAh. Avalie se as otimizações propostas fazem sentido para este hardware específico ou se são ineficazes/antigas.
3. **Otimizações do AxManager (Plugins, etc.)**: Se o script for relacionado a patches ou configurações do AxManager, garanta que os parâmetros de cache, verificação de assinaturas (signature verification bypass) ou otimizações de recursos estejam corretos para o S23 Ultra.
4. **Erros, Bugs e Falhas de Segurança**: Identifique erros de sintaxe (como aspas não fechadas, loops infinitos, comandos ADB com parâmetros incorretos) e falhas que podem causar bootloops ou instabilidade (ex: remover pacotes de sistema essenciais como Knox Guard de forma que cause falha de boot).
5. **Versão Otimizada**: Forneça uma versão corrigida, segura, comentada e 100% compatível com o cenário sem root no S23 Ultra.

Responda em formato JSON estruturado com os seguintes campos:
- "isCompatibleWithoutRoot": boolean
- "compatibilityWarnings": array de strings (detalhando o que requer root e o que não requer)
- "detectedBugs": array de objetos contendo { "line": string/number, "issue": string, "severity": "alta"|"media"|"baixa", "fix": string }
- "s23UltraSpecificOptimizations": array de strings (como melhorar o desempenho/bateria no S23 Ultra especificamente)
- "generalAnalysis": string (resumo geral em Markdown)
- "optimizedScript": string (o código totalmente corrigido e otimizado com comentários úteis)

Retorne APENAS o JSON válido. Não coloque blocos de código markdown adicionais fora do JSON.`;

    const userPrompt = `Analise o seguinte script/código:
\`\`\`
${script}
\`\`\`

Contexto adicional fornecido pelo usuário:
${context || "Nenhum contexto adicional fornecido."}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Não foi possível obter resposta do Gemini.");
    }

    // Attempt to parse the JSON to ensure validity
    const jsonResult = JSON.parse(resultText.trim());
    res.json(jsonResult);
  } catch (error: any) {
    console.error("Erro na análise do script:", error);
    res.status(500).json({
      error: "Ocorreu um erro ao processar a análise do script. Certifique-se de que o código seja válido.",
      details: error?.message || error,
    });
  }
});

// Configure Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
