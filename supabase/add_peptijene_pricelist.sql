-- Peptijene Price List (April 2026)
-- Source: Price List + Per Kit/Box images
-- Run this in the Supabase SQL Editor.
-- Idempotent: removes any prior rows with the same product names before inserting,
-- so you can safely re-run after edits.

BEGIN;

-- ──────────────────────────────────────────────────────────────
-- 1. Ensure required categories exist
-- ──────────────────────────────────────────────────────────────
INSERT INTO categories (id, name, icon, sort_order, active)
VALUES
  ('c0a80121-7ac0-4e78-94f8-585d77059123', 'Weight Management', 'Scale',    1, true),
  ('c0a80121-7ac0-4e78-94f8-585d77059124', 'Beauty & Anti-Aging', 'Sparkles', 2, true),
  ('c0a80121-7ac0-4e78-94f8-585d77059125', 'Wellness & Vitality', 'Heart',   3, true)
ON CONFLICT (id) DO NOTHING;

-- Add-Ons category (created elsewhere as gen_random_uuid; ensure it exists)
INSERT INTO categories (name, icon, sort_order, active)
SELECT 'Add-Ons', '🛒', 99, true
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Add-Ons');

-- ──────────────────────────────────────────────────────────────
-- 2. Remove any prior rows with the same product names
--    (lets you re-run this script safely)
-- ──────────────────────────────────────────────────────────────
DELETE FROM product_variations
WHERE product_id IN (
  SELECT id FROM products WHERE name IN (
    'Tirzepatide 15mg', 'Tirzepatide 30mg',
    'Retatrutide 10mg', 'Retatrutide 20mg',
    'Cagrilintide 5mg',
    'Lipo C w/ B12', 'NAD+ 500mg',
    'GHK-Cu 50mg', 'GHK-Cu 100mg',
    'KPV 10mg', 'GTT 1500mg',
    'Insulin Syringe (10pcs)',
    '3ml/cc Syringe',
    'Alcohol Pads (10pcs)',
    'Pink Vial Case (2-slot)'
  )
);

DELETE FROM products WHERE name IN (
  'Tirzepatide 15mg', 'Tirzepatide 30mg',
  'Retatrutide 10mg', 'Retatrutide 20mg',
  'Cagrilintide 5mg',
  'Lipo C w/ B12', 'NAD+ 500mg',
  'GHK-Cu 50mg', 'GHK-Cu 100mg',
  'KPV 10mg', 'GTT 1500mg',
  'Insulin Syringe (10pcs)',
  '3ml/cc Syringe',
  'Alcohol Pads (10pcs)',
  'Pink Vial Case (2-slot)'
);

-- ──────────────────────────────────────────────────────────────
-- 3. Insert peptide products
--    base_price = retail vial price (cheapest option shown on cards)
-- ──────────────────────────────────────────────────────────────

-- Weight Loss
INSERT INTO products (name, description, base_price, category, available, featured, stock_quantity) VALUES
  ('Tirzepatide 15mg', 'GLP-1/GIP dual agonist for weight management. 15mg vial.',           1200, 'c0a80121-7ac0-4e78-94f8-585d77059123', true, true,  1),
  ('Tirzepatide 30mg', 'GLP-1/GIP dual agonist for weight management. 30mg vial.',           1800, 'c0a80121-7ac0-4e78-94f8-585d77059123', true, true,  1),
  ('Retatrutide 10mg', 'Triple agonist (GLP-1/GIP/Glucagon) for weight management. 10mg.',   1200, 'c0a80121-7ac0-4e78-94f8-585d77059123', true, true,  1),
  ('Retatrutide 20mg', 'Triple agonist (GLP-1/GIP/Glucagon) for weight management. 20mg.',   1800, 'c0a80121-7ac0-4e78-94f8-585d77059123', true, true,  1),
  ('Cagrilintide 5mg', 'Long-acting amylin analogue for appetite control. 5mg vial.',        1200, 'c0a80121-7ac0-4e78-94f8-585d77059123', true, false, 1);

-- Longevity & Energy
INSERT INTO products (name, description, base_price, category, available, featured, stock_quantity) VALUES
  ('Lipo C w/ B12', 'Lipotropic blend with vitamin B12 for energy and metabolic support.', 1200, 'c0a80121-7ac0-4e78-94f8-585d77059125', true, false, 1),
  ('NAD+ 500mg',    'NAD+ for cellular energy, longevity, and recovery. 500mg vial.',     1100, 'c0a80121-7ac0-4e78-94f8-585d77059125', true, true,  1);

-- Beauty Glow
INSERT INTO products (name, description, base_price, category, available, featured, stock_quantity) VALUES
  ('GHK-Cu 50mg',  'Copper peptide for skin rejuvenation and elasticity. 50mg vial.',    1000, 'c0a80121-7ac0-4e78-94f8-585d77059124', true, true,  1),
  ('GHK-Cu 100mg', 'Copper peptide for skin rejuvenation and elasticity. 100mg vial.',   1200, 'c0a80121-7ac0-4e78-94f8-585d77059124', true, false, 1),
  ('KPV 10mg',     'Anti-inflammatory peptide for skin and gut health. 10mg vial.',      1200, 'c0a80121-7ac0-4e78-94f8-585d77059124', true, false, 1),
  ('GTT 1500mg',   'Glutathione for antioxidant support and skin glow. 1500mg vial.',    1200, 'c0a80121-7ac0-4e78-94f8-585d77059124', true, false, 1);

-- Add-Ons
INSERT INTO products (name, description, base_price, category, available, featured, stock_quantity)
SELECT 'Insulin Syringe (10pcs)', 'Insulin syringes, pack of 10.',           60, c.id, true, false, 1 FROM categories c WHERE c.name = 'Add-Ons'
UNION ALL SELECT '3ml/cc Syringe',         '3ml/cc syringe (single).',                  5, c.id, true, false, 1 FROM categories c WHERE c.name = 'Add-Ons'
UNION ALL SELECT 'Alcohol Pads (10pcs)',   'Sterile alcohol pads, pack of 10.',        10, c.id, true, false, 1 FROM categories c WHERE c.name = 'Add-Ons'
UNION ALL SELECT 'Pink Vial Case (2-slot)','Pink vial carrying case with 2 slots.',   100, c.id, true, false, 1 FROM categories c WHERE c.name = 'Add-Ons';

-- ──────────────────────────────────────────────────────────────
-- 4. Insert variations: Vial / Set / Kit (Kit = bulk reseller box)
-- ──────────────────────────────────────────────────────────────
WITH variation_data (product_name, variant_name, qty_mg, price) AS (VALUES
  -- Weight Loss
  ('Tirzepatide 15mg', 'Vial',       15.0,  1200::numeric),
  ('Tirzepatide 15mg', 'Set',        15.0,  1700::numeric),
  ('Tirzepatide 15mg', 'Kit / Box',  15.0,  6500::numeric),
  ('Tirzepatide 30mg', 'Vial',       30.0,  1800::numeric),
  ('Tirzepatide 30mg', 'Set',        30.0,  2500::numeric),
  ('Tirzepatide 30mg', 'Kit / Box',  30.0,  7500::numeric),
  ('Retatrutide 10mg', 'Vial',       10.0,  1200::numeric),
  ('Retatrutide 10mg', 'Set',        10.0,  1800::numeric),
  ('Retatrutide 10mg', 'Kit / Box',  10.0,  8000::numeric),
  ('Retatrutide 20mg', 'Vial',       20.0,  1800::numeric),
  ('Retatrutide 20mg', 'Set',        20.0,  2500::numeric),
  ('Retatrutide 20mg', 'Kit / Box',  20.0, 10500::numeric),
  ('Cagrilintide 5mg', 'Vial',        5.0,  1200::numeric),
  ('Cagrilintide 5mg', 'Set',         5.0,  1500::numeric),
  ('Cagrilintide 5mg', 'Kit / Box',   5.0,  7500::numeric),

  -- Longevity & Energy
  ('Lipo C w/ B12',    'Vial',        0.0,  1200::numeric),
  ('Lipo C w/ B12',    'Set',         0.0,  1500::numeric),
  ('Lipo C w/ B12',    'Kit / Box',   0.0,  7000::numeric),
  ('NAD+ 500mg',       'Vial',      500.0,  1100::numeric),
  ('NAD+ 500mg',       'Set',       500.0,  1500::numeric),
  ('NAD+ 500mg',       'Kit / Box', 500.0,  6500::numeric),

  -- Beauty Glow
  ('GHK-Cu 50mg',      'Vial',       50.0,  1000::numeric),
  ('GHK-Cu 50mg',      'Set',        50.0,  1200::numeric),
  ('GHK-Cu 50mg',      'Kit / Box',  50.0,  5000::numeric),
  ('GHK-Cu 100mg',     'Vial',      100.0,  1200::numeric),
  ('GHK-Cu 100mg',     'Set',       100.0,  1500::numeric),
  ('GHK-Cu 100mg',     'Kit / Box', 100.0,  6000::numeric),
  ('KPV 10mg',         'Vial',       10.0,  1200::numeric),
  ('KPV 10mg',         'Set',        10.0,  1500::numeric),
  ('KPV 10mg',         'Kit / Box',  10.0,  6000::numeric),
  ('GTT 1500mg',       'Vial',     1500.0,  1200::numeric),
  ('GTT 1500mg',       'Set',      1500.0,  1500::numeric),
  ('GTT 1500mg',       'Kit / Box',1500.0,  6500::numeric)
)
INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity)
SELECT p.id, v.variant_name, v.qty_mg, v.price, 1
FROM variation_data v
JOIN products p ON p.name = v.product_name;

COMMIT;

-- ──────────────────────────────────────────────────────────────
-- 5. Verify
-- ──────────────────────────────────────────────────────────────
SELECT p.name, c.name AS category, p.base_price,
       (SELECT json_agg(json_build_object('name', pv.name, 'price', pv.price) ORDER BY pv.price)
        FROM product_variations pv WHERE pv.product_id = p.id) AS variations
FROM products p
LEFT JOIN categories c ON c.id::text = p.category
WHERE p.name IN (
  'Tirzepatide 15mg','Tirzepatide 30mg','Retatrutide 10mg','Retatrutide 20mg','Cagrilintide 5mg',
  'Lipo C w/ B12','NAD+ 500mg',
  'GHK-Cu 50mg','GHK-Cu 100mg','KPV 10mg','GTT 1500mg',
  'Insulin Syringe (10pcs)','3ml/cc Syringe','Alcohol Pads (10pcs)','Pink Vial Case (2-slot)'
)
ORDER BY c.sort_order NULLS LAST, p.name;
