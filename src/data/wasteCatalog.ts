import { WasteItem, WasteCategory } from "../types";

export const CATEGORY_COLORS: Record<WasteCategory, { hex: string; bg: string; text: string; border: string; badge: string }> = {
  Recyclable: {
    hex: "#2563EB",
    bg: "bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/30",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  },
  Organic: {
    hex: "#16A34A",
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/30",
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  },
  Hazardous: {
    hex: "#DC2626",
    bg: "bg-red-500/10",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-500/30",
    badge: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800",
  },
  Landfill: {
    hex: "#64748B",
    bg: "bg-slate-500/10",
    text: "text-slate-600 dark:text-slate-400",
    border: "border-slate-500/30",
    badge: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700",
  },
};

export const WASTE_CATALOG: WasteItem[] = [
  // --- RECYCLABLE (Plastics, Metals, Paper, Glass) ---
  {
    id: "plastic-bottle",
    name: "Plastic Beverage Bottle (PET #1)",
    category: "Recyclable",
    material: "Polyethylene Terephthalate (PET #1)",
    color: "#2563EB",
    binName: "Blue Recycling Bin",
    resinCode: "♳ #1 PETE",
    recyclingSymbol: "♳",
    recyclabilityRating: "High Commercial Recyclability",
    carbonSavedKg: 0.38,
    recycledProduct: "RPET beverage bottles, fleece jackets, polyester sportswear, strapping, and acoustic insulation panels.",
    alternativeDisposal: "Deposit Return Scheme (DRS) reverse vending machine for a cash refund ($0.10 - $0.25).",
    instructions: "Empty all remaining beverage, rinse lightly with cold water, crush flat to maximize bin volume, and screw the cap back on tightly.",
    tips: "Transparent clear bottles have the highest market value for bottle-to-bottle recycling. Keep plastic caps screwed on so they don't get lost in screening grates.",
    contaminationWarning: "Never leave sugary soda, milk, or oily fluids inside; liquids ruin dry cardboard bales collected in the same truck.",
    environmentalImpact: "Recycling 1 plastic bottle saves enough energy to power a 60W LED bulb for over 6 hours and saves 0.38kg CO2e.",
    decompositionTime: "450 - 500 years in landfill",
    preparationSteps: [
      "Pour out leftover liquids completely",
      "Quick rinse to remove sugary or dairy residue",
      "Crush the bottle flat to conserve collection space",
      "Screw cap back on and place in Blue Recycling Bin"
    ],
    componentBreakdown: [
      { part: "Bottle Body", material: "PET #1 Clear Plastic", binName: "Blue Recycling Bin", category: "Recyclable", action: "Rinse & crush flat" },
      { part: "Screw Cap", material: "PP #5 Polypropylene", binName: "Blue Recycling Bin", category: "Recyclable", action: "Keep screwed onto bottle" },
      { part: "Shrink Label", material: "Printed Vinyl / OPP", binName: "Blue Recycling Bin", category: "Recyclable", action: "Leave on or peel into trash if loose" }
    ]
  },
  {
    id: "aluminum-soda-can",
    name: "Aluminum Soda & Beverage Can",
    category: "Recyclable",
    material: "100% Circular Aluminum (Alloy 3004 / 5182)",
    color: "#2563EB",
    binName: "Blue Recycling Bin",
    resinCode: "ALU 41",
    recyclingSymbol: "♻️",
    recyclabilityRating: "100% Infinitely Recyclable",
    carbonSavedKg: 0.52,
    recycledProduct: "New beverage cans (back on store shelves in 60 days), automotive body parts, bicycle frames, aerospace structures.",
    alternativeDisposal: "Bottle deposit reverse vending stations for instant cash credit.",
    instructions: "Pour out any leftover beverage, rinse quickly, and place in recycling. Do not crush if your local facility uses optical sorting.",
    tips: "Aluminum can be recycled indefinitely with zero loss of quality or strength. Over 75% of all aluminum ever mined is still in productive use today.",
    contaminationWarning: "Do not stuff cigarette butts, plastic straw wrappers, or lime wedges inside the can opening.",
    environmentalImpact: "Recycling aluminum requires 95% less energy than refining virgin aluminum from raw bauxite ore.",
    decompositionTime: "200 - 500 years",
    preparationSteps: [
      "Pour out all liquid residue",
      "Quick rinse under tap",
      "Deposit clean in Blue Recycling Bin"
    ],
    componentBreakdown: [
      { part: "Can Body & Tab", material: "Aluminum Alloy", binName: "Blue Recycling Bin", category: "Recyclable", action: "Empty & recycle directly" }
    ]
  },
  {
    id: "glass-jar-bottle",
    name: "Glass Food Jar & Beverage Bottle",
    category: "Recyclable",
    material: "Soda-Lime Silica Glass (GL 70/71/72)",
    color: "#2563EB",
    binName: "Blue Recycling Bin (or Glass Caddy)",
    resinCode: "GL 70 (Clear) / 71 (Green) / 72 (Brown)",
    recyclingSymbol: "♻️",
    recyclabilityRating: "100% Infinitely Recyclable",
    carbonSavedKg: 0.31,
    recycledProduct: "New glass bottles, fiberglass insulation, cullet for road aggregate (glasphalt), filtration media.",
    alternativeDisposal: "Local glass bottle banks or returnable deposit scheme.",
    instructions: "Scrape out all sauces/jams and rinse clean. Metal twist lids can be recycled separately or loosely placed back on.",
    tips: "Container glass (jars and bottles) is 100% recyclable. Never mix with drinking glasses, Pyrex, or window glass which have higher melting temps.",
    contaminationWarning: "Ceramics, porcelain, ovenware, mirror shards, and crystal will ruin entire batches of molten glass.",
    environmentalImpact: "Recycling 1 ton of glass saves 1.2 tons of virgin raw materials (sand, soda ash, limestone) and cuts emissions by 30%.",
    decompositionTime: "Over 1,000,000 years (will never degrade naturally)",
    preparationSteps: [
      "Scrape out sauce or jam residue",
      "Rinse with water until clear",
      "Remove metal twist lid (recycle separately)",
      "Place gently in Blue Recycling Bin / Glass Caddy"
    ],
    componentBreakdown: [
      { part: "Glass Jar Body", material: "Soda-Lime Silica", binName: "Blue Recycling Bin", category: "Recyclable", action: "Rinse clean" },
      { part: "Metal Lid", material: "Tinplate Steel / Aluminum", binName: "Blue Recycling Bin", category: "Recyclable", action: "Separate and place in bin" }
    ]
  },
  {
    id: "cardboard-shipping-box",
    name: "Corrugated Cardboard Shipping Box",
    category: "Recyclable",
    material: "Unbleached Kraft Cellulose Fiber (PAP 20)",
    color: "#2563EB",
    binName: "Blue Recycling Bin (Paper/Cardboard)",
    resinCode: "PAP 20",
    recyclingSymbol: "♻️",
    recyclabilityRating: "High Commercial Recyclability",
    carbonSavedKg: 0.94,
    recycledProduct: "New corrugated shipping boxes, paperboard cereal boxes, egg cartons, paper shopping bags.",
    alternativeDisposal: "Sheet mulching in garden beds or local cardboard baling drop-off.",
    instructions: "Remove all plastic bubble wrap, packing peanuts, and excessive plastic tape. Flatten the box completely flat.",
    tips: "Cardboard must be kept completely dry. Moisture encourages mildew and weakens cellulose fiber strands for paper mill pulping.",
    contaminationWarning: "Greasy pizza bottom boxes, food-soaked cardboard, and wax-coated produce boxes cannot be recycled into paper.",
    environmentalImpact: "Recycling 1 ton of corrugated cardboard preserves 17 mature trees, 7,000 gallons of water, and 4,000 kWh of energy.",
    decompositionTime: "2 - 3 months in compost (if clean and unprinted)",
    preparationSteps: [
      "Remove plastic air pillows, styrofoam, and inserts",
      "Slice or peel packing tape along box seams",
      "Flatten box completely flat to prevent bin clogging",
      "Keep dry and place inside Blue Recycling Bin"
    ],
    componentBreakdown: [
      { part: "Cardboard Box", material: "Kraft Paperboard", binName: "Blue Recycling Bin", category: "Recyclable", action: "Flatten completely" },
      { part: "Plastic Air Pillows", material: "LDPE #4 Film", binName: "Black Landfill Bin / Store Drop-off", category: "Landfill", action: "Deflate and drop at store bin" }
    ]
  },
  {
    id: "steel-food-can",
    name: "Steel / Tin Soup & Canned Food Can",
    category: "Recyclable",
    material: "Tin-Plated Magnetic Steel (FE 40)",
    color: "#2563EB",
    binName: "Blue Recycling Bin",
    resinCode: "FE 40",
    recyclingSymbol: "♻️",
    recyclabilityRating: "100% Infinitely Recyclable",
    carbonSavedKg: 0.65,
    recycledProduct: "Structural steel rebar, automobile frames, bridges, appliances, and new steel cans.",
    instructions: "Rinse clean of all soup, beans, or pet food. Tuck the metal lid inside the can to prevent laceration hazards to sanitation staff.",
    tips: "Steel is magnetic and easily recovered by high-power electromagnets at municipal sorting facilities (MRFs).",
    contaminationWarning: "Leaving thick sauce, oil, or food scraps attracts vermin and lowers sanitation safety.",
    environmentalImpact: "Every ton of recycled steel saves 2,500 lbs of iron ore, 1,400 lbs of coal, and 120 lbs of limestone.",
    decompositionTime: "50 - 100 years",
    preparationSteps: [
      "Scrape out food residue",
      "Rinse with water",
      "Carefully tuck metal lid inside the can",
      "Place in Blue Recycling Bin"
    ]
  },
  {
    id: "milk-carton-tetrapak",
    name: "Aseptic Beverage Carton (Tetra Pak / Milk)",
    category: "Recyclable",
    material: "Composite Layer: 75% Paperboard, 20% Polyethylene, 5% Aluminum Foil",
    color: "#2563EB",
    binName: "Blue Recycling Bin (Carton Stream)",
    resinCode: "C/PAP 84",
    recyclingSymbol: "♻️",
    recyclabilityRating: "High Commercial Recyclability",
    carbonSavedKg: 0.28,
    recycledProduct: "Tissue paper, paper towels, building roof sheathing boards (poly-al panels).",
    instructions: "Empty all milk or juice, rinse thoroughly, push the plastic cap on, and flatten the carton.",
    tips: "Hydro-pulping mills soak cartons in water for 20 minutes to separate high-grade virgin paper fibers without chemicals.",
    contaminationWarning: "Do not leave curdled milk or juice fermenting inside.",
    environmentalImpact: "Recovers high-strength Scandinavian virgin wood fibers for hygiene papers.",
    decompositionTime: "5 years",
    preparationSteps: [
      "Empty all beverage contents",
      "Rinse with clean water",
      "Flatten carton completely",
      "Replace plastic screw cap and place in Blue Bin"
    ]
  },
  {
    id: "shampoo-hdpe-bottle",
    name: "HDPE #2 Shampoo / Detergent Jug",
    category: "Recyclable",
    material: "High-Density Polyethylene (HDPE #2)",
    color: "#2563EB",
    binName: "Blue Recycling Bin",
    resinCode: "♴ #2 HDPE",
    recyclingSymbol: "♴",
    recyclabilityRating: "High Commercial Recyclability",
    carbonSavedKg: 0.45,
    recycledProduct: "Durable drainage pipes, outdoor plastic lumber, park benches, recycling bins, automotive fluid bottles.",
    instructions: "Rinse out soapy lather. Remove mechanical lotion/shampoo pump dispensers (which have metal internal springs) and discard pumps in trash.",
    tips: "HDPE is opaque or colored rigid plastic and is one of the most reliable polymers in the circular recycling chain.",
    contaminationWarning: "Lotion pump mechanisms contain metal springs that break optical sorting cameras and must be discarded in trash.",
    environmentalImpact: "Drastically lowers crude oil consumption and prevents toxic ocean plastic fragment accumulation.",
    decompositionTime: "100 - 300 years",
    preparationSteps: [
      "Rinse out soap and detergent suds",
      "Unscrew and throw spring pump dispenser into Black Landfill bin",
      "Leave standard flip-top caps on if plastic-only",
      "Place jug in Blue Recycling Bin"
    ],
    componentBreakdown: [
      { part: "HDPE Jug Body", material: "HDPE #2 Plastic", binName: "Blue Recycling Bin", category: "Recyclable", action: "Rinse clean" },
      { part: "Spring Pump Dispenser", material: "Mixed Plastic + Steel Spring", binName: "Black Landfill Bin", category: "Landfill", action: "Discard in trash" }
    ]
  },
  {
    id: "newspaper-magazine",
    name: "Newspapers, Office Paper & Glossy Magazines",
    category: "Recyclable",
    material: "De-inkable Bleached / Unbleached Cellulose Paper Pulp (PAP 22)",
    color: "#2563EB",
    binName: "Blue Recycling Bin (Mixed Paper)",
    resinCode: "PAP 22",
    recyclingSymbol: "♻️",
    recyclabilityRating: "High Commercial Recyclability",
    carbonSavedKg: 0.85,
    recycledProduct: "New newsprint, paper towels, tissue paper, egg cartons, cellulose wall insulation.",
    instructions: "Keep clean and dry. Staples and glossy color inks are accepted by modern pulping mills.",
    tips: "Paper fibers can be re-pulped and recycled 5 to 7 times before the fibers become too short.",
    contaminationWarning: "Do not recycle paper contaminated with grease, wax coatings, thermal receipt paper (BPA), or glitter.",
    environmentalImpact: "Saves mature trees and uses 60% less energy than producing paper from virgin timber.",
    decompositionTime: "6 weeks to 6 months",
    preparationSteps: [
      "Ensure paper is clean and dry",
      "Remove plastic wrapper sleeves from magazines",
      "Stack flat and place in Blue Recycling Bin"
    ]
  },

  // --- ORGANIC (Compost / Food Scraps / Garden Waste) ---
  {
    id: "banana-peel",
    name: "Banana Peel & Fresh Fruit Scraps",
    category: "Organic",
    material: "Biodegradable Fruit Biomass (Rich in Potassium, Nitrogen)",
    color: "#16A34A",
    binName: "Green Compost / Organics Bin",
    recyclingSymbol: "🌱",
    recyclabilityRating: "Commercially Compostable",
    carbonSavedKg: 0.22,
    recycledProduct: "Nutrient-dense organic compost, soil conditioner for agriculture, renewable biomethane via anaerobic digestion.",
    alternativeDisposal: "Backyard compost pile, vermiculture worm bin, or trench composting.",
    instructions: "Peel off any plastic PLU barcode stickers. Toss directly into your green organics bin or backyard compost pile.",
    tips: "Banana peels, apple cores, citrus rinds, and melon rinds break down in 2 to 4 weeks, supplying organic nutrients to soil.",
    contaminationWarning: "Always remove sticky PLU plastic stickers; they are synthetic vinyl and never degrade in compost!",
    environmentalImpact: "Diverting organics from landfills prevents anaerobic decay that produces methane (CH4), a greenhouse gas 28x more potent than CO2.",
    decompositionTime: "2 - 5 weeks in active compost",
    preparationSteps: [
      "Peel off and discard plastic PLU fruit sticker",
      "Chop into smaller pieces for faster breakdown (optional)",
      "Place into Green Organics Bin / Kitchen Caddy"
    ]
  },
  {
    id: "coffee-grounds-filter",
    name: "Spent Coffee Grounds & Paper Filter",
    category: "Organic",
    material: "Organic Nitrogen-Rich Biomass & Unbleached Cellulose",
    color: "#16A34A",
    binName: "Green Compost / Organics Bin",
    recyclingSymbol: "🌱",
    recyclabilityRating: "Commercially Compostable",
    carbonSavedKg: 0.18,
    recycledProduct: "Rich compost humus, mushroom cultivation substrate, natural garden slug repellent.",
    instructions: "Paper coffee filters and coffee grounds can both be composted together safely.",
    tips: "Coffee grounds are an outstanding 'green' nitrogen source (C:N ratio ~20:1) that boosts microbial activity.",
    contaminationWarning: "Single-use plastic K-cups and non-certified aluminum pods must NOT be thrown into organics bins.",
    environmentalImpact: "Replaces petroleum-derived chemical fertilizers with natural organic matter.",
    decompositionTime: "2 - 3 months",
    preparationSteps: [
      "Allow grounds to cool after brewing",
      "Deposit both paper filter and grounds together in Green Bin"
    ]
  },
  {
    id: "eggshells",
    name: "Crushed Eggshells",
    category: "Organic",
    material: "95% Calcium Carbonate (CaCO3) Bio-Mineral",
    color: "#16A34A",
    binName: "Green Compost / Organics Bin",
    recyclingSymbol: "🌱",
    recyclabilityRating: "Commercially Compostable",
    carbonSavedKg: 0.12,
    recycledProduct: "Calcium-enriched garden soil (prevents blossom end rot in tomatoes and peppers).",
    instructions: "Crush lightly with your hands before composting to speed up mineral release into the soil.",
    tips: "Eggshells do not attract pests when crushed and provide structural aeration to compost heaps.",
    contaminationWarning: "Do not place in plastic egg cartons; paper egg cartons can be composted.",
    environmentalImpact: "Reclaims bio-available calcium for regenerative organic gardening.",
    decompositionTime: "1 - 2 years (breaks down faster when finely crushed)",
    preparationSteps: [
      "Crush eggshell lightly in palm",
      "Toss into Green Organics Bin"
    ]
  },
  {
    id: "vegetable-scraps",
    name: "Vegetable Peelings, Onion Skins & Salad Greens",
    category: "Organic",
    material: "Cellulose, Water, Dietary Fiber & Minerals",
    color: "#16A34A",
    binName: "Green Compost / Organics Bin",
    recyclingSymbol: "🌱",
    recyclabilityRating: "Commercially Compostable",
    carbonSavedKg: 0.25,
    recycledProduct: "Municipal grade A compost, organic mulch for parks, biogas energy.",
    instructions: "Remove rubber bands, plastic ties, and PLU stickers before composting vegetable trimmings.",
    tips: "Carrot tops, celery bottoms, and potato peelings can also be simmered into homemade vegetable broth before composting!",
    contaminationWarning: "Remove wire twist-ties and synthetic netting bags commonly bundled on celery and onions.",
    environmentalImpact: "Eliminates municipal landfill methane emissions.",
    decompositionTime: "2 - 4 weeks",
    preparationSteps: [
      "Remove rubber bands, twist ties, or plastic tags",
      "Place scraps into kitchen compost caddy"
    ]
  },
  {
    id: "bread-bakery-scraps",
    name: "Stale Bread, Crusts, Rice & Cooked Grains",
    category: "Organic",
    material: "Carbohydrate-Rich Biomass",
    color: "#16A34A",
    binName: "Green Compost / Organics Bin",
    recyclingSymbol: "🌱",
    recyclabilityRating: "Commercially Compostable",
    carbonSavedKg: 0.15,
    recycledProduct: "Anaerobic digester biogas, organic compost.",
    instructions: "Wrap in a napkin or paper towel if moist, then place into green organics collection.",
    tips: "Municipal composting facilities reach thermophilic temperatures (130°F - 160°F) that break down cooked starches safely without pests.",
    contaminationWarning: "Ensure plastic bread clip or plastic bag is removed and discarded separately.",
    environmentalImpact: "Recaptures agricultural grain investments into renewable soil nutrients.",
    decompositionTime: "1 - 2 weeks",
    preparationSteps: [
      "Remove plastic bag and plastic closure tab",
      "Toss stale bread or grains into Green Bin"
    ]
  },
  {
    id: "greasy-pizza-box",
    name: "Greasy / Food-Soiled Pizza Box",
    category: "Organic",
    material: "Grease-Soaked Cellulose Fiber & Cheese Residue",
    color: "#16A34A",
    binName: "Green Compost Bin (or Landfill if no organics)",
    recyclingSymbol: "🌱",
    recyclabilityRating: "Commercially Compostable",
    carbonSavedKg: 0.40,
    recycledProduct: "Compost humus (grease and fiber break down naturally in commercial composting).",
    alternativeDisposal: "Tear in half: clean top lid to Blue Recycling, greasy bottom to Green Compost.",
    instructions: "Tear the box along the hinge! Put the clean, dry cardboard lid into Blue Recycling; put the greasy, cheese-soaked base into Green Compost.",
    tips: "Oil and melted grease bond to paper fibers and cannot be washed out during paper mill recycling, forming oil slicks on new paper.",
    contaminationWarning: "Never put food-soaked greasy cardboard in clean blue paper recycling.",
    environmentalImpact: "Composting avoids landfill methane and keeps recycling streams pristine.",
    decompositionTime: "2 - 4 months in compost",
    preparationSteps: [
      "Remove plastic pizza 'saver' tripod table and discard in trash",
      "Tear box at the middle hinge",
      "Place clean top lid into Blue Recycling Bin",
      "Place greasy bottom into Green Organics Bin"
    ],
    componentBreakdown: [
      { part: "Clean Top Lid", material: "Dry Cardboard", binName: "Blue Recycling Bin", category: "Recyclable", action: "Tear off and recycle" },
      { part: "Greasy Bottom Base", material: "Oil-Soaked Cardboard", binName: "Green Compost Bin", category: "Organic", action: "Compost with food waste" },
      { part: "Plastic Tripod Table", material: "Polystyrene Plastic", binName: "Black Landfill Bin", category: "Landfill", action: "Discard in trash" }
    ]
  },
  {
    id: "garden-leaves-grass",
    name: "Garden Leaves, Grass Clippings & Yard Waste",
    category: "Organic",
    material: "Lignin, Cellulose & Nitrogenous Plant Matter",
    color: "#16A34A",
    binName: "Green Yard Waste / Organics Bin",
    recyclingSymbol: "🌱",
    recyclabilityRating: "Commercially Compostable",
    carbonSavedKg: 0.50,
    recycledProduct: "Landscaping mulch, municipal soil enricher, erosion control compost blankets.",
    instructions: "Place in green yard waste bin or paper yard bags. Do not use plastic bags.",
    tips: "Grass clippings supply quick-release nitrogen, while dry leaves supply carbon structure for optimal compost balance.",
    contaminationWarning: "Never include treated lumber, plastic plant pots, dog feces, or synthetic garden hoses.",
    environmentalImpact: "Returns tons of organic biomass back to urban tree canopies and city parks.",
    decompositionTime: "1 - 3 months",
    preparationSteps: [
      "Ensure no rocks, garden tools, or plastic plant tags are mixed in",
      "Load into Green Yard Waste Bin loosely or in certified paper lawn bags"
    ]
  },

  // --- HAZARDOUS (Batteries, E-Waste, Chemicals, Medical) ---
  {
    id: "aa-alkaline-battery",
    name: "AA / AAA Alkaline Battery",
    category: "Hazardous",
    material: "Zinc-Manganese Dioxide (Zn/MnO2), Potassium Hydroxide Electrolyte",
    color: "#DC2626",
    binName: "Red Hazardous / Dedicated Battery Drop-Off",
    recyclingSymbol: "⚠️",
    recyclabilityRating: "Hazardous / Specialized Recovery",
    carbonSavedKg: 0.60,
    recycledProduct: "Recovered zinc for sunscreen/fertilizers, manganese for steel alloying, steel casings for construction.",
    alternativeDisposal: "Hardware store battery drop-off bins (Home Depot, Best Buy, Lowe's) or municipal HHW center.",
    instructions: "Never throw in standard trash or curbside recycling! Tape positive (+) and negative (-) terminals with clear tape to prevent fire sparks, and drop at a certified battery collection depot.",
    tips: "Crushed or shorted batteries in collection trucks cause explosive compactor fires every single week.",
    contaminationWarning: "DO NOT place in blue or green curbside bins! Battery sparks ignite paper and cardboard in sorting facilities.",
    environmentalImpact: "Recycling prevents caustic potassium hydroxide and heavy metals from leaching into groundwater aquifers.",
    decompositionTime: "100+ years (causes hazardous chemical leaching)",
    preparationSteps: [
      "Place clear tape over the positive (+) and negative (-) terminals",
      "Store in a dry plastic container away from metal objects",
      "Take to local electronic store drop-off or municipal HHW facility"
    ]
  },
  {
    id: "lithium-ion-phone-battery",
    name: "Rechargeable Lithium-Ion Battery (Phone / Tool)",
    category: "Hazardous",
    material: "Lithium Cobalt Oxide (LiCoO2) / Graphite Anode, Organic Carbonate Solvent",
    color: "#DC2626",
    binName: "Dedicated E-Waste / Battery Drop-Off Station",
    recyclingSymbol: "⚠️",
    recyclabilityRating: "Hazardous / Specialized Recovery",
    carbonSavedKg: 1.85,
    recycledProduct: "Refined battery-grade lithium, cobalt, nickel, and copper for next-generation EV batteries.",
    alternativeDisposal: "Call2Recycle retail drop-off kiosks in electronics retailers.",
    instructions: "High fire hazard! If battery is swollen or punctured, place in sand or fire-safe bag immediately. Tape terminals and drop at an authorized electronics recycler.",
    tips: "Lithium-ion batteries contain critical strategic minerals that can be hydrometallurgically refined back into new batteries.",
    contaminationWarning: "EXTREME FIRE HAZARD. Lithium batteries punctured by garbage truck compactors violently explode and ignite.",
    environmentalImpact: "Prevents toxic cobalt and nickel pollution while recovering critical rare earth elements.",
    decompositionTime: "Does not decompose (poses severe fire & toxicity risk)",
    preparationSteps: [
      "Inspect battery: if swollen or leaking, store in non-flammable container with sand",
      "Cover metallic contact pins with electrical tape",
      "Bring to certified municipal e-waste recycling depot"
    ]
  },
  {
    id: "old-electronics-phone-charger",
    name: "Old Smartphone, Laptop & Charging Cable (E-Waste)",
    category: "Hazardous",
    material: "Copper Wiring, Gold/Silver Circuitry, Printed Circuit Boards (PCBs), Flame-Retardant ABS",
    color: "#DC2626",
    binName: "Municipal E-Waste Recycling Depot",
    recyclingSymbol: "⚠️",
    recyclabilityRating: "Hazardous / Specialized Recovery",
    carbonSavedKg: 3.20,
    recycledProduct: "Gold, silver, palladium, high-purity copper cathodes, recycled ABS plastics.",
    alternativeDisposal: "Manufacturer trade-in (Apple, Google, Samsung) or electronics store drop-off bin.",
    instructions: "Perform a factory reset to wipe personal data. Deposit at an authorized e-waste collection center or charity refurbishment program.",
    tips: "One metric ton of circuit boards contains 40 to 800 times more gold than one metric ton of mined gold ore.",
    contaminationWarning: "Lead solders and brominated flame retardants in electronics contaminate standard municipal landfills.",
    environmentalImpact: "Conserves rare precious metals and prevents toxic lead/cadmium soil pollution.",
    decompositionTime: "Over 1,000 years",
    preparationSteps: [
      "Backup files and perform factory data wipe",
      "Bundle charging cables with twist-tie",
      "Deliver to certified electronics drop-off location"
    ]
  },
  {
    id: "fluorescent-cfl-bulb",
    name: "CFL Fluorescent Lightbulb & Tube",
    category: "Hazardous",
    material: "Mercury Vapor (Hg), Phosphor Powder Coating, Borosilicate Glass",
    color: "#DC2626",
    binName: "Red Hazardous Waste Facility",
    resinCode: "Hazardous Mercury",
    recyclingSymbol: "⚠️",
    recyclabilityRating: "Hazardous / Specialized Recovery",
    carbonSavedKg: 0.40,
    recycledProduct: "Distilled elemental mercury for industrial instruments, recycled phosphor powders, and glass cullet.",
    alternativeDisposal: "IKEA, Lowe's, or Home Depot bulb recycling drop-off kiosks.",
    instructions: "Package carefully in original carton or padded box to prevent breakage. If broken, ventilate room for 15 minutes, scoop with cardboard (never vacuum!), and seal in airtight jar.",
    tips: "Standard LED and incandescent bulbs can go in landfill; CFLs and fluorescent tubes ALWAYS require hazardous handling due to toxic mercury vapor.",
    contaminationWarning: "Even tiny amounts of mercury vapor released from broken tubes bioaccumulate in marine food chains.",
    environmentalImpact: "Safely captures neurotoxic mercury and prevents atmospheric release.",
    decompositionTime: "Glass lasts centuries; mercury persists forever",
    preparationSteps: [
      "Handle by the plastic base, never twist by the glass tube",
      "Place in padded box to avoid shattering during transport",
      "Deliver to designated municipal hazardous waste event"
    ]
  },
  {
    id: "expired-medicine-blister",
    name: "Expired Prescription Medicines & Blister Packs",
    category: "Hazardous",
    material: "Active Pharmaceutical Ingredients (APIs), Aluminum Foil & PVC Laminate",
    color: "#DC2626",
    binName: "Pharmacy Drug Take-Back Kiosk",
    recyclingSymbol: "⚠️",
    recyclabilityRating: "Hazardous / Specialized Recovery",
    carbonSavedKg: 0.10,
    recycledProduct: "High-temperature clinical incineration (prevents active drug compounds from entering municipal water reservoirs).",
    alternativeDisposal: "National Drug Take-Back Day drop boxes in local pharmacies and police stations.",
    instructions: "NEVER flush pills down the toilet or sink! Remove personal prescription labels, leave pills in bottles or blister packs, and drop into pharmacy take-back bins.",
    tips: "Municipal wastewater treatment plants cannot filter out antibiotics, hormones, or psychiatric medications from tap water.",
    contaminationWarning: "Flushed pharmaceuticals contaminate river ecosystems, causing fish mutations and antibiotic resistance.",
    environmentalImpact: "Guarantees clean drinking water watersheds and protects aquatic wildlife.",
    decompositionTime: "Chemical compounds persist in aquifers for decades",
    preparationSteps: [
      "Scratch out or blacken personal identification on prescription bottle",
      "Keep pills sealed in original container",
      "Drop into local pharmacy take-back collection receptacle"
    ]
  },
  {
    id: "spray-paint-can",
    name: "Aerosol Spray Paint & Solvent Can",
    category: "Hazardous",
    material: "Pressurized Propellant (Propane/Butane), Volatile Organic Solvents (VOCs), Steel Can",
    color: "#DC2626",
    binName: "Red Hazardous Waste Bin / HHW Depot",
    recyclingSymbol: "⚠️",
    recyclabilityRating: "Hazardous / Specialized Recovery",
    carbonSavedKg: 0.70,
    recycledProduct: "Punctured and degassed steel scrap for blast furnace smelting; solvent fuel blending.",
    instructions: "If completely empty with zero hiss when nozzle is pressed, some cities accept in blue steel recycling. If any liquid or pressure remains, it MUST go to hazardous waste.",
    tips: "Pressurized aerosol cans can explode violently under the hydraulic pressure of municipal recycling compactors.",
    contaminationWarning: "Explosion and fire risk when compressed in standard waste vehicles.",
    environmentalImpact: "Prevents ground-level ozone smog and dangerous solvent chemical fires.",
    decompositionTime: "50 - 100 years",
    preparationSteps: [
      "Hold nozzle in safe direction outdoors to confirm if empty",
      "If propellant or paint remains, label and take to hazardous drop-off",
      "If 100% empty and dry, verify if local blue bin accepts empty aerosols"
    ]
  },

  // --- LANDFILL (Non-Recyclable Residual Waste) ---
  {
    id: "styrofoam-takeout-container",
    name: "Expanded Polystyrene (Styrofoam #6)",
    category: "Landfill",
    material: "Expanded Polystyrene Foam (PS #6) - 95% Trapped Air",
    color: "#64748B",
    binName: "Black / Grey Landfill Bin",
    resinCode: "♸ #6 PS",
    recyclingSymbol: "🚯",
    recyclabilityRating: "Non-Recyclable Landfill Residual",
    carbonSavedKg: 0.0,
    recycledProduct: "Rarely recycled curbside due to low density and food grease contamination.",
    alternativeDisposal: "Specialized polystyrene densifier drop-off centers if available locally.",
    instructions: "Scrape food remnants and place into standard black landfill bin. Do not place in blue recycling!",
    tips: "Styrofoam is 95% air and crumbles into microplastic foam beads during transport, hopelessly contaminating paper and glass recycling lines.",
    contaminationWarning: "Styrofoam beads break into millions of static-charged pieces that clog recycling screens.",
    environmentalImpact: "Persists in ecosystems for hundreds of years and breaks down into hazardous microplastics.",
    decompositionTime: "500+ years (does not biodegrade)",
    preparationSteps: [
      "Wipe out excess food sauces",
      "Bag securely to prevent lightweight foam beads from blowing away",
      "Place into Black Landfill Bin"
    ]
  },
  {
    id: "chip-bag-metallic-film",
    name: "Chip / Snack Bag (Multi-layer Metallized Film)",
    category: "Landfill",
    material: "Multi-layer Laminated Polypropylene (BOPP) & Vacuum-Deposited Aluminum",
    color: "#64748B",
    binName: "Black / Grey Landfill Bin",
    resinCode: "♹ #7 OTHER (Composite)",
    recyclingSymbol: "🚯",
    recyclabilityRating: "Non-Recyclable Landfill Residual",
    carbonSavedKg: 0.0,
    recycledProduct: "TerraCycle mail-in programs for plastic pellets/park furniture.",
    instructions: "Crush the empty bag and throw it into the black landfill bin.",
    tips: "Do the 'Crinkle Test': If a shiny package crinkles loudly and does not stay flat when folded, it is multi-layer metallized film and cannot be recycled in standard curbside bins.",
    contaminationWarning: "Foil-plastic bonded packaging cannot be separated mechanically in water pulpers or standard plastic melt extruders.",
    environmentalImpact: "Non-degradable polymer layers persist for centuries in landfills.",
    decompositionTime: "80 - 100 years",
    preparationSteps: [
      "Ensure all snack crumbs are emptied",
      "Tuck into standard landfill trash bag",
      "Place in Black Landfill Bin"
    ]
  },
  {
    id: "disposable-coffee-cup",
    name: "Disposable Paper Takeout Coffee Cup",
    category: "Landfill",
    material: "Bleached Paperboard with Polyethylene (PE) Waterproof Inner Plastic Coating",
    color: "#64748B",
    binName: "Black / Grey Landfill Bin",
    resinCode: "C/PAP 81",
    recyclingSymbol: "🚯",
    recyclabilityRating: "Non-Recyclable Landfill Residual",
    carbonSavedKg: 0.0,
    recycledProduct: "Specialized carton pulping mills (in select forward-thinking cities only).",
    alternativeDisposal: "Bring a reusable stainless steel or glass travel mug for discounts.",
    instructions: "Separate the 3 parts: White plastic lid goes into Blue Recycling (if marked #5 PP), cardboard heat sleeve goes into Blue Recycling, but the paper cup itself MUST go into the Black Landfill bin.",
    tips: "Takeout paper cups have a thin plastic resin layer fused to the paper interior to prevent leaks, preventing the paper from dissolving in standard recycling pulpers.",
    contaminationWarning: "Putting liquid-filled coffee cups in recycling bins soaks clean paper bales, sending tons of recyclable paper straight to landfills.",
    environmentalImpact: "Over 50 billion single-use paper cups are landfilled annually worldwide.",
    decompositionTime: "20 - 30 years (plastic lining never biodegrades)",
    preparationSteps: [
      "Pour out remaining coffee liquid",
      "Pull off cardboard sleeve -> Blue Recycling Bin",
      "Pull off plastic lid -> Check resin code (#5 -> Blue Bin, otherwise Landfill)",
      "Place wax/plastic-lined paper cup -> Black Landfill Bin"
    ],
    componentBreakdown: [
      { part: "Plastic Sip Lid", material: "PP #5 or PS #6 Plastic", binName: "Blue Recycling Bin (if #5)", category: "Recyclable", action: "Check code, recycle if #5" },
      { part: "Cardboard Heat Sleeve", material: "Kraft Paperboard", binName: "Blue Recycling Bin", category: "Recyclable", action: "Slide off and recycle" },
      { part: "Coated Paper Cup Body", material: "PE-Lined Paperboard", binName: "Black Landfill Bin", category: "Landfill", action: "Place in general landfill waste" }
    ]
  },
  {
    id: "broken-ceramic-mug-plate",
    name: "Broken Ceramic Mug, Porcelain Plate & Drinking Glass",
    category: "Landfill",
    material: "Fired Clay, Glazed Porcelain, Lead Crystal or Borosilicate Glass",
    color: "#64748B",
    binName: "Black / Grey Landfill Bin",
    recyclingSymbol: "🚯",
    recyclabilityRating: "Non-Recyclable Landfill Residual",
    carbonSavedKg: 0.0,
    recycledProduct: "Crushed as inert structural aggregate or mosaic art craft projects.",
    instructions: "Wrap broken sharp pieces securely in newspaper or cardboard before placing in the black bin to protect sanitation workers from cuts.",
    tips: "Ceramics and drinking glassware melt at significantly higher temperatures than container glass jars, causing structural flaws in recycled bottles.",
    contaminationWarning: "Never toss drinking glasses or pottery into the blue glass recycling bin.",
    environmentalImpact: "Inert mineral that does not generate greenhouse gases.",
    decompositionTime: "1,000,000+ years (inert stone-like material)",
    preparationSteps: [
      "Carefully collect all sharp shards",
      "Wrap inside old newspaper or folded cardboard",
      "Tape securely and place into Black Landfill Bin"
    ]
  },
  {
    id: "plastic-straw-cutlery",
    name: "Plastic Straw, Single-Use Fork & Spoon",
    category: "Landfill",
    material: "Polystyrene (PS #6) or Polypropylene (PP #5) - Small Format",
    color: "#64748B",
    binName: "Black / Grey Landfill Bin",
    resinCode: "♸ #6 PS",
    recyclingSymbol: "🚯",
    recyclabilityRating: "Non-Recyclable Landfill Residual",
    carbonSavedKg: 0.0,
    recycledProduct: "Commercial industrial recycling only when bundled in massive batches.",
    instructions: "Throw in black landfill bin. Items smaller than 2 inches (5cm) fall through sorting conveyor screens into the landfill residue chute.",
    tips: "Switching to reusable bamboo, metal, or pasta straws eliminates single-use plastic waste.",
    contaminationWarning: "Small plastic cutlery falls between conveyor belts and jams rotating disc sorters.",
    environmentalImpact: "Major component of coastal plastic debris harmful to marine organisms.",
    decompositionTime: "200 - 400 years",
    preparationSteps: [
      "Wipe off food sauces",
      "Place into Black Landfill Bin"
    ]
  },
  {
    id: "sanitary-wipes-diapers",
    name: "Sanitary Wipes, Wet Wipes & Disposable Diapers",
    category: "Landfill",
    material: "Synthetic Polyester Non-Woven Fibers, Polyacrylate Superabsorbent Polymer",
    color: "#64748B",
    binName: "Black / Grey Landfill Bin",
    recyclingSymbol: "🚯",
    recyclabilityRating: "Non-Recyclable Landfill Residual",
    carbonSavedKg: 0.0,
    recycledProduct: "Waste-to-Energy thermal conversion.",
    instructions: "Wrap soiled items in a sanitary bag and place directly in the black landfill bin. NEVER flush wipes down toilets!",
    tips: "Even wipes marketed as 'flushable' contain synthetic plastic fibers that do not disintegrate, causing massive municipal sewer 'fatbergs'.",
    contaminationWarning: "Biohazard and hygiene contamination; never place in green compost or blue recycling.",
    environmentalImpact: "Contains synthetic plastics that release microfibers into water systems.",
    decompositionTime: "250 - 500 years",
    preparationSteps: [
      "Roll up soiled item securely",
      "Seal in small trash liner bag",
      "Deposit into Black Landfill Bin"
    ]
  }
];

// Helper search function to match any query to the most relevant waste item
export function findCatalogItem(query: string): WasteItem | null {
  if (!query) return null;
  const normalized = query.toLowerCase().trim();

  // Direct match by ID
  const directId = WASTE_CATALOG.find((item) => item.id === normalized);
  if (directId) return directId;

  // Exact or near match by name
  const directName = WASTE_CATALOG.find((item) => item.name.toLowerCase() === normalized);
  if (directName) return directName;

  // Keyword dictionary for instant matching
  const keywordMappings: Record<string, string> = {
    // Recyclables
    bottle: "plastic-bottle",
    coke: "aluminum-soda-can",
    pepsi: "aluminum-soda-can",
    can: "aluminum-soda-can",
    soda: "aluminum-soda-can",
    beer: "aluminum-soda-can",
    aluminum: "aluminum-soda-can",
    glass: "glass-jar-bottle",
    jar: "glass-jar-bottle",
    box: "cardboard-shipping-box",
    cardboard: "cardboard-shipping-box",
    amazon: "cardboard-shipping-box",
    package: "cardboard-shipping-box",
    steel: "steel-food-can",
    tin: "steel-food-can",
    soup: "steel-food-can",
    tuna: "steel-food-can",
    milk: "milk-carton-tetrapak",
    carton: "milk-carton-tetrapak",
    tetrapak: "milk-carton-tetrapak",
    juice: "milk-carton-tetrapak",
    shampoo: "shampoo-hdpe-bottle",
    conditioner: "shampoo-hdpe-bottle",
    lotion: "shampoo-hdpe-bottle",
    detergent: "shampoo-hdpe-bottle",
    newspaper: "newspaper-magazine",
    paper: "newspaper-magazine",
    magazine: "newspaper-magazine",
    book: "newspaper-magazine",
    flyer: "newspaper-magazine",
    envelope: "newspaper-magazine",
    pet: "plastic-bottle",
    hdpe: "shampoo-hdpe-bottle",

    // Organic
    banana: "banana-peel",
    peel: "banana-peel",
    apple: "banana-peel",
    fruit: "banana-peel",
    orange: "banana-peel",
    citrus: "banana-peel",
    coffee: "coffee-grounds-filter",
    espresso: "coffee-grounds-filter",
    tea: "coffee-grounds-filter",
    filter: "coffee-grounds-filter",
    egg: "eggshells",
    eggshell: "eggshells",
    vegetable: "vegetable-scraps",
    carrot: "vegetable-scraps",
    salad: "vegetable-scraps",
    lettuce: "vegetable-scraps",
    potato: "vegetable-scraps",
    onion: "vegetable-scraps",
    bread: "bread-bakery-scraps",
    crust: "bread-bakery-scraps",
    toast: "bread-bakery-scraps",
    rice: "bread-bakery-scraps",
    pasta: "bread-bakery-scraps",
    pizza: "greasy-pizza-box",
    dominos: "greasy-pizza-box",
    leaves: "garden-leaves-grass",
    grass: "garden-leaves-grass",
    yard: "garden-leaves-grass",
    plant: "garden-leaves-grass",
    flower: "garden-leaves-grass",

    // Hazardous
    battery: "aa-alkaline-battery",
    batteries: "aa-alkaline-battery",
    duracell: "aa-alkaline-battery",
    energizer: "aa-alkaline-battery",
    lithium: "lithium-ion-phone-battery",
    phone: "old-electronics-phone-charger",
    charger: "old-electronics-phone-charger",
    cable: "old-electronics-phone-charger",
    wire: "old-electronics-phone-charger",
    laptop: "old-electronics-phone-charger",
    bulb: "fluorescent-cfl-bulb",
    cfl: "fluorescent-cfl-bulb",
    fluorescent: "fluorescent-cfl-bulb",
    tube: "fluorescent-cfl-bulb",
    medicine: "expired-medicine-blister",
    pill: "expired-medicine-blister",
    pills: "expired-medicine-blister",
    drug: "expired-medicine-blister",
    pharma: "expired-medicine-blister",
    spray: "spray-paint-can",
    aerosol: "spray-paint-can",
    paint: "spray-paint-can",
    wd40: "spray-paint-can",
    deodorant: "spray-paint-can",

    // Landfill
    styrofoam: "styrofoam-takeout-container",
    foam: "styrofoam-takeout-container",
    polystyrene: "styrofoam-takeout-container",
    chips: "chip-bag-metallic-film",
    snack: "chip-bag-metallic-film",
    doritos: "chip-bag-metallic-film",
    lays: "chip-bag-metallic-film",
    wrapper: "chip-bag-metallic-film",
    cup: "disposable-coffee-cup",
    starbucks: "disposable-coffee-cup",
    mug: "broken-ceramic-mug-plate",
    ceramic: "broken-ceramic-mug-plate",
    plate: "broken-ceramic-mug-plate",
    shards: "broken-ceramic-mug-plate",
    porcelain: "broken-ceramic-mug-plate",
    straw: "plastic-straw-cutlery",
    fork: "plastic-straw-cutlery",
    spoon: "plastic-straw-cutlery",
    knife: "plastic-straw-cutlery",
    cutlery: "plastic-straw-cutlery",
    wipe: "sanitary-wipes-diapers",
    wipes: "sanitary-wipes-diapers",
    diaper: "sanitary-wipes-diapers",
    pampers: "sanitary-wipes-diapers",
    tissue: "sanitary-wipes-diapers",
  };

  const words = normalized.split(/[\s,._-]+/);
  for (const word of words) {
    if (keywordMappings[word]) {
      const match = WASTE_CATALOG.find((item) => item.id === keywordMappings[word]);
      if (match) return match;
    }
  }

  // Broad substring search across title, instructions, material
  return (
    WASTE_CATALOG.find(
      (item) =>
        item.name.toLowerCase().includes(normalized) ||
        item.material.toLowerCase().includes(normalized) ||
        item.instructions.toLowerCase().includes(normalized) ||
        (item.resinCode && item.resinCode.toLowerCase().includes(normalized))
    ) || null
  );
}
