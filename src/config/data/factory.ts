
import type { FactoryPowerBuildingConfig, FactoryMachineConfig, FactoryComponent, FactoryMaterialCollectorConfig, FactoryMachineUpgradeConfig } from '@/types';
import { Sun, Waves, Zap, Settings, Cog, Wrench, PackageSearch, Drill, HardHat, Factory as FactoryIcon, PackageCheck, PackagePlus, Pickaxe, Mountain, Satellite, CloudCog, TrendingUp, AtomIcon, InfinityIcon } from 'lucide-react';

export const INITIAL_FACTORY_POWER_BUILDINGS_CONFIG: FactoryPowerBuildingConfig[] = [
  {
    id: 'solar_panels_mk1',
    name: 'Solar Panel Array Mk1',
    icon: Sun,
    description: 'Basic solar panels providing a modest amount of power.',
    baseCost: 50000,
    costMultiplier: 1.2,
    powerOutputKw: 10,
    maxInstances: 20,
    requiredResearchId: 'unlock_solar_mk1',
  },
  {
    id: 'solar_panels_mk2',
    name: 'Solar Panel Array Mk2',
    icon: Sun,
    description: 'More efficient solar panels for greater power generation. No ownership cap.',
    baseCost: 200000,
    costMultiplier: 1.25,
    powerOutputKw: 50,
    requiredResearchId: 'unlock_solar_mk2',
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
    requiredResearchId: 'unlock_hydro_dam_small',
  },
  {
    id: 'diesel_generator_basic',
    name: 'Backup Diesel Generator',
    icon: Zap,
    description: 'A reliable but less efficient power source. Consumes conceptual fuel.',
    baseCost: 150000,
    costMultiplier: 1.25,
    powerOutputKw: 500,
    maxInstances: 10,
    requiredResearchId: 'unlock_diesel_generator_basic',
  },
  {
    id: 'geothermal_plant_mk1',
    name: 'Geothermal Plant Mk1',
    icon: TrendingUp,
    description: 'Taps into subterranean heat for consistent and powerful energy.',
    baseCost: 500000,
    costMultiplier: 1.4,
    powerOutputKw: 1000,
    maxInstances: 3,
    requiredResearchId: 'unlock_geothermal_plant_mk1',
  }
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
    upgrades: [
      { id: 'mk1_speed_gearing', name: 'Improved Gearing', description: '+10% Production Speed', costMoney: 500000, effects: { productionSpeedMultiplier: 1.1 } },
      { id: 'mk1_power_efficiency', name: 'Efficient Motor', description: '-10% Power Consumption', costMoney: 300000, costRP: 5, effects: { powerConsumptionModifier: 0.9 }, requiredResearchId: 'unlock_mk1_motor_efficiency_research' }
    ]
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
    upgrades: [
      { id: 'mk2_high_speed_actuators', name: 'High-Speed Actuators', description: '+15% Production Speed', costMoney: 1750000, effects: { productionSpeedMultiplier: 1.15 } },
      { id: 'mk2_optimized_circuitry', name: 'Optimized Circuitry', description: '-15% Power Consumption', costMoney: 1500000, costRP: 15, effects: { powerConsumptionModifier: 0.85 }, requiredResearchId: 'unlock_mk2_circuitry_research' }
    ]
  },
  {
    id: 'basic_assembler_mk3',
    name: 'Basic Assembler Mk3',
    icon: Settings,
    description: 'An advanced assembler for Tier 3 components, with improved speed and efficiency.',
    baseCost: 750000,
    powerConsumptionKw: 100,
    maxCraftableTier: 3,
    requiredResearchId: 'unlock_basic_assembler_mk3',
    familyId: 'basic_assembler',
    mark: 3,
    upgrades: [
      { id: 'mk3_reinforced_servos', name: 'Reinforced Servos', description: '+18% Production Speed', costMoney: 3750000, effects: { productionSpeedMultiplier: 1.18 } },
      { id: 'mk3_cryo_cooled_core', name: 'Cryo-Cooled Core', description: '-18% Power Consumption', costMoney: 3000000, costRP: 30, effects: { powerConsumptionModifier: 0.82 }, requiredResearchId: 'unlock_mk3_cryo_core_research' }
    ]
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
    upgrades: [
      { id: 'mk4_quantum_drive_belts', name: 'Quantum Drive Belts', description: '+22% Production Speed', costMoney: 8000000, effects: { productionSpeedMultiplier: 1.22 } },
      { id: 'mk4_micro_fusion_cell', name: 'Micro Fusion Cell', description: '-22% Power Consumption', costMoney: 7500000, costRP: 75, effects: { powerConsumptionModifier: 0.78 }, requiredResearchId: 'unlock_mk4_fusion_cell_research' }
    ]
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
    upgrades: [
      { id: 'mk5_temporal_gearbox', name: 'Temporal Gearbox', description: '+25% Production Speed', costMoney: 20000000, effects: { productionSpeedMultiplier: 1.25 } },
      { id: 'mk5_zero_point_module', name: 'Zero-Point Module', description: '-25% Power Consumption', costMoney: 17500000, costRP: 150, effects: { powerConsumptionModifier: 0.75 }, requiredResearchId: 'unlock_mk5_zpm_research' }
    ]
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
  {
    id: 'mining_rig_mk2',
    name: 'Automated Mining Rig Mk2',
    icon: Mountain,
    description: 'An upgraded mining rig with enhanced drilling depth and processing capabilities.',
    baseCost: 1200000,
    costMultiplier: 1.45,
    powerConsumptionKw: 150,
    materialsPerSecond: 5,
    maxInstances: 4,
    requiredResearchId: 'unlock_mining_rig_mk2',
  },
  {
    id: 'orbital_debris_collector',
    name: 'Orbital Debris Collector',
    icon: Satellite,
    description: 'A space-based platform that collects micrometeoroids and space junk, refining them into usable materials.',
    baseCost: 2500000,
    costMultiplier: 1.5,
    powerConsumptionKw: 250,
    materialsPerSecond: 8,
    maxInstances: 3,
    requiredResearchId: 'unlock_orbital_debris_collector',
  },
  {
    id: 'nanite_harvester_swarm',
    name: 'Nanite Harvester Swarm',
    icon: CloudCog,
    description: 'A cloud of microscopic nanobots that deconstruct ambient matter into raw materials.',
    baseCost: 5000000,
    costMultiplier: 1.6,
    powerConsumptionKw: 400,
    materialsPerSecond: 15,
    maxInstances: 2,
    requiredResearchId: 'unlock_nanite_harvester_swarm',
  },
];

