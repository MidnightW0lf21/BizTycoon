
import type { FactoryPowerBuildingConfig, FactoryMachineConfig, FactoryComponent, FactoryMaterialCollectorConfig } from '@/types';
import { Sun, Waves, Zap, Settings, Cog, Wrench, PackageSearch, Drill, HardHat, Factory as FactoryIcon, PackageCheck, PackagePlus, Pickaxe } from 'lucide-react';

export const INITIAL_FACTORY_POWER_BUILDINGS_CONFIG: FactoryPowerBuildingConfig[] = [
  {
    id: 'solar_panels_mk1',
    name: 'Solar Panel Array Mk1',
    icon: Sun,
    description: 'Basic solar panels providing a modest amount of power.',
    baseCost: 50000,
    costMultiplier: 1.2,
    powerOutputKw: 100,
    maxInstances: 20,
  },
  {
    id: 'hydro_dam_small',
    name: 'Small Hydro Dam',
    icon: Waves,
    description: 'A small hydroelectric dam. Requires a water source (conceptual for now).',
    baseCost: 250000,
    costMultiplier: 1.35,
    powerOutputKw: 750,
    maxInstances: 5,
  },
  {
    id: 'diesel_generator_basic',
    name: 'Backup Diesel Generator',
    icon: Zap,
    description: 'A reliable but less efficient power source. Consumes conceptual fuel.',
    baseCost: 150000,
    costMultiplier: 1.25,
    powerOutputKw: 500,
  },
];

export const INITIAL_FACTORY_COMPONENTS_CONFIG: FactoryComponent[] = [
  {
    id: 'basic_gear',
    name: 'Basic Gear',
    description: 'A simple metallic gear, a fundamental building block. Provides a small global income boost.',
    icon: Settings,
    tier: 1,
    recipe: [],
    rawMaterialCost: 10,
    productionTimeSeconds: 1,
    requiredAssemblerMark: 1,
    effects: {
      globalIncomeBoostPerComponentPercent: 0.001,
    }
  },
  {
    id: 'advanced_gear',
    name: 'Advanced Gear',
    description: 'A more complex gear, used in advanced machinery. Provides a moderate global income boost.',
    icon: Cog,
    tier: 2,
    recipe: [{ componentId: 'basic_gear', quantity: 5 }],
    rawMaterialCost: 20,
    productionTimeSeconds: 3,
    requiredAssemblerMark: 2,
    effects: {
      globalIncomeBoostPerComponentPercent: 0.005,
    }
  }
  // TODO: Add Tier 3, 4, 5 components later
];

export const INITIAL_FACTORY_MACHINE_CONFIGS: FactoryMachineConfig[] = [
  {
    id: 'basic_assembler_mk1',
    name: 'Basic Assembler Mk1',
    icon: Wrench,
    description: 'A versatile, entry-level machine for simple Tier 1 component assembly.',
    baseCost: 100000,
    powerConsumptionKw: 50,
    maxCraftableTier: 1,
    requiredResearchId: 'unlock_basic_assembler_mk1',
    familyId: 'basic_assembler',
    mark: 1,
  },
  {
    id: 'basic_assembler_mk2',
    name: 'Basic Assembler Mk2',
    icon: Drill,
    description: 'An upgraded assembler capable of crafting Tier 1 and Tier 2 components more efficiently.',
    baseCost: 250000,
    powerConsumptionKw: 75,
    maxCraftableTier: 2,
    requiredResearchId: 'unlock_basic_assembler_mk2',
    familyId: 'basic_assembler',
    mark: 2,
  },
  {
    id: 'basic_assembler_mk3',
    name: 'Basic Assembler Mk3',
    icon: Settings, // Re-using Settings icon, Cog is for Advanced Gear component
    description: 'An advanced assembler for Tier 3 components, with improved speed and efficiency.',
    baseCost: 750000,
    powerConsumptionKw: 100,
    maxCraftableTier: 3,
    requiredResearchId: 'unlock_basic_assembler_mk3',
    familyId: 'basic_assembler',
    mark: 3,
  },
  {
    id: 'basic_assembler_mk4',
    name: 'Basic Assembler Mk4',
    icon: HardHat,
    description: 'A heavy-duty assembler designed for complex Tier 4 component manufacturing.',
    baseCost: 2000000,
    powerConsumptionKw: 125,
    maxCraftableTier: 4,
    requiredResearchId: 'unlock_basic_assembler_mk4',
    familyId: 'basic_assembler',
    mark: 4,
  },
  {
    id: 'basic_assembler_mk5',
    name: 'Basic Assembler Mk5',
    icon: FactoryIcon,
    description: 'The pinnacle of basic assembly technology, capable of crafting up to Tier 5 components.',
    baseCost: 5000000,
    powerConsumptionKw: 150,
    maxCraftableTier: 5,
    requiredResearchId: 'unlock_basic_assembler_mk5',
    familyId: 'basic_assembler',
    mark: 5,
  }
];

export const INITIAL_FACTORY_MATERIAL_COLLECTORS_CONFIG: FactoryMaterialCollectorConfig[] = [
  {
    id: 'drone_swarm_mk1',
    name: 'Automated Drone Swarm Mk1',
    icon: PackageSearch,
    description: 'Deploys a swarm of drones to automatically collect raw materials.',
    baseCost: 75000,
    costMultiplier: 1.3,
    powerConsumptionKw: 25,
    materialsPerSecond: 0.5,
    maxInstances: 10,
    requiredResearchId: 'unlock_drone_swarm_mk1',
  },
  {
    id: 'drone_swarm_mk2',
    name: 'Heavy Drone Swarm Mk2',
    icon: PackagePlus,
    description: 'Larger, more efficient drones for increased material gathering.',
    baseCost: 200000,
    costMultiplier: 1.35,
    powerConsumptionKw: 40,
    materialsPerSecond: 1.5,
    maxInstances: 8,
    requiredResearchId: 'unlock_drone_swarm_mk2',
  },
  {
    id: 'mining_rig_mk1',
    name: 'Automated Mining Rig Mk1',
    icon: Pickaxe,
    description: 'A stationary rig that extracts materials from the ground.',
    baseCost: 500000,
    costMultiplier: 1.4,
    powerConsumptionKw: 100,
    materialsPerSecond: 3,
    maxInstances: 5,
    requiredResearchId: 'unlock_mining_rig_mk1',
  },
];
