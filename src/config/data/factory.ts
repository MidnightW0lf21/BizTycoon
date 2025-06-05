
import type { FactoryPowerBuildingConfig, FactoryMachineConfig, FactoryComponent, FactoryMaterialCollectorConfig, FactoryMachineUpgradeConfig } from '@/types';
import { Sun, Waves, Zap, Settings, Cog, Wrench, PackageSearch, Drill, HardHat, Factory as FactoryIcon, PackageCheck, PackagePlus, Pickaxe, Mountain, Satellite, CloudCog, TrendingUp, AtomIcon, InfinityIcon, Lightbulb, BrainCircuit, BarChart, Citrus, CircuitBoard, Frame, Camera, BatteryCharging, Users, Coffee, SolarPanel, Combine } from 'lucide-react';

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
  // Existing Gears
  {
    id: 'basic_gear',
    name: 'Basic Gear',
    description: 'A simple metallic gear, a fundamental building block. Provides a small global income boost.',
    icon: Settings,
    tier: 1,
    recipe: [],
    rawMaterialCost: 10,
    productionTimeSeconds: 20,
    requiredAssemblerMark: 1,
    effects: {
      globalIncomeBoostPerComponentPercent: 0.001,
      maxBonusPercent: 5,
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
    productionTimeSeconds: 60,
    requiredAssemblerMark: 2,
    effects: {
      globalIncomeBoostPerComponentPercent: 0.003,
      maxBonusPercent: 7.5,
    }
  },
  {
    id: 'precision_gear',
    name: 'Precision Gear',
    description: 'An intricately designed gear for high-performance applications. Enhances global income.',
    icon: Drill,
    tier: 3,
    recipe: [{ componentId: 'advanced_gear', quantity: 4 }],
    rawMaterialCost: 50,
    productionTimeSeconds: 180,
    requiredAssemblerMark: 3,
    effects: {
      globalIncomeBoostPerComponentPercent: 0.007,
      maxBonusPercent: 10,
    }
  },
  {
    id: 'alloy_gear',
    name: 'Alloy Gear',
    description: 'A gear made from advanced alloys for extreme durability and efficiency. Significantly boosts global income.',
    icon: HardHat,
    tier: 4,
    recipe: [{ componentId: 'precision_gear', quantity: 3 }],
    rawMaterialCost: 120,
    productionTimeSeconds: 900,
    requiredAssemblerMark: 4,
    effects: {
      globalIncomeBoostPerComponentPercent: 0.015,
      maxBonusPercent: 12.5,
    }
  },
  {
    id: 'quantum_gear',
    name: 'Quantum Gear',
    description: 'A gear operating on quantum principles, for cutting-edge technology. Provides a substantial global income boost.',
    icon: AtomIcon,
    tier: 5,
    recipe: [{ componentId: 'alloy_gear', quantity: 2 }],
    rawMaterialCost: 300,
    productionTimeSeconds: 3600,
    requiredAssemblerMark: 5,
    effects: {
      globalIncomeBoostPerComponentPercent: 0.030,
      maxBonusPercent: 15,
    }
  },

  // Existing Specific Boost Components
  {
    id: 'industrial_juicer_parts',
    name: 'Industrial Juicer Parts',
    description: 'Components for high-efficiency juicers. Boosts Lemonade Stand income.',
    icon: Citrus,
    tier: 2,
    recipe: [{ componentId: 'basic_gear', quantity: 3 }],
    rawMaterialCost: 25,
    productionTimeSeconds: 45,
    requiredAssemblerMark: 1,
    effects: {
      businessSpecificIncomeBoostPercent: { businessId: 'lemonade_stand', percent: 0.1 },
      maxBonusPercent: 25,
    }
  },
  {
    id: 'efficiency_coil',
    name: 'Efficiency Coil',
    description: 'A component that improves energy efficiency. Slightly boosts factory power output.',
    icon: Zap,
    tier: 2,
    recipe: [{ componentId: 'basic_gear', quantity: 2 }],
    rawMaterialCost: 15,
    productionTimeSeconds: 30,
    requiredAssemblerMark: 1,
    effects: {
      factoryGlobalPowerOutputBoostPercent: 0.05,
      maxBonusPercent: 10,
    }
  },
  {
    id: 'survey_drone_module',
    name: 'Survey Drone Module',
    description: 'Enhances drone capabilities for material collection. Slightly boosts factory material collection rate.',
    icon: PackageSearch,
    tier: 2,
    recipe: [{ componentId: 'basic_gear', quantity: 2 }, { componentId: 'efficiency_coil', quantity: 1 }],
    rawMaterialCost: 20,
    productionTimeSeconds: 30,
    requiredAssemblerMark: 1,
    effects: {
      factoryGlobalMaterialCollectionBoostPercent: 0.05,
      maxBonusPercent: 10,
    }
  },
  {
    id: 'miniature_ai_core',
    name: 'Miniature AI Core',
    description: 'A compact AI processing unit. Boosts Tech Startup income.',
    icon: BrainCircuit,
    tier: 3,
    recipe: [{ componentId: 'advanced_gear', quantity: 2 }, { componentId: 'efficiency_coil', quantity: 3 }],
    rawMaterialCost: 70,
    productionTimeSeconds: 240,
    requiredAssemblerMark: 2,
    effects: {
      businessSpecificIncomeBoostPercent: { businessId: 'tech_startup', percent: 0.12 },
      maxBonusPercent: 30,
    }
  },
  {
    id: 'market_analysis_chip',
    name: 'Market Analysis Chip',
    description: 'Specialized chip for financial analysis. Boosts Global Corp (GC) stock dividend yield.',
    icon: BarChart,
    tier: 3,
    recipe: [{ componentId: 'precision_gear', quantity: 1 }, { componentId: 'miniature_ai_core', quantity: 1 }],
    rawMaterialCost: 100,
    productionTimeSeconds: 300,
    requiredAssemblerMark: 3,
    effects: {
      stockSpecificDividendYieldBoostPercent: { stockId: 'global_corp', percent: 0.0005 },
      maxBonusPercent: 0.25
    }
  },

  // New Component Families (15 Components)
  // Family 1: Circuits
  {
    id: 'basic_circuit_board',
    name: 'Basic Circuit Board',
    description: 'A fundamental electronic board. Modestly improves Tech Startup efficiency.',
    icon: CircuitBoard,
    tier: 1,
    recipe: [],
    rawMaterialCost: 15,
    productionTimeSeconds: 25,
    requiredAssemblerMark: 1,
    effects: { businessSpecificLevelUpCostReductionPercent: { businessId: 'tech_startup', percent: 0.05 }, maxBonusPercent: 2 }
  },
  {
    id: 'advanced_logic_chip',
    name: 'Advanced Logic Chip',
    description: 'Sophisticated chip for complex calculations. Boosts Software Agency income.',
    icon: CircuitBoard,
    tier: 2,
    recipe: [{ componentId: 'basic_circuit_board', quantity: 4 }, { componentId: 'basic_gear', quantity: 2 }],
    rawMaterialCost: 40,
    productionTimeSeconds: 75,
    requiredAssemblerMark: 2,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'software_agency', percent: 0.08 }, maxBonusPercent: 10 }
  },
  {
    id: 'quantum_processor_unit',
    name: 'Quantum Processor Unit',
    description: 'A processor leveraging quantum mechanics. Enhances AI Research Lab income.',
    icon: CircuitBoard,
    tier: 3,
    recipe: [{ componentId: 'advanced_logic_chip', quantity: 3 }, { componentId: 'precision_gear', quantity: 1 }],
    rawMaterialCost: 100,
    productionTimeSeconds: 300,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'ai_research_lab', percent: 0.1 }, maxBonusPercent: 15 }
  },

  // Family 2: Frames
  {
    id: 'simple_frame',
    name: 'Simple Frame',
    description: 'Basic structural component. Small boost to Fast Food Franchise level up cost.',
    icon: Frame,
    tier: 1,
    recipe: [],
    rawMaterialCost: 8,
    productionTimeSeconds: 18,
    requiredAssemblerMark: 1,
    effects: { businessSpecificLevelUpCostReductionPercent: { businessId: 'fast_food_franchise', percent: 0.04 }, maxBonusPercent: 1.5 }
  },
  {
    id: 'reinforced_chassis',
    name: 'Reinforced Chassis',
    description: 'Durable frame for machinery. Benefits Manufacturing Plant upgrade costs.',
    icon: Frame,
    tier: 2,
    recipe: [{ componentId: 'simple_frame', quantity: 5 }],
    rawMaterialCost: 30,
    productionTimeSeconds: 70,
    requiredAssemblerMark: 2,
    effects: { businessSpecificUpgradeCostReductionPercent: { businessId: 'manufacturing_plant', percent: 0.06 }, maxBonusPercent: 8 }
  },
  {
    id: 'null_g_support_structure',
    name: 'Null-G Support Structure',
    description: 'Lightweight yet strong frame for space applications. Boosts Space Exploration Inc. income.',
    icon: Frame,
    tier: 3,
    recipe: [{ componentId: 'reinforced_chassis', quantity: 3 }, { componentId: 'advanced_gear', quantity: 2 }],
    rawMaterialCost: 90,
    productionTimeSeconds: 280,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'space_exploration_inc', percent: 0.09 }, maxBonusPercent: 12 }
  },

  // Family 3: Optics
  {
    id: 'crude_lens',
    name: 'Crude Lens',
    description: 'Basic optical lens. Minor boost to Movie Studio income.',
    icon: Camera,
    tier: 1,
    recipe: [],
    rawMaterialCost: 12,
    productionTimeSeconds: 22,
    requiredAssemblerMark: 1,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'movie_studio', percent: 0.03 }, maxBonusPercent: 1.8 }
  },
  {
    id: 'polished_optical_array',
    name: 'Polished Optical Array',
    description: 'High-quality lens array for precision instruments. Benefits Cybersecurity Solutions income.',
    icon: Camera,
    tier: 2,
    recipe: [{ componentId: 'crude_lens', quantity: 6 }],
    rawMaterialCost: 35,
    productionTimeSeconds: 80,
    requiredAssemblerMark: 2,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'cybersecurity_solutions', percent: 0.07 }, maxBonusPercent: 9 }
  },
  {
    id: 'gravimetric_sensor_suite',
    name: 'Gravimetric Sensor Suite',
    description: 'Advanced sensors for detecting gravitational anomalies. Aids Space Exploration Inc. upgrade costs.',
    icon: Camera,
    tier: 3,
    recipe: [{ componentId: 'polished_optical_array', quantity: 3 }, { componentId: 'miniature_ai_core', quantity: 1 }],
    rawMaterialCost: 110,
    productionTimeSeconds: 320,
    requiredAssemblerMark: 3,
    effects: { businessSpecificUpgradeCostReductionPercent: { businessId: 'space_exploration_inc', percent: 0.05 }, maxBonusPercent: 7 }
  },

  // Family 4: Power Cells
  {
    id: 'basic_energy_cell',
    name: 'Basic Energy Cell',
    description: 'Simple power storage unit. Slightly reduces Diesel Generator power consumption in effect (conceptual).',
    icon: BatteryCharging,
    tier: 1,
    recipe: [],
    rawMaterialCost: 20,
    productionTimeSeconds: 30,
    requiredAssemblerMark: 1,
    effects: { factoryGlobalPowerOutputBoostPercent: 0.01, maxBonusPercent: 1 } // Small general boost instead of specific building effect
  },
  {
    id: 'efficient_power_core',
    name: 'Efficient Power Core',
    description: 'Improved energy cell with better capacity. Small boost to Renewable Energy Corp income.',
    icon: BatteryCharging,
    tier: 2,
    recipe: [{ componentId: 'basic_energy_cell', quantity: 3 }, { componentId: 'efficiency_coil', quantity: 2 }],
    rawMaterialCost: 50,
    productionTimeSeconds: 90,
    requiredAssemblerMark: 2,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'renewable_energy_corp', percent: 0.06 }, maxBonusPercent: 8 }
  },
  {
    id: 'dense_plasma_battery',
    name: 'Dense Plasma Battery',
    description: 'High-capacity plasma battery for demanding applications. Benefits Fusion Power Plant income.',
    icon: BatteryCharging,
    tier: 3,
    recipe: [{ componentId: 'efficient_power_core', quantity: 2 }, { componentId: 'advanced_logic_chip', quantity: 1 }],
    rawMaterialCost: 130,
    productionTimeSeconds: 360,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'fusion_power_plant', percent: 0.12 }, maxBonusPercent: 18 }
  },

  // Family 5: Data Storage
  {
    id: 'magnetic_storage_unit',
    name: 'Magnetic Storage Unit',
    description: 'Basic data storage device. Minor boost to OmniMedia Group income.',
    icon: PackageCheck, // Placeholder, could be ServerIcon
    tier: 1,
    recipe: [],
    rawMaterialCost: 18,
    productionTimeSeconds: 28,
    requiredAssemblerMark: 1,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'omni_media_group', percent: 0.02 }, maxBonusPercent: 1.5 }
  },
  {
    id: 'solid_state_drive_array',
    name: 'Solid State Drive Array',
    description: 'Fast and reliable data storage. Aids Universal Translation Services income.',
    icon: PackageCheck, // Placeholder
    tier: 2,
    recipe: [{ componentId: 'magnetic_storage_unit', quantity: 4 }, { componentId: 'basic_circuit_board', quantity: 1 }],
    rawMaterialCost: 45,
    productionTimeSeconds: 85,
    requiredAssemblerMark: 2,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'universal_translation_services', percent: 0.05 }, maxBonusPercent: 7 }
  },
  {
    id: 'holographic_data_crystal',
    name: 'Holographic Data Crystal',
    description: 'Vast storage capacity using holographic technology. Boosts Omniversal Data Archive income.',
    icon: PackageCheck, // Placeholder
    tier: 3,
    recipe: [{ componentId: 'solid_state_drive_array', quantity: 2 }, { componentId: 'polished_optical_array', quantity: 1 }],
    rawMaterialCost: 120,
    productionTimeSeconds: 340,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'omniversal_data_archive', percent: 0.11 }, maxBonusPercent: 16 }
  },

  // Additional Unique Components (5 Components)
  {
    id: 'automated_coffee_grinder',
    name: 'Automated Coffee Grinder',
    description: 'Precision grinding for perfect coffee. Boosts Coffee Shop income significantly.',
    icon: Coffee,
    tier: 2,
    recipe: [{ componentId: 'basic_gear', quantity: 4 }, { componentId: 'efficiency_coil', quantity: 1 }],
    rawMaterialCost: 30,
    productionTimeSeconds: 65,
    requiredAssemblerMark: 2,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'coffee_shop', percent: 0.15 }, maxBonusPercent: 20 }
  },
  {
    id: 'high_yield_solar_cell_adv', // Renamed to avoid conflict if 'solar_cell' is used elsewhere
    name: 'High-Yield Solar Cell',
    description: 'Advanced photovoltaic cell. Boosts Solar Panel Array Mk2 power output (conceptual effect handled by game logic).',
    icon: SolarPanel, // Assuming SolarPanel is a valid LucideIcon
    tier: 3,
    recipe: [{ componentId: 'advanced_gear', quantity: 2 }, { componentId: 'precision_gear', quantity: 1 }],
    rawMaterialCost: 80,
    productionTimeSeconds: 200,
    requiredAssemblerMark: 3,
    effects: { factoryGlobalPowerOutputBoostPercent: 0.02, maxBonusPercent: 5 } // Broader effect for factory
  },
  {
    id: 'robotic_arm_actuator_adv', // Renamed for uniqueness
    name: 'Robotic Arm Actuator',
    description: 'Key component for robotic arms. Reduces Manufacturing Plant level up costs.',
    icon: Combine, // Using Combine as a placeholder for a robotic arm part
    tier: 4,
    recipe: [{ componentId: 'alloy_gear', quantity: 1 }, { componentId: 'advanced_logic_chip', quantity: 2 }],
    rawMaterialCost: 150,
    productionTimeSeconds: 1000,
    requiredAssemblerMark: 4,
    effects: { businessSpecificLevelUpCostReductionPercent: { businessId: 'manufacturing_plant', percent: 0.07 }, maxBonusPercent: 10 }
  },
  {
    id: 'logistics_ai_processor',
    name: 'Logistics AI Processor',
    description: 'AI chip for optimizing global logistics. Boosts GlobalLink Logistics income.',
    icon: BrainCircuit,
    tier: 4,
    recipe: [{ componentId: 'quantum_processor_unit', quantity: 1 }, { componentId: 'solid_state_drive_array', quantity: 2 }],
    rawMaterialCost: 200,
    productionTimeSeconds: 1200,
    requiredAssemblerMark: 4,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'global_logistics_inc', percent: 0.1 }, maxBonusPercent: 15 }
  },
  {
    id: 'advanced_mining_drill_bit',
    name: 'Advanced Mining Drill Bit',
    description: 'Extremely durable drill bit. Boosts Automated Mining Rig Mk1 material collection rate (conceptual).',
    icon: Drill,
    tier: 3,
    recipe: [{ componentId: 'precision_gear', quantity: 2 }, { componentId: 'simple_frame', quantity: 3 }],
    rawMaterialCost: 70,
    productionTimeSeconds: 220,
    requiredAssemblerMark: 3,
    effects: { factoryGlobalMaterialCollectionBoostPercent: 0.015, maxBonusPercent: 4 } // Broader effect for factory
  },
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


    