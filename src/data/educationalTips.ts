import { EducationalArticle } from "../types";

export const EDUCATIONAL_ARTICLES: EducationalArticle[] = [
  {
    id: "wishcycling-trap",
    title: "The 'Wishcycling' Trap: Why Good Intentions Can Ruin Recycling",
    category: "Myth Buster",
    readTime: "3 min read",
    summary: "Putting non-recyclable items into the recycling bin hoping they will be recycled causes massive equipment damage and rejects entire truckloads.",
    content: [
      "Wishcycling happens when we toss an item into the recycling bin with the best of intentions, thinking: 'This looks useful, surely someone will figure out how to recycle it!'",
      "In reality, sorting facilities (MRFs) rely on high-speed automated optical scanners, ballistic separators, and human sorters. Items like plastic garden hoses, metal chains, and soft plastic grocery bags wrap around spinning axles, forcing facilities to shut down for hours while workers manually cut tangles.",
      "Furthermore, when food-stained items or unrinsed bottles burst in paper balers, the paper pulp fibers become saturated with grease and sugars, turning tons of clean cardboard into unrecyclable landfill waste.",
      "Golden Rule: When in doubt, look it up in this assistant or place it in the landfill bin to protect the integrity of the recycling stream."
    ],
    keyTakeaway: "Putting one contaminated item in recycling can spoil an entire batch of clean recyclables.",
    badge: "Crucial Rule"
  },
  {
    id: "battery-safety",
    title: "Battery Fire Hazard: Never Throw Batteries in Household Bins",
    category: "Hazardous Safety",
    readTime: "2 min read",
    summary: "Compactors in garbage trucks and recycling plants crush batteries, creating instant explosive thermal runaway fires.",
    content: [
      "Lithium-ion batteries (found in vapes, wireless earbuds, phones, laptops, and toys) and even standard 9V alkaline batteries are the leading cause of catastrophic fires in waste management facilities worldwide.",
      "When a garbage truck's hydraulic compactor crushes a battery, the thin internal separator punctures. The resulting short circuit triggers thermal runaway within seconds, generating temperatures over 1,000°F (537°C) right next to dry cardboard and paper.",
      "How to dispose safely: Store spent batteries in a dry cardboard box. Place a strip of clear tape over both positive (+) and negative (-) terminals, then take them to a free drop-off box at your local grocery or hardware store."
    ],
    keyTakeaway: "Tape terminal ends with clear tape and drop off at battery kiosks. Never put in household bins.",
    badge: "Life Safety"
  },
  {
    id: "pizza-box-rule",
    title: "The Pizza Box Dilemma: Greasy Bottom vs Clean Lid",
    category: "Recycling Guide",
    readTime: "2 min read",
    summary: "How to properly segregate pizza boxes without ruining paper recycling or wasting compostable fiber.",
    content: [
      "Corrugated cardboard is one of the highest-value recyclable commodities. However, paper recycling is a water-based process where paper is mixed with warm water to create a slurry. Oil and grease from melted mozzarella cheese do not mix with water; oil binds directly to the cellulose fibers and creates greasy voids in new paper sheets.",
      "The Solution is Simple: Perform the 2-Second Tear. Tear the lid off (which is usually clean and dry) and place it in the Blue Recycling Bin. Put the grease-soaked bottom into your Green Organics/Compost Bin, where micro-organisms happily consume the oils!"
    ],
    keyTakeaway: "Clean top half = Blue Recycling. Greasy bottom half = Green Compost.",
    badge: "Quick Hack"
  },
  {
    id: "rinse-myth",
    title: "How Clean is 'Clean Enough' for Recyclables?",
    category: "Recycling Guide",
    readTime: "3 min read",
    summary: "You don't need dish soap or a dishwasher cycle. A quick 3-second rinse is all it takes.",
    content: [
      "Many people think recyclables need to be surgically spotless, leading some to run peanut butter jars through the dishwasher — wasting gallons of clean drinking water.",
      "Recycling plants do not need containers to be sterile. They only need containers to be empty and free of bulk food residues. A quick swirl with a splash of leftover dishwater (or scraping peanut butter with a spatula) is 100% sufficient.",
      "Containers that are dripping wet or full of half-eaten yogurt or salad dressing will attract flies, mold, and rats, making working conditions unsafe for human sorters."
    ],
    keyTakeaway: "Empty liquids, scrape food, and give a 3-second rinse with dishwater. No dishwashing required.",
    badge: "Eco Tip"
  },
  {
    id: "plastic-numbers",
    title: "Demystifying Resin Identification Codes (#1 to #7)",
    category: "Recycling Guide",
    readTime: "4 min read",
    summary: "The chasing arrows symbol does NOT mean an item is curbside recyclable. Learn what the numbers really mean.",
    content: [
      "#1 PET (Water bottles, soda bottles): Highly recyclable. Melted into carpet fiber, fleece jackets, and new bottles.",
      "#2 HDPE (Milk jugs, shampoo, detergent bottles): Highly recyclable. Robust, durable plastic made into pipes, plastic lumber, and toys.",
      "#3 PVC (Pipes, vinyl flooring, blister packaging): Rarely recyclable curbside. Contains chlorine and plasticizers.",
      "#4 LDPE (Bread bags, bubble wrap, squeeze bottles): Recyclable at specialized grocery store collection bins; not in curbside bins.",
      "#5 PP (Yogurt tubs, sour cream tubs, bottle caps, takeout tubs): Widely recyclable in modern facilities. Made into automotive parts and storage bins.",
      "#6 PS (Styrofoam, disposable party cups, meat trays): Landfill in almost all municipal curbside systems.",
      "#7 OTHER (Multi-layer films, PLA bioplastics, polycarbonate): Landfill or specialized industrial facility."
    ],
    keyTakeaway: "#1, #2, and #5 are the gold standards for household curbside recycling.",
    badge: "Reference"
  },
  {
    id: "composting-browns-greens",
    title: "Composting 101: The Perfect Carbon-to-Nitrogen Balance",
    category: "Composting",
    readTime: "3 min read",
    summary: "Keep your home compost odor-free and fast-decomposing by balancing browns (carbon) and greens (nitrogen).",
    content: [
      "A healthy compost pile never smells like rotten garbage; it smells like a fresh forest floor after rain.",
      "Greens (Nitrogen): Fruit peels, vegetable cuttings, coffee grounds, fresh grass trimmings. These provide moisture and protein for micro-organisms to multiply.",
      "Browns (Carbon): Dry leaves, shredded unprinted cardboard, straw, sawdust. These provide structural air pockets and carbon energy.",
      "The Golden Ratio: Maintain approximately 2 to 3 parts Browns for every 1 part Greens. Always cover fresh kitchen scraps with a layer of dry leaves or shredded cardboard to deter fruit flies."
    ],
    keyTakeaway: "Layer 3 parts dry brown material (leaves/cardboard) for every 1 part wet kitchen food scraps.",
    badge: "Garden Guide"
  }
];
