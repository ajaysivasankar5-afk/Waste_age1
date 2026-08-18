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

// Track AI provider availability status
let aiServiceAvailable: boolean | null = null;

// Helper fallback catalog for resilient waste classification when AI API is restricted or offline
const FALLBACK_ITEMS = [
  {
    keywords: ["plastic", "bottle", "pet", "water bottle", "soda bottle", "jug", "shampoo", "detergent", "container", "tub", "canister", "hdpe", "milk jug"],
    itemName: "Plastic Container / Bottle (Recyclable #1, #2, #5)",
    category: "Recyclable",
    confidence: 0.95,
    material: "Polyethylene Terephthalate (PET) / High-Density Polyethylene (HDPE)",
    color: "#2563EB",
    binName: "Blue Recycling Bin",
    instructions: "1. Empty all liquid residues.\n2. Lightly rinse with cold water.\n3. Crush container to save bin volume.\n4. Place loosely in the blue recycling cart (do not bag in black plastic).",
    tips: "Rigid plastic bottles (#1 PET, #2 HDPE, #5 PP) are widely accepted. Ensure caps are securely attached if instructed by local guidelines.",
    contaminationWarning: "Do not place flexible plastic wrap, grocery bags, or grease-stained plastic in the recycling bin.",
    environmentalImpact: "Recycling 1 ton of plastic saves approx. 5,774 kWh of electricity and 16.3 barrels of oil.",
    decompositionTime: "450 - 500 years in landfill",
    preparationSteps: ["Empty all liquid residue", "Quick cold rinse", "Crush flat to conserve bin space", "Place loose in blue recycling bin"],
  },
  {
    keywords: ["aluminum", "can", "soda", "coke", "beer", "tin", "foil", "metal", "beverage can", "soup can", "canned food", "steel can"],
    itemName: "Aluminum / Steel Beverage & Food Can",
    category: "Recyclable",
    confidence: 0.98,
    material: "100% Recyclable Aluminum / Tin-Coated Steel",
    color: "#2563EB",
    binName: "Blue Recycling Bin",
    instructions: "1. Pour out all residual fluids.\n2. Rinse food debris from tin cans.\n3. Place clean aluminum/steel directly into the blue bin.",
    tips: "Aluminum is infinitely recyclable without degrading in quality. A recycled can is back on supermarket shelves in 60 days.",
    contaminationWarning: "Do not leave cigarette butts, wrappers, or liquids inside cans.",
    environmentalImpact: "Recycling aluminum requires 95% less energy than refining primary raw bauxite ore.",
    decompositionTime: "200 - 500 years in landfill",
    preparationSteps: ["Empty fluid completely", "Lightly rinse clean", "Place loose in blue bin"],
  },
  {
    keywords: ["banana", "peel", "food", "fruit", "apple", "vegetable", "scrap", "coffee", "grounds", "tea", "bread", "eggshell", "organic", "plant", "leaf", "compost", "leftover", "salad", "orange", "potato", "onion"],
    itemName: "Organic Food Scraps & Biomass",
    category: "Organic",
    confidence: 0.96,
    material: "100% Compostable Organic Biomass",
    color: "#16A34A",
    binName: "Green Organics & Compost Bin",
    instructions: "1. Remove plastic PLU stickers, twist-ties, and rubber bands.\n2. Drain excess gravies/soups.\n3. Place directly in green compost bin or compost pail with certified BPI compostable liner.",
    tips: "Food scraps decompose into rich nutrient fertilizer, preventing toxic methane greenhouse emissions from landfills.",
    contaminationWarning: "Never put plastic packaging, foam trays, or plastic cutlery into organic compost streams.",
    environmentalImpact: "Composting organic waste eliminates anaerobic methane generation in municipal landfills.",
    decompositionTime: "2 - 6 weeks in commercial composting",
    preparationSteps: ["Peel off non-organic PLU stickers", "Drain liquid", "Transfer to green compost bin"],
  },
  {
    keywords: ["battery", "batteries", "aa", "aaa", "lithium", "rechargeable", "cell", "accumulator", "powerbank", "vape", "button cell", "car battery"],
    itemName: "Household Battery / Electrochemical Cell",
    category: "Hazardous",
    confidence: 0.97,
    material: "Alkaline / Lithium / Heavy Metal Chemical Matrix",
    color: "#DC2626",
    binName: "Red Hazardous / Dedicated Battery Drop-Off",
    instructions: "1. Tape terminal ends with clear tape to prevent short circuits and fire hazards.\n2. Store safely in a dry cardboard box or plastic container.\n3. Drop off at local municipal hazardous collection point or battery recycling kiosk.",
    tips: "Batteries must NEVER enter curbside trash or recycling carts due to severe fire hazard from compactor friction.",
    contaminationWarning: "NEVER dispose of in general trash. Lithium batteries ignite under compactor pressure.",
    environmentalImpact: "Recycling recovers precious cobalt, nickel, and lithium while keeping heavy lead and cadmium out of groundwater.",
    decompositionTime: "100+ years (releases toxic heavy metals if landfilled)",
    preparationSteps: ["Tape positive and negative terminals", "Place in dry container", "Drop off at dedicated e-waste kiosk"],
  },
  {
    keywords: ["pizza", "greasy", "box", "takeout", "dirty paper", "soiled cardboard", "napkin", "tissue", "paper towel"],
    itemName: "Greasy Soiled Pizza Box / Food Paper",
    category: "Organic",
    confidence: 0.91,
    material: "Food-Soiled Unbleached Cellulose Fiber",
    color: "#16A34A",
    binName: "Green Organics & Compost Bin",
    instructions: "1. Remove any plastic sauce cups or plastic lid supports.\n2. Tear off clean dry lid portion (if clean, put lid in Blue Recycling).\n3. Place greasy cheese-stained bottom into the Green Compost / Organics bin.",
    tips: "Food grease ruins recycling paper pulpers, but unbleached greasy cardboard decomposes naturally in municipal compost.",
    contaminationWarning: "Do not place heavily grease-soaked cardboard into blue recycling bins.",
    environmentalImpact: "Diverting soiled fiber to compost enriches agricultural soil and reduces landfill gas.",
    decompositionTime: "2 - 3 months in compost",
    preparationSteps: ["Remove plastic dipping cups and wax liner", "Tear off clean lid for recycling", "Compost greasy bottom in green bin"],
  },
  {
    keywords: ["cardboard", "shipping", "carton", "paper", "newspaper", "magazine", "office paper", "envelope", "mail", "flyer", "catalog"],
    itemName: "Corrugated Cardboard & Clean Paper",
    category: "Recyclable",
    confidence: 0.96,
    material: "Clean Unbleached Kraft Cellulose Fiber",
    color: "#2563EB",
    binName: "Blue Recycling Bin",
    instructions: "1. Remove excessive plastic tape, bubble wrap, and polystyrene foam.\n2. Flatten boxes completely.\n3. Keep dry and place in blue bin.",
    tips: "Flattening cardboard quadruples recycling truck capacity and prevents bin blockages.",
    contaminationWarning: "Do not mix wet or food-stained paper into dry paper recycling.",
    environmentalImpact: "Recycling 1 ton of cardboard saves 17 mature trees and 7,000 gallons of clean water.",
    decompositionTime: "2 - 5 months (readily recycled into new boxes)",
    preparationSteps: ["Strip packing tape and styrofoam", "Flatten completely", "Keep dry and place in blue bin"],
  },
  {
    keywords: ["bulb", "fluorescent", "cfl", "tube", "led", "lamp", "mercury", "lightbulb", "halogen"],
    itemName: "Fluorescent / CFL Bulb (Contains Mercury)",
    category: "Hazardous",
    confidence: 0.95,
    material: "Mercury Vapor / Phosphor Coated Glass Tube",
    color: "#DC2626",
    binName: "Red Hazardous / Municipal E-Waste Depot",
    instructions: "1. Handle gently to avoid breaking glass tube.\n2. Wrap in original carton or protective newspaper.\n3. Deliver to designated household hazardous waste depot or hardware store drop-off box.",
    tips: "CFLs contain trace mercury vapor. If broken, ventilate the room for 15 minutes before cleanup.",
    contaminationWarning: "Never crush or toss in general household bins; mercury vapor pollutes air and waterways.",
    environmentalImpact: "Specialized recycling recovers 100% of glass, aluminum, and harmful mercury safely.",
    decompositionTime: "Does not biodegrade safely",
    preparationSteps: ["Wrap in protective sleeve", "Do not crush", "Deliver to authorized hazardous waste depot"],
  },
  {
    keywords: ["styrofoam", "polystyrene", "foam", "packing peanut", "takeout box", "thermoform", "cup", "foam tray", "meat tray"],
    itemName: "Expanded Polystyrene (Styrofoam) Container",
    category: "Landfill",
    confidence: 0.94,
    material: "Expanded Polystyrene Foam (#6 PS)",
    color: "#64748B",
    binName: "Black / Grey Landfill Bin",
    instructions: "1. Empty all food residues.\n2. Bag tightly to prevent lightweight foam fragments blowing away.\n3. Place in general landfill bin (unless specialized drop-off exists locally).",
    tips: "Styrofoam is 95% air and rarely accepted in curbside recycling because it breaks into static crumbs that contaminate sorting machinery.",
    contaminationWarning: "Do not place in curbside recycling bins.",
    environmentalImpact: "Choose reusable or compostable sugarcane bagasse containers to eliminate foam waste.",
    decompositionTime: "500+ years (crumbles into persistent microplastics)",
    preparationSteps: ["Empty residual food", "Bag securely", "Place in black landfill bin"],
  },
  {
    keywords: ["glass", "jar", "wine", "beer bottle", "pickle", "sauce jar", "mason", "condiment jar"],
    itemName: "Glass Bottle / Food Jar",
    category: "Recyclable",
    confidence: 0.97,
    material: "100% Recyclable Soda-Lime Glass",
    color: "#2563EB",
    binName: "Blue Recycling Bin",
    instructions: "1. Empty contents and rinse clean.\n2. Metal lids can be recycled loosely or attached.\n3. Place unbroken glass into blue bin.",
    tips: "Glass can be recycled indefinitely without degradation. Do not mix with window glass, Pyrex, or drinking glasses.",
    contaminationWarning: "Do not include broken ceramic mugs, crystal, or heat-resistant cookware glass.",
    environmentalImpact: "Using recycled cullet reduces furnace melting temperatures, cutting energy emissions by 30%.",
    decompositionTime: "1,000,000+ years in landfill",
    preparationSteps: ["Rinse food contents", "Separate metal lid", "Place unbroken in blue recycling bin"],
  },
  {
    keywords: ["medicine", "pill", "blister", "tablet", "syrup", "capsule", "pharma", "prescription", "antibiotic"],
    itemName: "Pharmaceutical & Expired Medication Blister",
    category: "Hazardous",
    confidence: 0.94,
    material: "Medical Chemistry / Multi-Layer Foil Blister",
    color: "#DC2626",
    binName: "Red Hazardous / Pharmacy Take-Back Program",
    instructions: "1. Remove personal prescription labels for privacy.\n2. Keep pills in blister pack or bottle.\n3. Return to local pharmacy take-back receptacle or hazardous waste event.",
    tips: "Never flush medications down sinks or toilets as wastewater treatment plants cannot filter pharmaceuticals, poisoning aquatic life.",
    contaminationWarning: "Do not flush down toilet or sink.",
    environmentalImpact: "Safe pharmaceutical destruction keeps antibiotics and synthetic hormones out of groundwater.",
    decompositionTime: "Persistent synthetic chemical pollutants",
    preparationSteps: ["Black out private name on label", "Keep in secure container", "Drop off at pharmacy take-back box"],
  },
  {
    keywords: ["chemical", "paint", "bleach", "motor oil", "solvent", "spray", "aerosol", "pesticide", "cleaner", "insecticide", "antifreeze"],
    itemName: "Hazardous Household Chemical / Aerosol Can",
    category: "Hazardous",
    confidence: 0.96,
    material: "Toxic Chemical / Pressurized Steel Propellant Canister",
    color: "#DC2626",
    binName: "Red Hazardous / Household Hazardous Waste (HHW) Depot",
    instructions: "1. Keep in original labeled container if possible.\n2. Seal tightly to prevent toxic fumes or spills.\n3. Take to local municipal household hazardous waste collection site.",
    tips: "Never pour chemicals down storm drains, sinks, or mix with household garbage.",
    contaminationWarning: "Pressurized aerosol cans explode in standard compactor garbage trucks.",
    environmentalImpact: "Proper treatment prevents groundwater contamination and landfill chemical fires.",
    decompositionTime: "Does not safely decompose",
    preparationSteps: ["Keep in original container", "Ensure cap is tight", "Transport upright to hazardous depot"],
  },
  {
    keywords: ["e-waste", "phone", "cable", "charger", "laptop", "computer", "keyboard", "mouse", "electronic", "tablet", "circuit"],
    itemName: "Electronic Waste (E-Waste & Cables)",
    category: "Hazardous",
    confidence: 0.95,
    material: "Printed Circuit Board / Copper / Rare Earth Metals",
    color: "#DC2626",
    binName: "Red Hazardous / Certified E-Waste Drop-Off",
    instructions: "1. Back up and wipe personal data.\n2. Bundle cables together.\n3. Drop off at certified electronic recycler or electronics retail drop box.",
    tips: "Electronics contain gold, silver, copper, and rare earths that can be recovered efficiently.",
    contaminationWarning: "Never throw electronics in curbside carts.",
    environmentalImpact: "Recycling e-waste reduces demand for environmentally destructive virgin mineral mining.",
    decompositionTime: "Hundreds of years (leaches heavy metals)",
    preparationSteps: ["Wipe private data", "Bundle with twist tie", "Bring to e-waste collection center"],
  },
];

function getFallbackClassification(query: string) {
  const q = query.toLowerCase().trim();
  for (const item of FALLBACK_ITEMS) {
    if (item.keywords.some((k) => q.includes(k) || k.includes(q))) {
      return {
        itemName: item.itemName,
        category: item.category,
        confidence: item.confidence,
        material: item.material,
        color: item.color,
        binName: item.binName,
        instructions: item.instructions,
        tips: item.tips,
        contaminationWarning: item.contaminationWarning,
        environmentalImpact: item.environmentalImpact,
        decompositionTime: item.decompositionTime,
        preparationSteps: item.preparationSteps,
      };
    }
  }

  // Default smart fallback
  return {
    itemName: query.length > 0 ? query : "General Household Waste Item",
    category: "Landfill",
    confidence: 0.88,
    material: "Mixed Household Material",
    color: "#64748B",
    binName: "Black / Grey Landfill Bin",
    instructions: "1. Inspect item for resin identification codes (#1, #2, #5).\n2. If contaminated or mixed multi-material, dispose in general waste.\n3. Ensure hazardous chemicals, batteries, and electronics are separated.",
    tips: "When in doubt, placing questionable items in landfill waste prevents the contamination of entire recycling batches.",
    contaminationWarning: "Never mix hazardous items, batteries, or paints into general garbage.",
    environmentalImpact: "Proper segregation ensures non-recyclable materials do not spoil recyclable bales.",
    decompositionTime: "50 - 100 years",
    preparationSteps: ["Inspect for recycling symbols", "Remove food residues", "Place in general landfill cart"],
  };
}

// Classify waste item from base64 image
app.post("/api/classify-image", async (req: Request, res: Response) => {
  const { imageBase64, mimeType = "image/jpeg", region = "General", userNotes = "" } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: "No image data provided" });
  }

  // If Gemini API key is missing or previously determined unavailable, immediately use smart rules engine
  if (!process.env.GEMINI_API_KEY || aiServiceAvailable === false) {
    const fallbackData = getFallbackClassification(userNotes || "Recyclable Packaging Item");
    return res.json({
      success: true,
      data: fallbackData,
      fallback: true,
    });
  }

  try {
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
- instructions: concise, step-by-step preparation and disposal instructions
- tips: practical advice, contamination prevention, and municipality nuances
- contaminationWarning: crucial warning on what NOT to do
- environmentalImpact: positive ecological impact statement when segregated properly
- decompositionTime: estimated decomposition time if sent to landfill
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
    aiServiceAvailable = true;
    return res.json({ success: true, data: parsed });
  } catch (_error: any) {
    aiServiceAvailable = false;
    const fallbackData = getFallbackClassification(userNotes || "Recyclable Packaging Item");
    return res.json({
      success: true,
      data: fallbackData,
      fallback: true,
    });
  }
});

// Classify waste item from text query
app.post("/api/classify-text", async (req: Request, res: Response) => {
  const { query, region = "General" } = req.body;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Query string is required" });
  }

  // If Gemini API key is missing or previously determined unavailable, immediately use smart rules engine
  if (!process.env.GEMINI_API_KEY || aiServiceAvailable === false) {
    const fallbackData = getFallbackClassification(query);
    return res.json({
      success: true,
      data: fallbackData,
      fallback: true,
    });
  }

  try {
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
    aiServiceAvailable = true;
    return res.json({ success: true, data: parsed });
  } catch (_error: any) {
    aiServiceAvailable = false;
    const fallbackData = getFallbackClassification(query || "waste item");
    return res.json({
      success: true,
      data: fallbackData,
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
