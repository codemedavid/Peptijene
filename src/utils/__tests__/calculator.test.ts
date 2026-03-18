import { describe, it, expect } from 'vitest';

// Extracted calculator logic from PeptideCalculator component for testability
interface SyringeOption {
  id: string;
  name: string;
  unitsPerMl: number;
  maxVolume: number;
}

const SYRINGE_OPTIONS: SyringeOption[] = [
  { id: 'u100-1ml', name: 'U-100 Standard (1ml)', unitsPerMl: 100, maxVolume: 1.0 },
  { id: 'u100-0.5ml', name: 'U-100 Small (0.5ml)', unitsPerMl: 100, maxVolume: 0.5 },
  { id: 'u100-0.3ml', name: 'U-100 Micro (0.3ml)', unitsPerMl: 100, maxVolume: 0.3 },
  { id: 'u40-1ml', name: 'U-40 (1ml)', unitsPerMl: 40, maxVolume: 1.0 },
];

function calculateDose(
  vialQuantityMg: number,
  waterAddedMl: number,
  desiredDose: number,
  unit: 'mg' | 'mcg',
  syringe: SyringeOption,
) {
  const vialMg = vialQuantityMg;
  const doseMg = unit === 'mcg' ? desiredDose / 1000 : desiredDose;

  const concentrationMgPerMl = vialMg / waterAddedMl;
  const volumeToInjectMl = doseMg / concentrationMgPerMl;
  const units = volumeToInjectMl * syringe.unitsPerMl;

  const totalUnits = waterAddedMl * syringe.unitsPerMl;
  const mgPerUnit = vialMg / totalUnits;

  return {
    units: Number(units.toFixed(1)),
    mgPerUnit: Number(mgPerUnit.toFixed(4)),
    volumeMl: Number(volumeToInjectMl.toFixed(4)),
    concentrationMgPerMl: Number(concentrationMgPerMl.toFixed(4)),
    exceedsSyringe: units > syringe.maxVolume * syringe.unitsPerMl,
  };
}

describe('Peptide Calculator Logic', () => {
  const u100Standard = SYRINGE_OPTIONS[0]; // U-100 1ml
  const u100Small = SYRINGE_OPTIONS[1];    // U-100 0.5ml
  const u40 = SYRINGE_OPTIONS[3];          // U-40 1ml

  describe('basic calculations with U-100 Standard', () => {
    it('calculates correct units for 5mg vial, 2ml water, 0.25mg dose', () => {
      const result = calculateDose(5, 2, 0.25, 'mg', u100Standard);

      // concentration = 5/2 = 2.5 mg/ml
      // volume = 0.25/2.5 = 0.1 ml
      // units = 0.1 * 100 = 10
      expect(result.units).toBe(10);
      expect(result.volumeMl).toBe(0.1);
      expect(result.exceedsSyringe).toBe(false);
    });

    it('calculates correct units for 10mg vial, 2ml water, 2.5mg dose', () => {
      const result = calculateDose(10, 2, 2.5, 'mg', u100Standard);

      // concentration = 10/2 = 5 mg/ml
      // volume = 2.5/5 = 0.5 ml
      // units = 0.5 * 100 = 50
      expect(result.units).toBe(50);
      expect(result.exceedsSyringe).toBe(false);
    });

    it('calculates mg per unit correctly', () => {
      const result = calculateDose(5, 2, 0.25, 'mg', u100Standard);

      // totalUnits = 2 * 100 = 200
      // mgPerUnit = 5 / 200 = 0.025
      expect(result.mgPerUnit).toBe(0.025);
    });
  });

  describe('mcg to mg conversion', () => {
    it('converts micrograms to milligrams correctly', () => {
      const result = calculateDose(5, 2, 250, 'mcg', u100Standard);

      // 250 mcg = 0.25 mg
      // Same as 0.25mg test above
      expect(result.units).toBe(10);
    });

    it('handles large mcg values', () => {
      const result = calculateDose(10, 2, 5000, 'mcg', u100Standard);

      // 5000 mcg = 5 mg
      // concentration = 10/2 = 5 mg/ml
      // volume = 5/5 = 1 ml
      // units = 1 * 100 = 100
      expect(result.units).toBe(100);
    });
  });

  describe('U-40 syringe calculations', () => {
    it('calculates units for U-40 syringe', () => {
      const result = calculateDose(5, 2, 0.25, 'mg', u40);

      // concentration = 5/2 = 2.5 mg/ml
      // volume = 0.25/2.5 = 0.1 ml
      // units = 0.1 * 40 = 4
      expect(result.units).toBe(4);
    });

    it('calculates mg per unit for U-40', () => {
      const result = calculateDose(5, 2, 0.25, 'mg', u40);

      // totalUnits = 2 * 40 = 80
      // mgPerUnit = 5 / 80 = 0.0625
      expect(result.mgPerUnit).toBe(0.0625);
    });
  });

  describe('syringe capacity warnings', () => {
    it('detects when dose exceeds U-100 Standard (1ml = 100 units)', () => {
      const result = calculateDose(5, 1, 10, 'mg', u100Standard);

      // concentration = 5/1 = 5 mg/ml
      // volume = 10/5 = 2 ml
      // units = 2 * 100 = 200 > 100
      expect(result.exceedsSyringe).toBe(true);
    });

    it('detects when dose exceeds U-100 Small (0.5ml = 50 units)', () => {
      const result = calculateDose(10, 2, 5, 'mg', u100Small);

      // concentration = 10/2 = 5 mg/ml
      // volume = 5/5 = 1 ml
      // units = 1 * 100 = 100 > 50
      expect(result.exceedsSyringe).toBe(true);
    });

    it('does not warn when dose fits in syringe', () => {
      const result = calculateDose(10, 2, 0.5, 'mg', u100Standard);

      // concentration = 10/2 = 5 mg/ml
      // volume = 0.5/5 = 0.1 ml
      // units = 0.1 * 100 = 10 < 100
      expect(result.exceedsSyringe).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('handles very small doses', () => {
      const result = calculateDose(10, 2, 0.01, 'mg', u100Standard);

      // concentration = 5 mg/ml
      // volume = 0.01/5 = 0.002 ml
      // units = 0.002 * 100 = 0.2
      expect(result.units).toBe(0.2);
    });

    it('handles 1ml water reconstitution', () => {
      const result = calculateDose(5, 1, 1, 'mg', u100Standard);

      // concentration = 5/1 = 5 mg/ml
      // volume = 1/5 = 0.2 ml
      // units = 0.2 * 100 = 20
      expect(result.units).toBe(20);
    });

    it('concentration calculation is consistent', () => {
      const result = calculateDose(10, 2, 1, 'mg', u100Standard);
      expect(result.concentrationMgPerMl).toBe(5);
    });
  });
});
