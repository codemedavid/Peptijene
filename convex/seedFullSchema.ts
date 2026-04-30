import { internalMutation } from "./_generated/server";

const CATEGORIES = [
  { name: "Peptides", icon: "FlaskConical", sortOrder: 1 },
  { name: "Weight Management", icon: "Scale", sortOrder: 2 },
  { name: "Beauty & Anti-Aging", icon: "Sparkles", sortOrder: 3 },
  { name: "Wellness & Vitality", icon: "Heart", sortOrder: 4 },
  { name: "GLP-1 Agonists", icon: "Pill", sortOrder: 5 },
  { name: "Insulin Pens", icon: "Syringe", sortOrder: 6 },
  { name: "Accessories", icon: "Package", sortOrder: 7 },
  { name: "Bundles & Kits", icon: "Gift", sortOrder: 8 },
  // preserved from earlier price-list seed
  { name: "Add-Ons", icon: "ShoppingBag", sortOrder: 99 },
];

const SITE_SETTINGS = [
  { key: "site_name", value: "Peptide Pulse", type: "text", description: "The name of the website" },
  { key: "site_logo", value: "/assets/logo.jpeg", type: "image", description: "The logo image URL for the site" },
  { key: "site_description", value: "Premium Peptide Solutions", type: "text", description: "Short description of the site" },
  { key: "currency", value: "₱", type: "text", description: "Currency symbol for prices" },
  { key: "hero_title_prefix", value: "Premium", type: "text", description: "Hero title prefix" },
  { key: "hero_title_highlight", value: "Peptides", type: "text", description: "Hero title highlighted word" },
  { key: "hero_title_suffix", value: "& Essentials", type: "text", description: "Hero title suffix" },
  { key: "coa_page_enabled", value: "true", type: "boolean", description: "Enable/disable the COA page" },
];

const PAYMENT_METHODS = [
  { name: "GCash", accountNumber: "", accountName: "Peptide Pulse", active: true, sortOrder: 1 },
  { name: "BDO", accountNumber: "", accountName: "Peptide Pulse", active: true, sortOrder: 2 },
  { name: "Security Bank", accountNumber: "", accountName: "Peptide Pulse", active: true, sortOrder: 3 },
];

const SHIPPING_LOCATIONS = [
  { code: "LBC_METRO_MANILA",  name: "LBC - Metro Manila",                  fee: 150, orderIndex: 1 },
  { code: "LBC_LUZON",         name: "LBC - Luzon (Provincial)",            fee: 200, orderIndex: 2 },
  { code: "LBC_VISMIN",        name: "LBC - Visayas & Mindanao",            fee: 250, orderIndex: 3 },
  { code: "JNT_METRO_MANILA",  name: "J&T - Metro Manila",                  fee: 120, orderIndex: 4 },
  { code: "JNT_PROVINCIAL",    name: "J&T - Provincial",                    fee: 180, orderIndex: 5 },
  { code: "LALAMOVE_STANDARD", name: "Lalamove (Book Yourself / Rider)",    fee: 0,   orderIndex: 6 },
  { code: "MAXIM_STANDARD",    name: "Maxim (Book Yourself / Rider)",       fee: 0,   orderIndex: 7 },
  { code: "NCR",               name: "NCR (Metro Manila)",                  fee: 75,  orderIndex: 8 },
  { code: "LUZON",             name: "Luzon (Outside NCR)",                 fee: 100, orderIndex: 9 },
  { code: "VISAYAS_MINDANAO",  name: "Visayas & Mindanao",                  fee: 130, orderIndex: 10 },
];

const COURIERS = [
  { code: "lbc",      name: "LBC Express",   trackingUrlTemplate: "https://www.lbcexpress.com/track/?tracking_no={tracking}" },
  { code: "jnt",      name: "J&T Express",   trackingUrlTemplate: "https://www.jtexpress.ph/index/query/gzquery.html?bills={tracking}" },
  { code: "lalamove", name: "Lalamove",      trackingUrlTemplate: undefined },
  { code: "grab",     name: "Grab Express",  trackingUrlTemplate: undefined },
  { code: "maxim",    name: "Maxim",         trackingUrlTemplate: undefined },
];

const PROTOCOLS = [
  { name: "Tirzepetide 15MG Protocol", category: "Weight Management", dosage: "2.5mg - 7.5mg weekly (dose based on vial size)", frequency: "Once weekly on the same day", duration: "12-16 weeks per cycle",
    notes: ["Start with 2.5mg for first 4 weeks","Increase by 2.5mg every 4 weeks as tolerated","This is the 15mg vial - yields multiple doses","Inject subcutaneously in abdomen, thigh, or upper arm","Take with or without food","Rotate injection sites"],
    storage: "Refrigerate at 2-8°C. Once in use, can be kept at room temperature for up to 21 days.", sortOrder: 1 },
  { name: "Tirzepetide 30MG Protocol", category: "Weight Management", dosage: "5mg - 15mg weekly (higher dose vial)", frequency: "Once weekly on the same day", duration: "12-16 weeks per cycle",
    notes: ["Start with 5mg for first 4 weeks if experienced","Increase by 2.5-5mg every 4 weeks as tolerated","Maximum dose is 15mg weekly","This larger vial offers more flexibility","Inject subcutaneously","May cause nausea initially - eat smaller meals"],
    storage: "Refrigerate at 2-8°C.", sortOrder: 2 },
  { name: "NAD+ 500MG Protocol", category: "Longevity & Anti-Aging", dosage: "100mg - 250mg daily", frequency: "Once daily, preferably morning", duration: "8-12 weeks per cycle",
    notes: ["Start with 100mg and increase gradually","Subcutaneous or intramuscular injection","Higher dose vial allows extended use","Take in morning to avoid sleep disruption","Supports cellular energy and repair","Some initial flushing is normal"],
    storage: "Refrigerate after reconstitution. Protect from light.", sortOrder: 3 },
  { name: "GHK CU 50MG Protocol", category: "Beauty & Regeneration", dosage: "1mg - 2mg daily", frequency: "Once daily", duration: "8-12 weeks per cycle",
    notes: ["Can be used topically or via injection","Promotes collagen synthesis","Supports skin elasticity and wound healing","Also used for hair regrowth","Copper peptide with many benefits","Safe for long-term use"],
    storage: "Refrigerate after reconstitution.", sortOrder: 4 },
  { name: "GHK CU 100MG Protocol", category: "Beauty & Regeneration", dosage: "2mg - 3mg daily", frequency: "Once daily", duration: "8-12 weeks per cycle",
    notes: ["Higher concentration for extended protocols","Excellent for anti-aging protocols","Can inject near treatment area","Supports tissue repair","Works synergistically with other peptides","Monitor for copper sensitivity"],
    storage: "Refrigerate after reconstitution.", sortOrder: 5 },
  { name: "DSIP 5MG Protocol", category: "Sleep & Recovery", dosage: "100mcg - 300mcg before bed", frequency: "Once daily, 30 min before sleep", duration: "2-4 weeks per cycle",
    notes: ["Start with 100mcg to assess tolerance","Promotes deep, restorative sleep","Do not combine with other sedatives","Effects build over several days","Take 2-4 week breaks between cycles","Subcutaneous injection preferred"],
    storage: "Refrigerate after reconstitution.", sortOrder: 6 },
  { name: "DSIP 15MG Protocol", category: "Sleep & Recovery", dosage: "200mcg - 400mcg before bed", frequency: "Once daily, 30 min before sleep", duration: "4-6 weeks per cycle",
    notes: ["Larger vial for extended sleep support","Gradually increase dose as needed","Supports natural sleep architecture","May help with stress-related insomnia","Avoid alcohol when using","Take breaks to prevent tolerance"],
    storage: "Refrigerate after reconstitution.", sortOrder: 7 },
  { name: "Glutathione 1500MG Protocol", category: "Detox & Skin Brightening", dosage: "200mg - 500mg every other day", frequency: "3-4 times weekly", duration: "8-12 weeks per cycle",
    notes: ["Master antioxidant for detoxification","Skin brightening and evening tone","Can inject subcutaneously or intramuscularly","Often combined with Vitamin C","Supports liver function","Results visible after 4-6 weeks"],
    storage: "Refrigerate. Protect from light and heat.", sortOrder: 8 },
  { name: "Lipo C with B12 Protocol", category: "Fat Burning & Energy", dosage: "1ml injection", frequency: "2-3 times weekly", duration: "Ongoing or 8-12 week cycles",
    notes: ["Lipotropic injection for fat metabolism","Boosts energy and metabolism","Inject intramuscularly in thigh or buttock","Best combined with exercise program","Supports liver fat processing","B12 provides energy boost"],
    storage: "Refrigerate. Protect from light.", sortOrder: 9 },
  { name: "SS31 10MG Protocol", category: "Mitochondrial Health", dosage: "5mg - 10mg daily", frequency: "Once daily", duration: "4-6 weeks per cycle",
    notes: ["Targets inner mitochondrial membrane","Protects against oxidative stress","Supports cellular energy production","Inject subcutaneously","Best taken in morning","Take 4-week breaks between cycles"],
    storage: "Refrigerate. Protect from light.", sortOrder: 10 },
  { name: "SS31 50MG Protocol", category: "Mitochondrial Health", dosage: "10mg - 20mg daily", frequency: "Once daily", duration: "4-8 weeks per cycle",
    notes: ["Higher dose for intensive protocols","Advanced mitochondrial support","Anti-aging at cellular level","Monitor energy levels","May enhance exercise performance","Rotate injection sites"],
    storage: "Refrigerate. Protect from light.", sortOrder: 11 },
  { name: "MOTS C 10MG Protocol", category: "Metabolic Health", dosage: "5mg twice weekly", frequency: "Twice weekly (e.g., Mon/Thu)", duration: "8-12 weeks per cycle",
    notes: ["Mitochondrial-derived peptide","Improves insulin sensitivity","Enhances exercise capacity","Take before exercise for best results","Supports metabolic health","Intramuscular or subcutaneous"],
    storage: "Refrigerate after reconstitution.", sortOrder: 12 },
  { name: "MOTS C 40MG Protocol", category: "Metabolic Health", dosage: "10mg twice weekly", frequency: "Twice weekly (e.g., Mon/Thu)", duration: "8-12 weeks per cycle",
    notes: ["Higher dose for intensive protocols","Enhanced metabolic optimization","Great for athletes and active users","Best taken pre-workout","Supports weight management","Monitor blood glucose if diabetic"],
    storage: "Refrigerate after reconstitution.", sortOrder: 13 },
  { name: "KLOW (CU50+TB10+BC10+KPV10) Protocol", category: "Healing & Anti-Inflammatory", dosage: "As pre-mixed or follow component ratios", frequency: "Once daily", duration: "6-8 weeks per cycle",
    notes: ["Powerful combination stack","GHK-Cu for regeneration","TB-500 for tissue repair","BPC-157 for healing","KPV for anti-inflammatory","All-in-one healing protocol"],
    storage: "Refrigerate after reconstitution.", sortOrder: 14 },
  { name: "Lemon Bottle 10MG Protocol", category: "Fat Dissolving", dosage: "Apply as directed to treatment area", frequency: "Weekly treatments", duration: "4-6 sessions typically",
    notes: ["Lipolytic solution for fat reduction","Professional application recommended","Targets stubborn fat deposits","Massage after application","Results visible after 2-3 sessions","Avoid strenuous exercise 24hrs after"],
    storage: "Refrigerate. Keep away from direct sunlight.", sortOrder: 15 },
  { name: "KPV 10MG + GHKCu 50MG Protocol", category: "Anti-Inflammatory & Regeneration", dosage: "KPV: 200mcg + GHKCu: 1mg daily", frequency: "Once daily", duration: "6-8 weeks per cycle",
    notes: ["Synergistic anti-inflammatory combo","KPV reduces inflammation","GHKCu promotes tissue repair","Great for skin and gut health","Subcutaneous injection","Can split doses AM/PM"],
    storage: "Refrigerate after reconstitution.", sortOrder: 16 },
  { name: "Snap-8 (Botox in a Bottle) Protocol", category: "Anti-Wrinkle", dosage: "Apply topically to wrinkle-prone areas", frequency: "Twice daily", duration: "Ongoing use",
    notes: ["Topical anti-wrinkle peptide","Apply to forehead, crows feet, frown lines","Works by relaxing facial muscles","Visible results in 2-4 weeks","Safe for daily use","Can layer under moisturizer"],
    storage: "Store at room temperature. Keep sealed.", sortOrder: 17 },
  { name: "GHKCu Cosmetic Grade (1 gram) Protocol", category: "Professional Cosmetic Use", dosage: "Mix into serums: 0.1-0.5% concentration", frequency: "Daily as part of skincare routine", duration: "Ongoing use",
    notes: ["High-grade copper peptide powder","Mix into your preferred serum base","Start with lower concentration","Store mixed serum in dark bottle","Promotes collagen and elastin","Professional skincare formulation"],
    storage: "Store powder in freezer. Mixed serum refrigerate.", sortOrder: 18 },
  { name: "Semax 10MG + Selank 10MG Protocol", category: "Cognitive Enhancement", dosage: "Semax: 300mcg + Selank: 250mcg daily", frequency: "1-2 times daily", duration: "2-4 weeks per cycle",
    notes: ["Powerful nootropic combination","Semax for focus and memory","Selank for anxiety and stress","Intranasal or subcutaneous","Best taken morning/early afternoon","Take breaks between cycles"],
    storage: "Refrigerate. Use within 30 days.", sortOrder: 19 },
  { name: "KPV 5MG Protocol", category: "Anti-Inflammatory", dosage: "100mcg - 200mcg daily", frequency: "Once daily", duration: "4-8 weeks per cycle",
    notes: ["Potent anti-inflammatory peptide","Alpha-MSH fragment","Gut health and skin conditions","Subcutaneous injection","No significant side effects","Works systemically"],
    storage: "Refrigerate after reconstitution.", sortOrder: 20 },
  { name: "KPV 10MG Protocol", category: "Anti-Inflammatory", dosage: "200mcg - 400mcg daily", frequency: "Once or twice daily", duration: "4-8 weeks per cycle",
    notes: ["Higher dose for stronger effect","Excellent for inflammatory conditions","Can split dose morning/evening","Supports gut barrier function","Anti-microbial properties","Safe for extended use"],
    storage: "Refrigerate after reconstitution.", sortOrder: 21 },
  { name: "Tesamorelin 5MG Protocol", category: "Growth Hormone", dosage: "1mg daily", frequency: "Once daily before bed on empty stomach", duration: "12-26 weeks per cycle",
    notes: ["FDA-approved GHRH analog","Reduces visceral fat","Inject subcutaneously in abdomen","No food 2 hours before/after","Stimulates natural GH release","Monitor IGF-1 levels"],
    storage: "Refrigerate at 2-8°C.", sortOrder: 22 },
  { name: "Tesamorelin 10MG Protocol", category: "Growth Hormone", dosage: "1mg - 2mg daily", frequency: "Once daily before bed on empty stomach", duration: "12-26 weeks per cycle",
    notes: ["Larger vial for extended use","Same protocol as 5MG","Consistent timing important","Best taken before bed","Avoid eating after injection","Results visible after 8-12 weeks"],
    storage: "Refrigerate at 2-8°C.", sortOrder: 23 },
  { name: "Epitalon 10MG Protocol", category: "Longevity & Anti-Aging", dosage: "5mg - 10mg daily for 10-20 days", frequency: "Once daily, preferably before bed", duration: "10-20 day cycles, 4-6 months apart",
    notes: ["Telomere elongation peptide","Short intense cycles","Promotes melatonin production","Anti-aging at DNA level","Take 2-3 cycles per year","Subcutaneous injection"],
    storage: "Refrigerate. Stable for 6 months.", sortOrder: 24 },
  { name: "Epitalon 50MG Protocol", category: "Longevity & Anti-Aging", dosage: "10mg daily for 10-20 days", frequency: "Once daily, preferably before bed", duration: "10-20 day cycles, 4-6 months apart",
    notes: ["Higher dose vial for multiple cycles","Ultimate longevity peptide","Resets biological clock","Improves sleep quality","Supports immune function","Visible anti-aging effects"],
    storage: "Refrigerate. Stable for 6 months.", sortOrder: 25 },
  { name: "PT141 10MG Protocol", category: "Sexual Wellness", dosage: "500mcg - 2mg as needed", frequency: "As needed, 1-2 hours before activity", duration: "Use as needed, 24hr minimum between doses",
    notes: ["Also known as Bremelanotide","Start with 500mcg to assess tolerance","Effects last 24-72 hours","Inject subcutaneously 45min-2hrs before","May cause nausea initially","Maximum once per 24 hours"],
    storage: "Refrigerate. Use within 30 days.", sortOrder: 26 },
];

export const run = internalMutation({
  args: {},
  handler: async (ctx) => {
    let categoriesUpserted = 0;
    let settingsUpserted = 0;
    let paymentMethodsUpserted = 0;
    let shippingLocationsUpserted = 0;
    let couriersUpserted = 0;
    let protocolsUpserted = 0;

    // Categories
    for (const cat of CATEGORIES) {
      const existing = await ctx.db
        .query("categories")
        .withIndex("by_name", (q) => q.eq("name", cat.name))
        .unique();
      if (existing) {
        await ctx.db.patch(existing._id, { ...cat, active: true });
      } else {
        await ctx.db.insert("categories", { ...cat, active: true });
      }
      categoriesUpserted += 1;
    }

    // Site settings (keyed by `key`)
    for (const s of SITE_SETTINGS) {
      const existing = await ctx.db
        .query("siteSettings")
        .withIndex("by_key", (q) => q.eq("key", s.key))
        .unique();
      if (existing) {
        await ctx.db.patch(existing._id, s);
      } else {
        await ctx.db.insert("siteSettings", s);
      }
      settingsUpserted += 1;
    }

    // Payment methods (keyed by name)
    for (const p of PAYMENT_METHODS) {
      const existing = await ctx.db
        .query("paymentMethods")
        .withIndex("by_name", (q) => q.eq("name", p.name))
        .unique();
      if (existing) {
        await ctx.db.patch(existing._id, p);
      } else {
        await ctx.db.insert("paymentMethods", p);
      }
      paymentMethodsUpserted += 1;
    }

    // Shipping locations (keyed by code)
    for (const loc of SHIPPING_LOCATIONS) {
      const existing = await ctx.db
        .query("shippingLocations")
        .withIndex("by_code", (q) => q.eq("code", loc.code))
        .unique();
      if (existing) {
        await ctx.db.patch(existing._id, { ...loc, isActive: true });
      } else {
        await ctx.db.insert("shippingLocations", { ...loc, isActive: true });
      }
      shippingLocationsUpserted += 1;
    }

    // Couriers (keyed by code)
    for (const c of COURIERS) {
      const existing = await ctx.db
        .query("couriers")
        .withIndex("by_code", (q) => q.eq("code", c.code))
        .unique();
      const doc = {
        code: c.code,
        name: c.name,
        trackingUrlTemplate: c.trackingUrlTemplate,
        isActive: true,
      };
      if (existing) {
        await ctx.db.patch(existing._id, doc);
      } else {
        await ctx.db.insert("couriers", doc);
      }
      couriersUpserted += 1;
    }

    // Protocols (keyed by name)
    for (const p of PROTOCOLS) {
      const existing = await ctx.db
        .query("protocols")
        .withIndex("by_name", (q) => q.eq("name", p.name))
        .unique();
      const doc = { ...p, active: true, contentType: "text" };
      if (existing) {
        await ctx.db.patch(existing._id, doc);
      } else {
        await ctx.db.insert("protocols", doc);
      }
      protocolsUpserted += 1;
    }

    return {
      categoriesUpserted,
      settingsUpserted,
      paymentMethodsUpserted,
      shippingLocationsUpserted,
      couriersUpserted,
      protocolsUpserted,
    };
  },
});
