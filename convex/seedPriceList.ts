import { internalMutation } from "./_generated/server";

type CategorySeed = {
  name: string;
  icon: string;
  sortOrder: number;
};

type VariationSeed = {
  name: string;
  quantityMg: number;
  price: number;
};

type ProductSeed = {
  name: string;
  description: string;
  basePrice: number;
  category: string;
  featured: boolean;
  variations: VariationSeed[];
};

const CATEGORIES: CategorySeed[] = [
  { name: "Weight Management", icon: "Scale", sortOrder: 1 },
  { name: "Beauty & Anti-Aging", icon: "Sparkles", sortOrder: 2 },
  { name: "Wellness & Vitality", icon: "Heart", sortOrder: 3 },
  { name: "Add-Ons", icon: "ShoppingBag", sortOrder: 99 },
];

const PRODUCTS: ProductSeed[] = [
  // ── Weight Loss ──────────────────────────────────────────────
  {
    name: "Tirzepatide 15mg",
    description: "GLP-1/GIP dual agonist for weight management. 15mg vial.",
    basePrice: 1200,
    category: "Weight Management",
    featured: true,
    variations: [
      { name: "Vial", quantityMg: 15, price: 1200 },
      { name: "Set", quantityMg: 15, price: 1700 },
      { name: "Kit / Box", quantityMg: 15, price: 6500 },
    ],
  },
  {
    name: "Tirzepatide 30mg",
    description: "GLP-1/GIP dual agonist for weight management. 30mg vial.",
    basePrice: 1800,
    category: "Weight Management",
    featured: true,
    variations: [
      { name: "Vial", quantityMg: 30, price: 1800 },
      { name: "Set", quantityMg: 30, price: 2500 },
      { name: "Kit / Box", quantityMg: 30, price: 7500 },
    ],
  },
  {
    name: "Retatrutide 10mg",
    description: "Triple agonist (GLP-1/GIP/Glucagon) for weight management. 10mg.",
    basePrice: 1200,
    category: "Weight Management",
    featured: true,
    variations: [
      { name: "Vial", quantityMg: 10, price: 1200 },
      { name: "Set", quantityMg: 10, price: 1800 },
      { name: "Kit / Box", quantityMg: 10, price: 8000 },
    ],
  },
  {
    name: "Retatrutide 20mg",
    description: "Triple agonist (GLP-1/GIP/Glucagon) for weight management. 20mg.",
    basePrice: 1800,
    category: "Weight Management",
    featured: true,
    variations: [
      { name: "Vial", quantityMg: 20, price: 1800 },
      { name: "Set", quantityMg: 20, price: 2500 },
      { name: "Kit / Box", quantityMg: 20, price: 10500 },
    ],
  },
  {
    name: "Cagrilintide 5mg",
    description: "Long-acting amylin analogue for appetite control. 5mg vial.",
    basePrice: 1200,
    category: "Weight Management",
    featured: false,
    variations: [
      { name: "Vial", quantityMg: 5, price: 1200 },
      { name: "Set", quantityMg: 5, price: 1500 },
      { name: "Kit / Box", quantityMg: 5, price: 7500 },
    ],
  },

  // ── Longevity & Energy ───────────────────────────────────────
  {
    name: "Lipo C w/ B12",
    description: "Lipotropic blend with vitamin B12 for energy and metabolic support.",
    basePrice: 1200,
    category: "Wellness & Vitality",
    featured: false,
    variations: [
      { name: "Vial", quantityMg: 0, price: 1200 },
      { name: "Set", quantityMg: 0, price: 1500 },
      { name: "Kit / Box", quantityMg: 0, price: 7000 },
    ],
  },
  {
    name: "NAD+ 500mg",
    description: "NAD+ for cellular energy, longevity, and recovery. 500mg vial.",
    basePrice: 1100,
    category: "Wellness & Vitality",
    featured: true,
    variations: [
      { name: "Vial", quantityMg: 500, price: 1100 },
      { name: "Set", quantityMg: 500, price: 1500 },
      { name: "Kit / Box", quantityMg: 500, price: 6500 },
    ],
  },

  // ── Beauty Glow ──────────────────────────────────────────────
  {
    name: "GHK-Cu 50mg",
    description: "Copper peptide for skin rejuvenation and elasticity. 50mg vial.",
    basePrice: 1000,
    category: "Beauty & Anti-Aging",
    featured: true,
    variations: [
      { name: "Vial", quantityMg: 50, price: 1000 },
      { name: "Set", quantityMg: 50, price: 1200 },
      { name: "Kit / Box", quantityMg: 50, price: 5000 },
    ],
  },
  {
    name: "GHK-Cu 100mg",
    description: "Copper peptide for skin rejuvenation and elasticity. 100mg vial.",
    basePrice: 1200,
    category: "Beauty & Anti-Aging",
    featured: false,
    variations: [
      { name: "Vial", quantityMg: 100, price: 1200 },
      { name: "Set", quantityMg: 100, price: 1500 },
      { name: "Kit / Box", quantityMg: 100, price: 6000 },
    ],
  },
  {
    name: "KPV 10mg",
    description: "Anti-inflammatory peptide for skin and gut health. 10mg vial.",
    basePrice: 1200,
    category: "Beauty & Anti-Aging",
    featured: false,
    variations: [
      { name: "Vial", quantityMg: 10, price: 1200 },
      { name: "Set", quantityMg: 10, price: 1500 },
      { name: "Kit / Box", quantityMg: 10, price: 6000 },
    ],
  },
  {
    name: "GTT 1500mg",
    description: "Glutathione for antioxidant support and skin glow. 1500mg vial.",
    basePrice: 1200,
    category: "Beauty & Anti-Aging",
    featured: false,
    variations: [
      { name: "Vial", quantityMg: 1500, price: 1200 },
      { name: "Set", quantityMg: 1500, price: 1500 },
      { name: "Kit / Box", quantityMg: 1500, price: 6500 },
    ],
  },

  // ── Add-Ons ──────────────────────────────────────────────────
  {
    name: "Insulin Syringe (10pcs)",
    description: "Insulin syringes, pack of 10.",
    basePrice: 60,
    category: "Add-Ons",
    featured: false,
    variations: [],
  },
  {
    name: "3ml/cc Syringe",
    description: "3ml/cc syringe (single).",
    basePrice: 5,
    category: "Add-Ons",
    featured: false,
    variations: [],
  },
  {
    name: "Alcohol Pads (10pcs)",
    description: "Sterile alcohol pads, pack of 10.",
    basePrice: 10,
    category: "Add-Ons",
    featured: false,
    variations: [],
  },
  {
    name: "Pink Vial Case (2-slot)",
    description: "Pink vial carrying case with 2 slots.",
    basePrice: 100,
    category: "Add-Ons",
    featured: false,
    variations: [],
  },
];

export const run = internalMutation({
  args: {},
  handler: async (ctx) => {
    let categoriesUpserted = 0;
    let productsInserted = 0;
    let variationsInserted = 0;

    const categoryIdsByName = new Map<string, string>();

    for (const cat of CATEGORIES) {
      const existing = await ctx.db
        .query("categories")
        .withIndex("by_name", (q) => q.eq("name", cat.name))
        .unique();
      if (existing) {
        await ctx.db.patch(existing._id, {
          icon: cat.icon,
          sortOrder: cat.sortOrder,
          active: true,
        });
        categoryIdsByName.set(cat.name, existing._id);
      } else {
        const id = await ctx.db.insert("categories", { ...cat, active: true });
        categoryIdsByName.set(cat.name, id);
      }
      categoriesUpserted += 1;
    }

    for (const product of PRODUCTS) {
      const categoryId = categoryIdsByName.get(product.category);
      if (!categoryId) {
        throw new Error(`Missing category for product: ${product.name}`);
      }

      const existing = await ctx.db
        .query("products")
        .withIndex("by_name", (q) => q.eq("name", product.name))
        .unique();

      let productId: string;
      if (existing) {
        await ctx.db.patch(existing._id, {
          description: product.description,
          basePrice: product.basePrice,
          categoryId: categoryId as any,
          available: true,
          featured: product.featured,
          stockQuantity: 1,
        });
        productId = existing._id;

        const oldVariations = await ctx.db
          .query("productVariations")
          .withIndex("by_product", (q) => q.eq("productId", existing._id))
          .collect();
        for (const v of oldVariations) await ctx.db.delete(v._id);
      } else {
        productId = await ctx.db.insert("products", {
          name: product.name,
          description: product.description,
          basePrice: product.basePrice,
          categoryId: categoryId as any,
          available: true,
          featured: product.featured,
          stockQuantity: 1,
        });
        productsInserted += 1;
      }

      for (const variation of product.variations) {
        await ctx.db.insert("productVariations", {
          productId: productId as any,
          name: variation.name,
          quantityMg: variation.quantityMg,
          price: variation.price,
          stockQuantity: 1,
        });
        variationsInserted += 1;
      }
    }

    return { categoriesUpserted, productsInserted, variationsInserted };
  },
});
