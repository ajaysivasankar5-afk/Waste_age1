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

// Comprehensive Fallback Knowledge Base covering all waste streams
const FALLBACK_ITEMS = [
  // --- RECYCLABLES ---
  {
    keywords: ["plastic", "pet", "water bottle", "beverage bottle", "clear bottle", "soda bottle", "1 pet"],
    itemName: "Plastic Beverage Bottle (PET #1)",
    category: "Recyclable",
    confidence: 0.96,
    material: "Polyethylene Terephthalate (PET #1)",
    color: "#2563EB",
    binName: "Blue Recycling Bin",
    instructions: "Empty all remaining liquid, lightly rinse, crush flat to save space, and screw the cap back on tightly.",
    tips: "Clear transparent PET bottles have high circular value. Keep caps attached so they don't fall through sorting screens.",
    contaminationWarning: "Never leave sugary liquids or dairy inside; fluid spoils dry paper and cardboard in the same truck.",
    environmentalImpact: "Recycling 1 ton of PET saves approx. 5,774 kWh of electricity and 16.3 barrels of oil.",
    decompositionTime: "450 - 500 years in landfill",
    preparationSteps: ["Empty all liquid residue", "Quick rinse under tap", "Crush flat", "Screw cap on and place in blue bin"],
  },
  {
    keywords: ["aluminum", "can", "soda can", "coke", "pepsi", "beer can", "tin can", "metal can", "beverage can", "alu"],
    itemName: "Aluminum Soda & Beverage Can",
    category: "Recyclable",
    confidence: 0.98,
    material: "100% Circular Aluminum Alloy (3004/5182)",
    color: "#2563EB",
    binName: "Blue Recycling Bin",
    instructions: "Pour out leftover liquid, rinse clean, and place directly in the blue recycling bin.",
    tips: "Aluminum can be recycled infinitely with zero loss of quality. It returns to store shelves as a new can in 60 days.",
    contaminationWarning: "Do not stuff cigarette butts, plastic straws, or citrus wedges inside the can opening.",
    environmentalImpact: "Recycling aluminum uses 95% less energy than refining virgin aluminum from bauxite ore.",
    decompositionTime: "200 - 500 years",
    preparationSteps: ["Empty fluid completely", "Lightly rinse clean", "Place loose in blue recycling bin"],
  },
  {
    keywords: ["cardboard", "box", "shipping box", "amazon box", "kraft box", "corrugated", "package", "pap 20"],
    itemName: "Corrugated Cardboard Shipping Box",
    category: "Recyclable",
    confidence: 0.97,
    material: "Unbleached Kraft Cellulose Fiber (PAP 20)",
    color: "#2563EB",
    binName: "Blue Recycling Bin (Paper/Cardboard)",
    instructions: "Remove all plastic bubble wrap and excessive packing tape. Flatten the box completely flat before disposal.",
    tips: "Cardboard must be kept completely dry. Moisture encourages mildew and weakens cellulose fiber strands for paper mills.",
    contaminationWarning: "Greasy pizza bottoms and wax-coated produce boxes cannot be recycled with dry cardboard.",
    environmentalImpact: "Recycling 1 ton of cardboard saves 17 mature trees and 7,000 gallons of fresh water.",
    decompositionTime: "2 - 3 months in compost if unprinted",
    preparationSteps: ["Remove plastic inserts and bubble tape", "Flatten box completely flat", "Place clean and dry in blue bin"],
  },
  {
    keywords: ["glass", "jar", "glass bottle", "wine bottle", "beer bottle", "pickle jar", "sauce jar", "mason jar", "gl 70"],
    itemName: "Glass Food Jar & Beverage Bottle",
    category: "Recyclable",
    confidence: 0.97,
    material: "100% Recyclable Soda-Lime Silica Glass (GL 70/71/72)",
    color: "#2563EB",
    binName: "Blue Recycling Bin / Glass Caddy",
    instructions: "Scrape out sauces or jams, rinse clean with water. Metal lids can be recycled separately.",
    tips: "Container glass is 100% recyclable. Never mix with drinking glasses or Pyrex which have higher melting temperatures.",
    contaminationWarning: "Do not include ceramics, porcelain, or mirror glass shards.",
    environmentalImpact: "Using recycled cullet reduces furnace melting temperatures, cutting energy emissions by 30%.",
    decompositionTime: "1,000,000+ years (will never degrade naturally)",
    preparationSteps: ["Scrape out food residue", "Rinse clean with water", "Separate metal lid", "Place unbroken in blue bin"],
  },
  {
    keywords: ["shampoo", "detergent", "hdpe", "milk jug", "lotion", "conditioner", "soap bottle", "2 hdpe"],
    itemName: "HDPE #2 Shampoo / Detergent Jug",
    category: "Recyclable",
    confidence: 0.95,
    material: "High-Density Polyethylene (HDPE #2)",
    color: "#2563EB",
    binName: "Blue Recycling Bin",
    instructions: "Rinse soapy lather clean. Discard mechanical spring pump dispensers in the trash (they have metal internal springs).",
    tips: "HDPE is one of the most widely recycled plastics and is remanufactured into drainage pipes and park benches.",
    contaminationWarning: "Spring pump mechanisms jam optical sorting machinery and must be put in the black bin.",
    environmentalImpact: "Recycling HDPE reduces virgin crude oil consumption by 88%.",
    decompositionTime: "100 - 300 years",
    preparationSteps: ["Rinse out soap and detergent suds", "Discard spring pump in trash", "Recycle jug in blue bin"],
  },
  {
    keywords: ["newspaper", "magazine", "paper", "book", "flyer", "office paper", "envelope", "mail", "pap 22"],
    itemName: "Newspaper, Magazines & Mixed Paper",
    category: "Recyclable",
    confidence: 0.96,
    material: "Cellulose Paper Pulp (PAP 22)",
    color: "#2563EB",
    binName: "Blue Recycling Bin (Mixed Paper)",
    instructions: "Keep clean and dry. Staples and glossy inks are accepted by modern pulping facilities.",
    tips: "Paper fibers can be re-pulped and recycled 5 to 7 times before the fibers become too short.",
    contaminationWarning: "Do not recycle grease-stained paper, thermal receipts (BPA), or glitter-coated paper.",
    environmentalImpact: "Recycling 1 ton of paper saves 17 trees, 380 gallons of oil, and 4,000 kWh of energy.",
    decompositionTime: "6 weeks to 6 months",
    preparationSteps: ["Keep clean and dry", "Remove plastic wrappers", "Place flat in blue paper bin"],
  },

  // --- ORGANICS ---
  {
    keywords: ["banana", "peel", "fruit", "apple", "orange", "citrus", "lemon", "core", "fruit peel", "rind"],
    itemName: "Banana Peel & Fresh Fruit Scraps",
    category: "Organic",
    confidence: 0.97,
    material: "Biodegradable Organic Fruit Biomass",
    color: "#16A34A",
    binName: "Green Compost / Organics Bin",
    instructions: "Peel off plastic PLU barcode stickers. Toss directly into the green organics bin or compost pail.",
    tips: "Fruit scraps break down in 2 to 4 weeks, supplying potassium and nitrogen to agricultural compost.",
    contaminationWarning: "Always remove sticky plastic PLU stickers; they are synthetic vinyl and never degrade.",
    environmentalImpact: "Diverting fruit scraps prevents anaerobic decomposition that produces methane in landfills.",
    decompositionTime: "2 - 5 weeks in active compost",
    preparationSteps: ["Peel off plastic PLU stickers", "Toss into green compost bin or home compost"],
  },
  {
    keywords: ["coffee", "grounds", "filter", "espresso", "tea", "teabag", "coffee filter"],
    itemName: "Spent Coffee Grounds & Paper Filter",
    category: "Organic",
    confidence: 0.98,
    material: "Organic Nitrogen-Rich Biomass & Unbleached Cellulose",
    color: "#16A34A",
    binName: "Green Compost / Organics Bin",
    instructions: "Paper coffee filters and coffee grounds can both be composted together safely.",
    tips: "Coffee grounds are a rich nitrogen source (C:N ratio ~20:1) that boosts microbial activity.",
    contaminationWarning: "Single-use plastic coffee pods must NOT be thrown into organics bins.",
    environmentalImpact: "Replaces petroleum-based synthetic fertilizers with natural organic matter.",
    decompositionTime: "2 - 3 months",
    preparationSteps: ["Allow grounds to cool", "Deposit paper filter and grounds in green bin"],
  },
  {
    keywords: ["vegetable", "carrot", "salad", "lettuce", "onion", "potato", "celery", "greens", "scraps", "peelings"],
    itemName: "Vegetable Peelings & Salad Scraps",
    category: "Organic",
    confidence: 0.96,
    material: "Vegetable Cellulose Fiber & Minerals",
    color: "#16A34A",
    binName: "Green Compost / Organics Bin",
    instructions: "Remove rubber bands and twist ties before composting vegetable trimmings.",
    tips: "Carrot tops, celery trimmings, and potato peels can be boiled into vegetable stock before composting!",
    contaminationWarning: "Remove wire twist-ties and plastic netting from celery and onions.",
    environmentalImpact: "Eliminates municipal landfill methane emissions.",
    decompositionTime: "2 - 4 weeks",
    preparationSteps: ["Remove rubber bands or plastic ties", "Place in green organics bin"],
  },
  {
    keywords: ["egg", "eggshell", "eggshells", "egg shell"],
    itemName: "Crushed Eggshells",
    category: "Organic",
    confidence: 0.97,
    material: "95% Calcium Carbonate (CaCO3) Bio-Mineral",
    color: "#16A34A",
    binName: "Green Compost / Organics Bin",
    instructions: "Crush lightly with your hands before composting to speed up mineral release into the soil.",
    tips: "Eggshells do not attract pests when crushed and provide structural aeration to compost heaps.",
    contaminationWarning: "Do not place in plastic egg cartons; paper egg cartons can be composted.",
    environmentalImpact: "Reclaims bio-available calcium for regenerative organic gardening.",
    decompositionTime: "1 - 2 years (breaks down faster when finely crushed)",
    preparationSteps: ["Crush eggshells lightly in palm", "Toss into green compost bin"],
  },
  {
    keywords: ["pizza", "greasy", "pizza box", "cheese box", "soiled cardboard", "grease"],
    itemName: "Greasy / Food-Soiled Pizza Box",
    category: "Organic",
    confidence: 0.94,
    material: "Food-Soiled Unbleached Cellulose Fiber",
    color: "#16A34A",
    binName: "Green Compost Bin (or Landfill if no organics)",
    instructions: "Tear the box along the hinge: clean dry lid goes to Blue Recycling; greasy cheese-soaked bottom goes to Green Compost.",
    tips: "Food grease ruins recycling paper pulpers, but unbleached greasy cardboard decomposes naturally in municipal compost.",
    contaminationWarning: "Never put food-soaked greasy cardboard in clean blue paper recycling.",
    environmentalImpact: "Composting avoids landfill methane and keeps recycling streams pristine.",
    decompositionTime: "2 - 4 months in compost",
    preparationSteps: ["Remove plastic pizza tripod table", "Tear off clean lid for Blue Recycling", "Place greasy bottom in Green Compost"],
  },
  {
    keywords: ["leaves", "grass", "yard", "plant", "garden", "flowers", "branch", "twigs", "yard waste"],
    itemName: "Garden Leaves, Grass Clippings & Yard Waste",
    category: "Organic",
    confidence: 0.96,
    material: "Lignin, Cellulose & Nitrogenous Plant Matter",
    color: "#16A34A",
    binName: "Green Yard Waste / Organics Bin",
    instructions: "Place in green yard waste bin or certified paper yard bags. Do not use plastic bags.",
    tips: "Grass clippings supply quick-release nitrogen, while dry leaves supply carbon structure for optimal compost balance.",
    contaminationWarning: "Never include treated lumber, plastic plant pots, or dog feces.",
    environmentalImpact: "Returns tons of organic biomass back to urban tree canopies and city parks.",
    decompositionTime: "1 - 3 months",
    preparationSteps: ["Ensure no rocks or plastic tags are mixed in", "Load into green yard waste bin loosely"],
  },

  // --- HAZARDOUS ---
  {
    keywords: ["battery", "batteries", "aa", "aaa", "duracell", "energizer", "alkaline", "button cell"],
    itemName: "AA / AAA Alkaline Battery",
    category: "Hazardous",
    confidence: 0.97,
    material: "Zinc-Manganese Dioxide (Zn/MnO2), Potassium Hydroxide",
    color: "#DC2626",
    binName: "Red Hazardous / Dedicated Battery Drop-Off",
    instructions: "Never throw in standard trash or curbside recycling! Tape positive (+) and negative (-) terminals with clear tape to prevent fire sparks, and drop at a certified battery collection depot.",
    tips: "Crushed or shorted batteries cause severe compactor fires in collection trucks every single week.",
    contaminationWarning: "DO NOT place in blue or green curbside bins! Battery sparks ignite paper and cardboard.",
    environmentalImpact: "Recycling prevents caustic potassium hydroxide and heavy metals from leaching into groundwater.",
    decompositionTime: "100+ years (causes hazardous chemical leaching)",
    preparationSteps: ["Tape terminal ends with clear tape", "Store in dry container", "Drop at authorized battery kiosk"],
  },
  {
    keywords: ["lithium", "phone battery", "laptop battery", "rechargeable", "powerbank", "vape", "li-ion"],
    itemName: "Rechargeable Lithium-Ion Battery (Phone / Tool)",
    category: "Hazardous",
    confidence: 0.98,
    material: "Lithium Cobalt Oxide (LiCoO2) / Organic Carbonate Electrolyte",
    color: "#DC2626",
    binName: "Dedicated E-Waste / Battery Drop-Off Station",
    instructions: "High fire hazard! If battery is swollen or punctured, place in sand or fire-safe container immediately. Tape terminals and drop at an authorized electronics recycler.",
    tips: "Lithium-ion batteries contain critical strategic minerals that can be hydrometallurgically refined into new batteries.",
    contaminationWarning: "EXTREME FIRE HAZARD. Lithium batteries punctured by garbage truck compactors violently explode.",
    environmentalImpact: "Prevents toxic cobalt and nickel pollution while recovering critical rare earth elements.",
    decompositionTime: "Does not decompose (poses severe fire & toxicity risk)",
    preparationSteps: ["Cover metallic contact pins with electrical tape", "Store in non-flammable container", "Bring to certified e-waste depot"],
  },
  {
    keywords: ["phone", "electronics", "charger", "cable", "laptop", "wire", "e-waste", "ipad", "tablet", "circuit"],
    itemName: "Old Smartphone, Laptop & Charging Cable (E-Waste)",
    category: "Hazardous",
    confidence: 0.96,
    material: "Copper Wiring, Gold/Silver Circuitry, PCBs, Flame-Retardant ABS",
    color: "#DC2626",
    binName: "Municipal E-Waste Recycling Depot",
    instructions: "Perform a factory reset to wipe personal data. Deposit at an authorized e-waste collection center or charity refurbishment program.",
    tips: "One metric ton of circuit boards contains 40 to 800 times more gold than one metric ton of mined gold ore.",
    contaminationWarning: "Lead solders and brominated flame retardants contaminate standard municipal landfills.",
    environmentalImpact: "Conserves rare precious metals and prevents toxic lead/cadmium soil pollution.",
    decompositionTime: "Over 1,000 years",
    preparationSteps: ["Perform factory data wipe", "Bundle charging cables with twist-tie", "Deliver to certified e-waste depot"],
  },
  {
    keywords: ["bulb", "fluorescent", "cfl", "tube", "mercury bulb", "lightbulb", "cfl bulb"],
    itemName: "CFL Fluorescent Lightbulb & Tube",
    category: "Hazardous",
    confidence: 0.96,
    material: "Mercury Vapor (Hg), Phosphor Powder Coating, Glass",
    color: "#DC2626",
    binName: "Red Hazardous Waste Facility",
    instructions: "Package carefully in original carton or padded box to prevent breakage. If broken, ventilate room for 15 minutes, scoop with cardboard (never vacuum!), and seal in airtight jar.",
    tips: "CFLs and fluorescent tubes ALWAYS require hazardous handling due to toxic mercury vapor.",
    contaminationWarning: "Mercury vapor released from broken tubes bioaccumulates in marine food chains.",
    environmentalImpact: "Safely captures neurotoxic mercury and prevents atmospheric release.",
    decompositionTime: "Glass lasts centuries; mercury persists forever",
    preparationSteps: ["Handle by plastic base, do not twist glass tube", "Place in padded box", "Deliver to municipal hazardous waste event"],
  },
  {
    keywords: ["medicine", "pill", "blister", "tablet", "drug", "pharma", "prescription", "antibiotic", "syrup"],
    itemName: "Expired Prescription Medicines & Blister Packs",
    category: "Hazardous",
    confidence: 0.95,
    material: "Active Pharmaceutical Ingredients (APIs), Aluminum Foil & PVC",
    color: "#DC2626",
    binName: "Pharmacy Drug Take-Back Kiosk",
    instructions: "NEVER flush pills down the toilet or sink! Remove personal prescription labels, leave pills in bottles or blister packs, and drop into pharmacy take-back bins.",
    tips: "Municipal wastewater treatment plants cannot filter out antibiotics, hormones, or psychiatric medications from tap water.",
    contaminationWarning: "Flushed pharmaceuticals contaminate river ecosystems and municipal drinking reservoirs.",
    environmentalImpact: "Guarantees clean drinking water watersheds and protects aquatic wildlife.",
    decompositionTime: "Chemical compounds persist in aquifers for decades",
    preparationSteps: ["Blacken personal identification on label", "Keep pills sealed in bottle/pack", "Drop in pharmacy take-back kiosk"],
  },
  {
    keywords: ["spray", "aerosol", "paint", "solvent", "wd40", "spray paint", "insecticide", "pesticide"],
    itemName: "Aerosol Spray Paint & Solvent Can",
    category: "Hazardous",
    confidence: 0.96,
    material: "Pressurized Propellant (Propane/Butane), VOC Solvents, Steel Can",
    color: "#DC2626",
    binName: "Red Hazardous Waste Bin / HHW Depot",
    instructions: "If propellant or paint remains, it MUST go to hazardous waste. If 100% empty with zero hiss, check if local blue recycling accepts empty steel cans.",
    tips: "Pressurized aerosol cans explode violently under hydraulic compactor pressure in standard garbage trucks.",
    contaminationWarning: "Explosion and chemical fire risk when compressed in standard waste vehicles.",
    environmentalImpact: "Prevents ground-level ozone smog and dangerous solvent chemical fires.",
    decompositionTime: "50 - 100 years",
    preparationSteps: ["Hold nozzle in safe direction outdoors to confirm if empty", "If paint remains, bring to hazardous drop-off"],
  },

  // --- LANDFILL ---
  {
    keywords: ["styrofoam", "foam", "polystyrene", "takeout container", "packing peanut", "meat tray", "6 ps"],
    itemName: "Expanded Polystyrene (Styrofoam #6)",
    category: "Landfill",
    confidence: 0.95,
    material: "Expanded Polystyrene Foam (PS #6) - 95% Trapped Air",
    color: "#64748B",
    binName: "Black / Grey Landfill Bin",
    instructions: "Scrape food remnants and place into standard black landfill bin. Do not place in blue recycling!",
    tips: "Styrofoam is 95% air and crumbles into microplastic foam beads during transport, contaminating paper and glass recycling lines.",
    contaminationWarning: "Styrofoam beads break into millions of static-charged pieces that clog recycling screens.",
    environmentalImpact: "Persists in ecosystems for hundreds of years and breaks down into hazardous microplastics.",
    decompositionTime: "500+ years (does not biodegrade)",
    preparationSteps: ["Wipe out excess food sauces", "Bag securely to prevent foam beads blowing away", "Place in Black Landfill Bin"],
  },
  {
    keywords: ["chips", "snack", "chip bag", "doritos", "lays", "wrapper", "metallic wrapper", "foil bag", "7 other"],
    itemName: "Chip / Snack Bag (Multi-layer Metallized Film)",
    category: "Landfill",
    confidence: 0.94,
    material: "Multi-layer Laminated Polypropylene (BOPP) & Aluminum",
    color: "#64748B",
    binName: "Black / Grey Landfill Bin",
    instructions: "Crush the empty bag and throw it into the black landfill bin.",
    tips: "Do the 'Crinkle Test': If a shiny package crinkles loudly and does not stay flat when folded, it is multi-layer metallized film and cannot be recycled in standard curbside bins.",
    contaminationWarning: "Foil-plastic bonded packaging cannot be separated mechanically in recycling pulpers or melt extruders.",
    environmentalImpact: "Non-degradable polymer layers persist for centuries in landfills.",
    decompositionTime: "80 - 100 years",
    preparationSteps: ["Empty all snack crumbs", "Place in Black Landfill Bin"],
  },
  {
    keywords: ["cup", "coffee cup", "paper cup", "starbucks", "disposable cup", "takeout cup"],
    itemName: "Disposable Paper Takeout Coffee Cup",
    category: "Landfill",
    confidence: 0.93,
    material: "Bleached Paperboard with Polyethylene (PE) Plastic Coating",
    color: "#64748B",
    binName: "Black / Grey Landfill Bin",
    instructions: "Separate the 3 parts: Plastic lid goes into Blue Recycling (if #5 PP), cardboard sleeve goes into Blue Recycling, but the paper cup itself MUST go into the Black Landfill bin.",
    tips: "Takeout paper cups have a thin plastic resin layer fused to the paper interior to prevent leaks, preventing the paper from dissolving in standard recycling pulpers.",
    contaminationWarning: "Putting liquid-filled coffee cups in recycling bins soaks clean paper bales, ruining recyclable paper.",
    environmentalImpact: "Over 50 billion single-use paper cups are landfilled annually worldwide.",
    decompositionTime: "20 - 30 years (plastic lining never biodegrades)",
    preparationSteps: ["Pour out liquid", "Recycle cardboard sleeve in Blue Bin", "Place wax/plastic-lined cup in Black Landfill Bin"],
  },
  {
    keywords: ["mug", "ceramic", "plate", "broken glass", "porcelain", "shards", "pottery", "drinking glass"],
    itemName: "Broken Ceramic Mug, Porcelain Plate & Drinking Glass",
    category: "Landfill",
    confidence: 0.94,
    material: "Fired Clay, Glazed Porcelain, or Lead Crystal",
    color: "#64748B",
    binName: "Black / Grey Landfill Bin",
    instructions: "Wrap broken sharp pieces securely in newspaper or cardboard before placing in the black bin to protect sanitation workers from cuts.",
    tips: "Ceramics and drinking glassware melt at significantly higher temperatures than container glass jars, causing structural flaws in recycled bottles.",
    contaminationWarning: "Never toss drinking glasses or pottery into the blue glass recycling bin.",
    environmentalImpact: "Inert mineral that does not generate greenhouse gases.",
    decompositionTime: "1,000,000+ years (inert stone-like material)",
    preparationSteps: ["Collect sharp shards carefully", "Wrap inside old newspaper or folded cardboard", "Place into Black Landfill Bin"],
  },
  {
    keywords: ["straw", "fork", "spoon", "knife", "plastic cutlery", "plastic straw", "utensil"],
    itemName: "Plastic Straw, Single-Use Fork & Spoon",
    category: "Landfill",
    confidence: 0.95,
    material: "Polystyrene (PS #6) or Polypropylene (PP #5) - Small Format",
    color: "#64748B",
    binName: "Black / Grey Landfill Bin",
    instructions: "Throw in black landfill bin. Items smaller than 2 inches (5cm) fall through sorting conveyor screens into the landfill residue chute.",
    tips: "Switching to reusable bamboo or metal cutlery eliminates single-use plastic waste.",
    contaminationWarning: "Small plastic cutlery falls between conveyor belts and jams rotating disc sorters.",
    environmentalImpact: "Major component of coastal plastic debris harmful to marine organisms.",
    decompositionTime: "200 - 400 years",
    preparationSteps: ["Wipe off food sauces", "Place into Black Landfill Bin"],
  },
  {
    keywords: ["wipe", "wipes", "diaper", "diapers", "sanitary", "tissue", "pampers", "wet wipe"],
    itemName: "Sanitary Wipes, Wet Wipes & Disposable Diapers",
    category: "Landfill",
    confidence: 0.96,
    material: "Synthetic Polyester Non-Woven Fibers, Polyacrylate SAP",
    color: "#64748B",
    binName: "Black / Grey Landfill Bin",
    instructions: "Wrap soiled items in a sanitary bag and place directly in the black landfill bin. NEVER flush wipes down toilets!",
    tips: "Even wipes marketed as 'flushable' contain synthetic plastic fibers that do not disintegrate, causing massive sewer fatbergs.",
    contaminationWarning: "Biohazard and hygiene contamination; never place in green compost or blue recycling.",
    environmentalImpact: "Contains synthetic plastics that release microfibers into water systems.",
    decompositionTime: "250 - 500 years",
    preparationSteps: ["Roll up soiled item securely", "Seal in trash liner bag", "Deposit into Black Landfill Bin"],
  }
];

function getFallbackClassification(query: string) {
  const q = query.toLowerCase().trim();
  if (q) {
    for (const item of FALLBACK_ITEMS) {
      if (item.keywords.some((k) => q.includes(k) || k.includes(q))) {
        return item;
      }
    }
  }

  // Default to balanced recyclable or user query
  return {
    itemName: query.length > 0 ? query : "Mixed Packaging Item",
    category: "Recyclable",
    confidence: 0.90,
    material: "Standard Household Packaging Material",
    color: "#2563EB",
    binName: "Blue Recycling Bin",
    instructions: "1. Empty all liquid or food residue.\n2. Lightly rinse with cold water.\n3. Check for resin code symbols (#1, #2, #5).\n4. Place loosely in blue recycling cart.",
    tips: "Ensure items are free of food soils. When in doubt, verify local regional guidelines.",
    contaminationWarning: "Do not mix food-soaked paper or hazardous chemicals in recycling carts.",
    environmentalImpact: "Segregation preserves high-purity recycling bales for circular remanufacturing.",
    decompositionTime: "100 - 500 years",
    preparationSteps: ["Empty residue", "Quick rinse", "Place in blue recycling bin"],
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
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");

    const prompt = `You are an expert waste segregation and environmental recycling specialist.
Analyze this image of a discarded item or packaging.
The user is located in: "${region}". Context: "${userNotes}".

Identify the exact item and classify it into ONE of these four standard categories:
1. "Recyclable" (metals, clean paper/cardboard, rigid recyclable plastics #1, #2, #5, glass bottles/jars)
2. "Organic" (food scraps, fruit/vegetable peels, coffee grounds, eggshells, yard waste, compostable plant matter, greasy pizza box)
3. "Hazardous" (batteries, electronics, CFL/fluorescent bulbs, aerosol cans, paint, motor oil, medical waste, corrosive chemicals)
4. "Landfill" (chip bags, multi-layered plastic films, styrofoam, broken ceramics, sanitary wipes, disposable coffee cups)

Provide structured analysis in JSON:
- itemName: precise name of the detected object
- category: strictly one of "Recyclable", "Organic", "Hazardous", "Landfill"
- confidence: number between 0.70 and 0.99
- material: detected material composition
- color: HEX color code matching category ("#2563EB" for Recyclable, "#16A34A" for Organic, "#DC2626" for Hazardous, "#64748B" for Landfill)
- binName: name of recommended disposal container
- instructions: concise preparation and disposal instructions
- tips: practical advice and contamination prevention
- contaminationWarning: critical warning on what NOT to do
- environmentalImpact: ecological impact statement
- decompositionTime: estimated decomposition time in landfill
- preparationSteps: list of 2 to 4 checkable preparation steps`;

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
    const fallbackData = getFallbackClassification(query);
    return res.json({
      success: true,
      data: fallbackData,
      fallback: true,
    });
  }
});

// Vite middleware and static serving
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
    console.log(`EcoSort Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
