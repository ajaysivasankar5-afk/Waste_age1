import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parsing middleware - support large base64 image payloads
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Initialize Google GenAI lazy client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. Classification will use robust fallback rules.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MISSING_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Classify waste item from base64 image
app.post("/api/classify-image", async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", region = "General", userNotes = "" } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "No image data provided" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        fallback: true,
        message: "Gemini API key not configured. Using rule-based fallback.",
      });
    }

    const ai = getGenAI();

    // Clean base64 string if data URL prefix exists
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");

    const prompt = `You are an expert waste segregation and environmental recycling specialist.
Analyze this image of a discarded item or material.
The user is located in or following the guidelines for: "${region}". User notes: "${userNotes}".

Identify the exact item and classify it into ONE of these four standard categories:
1. "Recyclable" (metals, clean paper/cardboard, rigid recyclable plastics #1, #2, #5, glass bottles/jars)
2. "Organic" (food scraps, fruit/vegetable peels, coffee grounds, eggshells, yard waste, compostable plant matter)
3. "Hazardous" (batteries, electronics, CFL/fluorescent bulbs, aerosol cans, paint, motor oil, medical waste, corrosive chemicals, sharp blister packs/syringes)
4. "Landfill" (soiled food paper, dirty takeout containers, chip bags, multi-layered plastic films, styrofoam, broken ceramics, sanitary waste)

Provide structured analysis in JSON:
- itemName: precise name of the detected object (e.g., "Clear PET Water Bottle", "Banana Peel", "Alkaline AA Battery", "Greasy Pizza Box")
- category: strictly one of "Recyclable", "Organic", "Hazardous", "Landfill"
- confidence: number between 0.70 and 0.99
- material: detected material composition (e.g., "PET #1 Plastic", "Organic Biomass", "Zinc-Carbon / Alkaline Chemical Cell")
- color: HEX color code matching category ("#2563EB" for Recyclable, "#16A34A" for Organic, "#DC2626" for Hazardous, "#64748B" for Landfill)
- binName: name of the recommended disposal container (e.g., "Blue Recycling Bin", "Green Compost / Organics Bin", "Special E-Waste / Hazardous Drop-Off", "Black/Grey General Waste Bin")
- instructions: concise, step-by-step preparation and disposal instructions (e.g., "1. Empty remaining liquids. 2. Rinse lightly. 3. Squash to save space. 4. Place in blue bin.")
- tips: practical advice, contamination prevention, and municipality nuances
- contaminationWarning: crucial warning on what NOT to do (e.g., "Do not bag recyclables in black plastic bags", "Do not put batteries in general trash as they cause fires")
- environmentalImpact: positive ecological impact statement when segregated properly
- decompositionTime: estimated decomposition time if sent to landfill (e.g., "450 years", "2-4 weeks", "100+ years", "Does not biodegrade")
- preparationSteps: list of 2 to 4 interactive checkable steps for the user`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            itemName: { type: Type.STRING },
            category: { type: Type.STRING, enum: ["Recyclable", "Organic", "Hazardous", "Landfill"] },
            confidence: { type: Type.NUMBER },
            material: { type: Type.STRING },
            color: { type: Type.STRING },
            binName: { type: Type.STRING },
            instructions: { type: Type.STRING },
            tips: { type: Type.STRING },
            contaminationWarning: { type: Type.STRING },
            environmentalImpact: { type: Type.STRING },
            decompositionTime: { type: Type.STRING },
            preparationSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            "itemName",
            "category",
            "confidence",
            "material",
            "color",
            "binName",
            "instructions",
            "tips",
            "contaminationWarning",
            "environmentalImpact",
            "decompositionTime",
            "preparationSteps",
          ],
        },
      },
    });

    const responseText = response.text?.trim();
    if (!responseText) {
      throw new Error("Empty response from AI vision model");
    }

    const parsed = JSON.parse(responseText);
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("AI Image Classification Error:", error);
    return res.status(500).json({
      error: error.message || "Failed to classify image with AI",
      fallback: true,
    });
  }
});

// Classify waste item from text query
app.post("/api/classify-text", async (req: Request, res: Response) => {
  try {
    const { query, region = "General" } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Query string is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        fallback: true,
        message: "Gemini API key not configured. Using rule-based fallback.",
      });
    }

    const ai = getGenAI();

    const prompt = `You are an expert waste segregation assistant.
Classify the following waste item: "${query}".
Regional guideline: "${region}".

Categorize strictly into ONE of: "Recyclable", "Organic", "Hazardous", "Landfill".
Return JSON with itemName, category, confidence (0.85-0.99), material, color ("#2563EB" for Recyclable, "#16A34A" for Organic, "#DC2626" for Hazardous, "#64748B" for Landfill), binName, instructions, tips, contaminationWarning, environmentalImpact, decompositionTime, preparationSteps (array of strings).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            itemName: { type: Type.STRING },
            category: { type: Type.STRING, enum: ["Recyclable", "Organic", "Hazardous", "Landfill"] },
            confidence: { type: Type.NUMBER },
            material: { type: Type.STRING },
            color: { type: Type.STRING },
            binName: { type: Type.STRING },
            instructions: { type: Type.STRING },
            tips: { type: Type.STRING },
            contaminationWarning: { type: Type.STRING },
            environmentalImpact: { type: Type.STRING },
            decompositionTime: { type: Type.STRING },
            preparationSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            "itemName",
            "category",
            "confidence",
            "material",
            "color",
            "binName",
            "instructions",
            "tips",
            "contaminationWarning",
            "environmentalImpact",
            "decompositionTime",
            "preparationSteps",
          ],
        },
      },
    });

    const responseText = response.text?.trim();
    if (!responseText) {
      throw new Error("Empty response from AI text model");
    }

    const parsed = JSON.parse(responseText);
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("AI Text Classification Error:", error);
    return res.status(500).json({
      error: error.message || "Failed to classify text query",
      fallback: true,
    });
  }
});

// Vite middleware & Static asset serving
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Waste Segregation Assistant running on http://0.0.0.0:${PORT}`);
  });
}

start();
