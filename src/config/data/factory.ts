
import type { FactoryPowerBuildingConfig, FactoryMachineConfig, FactoryComponent, FactoryMaterialCollectorConfig, FactoryMachineUpgradeConfig } from '@/types';
import { Sun, Waves, Zap, Settings, Cog, Wrench, PackageSearch, Drill, HardHat, Factory as FactoryIcon, PackageCheck, PackagePlus, Pickaxe, Mountain, Satellite, CloudCog, TrendingUp, AtomIcon, InfinityIcon, Lightbulb, BrainCircuit, BarChart, Citrus, CircuitBoard, Frame, Camera, BatteryCharging, Users, Coffee, Combine, Landmark, Briefcase, ShieldCheck, FlaskConical, Rocket, Ship, Dna, Radio, Sigma, Anchor, Headset, Construction, LineChart, Languages, SproutIcon, UserCheck, Beaker, PenTool, Scroll, Milestone, BotIcon, Replace, Building2, Handshake, Database, HelpCircle, Gavel, University, Power, Aperture, Orbit, Layers, Truck, Map, Megaphone, Utensils, Code2, GitMerge as GitMergeIcon, PiggyBank, Archive, ShieldEllipsis, Server, Scissors, Mic, ToyBrick, Fuel, Scan, Smile, DollarSign, SlidersHorizontal, Diamond, Sparkles, Gem, BookOpen, ShieldAlert, TowerControl, TestTube, TrendingUp as TrendingUpLucideIcon, Brain, Globe, Biohazard, Film, Wind, Airplay, Antenna, Workflow, Scale, Speaker, Router, Palette, DraftingCompass, Tv } from 'lucide-react';

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
    description: 'Simple power storage unit. Slightly boosts factory power output.',
    icon: BatteryCharging,
    tier: 1,
    recipe: [],
    rawMaterialCost: 20,
    productionTimeSeconds: 30,
    requiredAssemblerMark: 1,
    effects: { factoryGlobalPowerOutputBoostPercent: 0.01, maxBonusPercent: 1 }
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
    icon: PackageCheck,
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
    icon: PackageCheck,
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
    icon: PackageCheck,
    tier: 3,
    recipe: [{ componentId: 'solid_state_drive_array', quantity: 2 }, { componentId: 'polished_optical_array', quantity: 1 }],
    rawMaterialCost: 120,
    productionTimeSeconds: 340,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'omniversal_data_archive', percent: 0.11 }, maxBonusPercent: 16 }
  },

  // Unique Components (Phase 1 additions)
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
    id: 'high_yield_solar_cell_adv',
    name: 'High-Yield Solar Cell',
    description: 'Advanced photovoltaic cell. Boosts Solar Panel Array Mk2 power output.',
    icon: Sun,
    tier: 3,
    recipe: [{ componentId: 'advanced_gear', quantity: 2 }, { componentId: 'precision_gear', quantity: 1 }],
    rawMaterialCost: 80,
    productionTimeSeconds: 200,
    requiredAssemblerMark: 3,
    effects: { factoryGlobalPowerOutputBoostPercent: 0.02, maxBonusPercent: 5 }
  },
  {
    id: 'robotic_arm_actuator_adv',
    name: 'Robotic Arm Actuator',
    description: 'Key component for robotic arms. Reduces Manufacturing Plant level up costs.',
    icon: Combine,
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
    description: 'Extremely durable drill bit. Boosts Automated Mining Rig Mk1 material collection rate.',
    icon: Drill,
    tier: 3,
    recipe: [{ componentId: 'precision_gear', quantity: 2 }, { componentId: 'simple_frame', quantity: 3 }],
    rawMaterialCost: 70,
    productionTimeSeconds: 220,
    requiredAssemblerMark: 3,
    effects: { factoryGlobalMaterialCollectionBoostPercent: 0.015, maxBonusPercent: 4 }
  },

  // Family 6: Power Regulators
  {
    id: 'power_regulator_mk1',
    name: 'Power Regulator Mk1',
    description: 'Stabilizes power flow. Small boost to global factory power output.',
    icon: Zap,
    tier: 2,
    recipe: [{ componentId: 'basic_circuit_board', quantity: 2 }, { componentId: 'efficiency_coil', quantity: 1 }],
    rawMaterialCost: 35,
    productionTimeSeconds: 80,
    requiredAssemblerMark: 2,
    effects: { factoryGlobalPowerOutputBoostPercent: 0.02, maxBonusPercent: 3 }
  },
  {
    id: 'power_regulator_mk2',
    name: 'Power Regulator Mk2',
    description: 'Advanced power regulation. Moderate boost to global factory power output.',
    icon: Zap,
    tier: 3,
    recipe: [{ componentId: 'power_regulator_mk1', quantity: 3 }, { componentId: 'advanced_logic_chip', quantity: 1 }],
    rawMaterialCost: 80,
    productionTimeSeconds: 250,
    requiredAssemblerMark: 3,
    effects: { factoryGlobalPowerOutputBoostPercent: 0.05, maxBonusPercent: 7 }
  },
  {
    id: 'power_regulator_mk3',
    name: 'Power Regulator Mk3',
    description: 'Cutting-edge power flow control. Large boost to global factory power output.',
    icon: Zap,
    tier: 4,
    recipe: [{ componentId: 'power_regulator_mk2', quantity: 2 }, { componentId: 'quantum_processor_unit', quantity: 1 }],
    rawMaterialCost: 200,
    productionTimeSeconds: 1000,
    requiredAssemblerMark: 4,
    effects: { factoryGlobalPowerOutputBoostPercent: 0.10, maxBonusPercent: 12 }
  },

  // Family 7: Nanite Assemblers
  {
    id: 'nanite_conduit',
    name: 'Nanite Conduit',
    description: 'Channels for nanite operations. Reduces level-up cost for Manufacturing businesses.',
    icon: Combine,
    tier: 3,
    recipe: [{ componentId: 'precision_gear', quantity: 1 }, { componentId: 'advanced_logic_chip', quantity: 1 }],
    rawMaterialCost: 90,
    productionTimeSeconds: 320,
    requiredAssemblerMark: 3,
    effects: { businessSpecificLevelUpCostReductionPercent: { businessId: 'manufacturing_plant', percent: 0.02 }, maxBonusPercent: 4 }
  },
  {
    id: 'nanite_assembler_core',
    name: 'Nanite Assembler Core',
    description: 'Core unit for nanite construction. Further reduces level-up cost for Manufacturing businesses.',
    icon: Combine,
    tier: 4,
    recipe: [{ componentId: 'nanite_conduit', quantity: 3 }, { componentId: 'quantum_processor_unit', quantity: 1 }],
    rawMaterialCost: 250,
    productionTimeSeconds: 1200,
    requiredAssemblerMark: 4,
    effects: { businessSpecificLevelUpCostReductionPercent: { businessId: 'manufacturing_plant', percent: 0.04 }, maxBonusPercent: 8 }
  },
  {
    id: 'self_replicating_nanite_swarm_component',
    name: 'Self-Replicating Nanite Swarm',
    description: 'Autonomous nanites for complex tasks. Significantly reduces Manufacturing business level-up costs and small global income boost.',
    icon: CloudCog,
    tier: 5,
    recipe: [{ componentId: 'nanite_assembler_core', quantity: 2 }, { componentId: 'quantum_gear', quantity: 1 }],
    rawMaterialCost: 600,
    productionTimeSeconds: 4000,
    requiredAssemblerMark: 5,
    effects: { businessSpecificLevelUpCostReductionPercent: { businessId: 'manufacturing_plant', percent: 0.08 }, globalIncomeBoostPerComponentPercent: 0.005, maxBonusPercent: 15 }
  },

  // Specific Business Boosts (Phase 1 additions for variety)
  {
    id: 'artisanal_sourdough_culture',
    name: 'Artisanal Sourdough Culture',
    description: 'A unique yeast culture for superior bread. Boosts Artisan Bakery income.',
    icon: Landmark,
    tier: 2,
    recipe: [{ componentId: 'basic_gear', quantity: 2 }],
    rawMaterialCost: 22,
    productionTimeSeconds: 55,
    requiredAssemblerMark: 1,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'artisan_bakery', percent: 0.08 }, maxBonusPercent: 15 }
  },
  {
    id: 'secure_encryption_module',
    name: 'Secure Encryption Module',
    description: 'Hardware module for strong encryption. Boosts Cybersecurity Solutions income.',
    icon: ShieldCheck,
    tier: 3,
    recipe: [{ componentId: 'advanced_logic_chip', quantity: 2 }, { componentId: 'efficiency_coil', quantity: 2 }],
    rawMaterialCost: 85,
    productionTimeSeconds: 280,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'cybersecurity_solutions', percent: 0.1 }, maxBonusPercent: 20 }
  },
  {
    id: 'bio_reactor_catalyst',
    name: 'Bio-Reactor Catalyst',
    description: 'Speeds up biological reactions. Boosts Pharmaceutical Company income.',
    icon: FlaskConical,
    tier: 3,
    recipe: [{ componentId: 'precision_gear', quantity: 1 }, { componentId: 'basic_circuit_board', quantity: 3 }],
    rawMaterialCost: 70,
    productionTimeSeconds: 260,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'pharmaceutical_company', percent: 0.09 }, maxBonusPercent: 18 }
  },
  {
    id: 'miniature_fusion_core_component',
    name: 'Miniature Fusion Core',
    description: 'Compact power source for spacecraft. Boosts Space Exploration Inc. income.',
    icon: Rocket,
    tier: 4,
    recipe: [{ componentId: 'quantum_processor_unit', quantity: 1 }, { componentId: 'power_regulator_mk2', quantity: 1 }],
    rawMaterialCost: 220,
    productionTimeSeconds: 1100,
    requiredAssemblerMark: 4,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'space_exploration_inc', percent: 0.12 }, maxBonusPercent: 22 }
  },
  {
    id: 'automated_logistics_router',
    name: 'Automated Logistics Router',
    description: 'Optimizes cargo routes. Boosts Horizon Logistics income.',
    icon: Ship,
    tier: 3,
    recipe: [{ componentId: 'advanced_logic_chip', quantity: 2 }, { componentId: 'survey_drone_module', quantity: 1 }],
    rawMaterialCost: 95,
    productionTimeSeconds: 310,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'global_shipping_network', percent: 0.08 }, maxBonusPercent: 16 }
  },
  {
    id: 'neural_net_processor_adv_component',
    name: 'Advanced Neural Net Processor',
    description: 'High-performance AI chip. Boosts AI Research Lab income.',
    icon: BrainCircuit,
    tier: 4,
    recipe: [{ componentId: 'quantum_processor_unit', quantity: 2 }, { componentId: 'holographic_data_crystal', quantity: 1 }],
    rawMaterialCost: 280,
    productionTimeSeconds: 1300,
    requiredAssemblerMark: 4,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'ai_research_lab', percent: 0.11 }, maxBonusPercent: 20 }
  },
  {
    id: 'gene_splicing_kit',
    name: 'Gene Splicing Kit',
    description: 'Tools for precise genetic modification. Boosts EvoGenesis Labs income.',
    icon: Dna,
    tier: 3,
    recipe: [{ componentId: 'precision_gear', quantity: 1 }, { componentId: 'polished_optical_array', quantity: 1 }],
    rawMaterialCost: 75,
    productionTimeSeconds: 270,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'genetic_engineering_firm', percent: 0.1 }, maxBonusPercent: 19 }
  },
  {
    id: 'vr_sensory_enhancer',
    name: 'VR Sensory Enhancer',
    description: 'Heightens realism in virtual environments. Boosts Elysian VR Realms income.',
    icon: Headset,
    tier: 3,
    recipe: [{ componentId: 'advanced_logic_chip', quantity: 1 }, { componentId: 'polished_optical_array', quantity: 2 }],
    rawMaterialCost: 100,
    productionTimeSeconds: 330,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'virtual_reality_worlds', percent: 0.09 }, maxBonusPercent: 17 }
  },
  {
    id: 'terraforming_microbes',
    name: 'Terraforming Microbes',
    description: 'Engineered organisms for planetary transformation. Boosts Genesis TerraCorp income.',
    icon: SproutIcon,
    tier: 4,
    recipe: [{ componentId: 'gene_splicing_kit', quantity: 2 }, { componentId: 'miniature_ai_core', quantity: 1 }],
    rawMaterialCost: 200,
    productionTimeSeconds: 1150,
    requiredAssemblerMark: 4,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'planetary_terraforming_corp', percent: 0.12 }, maxBonusPercent: 21 }
  },

  // Specific Stock Boosts (Phase 1 additions)
  {
    id: 'green_energy_turbine_blade',
    name: 'Advanced Turbine Blade',
    description: 'Aerodynamic blade for wind turbines. Boosts Green Energy Co. (GEC) stock dividend yield.',
    icon: Wind,
    tier: 2,
    recipe: [{ componentId: 'simple_frame', quantity: 3 }, { componentId: 'basic_gear', quantity: 2 }],
    rawMaterialCost: 30,
    productionTimeSeconds: 70,
    requiredAssemblerMark: 2,
    effects: { stockSpecificDividendYieldBoostPercent: { stockId: 'green_energy_co', percent: 0.0003 }, maxBonusPercent: 0.15 }
  },
  {
    id: 'real_estate_ai_predictor_component',
    name: 'Real Estate AI Predictor',
    description: 'AI model for predicting property market trends. Boosts Summit Real Estate (SRE) stock dividend yield.',
    icon: Landmark,
    tier: 3,
    recipe: [{ componentId: 'miniature_ai_core', quantity: 1 }, { componentId: 'solid_state_drive_array', quantity: 1 }],
    rawMaterialCost: 100,
    productionTimeSeconds: 320,
    requiredAssemblerMark: 3,
    effects: { stockSpecificDividendYieldBoostPercent: { stockId: 'summit_real_estate', percent: 0.0004 }, maxBonusPercent: 0.20 }
  },
  {
    id: 'vtol_engine_prototype',
    name: 'VTOL Engine Prototype',
    description: 'Experimental engine for vertical take-off vehicles. Boosts Momentum Motors (MMTR) stock dividend yield.',
    icon: Rocket,
    tier: 4,
    recipe: [{ componentId: 'alloy_gear', quantity: 1 }, { componentId: 'power_regulator_mk2', quantity: 1 }],
    rawMaterialCost: 250,
    productionTimeSeconds: 1250,
    requiredAssemblerMark: 4,
    effects: { stockSpecificDividendYieldBoostPercent: { stockId: 'momentum_motors', percent: 0.0002 }, maxBonusPercent: 0.10 }
  },

  // Business Type Boosts (Phase 1 additions)
  {
    id: 'energy_grid_stabilizer',
    name: 'Energy Grid Stabilizer',
    description: 'Component for stabilizing large-scale power grids. Boosts income for all Energy type businesses.',
    icon: Zap,
    tier: 3,
    recipe: [{ componentId: 'power_regulator_mk1', quantity: 2 }, { componentId: 'advanced_logic_chip', quantity: 1 }],
    rawMaterialCost: 90,
    productionTimeSeconds: 300,
    requiredAssemblerMark: 3,
    effects: { businessTypeIncomeBoostPercent: { businessType: 'ENERGY', percent: 0.02 }, maxBonusPercent: 5 }
  },
  {
    id: 'logistics_ai_coordination_chip',
    name: 'Logistics Coordination AI',
    description: 'Specialized AI for coordinating complex logistics. Boosts income for all Logistics type businesses.',
    icon: Truck,
    tier: 3,
    recipe: [{ componentId: 'miniature_ai_core', quantity: 1 }, { componentId: 'basic_circuit_board', quantity: 2 }],
    rawMaterialCost: 80,
    productionTimeSeconds: 290,
    requiredAssemblerMark: 3,
    effects: { businessTypeIncomeBoostPercent: { businessType: 'LOGISTICS', percent: 0.02 }, maxBonusPercent: 5 }
  },

  // Global Boosts / Factory Boosts (Phase 1 additions)
  {
    id: 'reinforced_factory_plating_component',
    name: 'Reinforced Factory Plating',
    description: 'Strengthens factory infrastructure. Small boost to factory power output (simulating reduced losses).',
    icon: FactoryIcon,
    tier: 2,
    recipe: [{ componentId: 'simple_frame', quantity: 4 }],
    rawMaterialCost: 25,
    productionTimeSeconds: 60,
    requiredAssemblerMark: 1,
    effects: { factoryGlobalPowerOutputBoostPercent: 0.015, maxBonusPercent: 2.5 }
  },
  {
    id: 'automated_resource_scanner',
    name: 'Automated Resource Scanner',
    description: 'Improves efficiency of material collectors. Small boost to global material collection rate.',
    icon: PackageSearch,
    tier: 2,
    recipe: [{ componentId: 'basic_circuit_board', quantity: 1 }, { componentId: 'crude_lens', quantity: 2 }],
    rawMaterialCost: 30,
    productionTimeSeconds: 70,
    requiredAssemblerMark: 2,
    effects: { factoryGlobalMaterialCollectionBoostPercent: 0.01, maxBonusPercent: 3 }
  },
  {
    id: 'assembly_line_lubricant_super',
    name: 'Super Lubricant',
    description: 'Reduces friction in all machinery. Minor boost to global income.',
    icon: Cog,
    tier: 1,
    recipe: [],
    rawMaterialCost: 7,
    productionTimeSeconds: 15,
    requiredAssemblerMark: 1,
    effects: { globalIncomeBoostPerComponentPercent: 0.0005, maxBonusPercent: 2 }
  },
  {
    id: 'data_optimization_algorithm_component',
    name: 'Data Optimization Algorithm',
    description: 'Improves data processing efficiency. Minor boost to global income.',
    icon: BarChart,
    tier: 2,
    recipe: [{ componentId: 'basic_circuit_board', quantity: 2 }],
    rawMaterialCost: 28,
    productionTimeSeconds: 65,
    requiredAssemblerMark: 2,
    effects: { globalIncomeBoostPerComponentPercent: 0.001, maxBonusPercent: 3 }
  },
  {
    id: 'advanced_cooling_system_component',
    name: 'Advanced Cooling System',
    description: 'High-efficiency cooling for factory systems. Further boost to factory power output.',
    icon: Zap,
    tier: 3,
    recipe: [{ componentId: 'efficiency_coil', quantity: 3 }, { componentId: 'reinforced_chassis', quantity: 1 }],
    rawMaterialCost: 65,
    productionTimeSeconds: 230,
    requiredAssemblerMark: 3,
    effects: { factoryGlobalPowerOutputBoostPercent: 0.03, maxBonusPercent: 6 }
  },
  {
    id: 'predictive_maintenance_module_component',
    name: 'Predictive Maintenance Module',
    description: 'AI module that predicts and schedules maintenance, reducing global business upgrade costs.',
    icon: Wrench,
    tier: 3,
    recipe: [{ componentId: 'miniature_ai_core', quantity: 1 }, { componentId: 'advanced_gear', quantity: 1 }],
    rawMaterialCost: 80,
    productionTimeSeconds: 290,
    requiredAssemblerMark: 3,
    effects: { globalBusinessUpgradeCostReductionPercent: 0.01, maxBonusPercent: 2 }
  },
  {
    id: 'universal_adapter_module_component',
    name: 'Universal Adapter Module',
    description: 'Versatile adapter for various machinery. Reduces global business level-up costs.',
    icon: Combine,
    tier: 2,
    recipe: [{ componentId: 'basic_gear', quantity: 3 }, { componentId: 'simple_frame', quantity: 1 }],
    rawMaterialCost: 32,
    productionTimeSeconds: 75,
    requiredAssemblerMark: 2,
    effects: { globalCostReductionPercent: 0.005, maxBonusPercent: 1 }
  },
  {
    id: 'harmonic_resonance_capacitor',
    name: 'Harmonic Resonance Capacitor',
    description: 'Stores and releases energy in perfect harmony. Significant boost to factory power output.',
    icon: Power,
    tier: 4,
    recipe: [{ componentId: 'power_regulator_mk2', quantity: 1 }, { componentId: 'quantum_processor_unit', quantity: 1 }],
    rawMaterialCost: 230,
    productionTimeSeconds: 1100,
    requiredAssemblerMark: 4,
    effects: { factoryGlobalPowerOutputBoostPercent: 0.08, maxBonusPercent: 10 }
  },
  {
    id: 'geospatial_mapping_unit',
    name: 'Geospatial Mapping Unit',
    description: 'Advanced terrain mapping for resource extraction. Boosts global material collection rate.',
    icon: Map,
    tier: 3,
    recipe: [{ componentId: 'survey_drone_module', quantity: 2 }, { componentId: 'advanced_logic_chip', quantity: 1 }],
    rawMaterialCost: 90,
    productionTimeSeconds: 310,
    requiredAssemblerMark: 3,
    effects: { factoryGlobalMaterialCollectionBoostPercent: 0.03, maxBonusPercent: 7 }
  },
  // High Tier Components (Phase 1 additions)
  {
    id: 'tachyon_field_emitter_component',
    name: 'Tachyon Field Emitter',
    description: 'Generates tachyon fields for FTL applications. Boosts income for all Aerospace businesses.',
    icon: Aperture,
    tier: 5,
    recipe: [{ componentId: 'quantum_gear', quantity: 1 }, { componentId: 'power_regulator_mk3', quantity: 1 }],
    rawMaterialCost: 550,
    productionTimeSeconds: 3800,
    requiredAssemblerMark: 5,
    effects: { businessTypeIncomeBoostPercent: { businessType: 'AEROSPACE', percent: 0.05 }, maxBonusPercent: 10 }
  },
  {
    id: 'chroniton_particle_stabilizer_component',
    name: 'Chroniton Particle Stabilizer',
    description: 'Manipulates chronitons for temporal stability. Provides a global income boost.',
    icon: Orbit,
    tier: 5,
    recipe: [{ componentId: 'quantum_gear', quantity: 1 }, { componentId: 'holographic_data_crystal', quantity: 2 }],
    rawMaterialCost: 600,
    productionTimeSeconds: 4200,
    requiredAssemblerMark: 5,
    effects: { globalIncomeBoostPerComponentPercent: 0.025, maxBonusPercent: 10 }
  },
  {
    id: 'exotic_matter_containment_cell_component',
    name: 'Exotic Matter Containment Cell',
    description: 'Safely contains unstable exotic matter. Boosts income for all BioTech businesses.',
    icon: Layers,
    tier: 5,
    recipe: [{ componentId: 'alloy_gear', quantity: 2 }, { componentId: 'dense_plasma_battery', quantity: 2 }],
    rawMaterialCost: 580,
    productionTimeSeconds: 4000,
    requiredAssemblerMark: 5,
    effects: { businessTypeIncomeBoostPercent: { businessType: 'BIO_TECH', percent: 0.06 }, maxBonusPercent: 12 }
  },
  {
    id: 'reality_distortion_lens_component',
    name: 'Reality Distortion Lens',
    description: 'A lens that bends local spacetime. Boosts income for Misc. Advanced businesses.',
    icon: Replace,
    tier: 5,
    recipe: [{ componentId: 'gravimetric_sensor_suite', quantity: 3 }, { componentId: 'quantum_processor_unit', quantity: 2 }],
    rawMaterialCost: 650,
    productionTimeSeconds: 4500,
    requiredAssemblerMark: 5,
    effects: { businessTypeIncomeBoostPercent: { businessType: 'MISC_ADVANCED', percent: 0.04 }, maxBonusPercent: 8 }
  },

  // --- PHASE 2 ADDITIONS ---
  // Family: Advanced Casing
  {
    id: 'rugged_casing',
    name: 'Rugged Casing',
    description: 'A durable casing for electronics. Provides a small income boost to Fast Food Franchises.',
    icon: Archive,
    tier: 1,
    recipe: [],
    rawMaterialCost: 10,
    productionTimeSeconds: 20,
    requiredAssemblerMark: 1,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'fast_food_franchise', percent: 0.03 }, maxBonusPercent: 2 }
  },
  {
    id: 'shielded_enclosure',
    name: 'Shielded Enclosure',
    description: 'EM-shielded casing for sensitive components. Boosts Cybersecurity Solutions income.',
    icon: ShieldEllipsis,
    tier: 2,
    recipe: [{ componentId: 'rugged_casing', quantity: 3 }],
    rawMaterialCost: 15,
    productionTimeSeconds: 60,
    requiredAssemblerMark: 2,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'cybersecurity_solutions', percent: 0.05 }, maxBonusPercent: 3 }
  },
  {
    id: 'vacuum_sealed_housing',
    name: 'Vacuum-Sealed Housing',
    description: 'Airtight housing for space applications. Boosts Space Exploration Inc. income.',
    icon: Rocket,
    tier: 3,
    recipe: [{ componentId: 'shielded_enclosure', quantity: 2 }, { componentId: 'basic_gear', quantity: 2 }],
    rawMaterialCost: 30,
    productionTimeSeconds: 180,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'space_exploration_inc', percent: 0.07 }, maxBonusPercent: 4 }
  },

  // Family: Computation Cores
  {
    id: 'neural_processing_unit_adv',
    name: 'Neural Processing Unit',
    description: 'Specialized for neural network computations. Boosts AI Research Lab income.',
    icon: BrainCircuit,
    tier: 2,
    recipe: [{ componentId: 'basic_circuit_board', quantity: 3 }, { componentId: 'advanced_gear', quantity: 1 }],
    rawMaterialCost: 30,
    productionTimeSeconds: 70,
    requiredAssemblerMark: 2,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'ai_research_lab', percent: 0.06 }, maxBonusPercent: 5 }
  },
  {
    id: 'cognitive_matrix_core_adv',
    name: 'Cognitive Matrix Core',
    description: 'Core for advanced AI cognition. Boosts Sentient AI Consultancy income.',
    icon: Brain,
    tier: 3,
    recipe: [{ componentId: 'neural_processing_unit_adv', quantity: 2 }, { componentId: 'advanced_logic_chip', quantity: 1 }],
    rawMaterialCost: 60,
    productionTimeSeconds: 200,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'sentient_ai_consultancy', percent: 0.08 }, maxBonusPercent: 6 }
  },
  {
    id: 'singularity_engine_fragment_component_adv',
    name: 'Singularity Engine Fragment',
    description: 'A piece of a theoretical singularity engine. Boosts Singularity Management Corp income.',
    icon: InfinityIcon,
    tier: 4,
    recipe: [{ componentId: 'cognitive_matrix_core_adv', quantity: 2 }, { componentId: 'quantum_processor_unit', quantity: 1 }],
    rawMaterialCost: 150,
    productionTimeSeconds: 900,
    requiredAssemblerMark: 4,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'singularity_management_corp', percent: 0.1 }, maxBonusPercent: 7 }
  },

  // Family: Energy Conduits
  {
    id: 'superconductive_wire_bundle',
    name: 'Superconductive Wire Bundle',
    description: 'High-efficiency power transmission. Small boost to factory power output.',
    icon: GitMergeIcon,
    tier: 2,
    recipe: [{ componentId: 'efficiency_coil', quantity: 3 }],
    rawMaterialCost: 20,
    productionTimeSeconds: 50,
    requiredAssemblerMark: 2,
    effects: { factoryGlobalPowerOutputBoostPercent: 0.01, maxBonusPercent: 2 }
  },
  {
    id: 'plasma_conduit_segment_component_adv',
    name: 'Plasma Conduit Segment',
    description: 'For extreme energy throughput. Medium boost to factory power output.',
    icon: Sigma,
    tier: 3,
    recipe: [{ componentId: 'superconductive_wire_bundle', quantity: 2 }, { componentId: 'power_regulator_mk1', quantity: 1 }],
    rawMaterialCost: 50,
    productionTimeSeconds: 150,
    requiredAssemblerMark: 3,
    effects: { factoryGlobalPowerOutputBoostPercent: 0.03, maxBonusPercent: 5 }
  },
  {
    id: 'zero_point_tap_module_component_adv',
    name: 'Zero-Point Tap Module',
    description: 'Draws energy from vacuum fluctuations. Large boost to factory power output.',
    icon: Power,
    tier: 4,
    recipe: [{ componentId: 'plasma_conduit_segment_component_adv', quantity: 2 }, { componentId: 'power_regulator_mk2', quantity: 1 }],
    rawMaterialCost: 120,
    productionTimeSeconds: 800,
    requiredAssemblerMark: 4,
    effects: { factoryGlobalPowerOutputBoostPercent: 0.06, maxBonusPercent: 8 }
  },

  // Specific Business Boosts (Phase 2 Additions)
  {
    id: 'movie_studio_digital_projector_lens',
    name: 'Digital Projector Lens',
    description: 'High-clarity lens for digital projection. Boosts Movie Studio income.',
    icon: Film,
    tier: 2,
    recipe: [{ componentId: 'polished_optical_array', quantity: 1 }, { componentId: 'basic_circuit_board', quantity: 2 }],
    rawMaterialCost: 40,
    productionTimeSeconds: 75,
    requiredAssemblerMark: 2,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'movie_studio', percent: 0.07 }, maxBonusPercent: 4 }
  },
  {
    id: 'pharmaceutical_bio_printer_nozzle',
    name: 'Bio-Printer Nozzle',
    description: 'Precision nozzle for bio-printing applications. Boosts Pharmaceutical Company income.',
    icon: FlaskConical,
    tier: 3,
    recipe: [{ componentId: 'precision_gear', quantity: 1 }, { componentId: 'nanite_conduit', quantity: 1 }],
    rawMaterialCost: 70,
    productionTimeSeconds: 220,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'pharmaceutical_company', percent: 0.09 }, maxBonusPercent: 5 }
  },
  {
    id: 'renewable_energy_grid_inverter_adv',
    name: 'Advanced Grid Inverter',
    description: 'Efficiently converts DC to AC for power grids. Boosts EcoPower Corp income.',
    icon: Wind,
    tier: 2,
    recipe: [{ componentId: 'power_regulator_mk1', quantity: 1 }, { componentId: 'basic_energy_cell', quantity: 2 }],
    rawMaterialCost: 45,
    productionTimeSeconds: 80,
    requiredAssemblerMark: 2,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'renewable_energy_corp', percent: 0.06 }, maxBonusPercent: 4 }
  },
  {
    id: 'genetic_sequencer_chip_adv',
    name: 'Genetic Sequencer Chip',
    description: 'Specialized chip for rapid gene sequencing. Boosts EvoGenesis Labs income.',
    icon: Dna,
    tier: 3,
    recipe: [{ componentId: 'advanced_logic_chip', quantity: 2 }, { componentId: 'holographic_data_crystal', quantity: 1 }],
    rawMaterialCost: 110,
    productionTimeSeconds: 300,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'genetic_engineering_firm', percent: 0.11 }, maxBonusPercent: 6 }
  },
  {
    id: 'streaming_service_codec_optimizer_chip',
    name: 'Codec Optimizer Chip',
    description: 'Improves video compression for streaming. Boosts StreamFlix income.',
    icon: Tv,
    tier: 2,
    recipe: [{ componentId: 'advanced_logic_chip', quantity: 1 }, { componentId: 'magnetic_storage_unit', quantity: 2 }],
    rawMaterialCost: 50,
    productionTimeSeconds: 85,
    requiredAssemblerMark: 2,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'entertainment_streaming_service', percent: 0.05 }, maxBonusPercent: 3 }
  },
  {
    id: 'ad_agency_neural_targeting_module_adv',
    name: 'Neural Targeting Module',
    description: 'AI module for hyper-targeted advertising. Boosts Boutique Ad Agency income.',
    icon: Megaphone,
    tier: 3,
    recipe: [{ componentId: 'neural_processing_unit_adv', quantity: 1 }, { componentId: 'miniature_ai_core', quantity: 1 }],
    rawMaterialCost: 90,
    productionTimeSeconds: 280,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'ad_agency', percent: 0.08 }, maxBonusPercent: 5 }
  },
  {
    id: 'real_estate_holographic_viewer_pro',
    name: 'Holographic Property Viewer',
    description: 'Device for immersive property tours. Boosts Real Estate Agency income.',
    icon: Landmark,
    tier: 2,
    recipe: [{ componentId: 'polished_optical_array', quantity: 1 }, { componentId: 'simple_frame', quantity: 2 }],
    rawMaterialCost: 35,
    productionTimeSeconds: 70,
    requiredAssemblerMark: 2,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'real_estate', percent: 0.04 }, maxBonusPercent: 3 }
  },
  {
    id: 'logistics_drone_battery_extender_plus',
    name: 'Drone Battery Extender',
    description: 'Increases drone flight time for deliveries. Boosts AeroSwift Delivery income.',
    icon: Navigation,
    tier: 2,
    recipe: [{ componentId: 'efficient_power_core', quantity: 1 }, { componentId: 'basic_circuit_board', quantity: 1 }],
    rawMaterialCost: 60,
    productionTimeSeconds: 90,
    requiredAssemblerMark: 2,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'drone_delivery_service', percent: 0.07 }, maxBonusPercent: 4 }
  },
  {
    id: 'fast_food_automated_dispenser',
    name: 'Automated Food Dispenser',
    description: 'Speeds up order fulfillment. Boosts Fast Food Franchise income.',
    icon: Utensils,
    tier: 2,
    recipe: [{ componentId: 'basic_gear', quantity: 3 }, { componentId: 'simple_frame', quantity: 2 }],
    rawMaterialCost: 30,
    productionTimeSeconds: 65,
    requiredAssemblerMark: 2,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'fast_food_franchise', percent: 0.06 }, maxBonusPercent: 3 }
  },
  {
    id: 'software_agency_dev_ops_pipeline_module',
    name: 'DevOps Pipeline Module',
    description: 'Automates software deployment. Boosts CodeCrafters Inc. income.',
    icon: Code2,
    tier: 3,
    recipe: [{ componentId: 'advanced_logic_chip', quantity: 2 }, { componentId: 'survey_drone_module', quantity: 1 }],
    rawMaterialCost: 80,
    productionTimeSeconds: 250,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'software_agency', percent: 0.09 }, maxBonusPercent: 5 }
  },
  {
    id: 'global_shipping_container_tracker_adv',
    name: 'Advanced Container Tracker',
    description: 'Real-time tracking for global shipments. Boosts Horizon Logistics income.',
    icon: Ship,
    tier: 3,
    recipe: [{ componentId: 'solid_state_drive_array', quantity: 1 }, { componentId: 'miniature_ai_core', quantity: 1 }],
    rawMaterialCost: 100,
    productionTimeSeconds: 290,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'global_shipping_network', percent: 0.08 }, maxBonusPercent: 4 }
  },

  // Specific Stock Boosts (Phase 2 Additions)
  {
    id: 'alpha_pharma_research_accelerator_core',
    name: 'Research Accelerator Core',
    description: 'Speeds up drug discovery processes. Boosts Alpha Pharma (APRX) stock dividend yield.',
    icon: Beaker,
    tier: 3,
    recipe: [{ componentId: 'bio_reactor_catalyst', quantity: 1 }, { componentId: 'quantum_processor_unit', quantity: 1 }],
    rawMaterialCost: 200,
    productionTimeSeconds: 350,
    requiredAssemblerMark: 3,
    effects: { stockSpecificDividendYieldBoostPercent: { stockId: 'alpha_pharma', percent: 0.0006 }, maxBonusPercent: 0.3 }
  },
  {
    id: 'tech_innovations_quantum_sensor_array',
    name: 'Quantum Sensor Array',
    description: 'Ultra-sensitive sensors for R&D. Boosts Tech Innovations (TINV) stock dividend yield.',
    icon: AtomIcon,
    tier: 4,
    recipe: [{ componentId: 'gravimetric_sensor_suite', quantity: 1 }, { componentId: 'miniature_fusion_core_component', quantity: 1 }],
    rawMaterialCost: 350,
    productionTimeSeconds: 1000,
    requiredAssemblerMark: 4,
    effects: { stockSpecificDividendYieldBoostPercent: { stockId: 'tech_innovations', percent: 0.0003 }, maxBonusPercent: 0.15 }
  },
  {
    id: 'global_corp_efficiency_module_adv',
    name: 'GC Efficiency Module',
    description: 'Improves operational efficiency for large conglomerates. Boosts Global Corp (GC) stock dividend.',
    icon: Building,
    tier: 2,
    recipe: [{ componentId: 'advanced_gear', quantity: 2 }, { componentId: 'efficiency_coil', quantity: 2 }],
    rawMaterialCost: 50,
    productionTimeSeconds: 90,
    requiredAssemblerMark: 2,
    effects: { stockSpecificDividendYieldBoostPercent: { stockId: 'global_corp', percent: 0.0004 }, maxBonusPercent: 0.2 }
  },

  // Business Type Boosts (Phase 2 Additions)
  {
    id: 'financial_transaction_secure_ledger',
    name: 'Secure Financial Ledger',
    description: 'Immutable ledger for secure transactions. Boosts all FINANCE type businesses.',
    icon: PiggyBank,
    tier: 2,
    recipe: [{ componentId: 'solid_state_drive_array', quantity: 1 }, { componentId: 'basic_circuit_board', quantity: 2 }],
    rawMaterialCost: 60,
    productionTimeSeconds: 100,
    requiredAssemblerMark: 2,
    effects: { businessTypeIncomeBoostPercent: { businessType: 'FINANCE', percent: 0.01 }, maxBonusPercent: 3 }
  },
  {
    id: 'media_content_adaptive_streamer',
    name: 'Adaptive Content Streamer',
    description: 'Optimizes media delivery based on bandwidth. Boosts all MEDIA type businesses.',
    icon: Radio,
    tier: 3,
    recipe: [{ componentId: 'streaming_service_codec_optimizer_chip', quantity: 1 }, { componentId: 'advanced_logic_chip', quantity: 1 }],
    rawMaterialCost: 120,
    productionTimeSeconds: 320,
    requiredAssemblerMark: 3,
    effects: { businessTypeIncomeBoostPercent: { businessType: 'MEDIA', percent: 0.015 }, maxBonusPercent: 4 }
  },
  {
    id: 'aerospace_navigation_computer_adv',
    name: 'Advanced Navigation Computer',
    description: 'High-precision computer for aerospace applications. Boosts all AEROSPACE type businesses.',
    icon: Compass,
    tier: 4,
    recipe: [{ componentId: 'null_g_support_structure', quantity: 1 }, { componentId: 'quantum_processor_unit', quantity: 1 }],
    rawMaterialCost: 200,
    productionTimeSeconds: 950,
    requiredAssemblerMark: 4,
    effects: { businessTypeIncomeBoostPercent: { businessType: 'AEROSPACE', percent: 0.02 }, maxBonusPercent: 5 }
  },

  // Global/Factory Boosts (Phase 2 Additions)
  {
    id: 'advanced_coolant_circulation_system',
    name: 'Advanced Coolant System',
    description: 'Efficiently dissipates heat from machinery. Small global business level-up cost reduction.',
    icon: Waves,
    tier: 2,
    recipe: [{ componentId: 'efficiency_coil', quantity: 2 }, { componentId: 'simple_frame', quantity: 1 }],
    rawMaterialCost: 40,
    productionTimeSeconds: 75,
    requiredAssemblerMark: 2,
    effects: { globalCostReductionPercent: 0.0025, maxBonusPercent: 0.75 }
  },
  {
    id: 'geological_survey_data_analyzer',
    name: 'Geological Data Analyzer',
    description: 'Processes survey data to find rich material deposits. Small global material collection boost.',
    icon: Pickaxe,
    tier: 2,
    recipe: [{ componentId: 'survey_drone_module', quantity: 1 }, { componentId: 'basic_circuit_board', quantity: 1 }],
    rawMaterialCost: 45,
    productionTimeSeconds: 80,
    requiredAssemblerMark: 2,
    effects: { factoryGlobalMaterialCollectionBoostPercent: 0.0075, maxBonusPercent: 2.5 }
  },
  {
    id: 'high_frequency_market_algorithm_core',
    name: 'Market Algorithm Core',
    description: 'Core for high-frequency trading algorithms. Small global dividend yield boost.',
    icon: LineChart,
    tier: 3,
    recipe: [{ componentId: 'market_analysis_chip', quantity: 1 }, { componentId: 'neural_processing_unit_adv', quantity: 1 }],
    rawMaterialCost: 140,
    productionTimeSeconds: 330,
    requiredAssemblerMark: 3,
    effects: { globalDividendYieldBoostPercent: 0.0005, maxBonusPercent: 0.15 }
  },
  {
    id: 'automated_maintenance_bot_toolkit',
    name: 'Automated Maintenance Toolkit',
    description: 'Toolkit for automated maintenance bots. Small global business upgrade cost reduction.',
    icon: Wrench,
    tier: 3,
    recipe: [{ componentId: 'robotic_arm_actuator_adv', quantity: 1 }, { componentId: 'advanced_gear', quantity: 2 }],
    rawMaterialCost: 80,
    productionTimeSeconds: 310,
    requiredAssemblerMark: 3,
    effects: { globalBusinessUpgradeCostReductionPercent: 0.005, maxBonusPercent: 1.5 }
  },
  {
    id: 'universal_resource_optimization_node',
    name: 'Universal Resource Optimizer',
    description: 'AI node for optimizing resource use across all ventures. Small global income boost.',
    icon: Database,
    tier: 4,
    recipe: [{ componentId: 'logistics_ai_processor', quantity: 1 }, { componentId: 'power_regulator_mk2', quantity: 1 }],
    rawMaterialCost: 300,
    productionTimeSeconds: 1100,
    requiredAssemblerMark: 4,
    effects: { globalIncomeBoostPerComponentPercent: 0.003, maxBonusPercent: 1 }
  },
  {
    id: 'master_craftsman_calibration_tools',
    name: 'Master Calibration Tools',
    description: 'High-precision tools for calibrating machinery. Reduces global business upgrade costs.',
    icon: HardHat,
    tier: 4,
    recipe: [{ componentId: 'nanite_assembler_core', quantity: 1 }, { componentId: 'precision_gear', quantity: 2 }],
    rawMaterialCost: 320,
    productionTimeSeconds: 1200,
    requiredAssemblerMark: 4,
    effects: { globalBusinessUpgradeCostReductionPercent: 0.0075, maxBonusPercent: 2 }
  },
  
  // --- PHASE 3 ADDITIONS START HERE ---

  // Family: Advanced Actuators
  {
    id: 'servo_motor_mini',
    name: 'Miniature Servo Motor',
    description: 'A small, precise motor for robotic articulation. Benefits Robotics Factory SynthoDynamics.',
    icon: Cog,
    tier: 1,
    recipe: [],
    rawMaterialCost: 12,
    productionTimeSeconds: 22,
    requiredAssemblerMark: 1,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'robotics_factory_synthodynamics', percent: 0.02 }, maxBonusPercent: 1.5 }
  },
  {
    id: 'linear_actuator_industrial',
    name: 'Industrial Linear Actuator',
    description: 'A robust actuator for heavy-duty linear motion. Reduces Robotics Factory upgrade costs.',
    icon: SlidersHorizontal,
    tier: 2,
    recipe: [{ componentId: 'servo_motor_mini', quantity: 4 }, { componentId: 'basic_gear', quantity: 2 }],
    rawMaterialCost: 35,
    productionTimeSeconds: 70,
    requiredAssemblerMark: 2,
    effects: { businessSpecificUpgradeCostReductionPercent: { businessId: 'robotics_factory_synthodynamics', percent: 0.03 }, maxBonusPercent: 2 }
  },
  {
    id: 'electro_hydraulic_actuator_precision',
    name: 'Precision Electro-Hydraulic Actuator',
    description: 'Combines electric precision with hydraulic power. Further boosts Robotics Factory income.',
    icon: GitMergeIcon,
    tier: 3,
    recipe: [{ componentId: 'linear_actuator_industrial', quantity: 3 }, { componentId: 'power_regulator_mk1', quantity: 1 }],
    rawMaterialCost: 90,
    productionTimeSeconds: 280,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'robotics_factory_synthodynamics', percent: 0.05 }, maxBonusPercent: 3 }
  },

  // Family: Biological Samples/Cultures
  {
    id: 'nutrient_gel_pack_basic',
    name: 'Basic Nutrient Gel Pack',
    description: 'Provides essential nutrients for biological processes. Small boost to Pharmaceutical Company income.',
    icon: Beaker,
    tier: 1,
    recipe: [],
    rawMaterialCost: 10,
    productionTimeSeconds: 20,
    requiredAssemblerMark: 1,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'pharmaceutical_company', percent: 0.025 }, maxBonusPercent: 1.8 }
  },
  {
    id: 'stabilized_cell_culture_medium',
    name: 'Stabilized Cell Culture Medium',
    description: 'Optimized medium for growing cell cultures. Boosts BioSynth Creations income.',
    icon: FlaskConical,
    tier: 2,
    recipe: [{ componentId: 'nutrient_gel_pack_basic', quantity: 5 }],
    rawMaterialCost: 28,
    productionTimeSeconds: 65,
    requiredAssemblerMark: 2,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'custom_genome_design', percent: 0.04 }, maxBonusPercent: 2.5 }
  },
  {
    id: 'cryo_preserved_tissue_sample_rare',
    name: 'Rare Cryo-Preserved Tissue Sample',
    description: 'Valuable genetic material preserved for research. Boosts EvoGenesis Labs income.',
    icon: Dna,
    tier: 3,
    recipe: [{ componentId: 'stabilized_cell_culture_medium', quantity: 3 }, { componentId: 'basic_energy_cell', quantity: 2 }],
    rawMaterialCost: 75,
    productionTimeSeconds: 240,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'genetic_engineering_firm', percent: 0.06 }, maxBonusPercent: 3.5 }
  },

  // Family: Exotic Crystals/Gems
  {
    id: 'synthetic_quartz_crystal_raw',
    name: 'Raw Synthetic Quartz',
    description: 'Lab-grown quartz, base for energy focusing. Minor global income boost.',
    icon: Gem,
    tier: 1,
    recipe: [],
    rawMaterialCost: 15,
    productionTimeSeconds: 25,
    requiredAssemblerMark: 1,
    effects: { globalIncomeBoostPerComponentPercent: 0.0008, maxBonusPercent: 1 }
  },
  {
    id: 'focused_energy_crystal_refined',
    name: 'Refined Energy Crystal',
    description: 'Cut and polished crystal for energy applications. Benefits Energy type businesses.',
    icon: Diamond,
    tier: 2,
    recipe: [{ componentId: 'synthetic_quartz_crystal_raw', quantity: 4 }, { componentId: 'crude_lens', quantity: 1 }],
    rawMaterialCost: 40,
    productionTimeSeconds: 80,
    requiredAssemblerMark: 2,
    effects: { businessTypeIncomeBoostPercent: { businessType: 'ENERGY', percent: 0.01 }, maxBonusPercent: 2 }
  },
  {
    id: 'perfect_resonance_gemstone_tuned',
    name: 'Tuned Resonance Gemstone',
    description: 'Perfectly tuned for harmonic resonance. Boosts QuantaLeap Solutions income.',
    icon: Sparkles,
    tier: 3,
    recipe: [{ componentId: 'focused_energy_crystal_refined', quantity: 3 }, { componentId: 'precision_gear', quantity: 1 }],
    rawMaterialCost: 100,
    productionTimeSeconds: 300,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'quantum_computing_labs_quantaleap', percent: 0.07 }, maxBonusPercent: 4 }
  },

  // Unique Components (Phase 3 Additions)
  {
    id: 'lemonade_stand_marketing_kit',
    name: 'Lemonade Marketing Kit',
    description: 'Professional flyers and stand decor. Boosts Lemonade Stand income.',
    icon: Megaphone,
    tier: 1,
    recipe: [],
    rawMaterialCost: 8,
    productionTimeSeconds: 18,
    requiredAssemblerMark: 1,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'lemonade_stand', percent: 0.05 }, maxBonusPercent: 2.5 }
  },
  {
    id: 'artisan_bakery_display_case_premium',
    name: 'Premium Bakery Display Case',
    description: 'Elegant, temperature-controlled display. Boosts Artisan Bakery income.',
    icon: ShoppingBag,
    tier: 2,
    recipe: [{ componentId: 'simple_frame', quantity: 2 }, { componentId: 'crude_lens', quantity: 3 }],
    rawMaterialCost: 30,
    productionTimeSeconds: 60,
    requiredAssemblerMark: 2,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'artisan_bakery', percent: 0.06 }, maxBonusPercent: 3 }
  },
  {
    id: 'tech_startup_server_rack_optimized',
    name: 'Optimized Server Rack',
    description: 'Efficient cooling and cable management for servers. Reduces Tech Startup level up costs.',
    icon: Server,
    tier: 2,
    recipe: [{ componentId: 'reinforced_chassis', quantity: 1 }, { componentId: 'efficiency_coil', quantity: 2 }],
    rawMaterialCost: 38,
    productionTimeSeconds: 70,
    requiredAssemblerMark: 2,
    effects: { businessSpecificLevelUpCostReductionPercent: { businessId: 'tech_startup', percent: 0.03 }, maxBonusPercent: 1.5 }
  },
  {
    id: 'movie_studio_sound_mixing_board_pro',
    name: 'Pro Sound Mixing Board',
    description: 'Studio-grade audio mixing console. Boosts Movie Studio income.',
    icon: Radio,
    tier: 3,
    recipe: [{ componentId: 'advanced_logic_chip', quantity: 2 }, { componentId: 'basic_circuit_board', quantity: 3 }],
    rawMaterialCost: 90,
    productionTimeSeconds: 270,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'movie_studio', percent: 0.08 }, maxBonusPercent: 4 }
  },
  {
    id: 'cybersecurity_threat_intel_feed_premium',
    name: 'Premium Threat Intel Feed',
    description: 'Subscription to exclusive cybersecurity threat data. Boosts CyberGuard Solutions income.',
    icon: ShieldAlert,
    tier: 3,
    recipe: [{ componentId: 'miniature_ai_core', quantity: 1 }, { componentId: 'solid_state_drive_array', quantity: 2 }],
    rawMaterialCost: 110,
    productionTimeSeconds: 310,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'cybersecurity_solutions', percent: 0.09 }, maxBonusPercent: 4.5 }
  },
  {
    id: 'space_exploration_navigation_module_advanced',
    name: 'Advanced Navigation Module',
    description: 'For precise interstellar navigation. Boosts Space Exploration Inc. income.',
    icon: Compass,
    tier: 4,
    recipe: [{ componentId: 'quantum_processor_unit', quantity: 1 }, { componentId: 'gravimetric_sensor_suite', quantity: 1 }],
    rawMaterialCost: 200,
    productionTimeSeconds: 950,
    requiredAssemblerMark: 4,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'space_exploration_inc', percent: 0.1 }, maxBonusPercent: 5 }
  },
  {
    id: 'ai_research_lab_algorithm_library_expanded',
    name: 'Expanded Algorithm Library',
    description: 'A vast collection of AI algorithms. Boosts AI Research Lab income.',
    icon: BookOpen,
    tier: 4,
    recipe: [{ componentId: 'cognitive_matrix_core_adv', quantity: 1 }, { componentId: 'holographic_data_crystal', quantity: 2 }],
    rawMaterialCost: 220,
    productionTimeSeconds: 1000,
    requiredAssemblerMark: 4,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'ai_research_lab', percent: 0.09 }, maxBonusPercent: 4.5 }
  },
  {
    id: 'genetic_engineering_crispr_toolkit_pro',
    name: 'Pro CRISPR Toolkit',
    description: 'Advanced gene-editing tools. Boosts EvoGenesis Labs income significantly.',
    icon: Scissors,
    tier: 4,
    recipe: [{ componentId: 'cryo_preserved_tissue_sample_rare', quantity: 2 }, { componentId: 'polished_optical_array', quantity: 2 }],
    rawMaterialCost: 180,
    productionTimeSeconds: 900,
    requiredAssemblerMark: 4,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'genetic_engineering_firm', percent: 0.12 }, maxBonusPercent: 6 }
  },
  {
    id: 'omni_media_investigative_reporter_toolkit',
    name: 'Investigative Reporter Toolkit',
    description: 'High-tech gear for investigative journalism. Boosts OmniMedia Group income.',
    icon: Mic,
    tier: 3,
    recipe: [{ componentId: 'polished_optical_array', quantity: 1 }, { componentId: 'magnetic_storage_unit', quantity: 3 }],
    rawMaterialCost: 70,
    productionTimeSeconds: 250,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'omni_media_group', percent: 0.07 }, maxBonusPercent: 3.5 }
  },
  {
    id: 'robotics_factory_adaptive_ai_controller',
    name: 'Adaptive AI Robot Controller',
    description: 'Allows robots to learn and adapt. Boosts SynthoDynamics Robotics income.',
    icon: ToyBrick,
    tier: 4,
    recipe: [{ componentId: 'miniature_ai_core', quantity: 2 }, { componentId: 'electro_hydraulic_actuator_precision', quantity: 1 }],
    rawMaterialCost: 200,
    productionTimeSeconds: 980,
    requiredAssemblerMark: 4,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'robotics_factory_synthodynamics', percent: 0.11 }, maxBonusPercent: 5.5 }
  },
  {
    id: 'quantum_computing_qubit_stabilizer_adv',
    name: 'Advanced Qubit Stabilizer',
    description: 'Maintains coherence in quantum bits. Significantly boosts QuantaLeap Solutions income.',
    icon: Sigma,
    tier: 5,
    recipe: [{ componentId: 'perfect_resonance_gemstone_tuned', quantity: 1 }, { componentId: 'power_regulator_mk3', quantity: 1 }],
    rawMaterialCost: 450,
    productionTimeSeconds: 3500,
    requiredAssemblerMark: 5,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'quantum_computing_labs_quantaleap', percent: 0.15 }, maxBonusPercent: 7.5 }
  },

  // Specific Stock Boosts (Phase 3 Additions)
  {
    id: 'biofuture_med_gene_therapy_vector',
    name: 'Gene Therapy Vector',
    description: 'Advanced viral vector for gene delivery. Boosts BioFuture Med (BFM) stock dividend.',
    icon: Biohazard,
    tier: 4,
    recipe: [{ componentId: 'cryo_preserved_tissue_sample_rare', quantity: 1 }, { componentId: 'nanite_conduit', quantity: 1 }],
    rawMaterialCost: 180,
    productionTimeSeconds: 920,
    requiredAssemblerMark: 4,
    effects: { stockSpecificDividendYieldBoostPercent: { stockId: 'biofuture_med', percent: 0.0005 }, maxBonusPercent: 0.22 }
  },
  {
    id: 'aether_logistics_drone_traffic_controller',
    name: 'Drone Traffic Control System',
    description: 'Manages large fleets of delivery drones. Boosts Aether Logistics (AETL) stock dividend.',
    icon: TowerControl,
    tier: 3,
    recipe: [{ componentId: 'advanced_logic_chip', quantity: 2 }, { componentId: 'survey_drone_module', quantity: 1 }],
    rawMaterialCost: 100,
    productionTimeSeconds: 300,
    requiredAssemblerMark: 3,
    effects: { stockSpecificDividendYieldBoostPercent: { stockId: 'aether_logistics', percent: 0.0004 }, maxBonusPercent: 0.18 }
  },
  {
    id: 'omega_corp_experimental_alloy_sample',
    name: 'Experimental Alloy Sample',
    description: 'A sample of a new, potentially revolutionary alloy. Boosts Omega Corp (OMG) stock dividend.',
    icon: TestTube,
    tier: 4,
    recipe: [{ componentId: 'alloy_gear', quantity: 1 }, { componentId: 'focused_energy_crystal_refined', quantity: 1 }],
    rawMaterialCost: 180,
    productionTimeSeconds: 950,
    requiredAssemblerMark: 4,
    effects: { stockSpecificDividendYieldBoostPercent: { stockId: 'omega_corp', percent: 0.0007 }, maxBonusPercent: 0.35 }
  },
  {
    id: 'stellar_dynamics_propulsion_fuel_cell',
    name: 'Advanced Propulsion Fuel Cell',
    description: 'Highly efficient fuel cell for spacecraft. Boosts Stellar Dynamics (STLR) stock dividend.',
    icon: Fuel,
    tier: 5,
    recipe: [{ componentId: 'dense_plasma_battery', quantity: 2 }, { componentId: 'zero_point_tap_module_component_adv', quantity: 1 }],
    rawMaterialCost: 500,
    productionTimeSeconds: 3800,
    requiredAssemblerMark: 5,
    effects: { stockSpecificDividendYieldBoostPercent: { stockId: 'stellar_dynamics', percent: 0.001 }, maxBonusPercent: 0.5 }
  },

  // Business Type Boosts (Phase 3 Additions)
  {
    id: 'financial_algo_trading_processor',
    name: 'Algo-Trading Processor',
    description: 'Specialized processor for high-frequency financial trading. Boosts all FINANCE type businesses.',
    icon: LineChart,
    tier: 4,
    recipe: [{ componentId: 'quantum_processor_unit', quantity: 1 }, { componentId: 'market_analysis_chip', quantity: 1 }],
    rawMaterialCost: 250,
    productionTimeSeconds: 1100,
    requiredAssemblerMark: 4,
    effects: { businessTypeIncomeBoostPercent: { businessType: 'FINANCE', percent: 0.025 }, maxBonusPercent: 6 }
  },
  {
    id: 'manufacturing_quality_control_sensor',
    name: 'Precision QC Sensor',
    description: 'Advanced sensor for quality control in manufacturing. Boosts all MANUFACTURING type businesses.',
    icon: Scan,
    tier: 3,
    recipe: [{ componentId: 'polished_optical_array', quantity: 1 }, { componentId: 'advanced_logic_chip', quantity: 1 }],
    rawMaterialCost: 80,
    productionTimeSeconds: 260,
    requiredAssemblerMark: 3,
    effects: { businessTypeIncomeBoostPercent: { businessType: 'MANUFACTURING', percent: 0.018 }, maxBonusPercent: 4.5 }
  },
  {
    id: 'media_viral_content_algorithm',
    name: 'Viral Content Algorithm',
    description: 'AI algorithm to predict and create viral media content. Boosts all MEDIA type businesses.',
    icon: TrendingUpLucideIcon,
    tier: 4,
    recipe: [{ componentId: 'cognitive_matrix_core_adv', quantity: 1 }, { componentId: 'holographic_data_crystal', quantity: 1 }],
    rawMaterialCost: 210,
    productionTimeSeconds: 1000,
    requiredAssemblerMark: 4,
    effects: { businessTypeIncomeBoostPercent: { businessType: 'MEDIA', percent: 0.022 }, maxBonusPercent: 5.5 }
  },

  // Global/Factory Boosts (Phase 3 Additions)
  {
    id: 'universal_efficiency_modulator',
    name: 'Universal Efficiency Modulator',
    description: 'A device that globally improves operational efficiency. Reduces global business level-up costs.',
    icon: SlidersHorizontal,
    tier: 4,
    recipe: [{ componentId: 'power_regulator_mk2', quantity: 1 }, { componentId: 'nanite_conduit', quantity: 1 }],
    rawMaterialCost: 190,
    productionTimeSeconds: 900,
    requiredAssemblerMark: 4,
    effects: { globalCostReductionPercent: 0.008, maxBonusPercent: 2 }
  },
  {
    id: 'factory_energy_capacitor_large',
    name: 'Large Factory Energy Capacitor',
    description: 'Stores large amounts of energy for factory use. Boosts factory global power output.',
    icon: BatteryCharging,
    tier: 3,
    recipe: [{ componentId: 'efficient_power_core', quantity: 3 }, { componentId: 'superconductive_wire_bundle', quantity: 2 }],
    rawMaterialCost: 110,
    productionTimeSeconds: 320,
    requiredAssemblerMark: 3,
    effects: { factoryGlobalPowerOutputBoostPercent: 0.04, maxBonusPercent: 8 }
  },
  {
    id: 'resource_extraction_optimizer_ai',
    name: 'Resource Extraction AI Optimizer',
    description: 'AI to maximize yield from material collectors. Boosts factory global material collection.',
    icon: Brain,
    tier: 4,
    recipe: [{ componentId: 'miniature_ai_core', quantity: 2 }, { componentId: 'survey_drone_module', quantity: 2 }],
    rawMaterialCost: 160,
    productionTimeSeconds: 850,
    requiredAssemblerMark: 4,
    effects: { factoryGlobalMaterialCollectionBoostPercent: 0.025, maxBonusPercent: 6 }
  },
  {
    id: 'advanced_research_data_processor',
    name: 'Advanced Research Data Processor',
    description: 'Speeds up processing of research data. Increases manual RP generation slightly.',
    icon: Database,
    tier: 3,
    recipe: [{ componentId: 'quantum_processor_unit', quantity: 1 }, { componentId: 'solid_state_drive_array', quantity: 1 }],
    rawMaterialCost: 130,
    productionTimeSeconds: 350,
    requiredAssemblerMark: 3,
    effects: { factoryManualRPGenerationBoost: 0.002, maxBonusPercent: 0.5 }
  },
  {
    id: 'global_marketing_synergy_module',
    name: 'Global Marketing Synergy Module',
    description: 'Coordinates global marketing efforts. Provides a global income boost.',
    icon: Globe,
    tier: 5,
    recipe: [{ componentId: 'cognitive_matrix_core_adv', quantity: 1 }, { componentId: 'ad_agency_neural_targeting_module_adv', quantity: 1 }],
    rawMaterialCost: 400,
    productionTimeSeconds: 3600,
    requiredAssemblerMark: 5,
    effects: { globalIncomeBoostPerComponentPercent: 0.018, maxBonusPercent: 8 }
  },
  {
    id: 'worker_morale_enhancer_automated',
    name: 'Automated Morale Enhancer',
    description: 'Dispenses coffee and motivational posters. Slightly reduces worker energy drain.',
    icon: Smile,
    tier: 2,
    recipe: [{ componentId: 'basic_circuit_board', quantity: 1 }, { componentId: 'servo_motor_mini', quantity: 1 }],
    rawMaterialCost: 25,
    productionTimeSeconds: 50,
    requiredAssemblerMark: 2,
    effects: { factoryWorkerEnergyDrainModifier: 0.98, maxBonusPercent: 10 }
  },
  {
    id: 'automated_stock_portfolio_manager_basic',
    name: 'Basic Stock Portfolio AI',
    description: 'A simple AI to manage stock investments. Small global dividend yield boost.',
    icon: DollarSign,
    tier: 3,
    recipe: [{ componentId: 'market_analysis_chip', quantity: 1 }, { componentId: 'neural_processing_unit_adv', quantity: 1 }],
    rawMaterialCost: 140,
    productionTimeSeconds: 380,
    requiredAssemblerMark: 3,
    effects: { globalDividendYieldBoostPercent: 0.0008, maxBonusPercent: 0.2 }
  },
  // --- PHASE 4 ADDITIONS START HERE ---

  // Family: Advanced Sensors
  {
    id: 'basic_environmental_sensor',
    name: 'Basic Environmental Sensor',
    description: 'Monitors basic environmental conditions. Slightly reduces EcoPower Corp level up costs.',
    icon: Airplay,
    tier: 1,
    recipe: [],
    rawMaterialCost: 9,
    productionTimeSeconds: 19,
    requiredAssemblerMark: 1,
    effects: { businessSpecificLevelUpCostReductionPercent: { businessId: 'renewable_energy_corp', percent: 0.02 }, maxBonusPercent: 1 }
  },
  {
    id: 'multi_spectral_imaging_array',
    name: 'Multi-Spectral Imaging Array',
    description: 'Advanced imaging for detailed analysis. Boosts Planetary Terraforming Corp income.',
    icon: Palette,
    tier: 2,
    recipe: [{ componentId: 'basic_environmental_sensor', quantity: 3 }, { componentId: 'polished_optical_array', quantity: 1 }],
    rawMaterialCost: 32,
    productionTimeSeconds: 68,
    requiredAssemblerMark: 2,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'planetary_terraforming_corp', percent: 0.05 }, maxBonusPercent: 2.5 }
  },
  {
    id: 'deep_space_observatory_lens_pro',
    name: 'Deep Space Observatory Lens',
    description: 'Extremely sensitive lens for cosmic observation. Boosts Galactic Archaeology Guild income.',
    icon: TelescopeIconLucide,
    tier: 3,
    recipe: [{ componentId: 'multi_spectral_imaging_array', quantity: 2 }, { componentId: 'null_g_support_structure', quantity: 1 }],
    rawMaterialCost: 85,
    productionTimeSeconds: 270,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'galactic_archaeology_guild', percent: 0.07 }, maxBonusPercent: 3.5 }
  },

  // Family: Communication Systems
  {
    id: 'simple_transceiver_unit',
    name: 'Simple Transceiver Unit',
    description: 'Basic two-way communication device. Minor boost to AeroSwift Delivery income.',
    icon: Antenna,
    tier: 1,
    recipe: [],
    rawMaterialCost: 11,
    productionTimeSeconds: 21,
    requiredAssemblerMark: 1,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'drone_delivery_service', percent: 0.025 }, maxBonusPercent: 1.2 }
  },
  {
    id: 'encrypted_comms_chip_mil',
    name: 'Military-Grade Comms Chip',
    description: 'Secure communication chip. Boosts CyberGuard Solutions upgrade costs.',
    icon: ShieldAlert,
    tier: 2,
    recipe: [{ componentId: 'simple_transceiver_unit', quantity: 3 }, { componentId: 'basic_circuit_board', quantity: 1 }],
    rawMaterialCost: 30,
    productionTimeSeconds: 66,
    requiredAssemblerMark: 2,
    effects: { businessSpecificUpgradeCostReductionPercent: { businessId: 'cybersecurity_solutions', percent: 0.04 }, maxBonusPercent: 2 }
  },
  {
    id: 'quantum_entanglement_communicator_prototype',
    name: 'Quantum Entanglement Communicator',
    description: 'Instantaneous, untappable communication. Boosts Global Satellite Network income.',
    icon: Radio,
    tier: 3,
    recipe: [{ componentId: 'encrypted_comms_chip_mil', quantity: 2 }, { componentId: 'quantum_processor_unit', quantity: 1 }],
    rawMaterialCost: 130,
    productionTimeSeconds: 330,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'global_satellite_network', percent: 0.09 }, maxBonusPercent: 4.5 }
  },

  // Family: Robotics AI Cores
  {
    id: 'basic_robot_logic_core',
    name: 'Basic Robot Logic Core',
    description: 'Simple AI core for basic robotic tasks. Slightly reduces Automated Maintenance Toolkit cost (component).',
    icon: BotIcon,
    tier: 1,
    recipe: [],
    rawMaterialCost: 14,
    productionTimeSeconds: 24,
    requiredAssemblerMark: 1,
    effects: { } 
  },
  {
    id: 'swarm_robotics_coordination_module',
    name: 'Swarm Robotics Module',
    description: 'Coordinates multiple robots for complex tasks. Boosts Universal Constructors income.',
    icon: Users,
    tier: 2,
    recipe: [{ componentId: 'basic_robot_logic_core', quantity: 3 }, { componentId: 'neural_processing_unit_adv', quantity: 1 }],
    rawMaterialCost: 40,
    productionTimeSeconds: 78,
    requiredAssemblerMark: 2,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'universal_constructors_von_neumann', percent: 0.04 }, maxBonusPercent: 2.2 }
  },
  {
    id: 'sentient_robot_posibrain_core_adv',
    name: 'Positronic Robot Brain Core',
    description: 'A highly advanced AI core approaching sentience. Boosts Hegemon AI income.',
    icon: Brain,
    tier: 3,
    recipe: [{ componentId: 'swarm_robotics_coordination_module', quantity: 2 }, { componentId: 'cognitive_matrix_core_adv', quantity: 1 }],
    rawMaterialCost: 100,
    productionTimeSeconds: 310,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'galactic_governance_ai', percent: 0.06 }, maxBonusPercent: 3 }
  },

  // Unique Components (Phase 4 Additions)
  {
    id: 'luxury_space_tourism_vr_headset_component',
    name: 'Luxury VR Headset',
    description: 'High-end VR headset for pre-flight simulations. Boosts Celestial Voyages income.',
    icon: Headset,
    tier: 2,
    recipe: [{ componentId: 'polished_optical_array', quantity: 1 }, { componentId: 'shielded_enclosure', quantity: 1 }],
    rawMaterialCost: 42,
    productionTimeSeconds: 77,
    requiredAssemblerMark: 2,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'luxury_space_tourism', percent: 0.05 }, maxBonusPercent: 2.8 }
  },
  {
    id: 'ai_driven_healthcare_diagnostic_scanner_component',
    name: 'AI Diagnostic Scanner',
    description: 'Advanced medical scanner using AI. Boosts MediMind AI Clinics income.',
    icon: Scan,
    tier: 3,
    recipe: [{ componentId: 'multi_spectral_imaging_array', quantity: 1 }, { componentId: 'miniature_ai_core', quantity: 1 }],
    rawMaterialCost: 95,
    productionTimeSeconds: 290,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'ai_driven_healthcare', percent: 0.08 }, maxBonusPercent: 4.2 }
  },
  {
    id: 'advanced_materials_lab_furnace_component',
    name: 'High-Temperature Lab Furnace',
    description: 'Furnace for creating exotic materials. Boosts NovaForge Materials income.',
    icon: TestTube,
    tier: 2,
    recipe: [{ componentId: 'power_regulator_mk1', quantity: 1 }, { componentId: 'reinforced_chassis', quantity: 1 }],
    rawMaterialCost: 50,
    productionTimeSeconds: 88,
    requiredAssemblerMark: 2,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'advanced_materials_rd', percent: 0.06 }, maxBonusPercent: 3.3 }
  },
  {
    id: 'fusion_power_plasma_injector_component',
    name: 'Plasma Injector Array',
    description: 'Precision injectors for fusion reactors. Boosts Helios Fusion Energy income.',
    icon: AtomIcon,
    tier: 4,
    recipe: [{ componentId: 'plasma_conduit_segment_component_adv', quantity: 1 }, { componentId: 'precision_gear', quantity: 2 }],
    rawMaterialCost: 180,
    productionTimeSeconds: 920,
    requiredAssemblerMark: 4,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'fusion_power_plant', percent: 0.1 }, maxBonusPercent: 5.5 }
  },
  {
    id: 'interstellar_trade_negotiation_matrix_component',
    name: 'Trade Negotiation AI Matrix',
    description: 'AI to optimize trade deals. Boosts Cosmic Cartel Traders income.',
    icon: Handshake,
    tier: 3,
    recipe: [{ componentId: 'cognitive_matrix_core_adv', quantity: 1 }, { componentId: 'encrypted_comms_chip_mil', quantity: 1 }],
    rawMaterialCost: 110,
    productionTimeSeconds: 315,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'interstellar_trading_guild', percent: 0.07 }, maxBonusPercent: 3.8 }
  },
  {
    id: 'neural_interface_biofeedback_sensor_component',
    name: 'Biofeedback Sensor Suite',
    description: 'Monitors user biometrics for neural interfaces. Boosts Synapse Dynamics income.',
    icon: Brain,
    tier: 2,
    recipe: [{ componentId: 'basic_environmental_sensor', quantity: 2 }, { componentId: 'basic_circuit_board', quantity: 1 }],
    rawMaterialCost: 28,
    productionTimeSeconds: 62,
    requiredAssemblerMark: 2,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'neural_interface_tech', percent: 0.06 }, maxBonusPercent: 3.1 }
  },
  {
    id: 'autonomous_factory_self_repair_module_component',
    name: 'Self-Repair Module',
    description: 'Enables factory machinery to repair itself. Boosts AutoCorp Industries income.',
    icon: Wrench,
    tier: 4,
    recipe: [{ componentId: 'nanite_assembler_core', quantity: 1 }, { componentId: 'basic_robot_logic_core', quantity: 2 }],
    rawMaterialCost: 230,
    productionTimeSeconds: 1050,
    requiredAssemblerMark: 4,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'autonomous_megafactories', percent: 0.09 }, maxBonusPercent: 4.8 }
  },
  {
    id: 'oceanic_colony_pressure_equalizer_component',
    name: 'Pressure Equalization System',
    description: 'Maintains stable pressure in underwater habitats. Boosts AquaDom Settlements income.',
    icon: Anchor,
    tier: 3,
    recipe: [{ componentId: 'reinforced_chassis', quantity: 2 }, { componentId: 'linear_actuator_industrial', quantity: 1 }],
    rawMaterialCost: 80,
    productionTimeSeconds: 275,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'oceanic_colonization_project', percent: 0.08 }, maxBonusPercent: 4.0 }
  },
  {
    id: 'dyson_sphere_energy_collector_panel_component',
    name: 'Stellar Energy Collector Panel',
    description: 'Advanced panel for Dyson sphere energy collection. Boosts SolaraConstruct Dyson income.',
    icon: SunIcon,
    tier: 5,
    recipe: [{ componentId: 'zero_point_tap_module_component_adv', quantity: 1 }, { componentId: 'focused_energy_crystal_refined', quantity: 2 }],
    rawMaterialCost: 550,
    productionTimeSeconds: 3900,
    requiredAssemblerMark: 5,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'dyson_sphere_engineering', percent: 0.12 }, maxBonusPercent: 6.0 }
  },
  {
    id: 'galactic_exchange_latency_reducer_component',
    name: 'Quantum Latency Reducer',
    description: 'Reduces signal latency for financial data. Boosts Galactic Exchange Authority income.',
    icon: LineChart,
    tier: 4,
    recipe: [{ componentId: 'quantum_entanglement_communicator_prototype', quantity: 1 }, { componentId: 'market_analysis_chip', quantity: 1 }],
    rawMaterialCost: 210,
    productionTimeSeconds: 980,
    requiredAssemblerMark: 4,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'galactic_stock_exchange', percent: 0.1 }, maxBonusPercent: 5.2 }
  },
  {
    id: 'universal_translator_cultural_database_component',
    name: 'Xeno-Cultural Database',
    description: 'Vast database of alien cultures for translation accuracy. Boosts Babel Link Universal income.',
    icon: Languages,
    tier: 3,
    recipe: [{ componentId: 'holographic_data_crystal', quantity: 1 }, { componentId: 'cognitive_matrix_core_adv', quantity: 1 }],
    rawMaterialCost: 150,
    productionTimeSeconds: 340,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'universal_translation_services', percent: 0.09 }, maxBonusPercent: 4.7 }
  },
  {
    id: 'exotic_matter_stabilization_field_component',
    name: 'Exotic Matter Stabilizer Field',
    description: 'Creates fields to stabilize volatile exotic matter. Boosts DimensionX Labs income.',
    icon: Layers,
    tier: 5,
    recipe: [{ componentId: 'power_regulator_mk3', quantity: 1 }, { componentId: 'quantum_gear', quantity: 1 }],
    rawMaterialCost: 580,
    productionTimeSeconds: 4100,
    requiredAssemblerMark: 5,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'exotic_matter_research', percent: 0.11 }, maxBonusPercent: 5.8 }
  },
  {
    id: 'hyperspace_navigation_beacon_component',
    name: 'Hyperspace Beacon Array',
    description: 'Network of beacons for safe hyperspace travel. Boosts JumpPoint Navigators income.',
    icon: Milestone,
    tier: 4,
    recipe: [{ componentId: 'quantum_entanglement_communicator_prototype', quantity: 1 }, { componentId: 'null_g_support_structure', quantity: 1 }],
    rawMaterialCost: 230,
    productionTimeSeconds: 1020,
    requiredAssemblerMark: 4,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'hyperspace_travel_agency', percent: 0.1 }, maxBonusPercent: 5.3 }
  },
  {
    id: 'genome_sequencing_supercomputer_component',
    name: 'Genome SuperSequencer',
    description: 'Ultra-fast genome sequencing for custom designs. Boosts BioSynth Creations income.',
    icon: Dna,
    tier: 5,
    recipe: [{ componentId: 'singularity_engine_fragment_component_adv', quantity: 1 }, { componentId: 'genetic_sequencer_chip_adv', quantity: 2 }],
    rawMaterialCost: 620,
    productionTimeSeconds: 4300,
    requiredAssemblerMark: 5,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'custom_genome_design', percent: 0.13 }, maxBonusPercent: 6.5 }
  },
  {
    id: 'archaeological_artifact_scanner_component',
    name: 'Artifact Resonance Scanner',
    description: 'Detects subtle energy signatures of ancient artifacts. Boosts XenoChronos Archives income.',
    icon: Scroll,
    tier: 4,
    recipe: [{ componentId: 'deep_space_observatory_lens_pro', quantity: 1 }, { componentId: 'gravimetric_sensor_suite', quantity: 1 }],
    rawMaterialCost: 200,
    productionTimeSeconds: 960,
    requiredAssemblerMark: 4,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'galactic_archaeology_guild', percent: 0.1 }, maxBonusPercent: 5.1 }
  },
  {
    id: 'zero_point_energy_regulator_valve_component',
    name: 'ZPE Regulator Valve',
    description: 'Controls the flow of zero-point energy. Boosts Aetheria Energy Dynamics income.',
    icon: Power,
    tier: 5,
    recipe: [{ componentId: 'zero_point_tap_module_component_adv', quantity: 1 }, { componentId: 'power_regulator_mk3', quantity: 1 }],
    rawMaterialCost: 590,
    productionTimeSeconds: 4150,
    requiredAssemblerMark: 5,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'zero_point_energy_solutions', percent: 0.12 }, maxBonusPercent: 6.2 }
  },
  {
    id: 'consciousness_network_synaptic_enhancer_component',
    name: 'Synaptic Network Enhancer',
    description: 'Boosts signal strength in the Noosphere. Boosts The Noosphere Collective income.',
    icon: Share2,
    tier: 5,
    recipe: [{ componentId: 'cognitive_matrix_core_adv', quantity: 2 }, { componentId: 'quantum_entanglement_communicator_prototype', quantity: 1 }],
    rawMaterialCost: 570,
    productionTimeSeconds: 4050,
    requiredAssemblerMark: 5,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'universal_consciousness_network', percent: 0.11 }, maxBonusPercent: 5.9 }
  },
  {
    id: 'ascension_tech_dimensional_anchor_component',
    name: 'Dimensional Anchor Device',
    description: 'Stabilizes reality during transcendence. Boosts Apex Transcendence Corp. income.',
    icon: Aperture,
    tier: 5,
    recipe: [{ componentId: 'reality_distortion_lens_component', quantity: 1 }, { componentId: 'exotic_matter_containment_cell_component', quantity: 1 }],
    rawMaterialCost: 700,
    productionTimeSeconds: 4800,
    requiredAssemblerMark: 5,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'ascension_technologies', percent: 0.1 }, maxBonusPercent: 5.0 }
  },

  // Generic Boosts (Phase 4 Additions)
  {
    id: 'universal_construction_toolkit_component',
    name: 'Universal Construction Toolkit',
    description: 'Advanced tools for all construction types. Reduces upgrade costs for all Manufacturing businesses.',
    icon: Hammer,
    tier: 3,
    recipe: [{ componentId: 'robotic_arm_actuator_adv', quantity: 1 }, { componentId: 'linear_actuator_industrial', quantity: 1 }],
    rawMaterialCost: 100,
    productionTimeSeconds: 300,
    requiredAssemblerMark: 3,
    effects: { businessTypeUpgradeCostReductionPercent: { businessType: 'MANUFACTURING', percent: 0.02 }, maxBonusPercent: 5 }
  },
  {
    id: 'bio_tech_research_accelerant_component',
    name: 'BioTech Research Accelerant',
    description: 'Catalyst for biological research. Boosts income for all BioTech businesses.',
    icon: TestTube,
    tier: 4,
    recipe: [{ componentId: 'bio_reactor_catalyst', quantity: 2 }, { componentId: 'cryo_preserved_tissue_sample_rare', quantity: 1 }],
    rawMaterialCost: 180,
    productionTimeSeconds: 930,
    requiredAssemblerMark: 4,
    effects: { businessTypeIncomeBoostPercent: { businessType: 'BIO_TECH', percent: 0.03 }, maxBonusPercent: 7 }
  },
  {
    id: 'advanced_factory_workflow_optimizer',
    name: 'Factory Workflow AI',
    description: 'AI that optimizes internal factory logistics and worker tasking, slightly reducing worker energy drain.',
    icon: Workflow,
    tier: 3,
    recipe: [{ componentId: 'miniature_ai_core', quantity: 1 }, { componentId: 'basic_robot_logic_core', quantity: 2 }],
    rawMaterialCost: 80,
    productionTimeSeconds: 280,
    requiredAssemblerMark: 3,
    effects: { factoryWorkerEnergyDrainModifier: 0.97, maxBonusPercent: 6 } // 3% reduction max
  },
  {
    id: 'precision_calibration_weights_set',
    name: 'Precision Calibration Weights',
    description: 'Ultra-precise weights for calibrating sensitive factory equipment. Reduces global business level-up costs slightly.',
    icon: Scale,
    tier: 2,
    recipe: [{ componentId: 'alloy_gear', quantity: 1 } ], 
    rawMaterialCost: 30, 
    productionTimeSeconds: 60,
    requiredAssemblerMark: 2, 
    effects: { globalCostReductionPercent: 0.003, maxBonusPercent: 0.8 }
  },
  {
    id: 'acoustic_dampening_panel_factory',
    name: 'Acoustic Dampening Panel',
    description: 'Reduces factory noise, improving worker focus and slightly reducing energy drain.',
    icon: Speaker,
    tier: 1,
    recipe: [],
    rawMaterialCost: 15,
    productionTimeSeconds: 23,
    requiredAssemblerMark: 1,
    effects: { factoryWorkerEnergyDrainModifier: 0.99, maxBonusPercent: 2 }
  },
  {
    id: 'network_bandwidth_router_high_speed',
    name: 'High-Speed Network Router',
    description: 'Improves data transfer speed for all tech-based businesses. Boosts all Tech business type income.',
    icon: Router,
    tier: 3,
    recipe: [{ componentId: 'advanced_logic_chip', quantity: 2 }, { componentId: 'superconductive_wire_bundle', quantity: 1 }],
    rawMaterialCost: 90,
    productionTimeSeconds: 290,
    requiredAssemblerMark: 3,
    effects: { businessTypeIncomeBoostPercent: { businessType: 'TECH', percent: 0.015 }, maxBonusPercent: 4 }
  },
  {
    id: 'ergonomic_tool_set_factory',
    name: 'Ergonomic Tool Set',
    description: 'Tools designed for worker comfort and efficiency. Slightly reduces worker energy drain.',
    icon: DraftingCompass,
    tier: 2,
    recipe: [{ componentId: 'simple_frame', quantity: 2 }, { componentId: 'basic_gear', quantity: 1 }],
    rawMaterialCost: 20,
    productionTimeSeconds: 40,
    requiredAssemblerMark: 1,
    effects: { factoryWorkerEnergyDrainModifier: 0.985, maxBonusPercent: 3 }
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
    description: 'An advanced assembler for Tier 3 component production, with improved speed and efficiency.',
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

