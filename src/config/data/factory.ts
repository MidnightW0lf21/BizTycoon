
import type { FactoryPowerBuildingConfig, FactoryMachineConfig, FactoryComponent, FactoryMaterialCollectorConfig, FactoryMachineUpgradeConfig } from '@/types';
import { Sun, Waves, Zap, Settings, Cog, Wrench, PackageSearch, Drill, HardHat, Factory as FactoryIcon, PackageCheck, PackagePlus, Pickaxe, Mountain, Satellite, CloudCog, CloudDrizzle, TrendingUp, AtomIcon, InfinityIcon, Lightbulb, BrainCircuit, BarChart, Citrus, CircuitBoard, Frame, Camera, BatteryCharging, Users, Coffee, Combine, Landmark, Briefcase, ShieldCheck, FlaskConical, Rocket, Ship, Dna, Radio, Sigma, Anchor, Headset, Construction, LineChart, Languages, SproutIcon, UserCheck, Beaker, PenTool, Scroll, Milestone, BotIcon, Replace, Building2, Handshake, Database, HelpCircle, Gavel, University, Power, Aperture, Orbit, Layers, Truck, Archive, Building, Film, Wind, Tv, Navigation, Map, Megaphone, Utensils, Code2, GitMerge as GitMergeIcon, PiggyBank, ShieldEllipsis, Server, Scissors, Mic, ToyBrick, Fuel, Scan, Smile, DollarSign, SlidersHorizontal, Diamond, Sparkles, Gem, BookOpen, ShieldAlert, TowerControl, TestTube, TrendingUp as TrendingUpLucideIcon, Brain, Globe, Biohazard, Airplay, Antenna, Workflow, Scale, Speaker, Router, Palette, DraftingCompass, Thermometer, Snowflake, ZapOff, Shield, Route, UserPlus, Trees, Plane, HandCoins, Users2, Recycle, ShoppingBag, Compass, TelescopeIcon as TelescopeIconLucide, Share2, RouteIcon, Syringe, Dices, BoxIcon, Binary, AlertTriangle, Magnet, Hand, ScanSearch, SearchCode, MapPinned, Stamp, BookLock, Library, MemoryStick, Gauge, UserCog, ShipWheel, PlugZap, Lock, PersonStanding, Network, Puzzle, Eye, KeyRound, Hammer, Hourglass } from 'lucide-react';

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
      maxBonusPercent: 6,
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
      globalIncomeBoostPerComponentPercent: 0.001,
      maxBonusPercent: 9,
    }
  },
  {
    id: 'precision_gear',
    name: 'Precision Gear',
    description: 'An intricately designed gear for high-performance applications. Enhances global income.',
    icon: Drill,
    tier: 3,
    recipe: [{ componentId: 'advanced_gear', quantity: 10 }],
    rawMaterialCost: 50,
    productionTimeSeconds: 180,
    requiredAssemblerMark: 3,
    effects: {
      globalIncomeBoostPerComponentPercent: 0.001,
      maxBonusPercent: 12,
    }
  },
  {
    id: 'alloy_gear',
    name: 'Alloy Gear',
    description: 'A gear made from advanced alloys for extreme durability and efficiency. Significantly boosts global income.',
    icon: HardHat,
    tier: 4,
    recipe: [{ componentId: 'precision_gear', quantity: 15 }],
    rawMaterialCost: 120,
    productionTimeSeconds: 900,
    requiredAssemblerMark: 4,
    effects: {
      globalIncomeBoostPerComponentPercent: 0.001,
      maxBonusPercent: 15,
    }
  },
  {
    id: 'quantum_gear',
    name: 'Quantum Gear',
    description: 'A gear operating on quantum principles, for cutting-edge technology. Provides a substantial global income boost.',
    icon: AtomIcon,
    tier: 5,
    recipe: [{ componentId: 'alloy_gear', quantity: 20 }],
    rawMaterialCost: 300,
    productionTimeSeconds: 3600,
    requiredAssemblerMark: 5,
    effects: {
      globalIncomeBoostPerComponentPercent: 0.001,
      maxBonusPercent: 18,
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
      businessSpecificIncomeBoostPercent: { businessId: 'lemonade_stand', percent: 0.001 },
      maxBonusPercent: 30,
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
      factoryGlobalPowerOutputBoostPercent: 0.001,
      maxBonusPercent: 12,
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
      factoryGlobalMaterialCollectionBoostPercent: 0.001,
      maxBonusPercent: 12,
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
      businessSpecificIncomeBoostPercent: { businessId: 'tech_startup', percent: 0.001 },
      maxBonusPercent: 36,
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
      stockSpecificDividendYieldBoostPercent: { stockId: 'global_corp', percent: 0.001 },
      maxBonusPercent: 0.3
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
    effects: { 
      businessSpecificLevelUpCostReductionPercent: { businessId: 'tech_startup', percent: 0.001 }, 
      maxBonusPercent: 2.4
    }
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'software_agency', percent: 0.001 }, maxBonusPercent: 12 }
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'ai_research_lab', percent: 0.001 }, maxBonusPercent: 18 }
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
    effects: { businessSpecificLevelUpCostReductionPercent: { businessId: 'fast_food_franchise', percent: 0.001 }, maxBonusPercent: 1.8 }
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
    effects: { businessSpecificUpgradeCostReductionPercent: { businessId: 'manufacturing_plant', percent: 0.001 }, maxBonusPercent: 10 }
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'space_exploration_inc', percent: 0.001 }, maxBonusPercent: 14 }
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'movie_studio', percent: 0.001 }, maxBonusPercent: 2.2 }
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'cybersecurity_solutions', percent: 0.001 }, maxBonusPercent: 11 }
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
    effects: { businessSpecificUpgradeCostReductionPercent: { businessId: 'space_exploration_inc', percent: 0.001 }, maxBonusPercent: 8.5 }
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
    effects: { factoryGlobalPowerOutputBoostPercent: 0.001, maxBonusPercent: 1.2 }
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'renewable_energy_corp', percent: 0.001 }, maxBonusPercent: 10 }
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'fusion_power_plant', percent: 0.001 }, maxBonusPercent: 22 }
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'omni_media_group', percent: 0.001 }, maxBonusPercent: 1.8 }
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'universal_translation_services', percent: 0.001 }, maxBonusPercent: 8.5 }
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'omniversal_data_archive', percent: 0.001 }, maxBonusPercent: 20 }
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'coffee_shop', percent: 0.001 }, maxBonusPercent: 24 }
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
    effects: { factoryGlobalPowerOutputBoostPercent: 0.001, maxBonusPercent: 6 }
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
    effects: { businessSpecificLevelUpCostReductionPercent: { businessId: 'manufacturing_plant', percent: 0.001 }, maxBonusPercent: 12 }
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'global_logistics_inc', percent: 0.001 }, maxBonusPercent: 18 }
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
    effects: { factoryGlobalMaterialCollectionBoostPercent: 0.001, maxBonusPercent: 5 }
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
    effects: { factoryGlobalPowerOutputBoostPercent: 0.001, maxBonusPercent: 3.6 }
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
    effects: { factoryGlobalPowerOutputBoostPercent: 0.001, maxBonusPercent: 8.4 }
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
    effects: { factoryGlobalPowerOutputBoostPercent: 0.001, maxBonusPercent: 14.4 }
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
    effects: { businessSpecificLevelUpCostReductionPercent: { businessId: 'manufacturing_plant', percent: 0.001 }, maxBonusPercent: 5 }
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
    effects: { businessSpecificLevelUpCostReductionPercent: { businessId: 'manufacturing_plant', percent: 0.001 }, maxBonusPercent: 10 }
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
    effects: { businessSpecificLevelUpCostReductionPercent: { businessId: 'manufacturing_plant', percent: 0.001 }, globalIncomeBoostPerComponentPercent: 0.001, maxBonusPercent: 18 }
  },

  // Specific Business Boosts (Phase 1 additions for variety)
  {
    id: 'artisanal_sourdough_culture',
    name: 'Artisanal Sourdough Culture',
    description: 'A unique yeast culture for superior bread. Boosts Artisan Bakery income.',
    icon: Landmark, // Placeholder, could be Cookie or similar
    tier: 2,
    recipe: [{ componentId: 'basic_gear', quantity: 2 }], // Placeholder recipe
    rawMaterialCost: 22,
    productionTimeSeconds: 55,
    requiredAssemblerMark: 1,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'artisan_bakery', percent: 0.001 }, maxBonusPercent: 18 }
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'cybersecurity_solutions', percent: 0.001 }, maxBonusPercent: 24 }
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'pharmaceutical_company', percent: 0.001 }, maxBonusPercent: 22 }
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'space_exploration_inc', percent: 0.001 }, maxBonusPercent: 26 }
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'global_shipping_network', percent: 0.001 }, maxBonusPercent: 19 }
  },
  {
    id: 'advanced_neural_net_processor_adv_component',
    name: 'Advanced Neural Net Processor',
    description: 'High-performance AI chip. Boosts AI Research Lab income.',
    icon: BrainCircuit,
    tier: 4,
    recipe: [{ componentId: 'quantum_processor_unit', quantity: 2 }, { componentId: 'holographic_data_crystal', quantity: 1 }],
    rawMaterialCost: 280,
    productionTimeSeconds: 1300,
    requiredAssemblerMark: 4,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'ai_research_lab', percent: 0.001 }, maxBonusPercent: 24 }
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'genetic_engineering_firm', percent: 0.001 }, maxBonusPercent: 23 }
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'virtual_reality_worlds', percent: 0.001 }, maxBonusPercent: 20 }
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'planetary_terraforming_corp', percent: 0.001 }, maxBonusPercent: 25 }
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
    effects: { stockSpecificDividendYieldBoostPercent: { stockId: 'green_energy_co', percent: 0.001 }, maxBonusPercent: 0.18 }
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
    effects: { stockSpecificDividendYieldBoostPercent: { stockId: 'summit_real_estate', percent: 0.001 }, maxBonusPercent: 0.24 }
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
    effects: { stockSpecificDividendYieldBoostPercent: { stockId: 'momentum_motors', percent: 0.001 }, maxBonusPercent: 0.12 }
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
    effects: { businessTypeIncomeBoostPercent: { businessType: 'ENERGY', percent: 0.001 }, maxBonusPercent: 6 }
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
    effects: { businessTypeIncomeBoostPercent: { businessType: 'LOGISTICS', percent: 0.001 }, maxBonusPercent: 6 }
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
    effects: { factoryGlobalPowerOutputBoostPercent: 0.001, maxBonusPercent: 3 }
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
    effects: { factoryGlobalMaterialCollectionBoostPercent: 0.001, maxBonusPercent: 3.6 }
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
    effects: { globalIncomeBoostPerComponentPercent: 0.001, maxBonusPercent: 2.4 }
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
    effects: { globalIncomeBoostPerComponentPercent: 0.001, maxBonusPercent: 3.6 }
  },
  {
    id: 'advanced_cooling_system_component',
    name: 'Advanced Cooling System',
    description: 'High-efficiency cooling for factory systems. Further boost to factory power output.',
    icon: Snowflake,
    tier: 3,
    recipe: [{ componentId: 'efficiency_coil', quantity: 3 }, { componentId: 'reinforced_chassis', quantity: 1 }],
    rawMaterialCost: 65,
    productionTimeSeconds: 230,
    requiredAssemblerMark: 3,
    effects: { factoryGlobalPowerOutputBoostPercent: 0.001, maxBonusPercent: 7.2 }
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
    effects: { globalBusinessUpgradeCostReductionPercent: 0.001, maxBonusPercent: 2.4 }
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
    effects: { globalCostReductionPercent: 0.001, maxBonusPercent: 1.2 }
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
    effects: { factoryGlobalPowerOutputBoostPercent: 0.001, maxBonusPercent: 12 }
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
    effects: { factoryGlobalMaterialCollectionBoostPercent: 0.001, maxBonusPercent: 8.4 }
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
    effects: { businessTypeIncomeBoostPercent: { businessType: 'AEROSPACE', percent: 0.001 }, maxBonusPercent: 12 }
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
    effects: { globalIncomeBoostPerComponentPercent: 0.001, maxBonusPercent: 12 }
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
    effects: { businessTypeIncomeBoostPercent: { businessType: 'BIO_TECH', percent: 0.001 }, maxBonusPercent: 14.4 }
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
    effects: { businessTypeIncomeBoostPercent: { businessType: 'MISC_ADVANCED', percent: 0.001 }, maxBonusPercent: 10 }
  },

  // --- PHASE 2 ADDITIONS START HERE ---
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'fast_food_franchise', percent: 0.001 }, maxBonusPercent: 2.4 }
  },
  {
    id: 'shielded_enclosure',
    name: 'Shielded Enclosure',
    description: 'EM-shielded casing for sensitive components. Boosts Cybersecurity Solutions income.',
    icon: ShieldEllipsis,
    tier: 2,
    recipe: [{ componentId: 'rugged_casing', quantity: 3 }],
    rawMaterialCost: 15, // Adjusted cost based on input (3*10 raw equivalent if we were to use that, but direct RM cost is lower for balance)
    productionTimeSeconds: 60,
    requiredAssemblerMark: 2,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'cybersecurity_solutions', percent: 0.001 }, maxBonusPercent: 3.6 }
  },
  {
    id: 'vacuum_sealed_housing',
    name: 'Vacuum-Sealed Housing',
    description: 'Airtight housing for space applications. Boosts Space Exploration Inc. income.',
    icon: Rocket,
    tier: 3,
    recipe: [{ componentId: 'shielded_enclosure', quantity: 2 }, { componentId: 'basic_gear', quantity: 2 }],
    rawMaterialCost: 30, // Adjusted
    productionTimeSeconds: 180,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'space_exploration_inc', percent: 0.001 }, maxBonusPercent: 5 }
  },

  // Family: Computation Cores
  {
    id: 'neural_processing_unit_adv',
    name: 'Neural Processing Unit',
    description: 'Specialized for neural network computations. Boosts AI Research Lab income.',
    icon: BrainCircuit,
    tier: 2,
    recipe: [{ componentId: 'basic_circuit_board', quantity: 3 }, { componentId: 'advanced_gear', quantity: 1 }],
    rawMaterialCost: 30, // Adjusted
    productionTimeSeconds: 70,
    requiredAssemblerMark: 2,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'ai_research_lab', percent: 0.001 }, maxBonusPercent: 6 }
  },
  {
    id: 'cognitive_matrix_core_adv',
    name: 'Cognitive Matrix Core',
    description: 'Core for advanced AI cognition. Boosts Sentient AI Consultancy income.',
    icon: Brain,
    tier: 3,
    recipe: [{ componentId: 'neural_processing_unit_adv', quantity: 2 }, { componentId: 'advanced_logic_chip', quantity: 1 }],
    rawMaterialCost: 60, // Adjusted
    productionTimeSeconds: 200,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'sentient_ai_consultancy', percent: 0.001 }, maxBonusPercent: 7.2 }
  },
  {
    id: 'singularity_engine_fragment_component_adv',
    name: 'Singularity Engine Fragment',
    description: 'A piece of a theoretical singularity engine. Boosts Singularity Management Corp income.',
    icon: InfinityIcon,
    tier: 4,
    recipe: [{ componentId: 'cognitive_matrix_core_adv', quantity: 2 }, { componentId: 'quantum_processor_unit', quantity: 1 }],
    rawMaterialCost: 150, // Adjusted
    productionTimeSeconds: 900,
    requiredAssemblerMark: 4,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'singularity_management_corp', percent: 0.001 }, maxBonusPercent: 8.4 }
  },

  // Family: Energy Conduits
  {
    id: 'superconductive_wire_bundle',
    name: 'Superconductive Wire Bundle',
    description: 'High-efficiency power transmission. Small boost to factory power output.',
    icon: GitMergeIcon,
    tier: 2,
    recipe: [{ componentId: 'efficiency_coil', quantity: 3 }],
    rawMaterialCost: 20, // Adjusted
    productionTimeSeconds: 50,
    requiredAssemblerMark: 2,
    effects: { factoryGlobalPowerOutputBoostPercent: 0.001, maxBonusPercent: 2.4 }
  },
  {
    id: 'plasma_conduit_segment_component_adv',
    name: 'Plasma Conduit Segment',
    description: 'For extreme energy throughput. Medium boost to factory power output.',
    icon: Sigma,
    tier: 3,
    recipe: [{ componentId: 'superconductive_wire_bundle', quantity: 2 }, { componentId: 'power_regulator_mk1', quantity: 1 }],
    rawMaterialCost: 50, // Adjusted
    productionTimeSeconds: 150,
    requiredAssemblerMark: 3,
    effects: { factoryGlobalPowerOutputBoostPercent: 0.001, maxBonusPercent: 6 }
  },
  {
    id: 'zero_point_tap_module_component_adv',
    name: 'Zero-Point Tap Module',
    description: 'Draws energy from vacuum fluctuations. Large boost to factory power output.',
    icon: Power,
    tier: 4,
    recipe: [{ componentId: 'plasma_conduit_segment_component_adv', quantity: 2 }, { componentId: 'power_regulator_mk2', quantity: 1 }],
    rawMaterialCost: 120, // Adjusted
    productionTimeSeconds: 800,
    requiredAssemblerMark: 4,
    effects: { factoryGlobalPowerOutputBoostPercent: 0.001, maxBonusPercent: 9.6 }
  },

  // Specific Business Boosts (Phase 2 Additions)
  {
    id: 'movie_studio_digital_projector_lens',
    name: 'Digital Projector Lens',
    description: 'High-clarity lens for digital projection. Boosts Movie Studio income.',
    icon: Film,
    tier: 2,
    recipe: [{ componentId: 'polished_optical_array', quantity: 1 }, { componentId: 'basic_circuit_board', quantity: 2 }],
    rawMaterialCost: 40, // Adjusted
    productionTimeSeconds: 75,
    requiredAssemblerMark: 2,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'movie_studio', percent: 0.001 }, maxBonusPercent: 5 }
  },
  {
    id: 'pharmaceutical_bio_printer_nozzle',
    name: 'Bio-Printer Nozzle',
    description: 'Precision nozzle for bio-printing applications. Boosts Pharmaceutical Company income.',
    icon: FlaskConical,
    tier: 3,
    recipe: [{ componentId: 'precision_gear', quantity: 1 }, { componentId: 'nanite_conduit', quantity: 1 }],
    rawMaterialCost: 70, // Adjusted
    productionTimeSeconds: 220,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'pharmaceutical_company', percent: 0.001 }, maxBonusPercent: 6 }
  },
  {
    id: 'renewable_energy_grid_inverter_adv',
    name: 'Advanced Grid Inverter',
    description: 'Efficiently converts DC to AC for power grids. Boosts EcoPower Corp income.',
    icon: Wind,
    tier: 2,
    recipe: [{ componentId: 'power_regulator_mk1', quantity: 1 }, { componentId: 'basic_energy_cell', quantity: 2 }],
    rawMaterialCost: 45, // Adjusted
    productionTimeSeconds: 80,
    requiredAssemblerMark: 2,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'renewable_energy_corp', percent: 0.001 }, maxBonusPercent: 5 }
  },
  {
    id: 'genetic_sequencer_chip_adv',
    name: 'Genetic Sequencer Chip',
    description: 'Specialized chip for rapid gene sequencing. Boosts EvoGenesis Labs income.',
    icon: Dna,
    tier: 3,
    recipe: [{ componentId: 'advanced_logic_chip', quantity: 2 }, { componentId: 'holographic_data_crystal', quantity: 1 }],
    rawMaterialCost: 110, // Adjusted
    productionTimeSeconds: 300,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'genetic_engineering_firm', percent: 0.001 }, maxBonusPercent: 7.2 }
  },
  {
    id: 'streaming_service_codec_optimizer_chip',
    name: 'Codec Optimizer Chip',
    description: 'Improves video compression for streaming. Boosts StreamFlix income.',
    icon: Tv,
    tier: 2,
    recipe: [{ componentId: 'advanced_logic_chip', quantity: 1 }, { componentId: 'magnetic_storage_unit', quantity: 2 }],
    rawMaterialCost: 50, // Adjusted
    productionTimeSeconds: 85,
    requiredAssemblerMark: 2,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'entertainment_streaming_service', percent: 0.001 }, maxBonusPercent: 3.6 }
  },
  {
    id: 'ad_agency_neural_targeting_module_adv',
    name: 'Neural Targeting Module',
    description: 'AI module for hyper-targeted advertising. Boosts Boutique Ad Agency income.',
    icon: Megaphone,
    tier: 3,
    recipe: [{ componentId: 'neural_processing_unit_adv', quantity: 1 }, { componentId: 'miniature_ai_core', quantity: 1 }],
    rawMaterialCost: 90, // Adjusted
    productionTimeSeconds: 280,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'ad_agency', percent: 0.001 }, maxBonusPercent: 6 }
  },
  {
    id: 'real_estate_holographic_viewer_pro',
    name: 'Holographic Property Viewer',
    description: 'Device for immersive property tours. Boosts Real Estate Agency income.',
    icon: Building,
    tier: 2,
    recipe: [{ componentId: 'polished_optical_array', quantity: 1 }, { componentId: 'simple_frame', quantity: 2 }],
    rawMaterialCost: 35, // Adjusted
    productionTimeSeconds: 70,
    requiredAssemblerMark: 2,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'real_estate', percent: 0.001 }, maxBonusPercent: 3.6 }
  },
  {
    id: 'logistics_drone_battery_extender_plus',
    name: 'Drone Battery Extender',
    description: 'Increases drone flight time for deliveries. Boosts AeroSwift Delivery income.',
    icon: Navigation,
    tier: 2,
    recipe: [{ componentId: 'efficient_power_core', quantity: 1 }, { componentId: 'basic_circuit_board', quantity: 1 }],
    rawMaterialCost: 60, // Adjusted
    productionTimeSeconds: 90,
    requiredAssemblerMark: 2,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'drone_delivery_service', percent: 0.001 }, maxBonusPercent: 5 }
  },
  {
    id: 'fast_food_automated_dispenser',
    name: 'Automated Food Dispenser',
    description: 'Speeds up order fulfillment. Boosts Fast Food Franchise income.',
    icon: Utensils,
    tier: 2,
    recipe: [{ componentId: 'basic_gear', quantity: 3 }, { componentId: 'simple_frame', quantity: 2 }],
    rawMaterialCost: 30, // Adjusted
    productionTimeSeconds: 65,
    requiredAssemblerMark: 2,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'fast_food_franchise', percent: 0.001 }, maxBonusPercent: 3.6 }
  },
  {
    id: 'software_agency_dev_ops_pipeline_module',
    name: 'DevOps Pipeline Module',
    description: 'Automates software deployment. Boosts CodeCrafters Inc. income.',
    icon: Code2,
    tier: 3,
    recipe: [{ componentId: 'advanced_logic_chip', quantity: 2 }, { componentId: 'survey_drone_module', quantity: 1 }],
    rawMaterialCost: 80, // Adjusted
    productionTimeSeconds: 250,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'software_agency', percent: 0.001 }, maxBonusPercent: 6 }
  },
  {
    id: 'global_shipping_container_tracker_adv',
    name: 'Advanced Container Tracker',
    description: 'Real-time tracking for global shipments. Boosts Horizon Logistics income.',
    icon: Ship,
    tier: 3,
    recipe: [{ componentId: 'solid_state_drive_array', quantity: 1 }, { componentId: 'miniature_ai_core', quantity: 1 }],
    rawMaterialCost: 100, // Adjusted
    productionTimeSeconds: 290,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'global_shipping_network', percent: 0.001 }, maxBonusPercent: 5 }
  },

  // Specific Stock Boosts (Phase 2 Additions)
  {
    id: 'alpha_pharma_research_accelerator_core',
    name: 'Research Accelerator Core',
    description: 'Speeds up drug discovery processes. Boosts Alpha Pharma (APRX) stock dividend yield.',
    icon: Beaker,
    tier: 3,
    recipe: [{ componentId: 'bio_reactor_catalyst', quantity: 1 }, { componentId: 'quantum_processor_unit', quantity: 1 }],
    rawMaterialCost: 200, // Adjusted
    productionTimeSeconds: 350,
    requiredAssemblerMark: 3,
    effects: { stockSpecificDividendYieldBoostPercent: { stockId: 'alpha_pharma', percent: 0.001 }, maxBonusPercent: 0.36 }
  },
  {
    id: 'tech_innovations_quantum_sensor_array',
    name: 'Quantum Sensor Array',
    description: 'Ultra-sensitive sensors for R&D. Boosts Tech Innovations (TINV) stock dividend yield.',
    icon: AtomIcon,
    tier: 4,
    recipe: [{ componentId: 'gravimetric_sensor_suite', quantity: 1 }, { componentId: 'miniature_fusion_core_component', quantity: 1 }],
    rawMaterialCost: 350, // Adjusted
    productionTimeSeconds: 1000,
    requiredAssemblerMark: 4,
    effects: { stockSpecificDividendYieldBoostPercent: { stockId: 'tech_innovations', percent: 0.001 }, maxBonusPercent: 0.18 }
  },
  {
    id: 'global_corp_efficiency_module_adv',
    name: 'GC Efficiency Module',
    description: 'Improves operational efficiency for large conglomerates. Boosts Global Corp (GC) stock dividend.',
    icon: Building,
    tier: 2,
    recipe: [{ componentId: 'advanced_gear', quantity: 2 }, { componentId: 'efficiency_coil', quantity: 2 }],
    rawMaterialCost: 50, // Adjusted
    productionTimeSeconds: 90,
    requiredAssemblerMark: 2,
    effects: { stockSpecificDividendYieldBoostPercent: { stockId: 'global_corp', percent: 0.001 }, maxBonusPercent: 0.24 }
  },

  // Business Type Boosts (Phase 2 Additions)
  {
    id: 'financial_transaction_secure_ledger',
    name: 'Secure Financial Ledger',
    description: 'Immutable ledger for secure transactions. Boosts all FINANCE type businesses.',
    icon: PiggyBank,
    tier: 2,
    recipe: [{ componentId: 'solid_state_drive_array', quantity: 1 }, { componentId: 'basic_circuit_board', quantity: 2 }],
    rawMaterialCost: 60, // Adjusted
    productionTimeSeconds: 100,
    requiredAssemblerMark: 2,
    effects: { businessTypeIncomeBoostPercent: { businessType: 'FINANCE', percent: 0.001 }, maxBonusPercent: 3.6 }
  },
  {
    id: 'media_content_adaptive_streamer',
    name: 'Adaptive Content Streamer',
    description: 'Optimizes media delivery based on bandwidth. Boosts all MEDIA type businesses.',
    icon: Radio,
    tier: 3,
    recipe: [{ componentId: 'streaming_service_codec_optimizer_chip', quantity: 1 }, { componentId: 'advanced_logic_chip', quantity: 1 }],
    rawMaterialCost: 120, // Adjusted
    productionTimeSeconds: 320,
    requiredAssemblerMark: 3,
    effects: { businessTypeIncomeBoostPercent: { businessType: 'MEDIA', percent: 0.001 }, maxBonusPercent: 5 }
  },
  {
    id: 'aerospace_navigation_computer_adv',
    name: 'Advanced Navigation Computer',
    description: 'High-precision computer for aerospace applications. Boosts all AEROSPACE type businesses.',
    icon: Compass,
    tier: 4,
    recipe: [{ componentId: 'null_g_support_structure', quantity: 1 }, { componentId: 'quantum_processor_unit', quantity: 1 }],
    rawMaterialCost: 200, // Adjusted
    productionTimeSeconds: 950,
    requiredAssemblerMark: 4,
    effects: { businessTypeIncomeBoostPercent: { businessType: 'AEROSPACE', percent: 0.001 }, maxBonusPercent: 6 }
  },

  // Global/Factory Boosts (Phase 2 Additions)
  {
    id: 'advanced_coolant_circulation_system',
    name: 'Advanced Coolant System',
    description: 'Efficiently dissipates heat from machinery. Small global business level-up cost reduction.',
    icon: Waves,
    tier: 2,
    recipe: [{ componentId: 'efficiency_coil', quantity: 2 }, { componentId: 'simple_frame', quantity: 1 }],
    rawMaterialCost: 40, // Adjusted
    productionTimeSeconds: 75,
    requiredAssemblerMark: 2,
    effects: { globalCostReductionPercent: 0.001, maxBonusPercent: 0.9 }
  },
  {
    id: 'geological_survey_data_analyzer',
    name: 'Geological Data Analyzer',
    description: 'Processes survey data to find rich material deposits. Small global material collection boost.',
    icon: Pickaxe,
    tier: 2,
    recipe: [{ componentId: 'survey_drone_module', quantity: 1 }, { componentId: 'basic_circuit_board', quantity: 1 }],
    rawMaterialCost: 45, // Adjusted
    productionTimeSeconds: 80,
    requiredAssemblerMark: 2,
    effects: { factoryGlobalMaterialCollectionBoostPercent: 0.001, maxBonusPercent: 3 }
  },
  {
    id: 'high_frequency_market_algorithm_core',
    name: 'Market Algorithm Core',
    description: 'Core for high-frequency trading algorithms. Small global dividend yield boost.',
    icon: LineChart,
    tier: 3,
    recipe: [{ componentId: 'market_analysis_chip', quantity: 1 }, { componentId: 'neural_processing_unit_adv', quantity: 1 }],
    rawMaterialCost: 140, // Adjusted
    productionTimeSeconds: 330,
    requiredAssemblerMark: 3,
    effects: { globalDividendYieldBoostPercent: 0.001, maxBonusPercent: 0.18 }
  },
  {
    id: 'automated_maintenance_bot_toolkit',
    name: 'Automated Maintenance Toolkit',
    description: 'Toolkit for automated maintenance bots. Small global business upgrade cost reduction.',
    icon: Wrench,
    tier: 3,
    recipe: [{ componentId: 'robotic_arm_actuator_adv', quantity: 1 }, { componentId: 'advanced_gear', quantity: 2 }],
    rawMaterialCost: 80, // Adjusted
    productionTimeSeconds: 310,
    requiredAssemblerMark: 3,
    effects: { globalBusinessUpgradeCostReductionPercent: 0.001, maxBonusPercent: 1.8 }
  },
  {
    id: 'universal_resource_optimization_node',
    name: 'Universal Resource Optimizer',
    description: 'AI node for optimizing resource use across all ventures. Small global income boost.',
    icon: Database,
    tier: 4,
    recipe: [{ componentId: 'logistics_ai_processor', quantity: 1 }, { componentId: 'power_regulator_mk2', quantity: 1 }],
    rawMaterialCost: 300, // Adjusted
    productionTimeSeconds: 1100,
    requiredAssemblerMark: 4,
    effects: { globalIncomeBoostPerComponentPercent: 0.001, maxBonusPercent: 1.2 }
  },
  {
    id: 'master_craftsman_calibration_tools',
    name: 'Master Calibration Tools',
    description: 'High-precision tools for calibrating machinery. Reduces global business upgrade costs.',
    icon: HardHat,
    tier: 4,
    recipe: [{ componentId: 'nanite_assembler_core', quantity: 1 }, { componentId: 'precision_gear', quantity: 2 }],
    rawMaterialCost: 320, // Adjusted
    productionTimeSeconds: 1200,
    requiredAssemblerMark: 4,
    effects: { globalBusinessUpgradeCostReductionPercent: 0.001, maxBonusPercent: 2.4 }
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'robotics_factory_synthodynamics', percent: 0.001 }, maxBonusPercent: 1.8 }
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
    effects: { businessSpecificUpgradeCostReductionPercent: { businessId: 'robotics_factory_synthodynamics', percent: 0.001 }, maxBonusPercent: 2.4 }
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'robotics_factory_synthodynamics', percent: 0.001 }, maxBonusPercent: 3.6 }
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'pharmaceutical_company', percent: 0.001 }, maxBonusPercent: 2.2 }
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'custom_genome_design', percent: 0.001 }, maxBonusPercent: 3 }
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'genetic_engineering_firm', percent: 0.001 }, maxBonusPercent: 4.2 }
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
    effects: { globalIncomeBoostPerComponentPercent: 0.001, maxBonusPercent: 1.2 }
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
    effects: { businessTypeIncomeBoostPercent: { businessType: 'ENERGY', percent: 0.001 }, maxBonusPercent: 2.4 }
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'quantum_computing_labs_quantaleap', percent: 0.001 }, maxBonusPercent: 5 }
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'lemonade_stand', percent: 0.001 }, maxBonusPercent: 3 }
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'artisan_bakery', percent: 0.001 }, maxBonusPercent: 3.6 }
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
    effects: { businessSpecificLevelUpCostReductionPercent: { businessId: 'tech_startup', percent: 0.001 }, maxBonusPercent: 1.8 }
  },
  {
    id: 'movie_studio_sound_mixing_board_pro',
    name: 'Pro Sound Mixing Board',
    description: 'Studio-grade audio mixing console. Boosts Movie Studio income.',
    icon: Radio, // Re-using Radio as it fits media context
    tier: 3,
    recipe: [{ componentId: 'advanced_logic_chip', quantity: 2 }, { componentId: 'basic_circuit_board', quantity: 3 }],
    rawMaterialCost: 90,
    productionTimeSeconds: 270,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'movie_studio', percent: 0.001 }, maxBonusPercent: 5 }
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'cybersecurity_solutions', percent: 0.001 }, maxBonusPercent: 5.4 }
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'space_exploration_inc', percent: 0.001 }, maxBonusPercent: 6 }
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'ai_research_lab', percent: 0.001 }, maxBonusPercent: 5.4 }
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'genetic_engineering_firm', percent: 0.001 }, maxBonusPercent: 7.2 }
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'omni_media_group', percent: 0.001 }, maxBonusPercent: 4.2 }
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'robotics_factory_synthodynamics', percent: 0.001 }, maxBonusPercent: 6.6 }
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
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'quantum_computing_labs_quantaleap', percent: 0.001 }, maxBonusPercent: 9 }
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
    effects: { stockSpecificDividendYieldBoostPercent: { stockId: 'biofuture_med', percent: 0.001 }, maxBonusPercent: 0.26 }
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
    effects: { stockSpecificDividendYieldBoostPercent: { stockId: 'aether_logistics', percent: 0.001 }, maxBonusPercent: 0.22 }
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
    effects: { stockSpecificDividendYieldBoostPercent: { stockId: 'omega_corp', percent: 0.001 }, maxBonusPercent: 0.42 }
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
    effects: { stockSpecificDividendYieldBoostPercent: { stockId: 'stellar_dynamics', percent: 0.001 }, maxBonusPercent: 0.6 }
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
    effects: { businessTypeIncomeBoostPercent: { businessType: 'FINANCE', percent: 0.001 }, maxBonusPercent: 7.2 }
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
    effects: { businessTypeIncomeBoostPercent: { businessType: 'MANUFACTURING', percent: 0.001 }, maxBonusPercent: 5.4 }
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
    effects: { businessTypeIncomeBoostPercent: { businessType: 'MEDIA', percent: 0.001 }, maxBonusPercent: 6.6 }
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
    effects: { globalCostReductionPercent: 0.001, maxBonusPercent: 2.4 }
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
    effects: { factoryGlobalPowerOutputBoostPercent: 0.001, maxBonusPercent: 9.6 }
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
    effects: { factoryGlobalMaterialCollectionBoostPercent: 0.001, maxBonusPercent: 7.2 }
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
    effects: { factoryManualRPGenerationBoost: 0.002, maxBonusPercent: 0.6 }
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
    effects: { globalIncomeBoostPerComponentPercent: 0.001, maxBonusPercent: 9.6 }
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
    effects: { factoryWorkerEnergyDrainModifier: 0.98, maxBonusPercent: 12 } // Reduces drain by 2% effectively
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
    effects: { globalDividendYieldBoostPercent: 0.001, maxBonusPercent: 0.24 }
  },

  // --- PHASE 4 ADDITIONS START HERE ---
  // Family: Advanced Sensors
  {
    id: 'basic_environmental_sensor',
    name: 'Basic Environmental Sensor',
    description: 'Detects basic environmental conditions. Small boost to Renewable Energy Corp income.',
    icon: Thermometer,
    tier: 1,
    recipe: [],
    rawMaterialCost: 14,
    productionTimeSeconds: 23,
    requiredAssemblerMark: 1,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'renewable_energy_corp', percent: 0.001 }, maxBonusPercent: 2.4 }
  },
  {
    id: 'multi_spectral_imaging_array',
    name: 'Multi-Spectral Imaging Array',
    description: 'Advanced sensor for detailed environmental analysis. Boosts Planetary Terraforming Corp income.',
    icon: Palette,
    tier: 2,
    recipe: [{ componentId: 'basic_environmental_sensor', quantity: 3 }, { componentId: 'polished_optical_array', quantity: 1 }],
    rawMaterialCost: 42,
    productionTimeSeconds: 75,
    requiredAssemblerMark: 2,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'planetary_terraforming_corp', percent: 0.001 }, maxBonusPercent: 3.6 }
  },
  {
    id: 'deep_space_observatory_lens_pro',
    name: 'Deep Space Observatory Lens',
    description: 'Ultra-powerful lens for cosmic observation. Boosts Interstellar Trading Guild income.',
    icon: TelescopeIconLucide,
    tier: 3,
    recipe: [{ componentId: 'multi_spectral_imaging_array', quantity: 2 }, { componentId: 'gravimetric_sensor_suite', quantity: 1 }],
    rawMaterialCost: 110,
    productionTimeSeconds: 310,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'interstellar_trading_guild', percent: 0.001 }, maxBonusPercent: 5 }
  },

  // Family: Communication Systems
  {
    id: 'simple_transceiver_unit',
    name: 'Simple Transceiver',
    description: 'Basic two-way communication device. Small boost to AeroSwift Delivery income.',
    icon: Antenna,
    tier: 1,
    recipe: [],
    rawMaterialCost: 16,
    productionTimeSeconds: 26,
    requiredAssemblerMark: 1,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'drone_delivery_service', percent: 0.001 }, maxBonusPercent: 2.6 }
  },
  {
    id: 'encrypted_comms_chip_mil',
    name: 'Military-Grade Comms Chip',
    description: 'Secure communication chip. Boosts income for Global Satellite Network.',
    icon: ShieldEllipsis,
    tier: 2,
    recipe: [{ componentId: 'simple_transceiver_unit', quantity: 3 }, { componentId: 'secure_encryption_module', quantity: 1 }],
    rawMaterialCost: 50,
    productionTimeSeconds: 90,
    requiredAssemblerMark: 2,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'global_satellite_network', percent: 0.001 }, maxBonusPercent: 4.2 }
  },
  {
    id: 'quantum_entanglement_communicator_prototype',
    name: 'Quantum Entanglement Communicator',
    description: 'Instantaneous, unjammable communication across any distance. Boosts Universal Consciousness Network.',
    icon: Share2,
    tier: 3,
    recipe: [{ componentId: 'encrypted_comms_chip_mil', quantity: 2 }, { componentId: 'quantum_processor_unit', quantity: 1 }],
    rawMaterialCost: 130,
    productionTimeSeconds: 350,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'universal_consciousness_network', percent: 0.001 }, maxBonusPercent: 6 }
  },

  // Family: Robotics AI Cores
  {
    id: 'basic_robot_logic_core',
    name: 'Basic Robot Logic Core',
    description: 'Simple AI for basic robotic tasks. Reduces Robotics Factory SynthoDynamics level up costs.',
    icon: BotIcon,
    tier: 1,
    recipe: [],
    rawMaterialCost: 13,
    productionTimeSeconds: 21,
    requiredAssemblerMark: 1,
    effects: { businessSpecificLevelUpCostReductionPercent: { businessId: 'robotics_factory_synthodynamics', percent: 0.001 }, maxBonusPercent: 1.2 }
  },
  {
    id: 'swarm_robotics_coordination_module',
    name: 'Swarm Robotics Module',
    description: 'Coordinates multiple robots for complex tasks. Boosts AutoCorp Industries income.',
    icon: Workflow,
    tier: 2,
    recipe: [{ componentId: 'basic_robot_logic_core', quantity: 4 }, { componentId: 'simple_transceiver_unit', quantity: 2 }],
    rawMaterialCost: 40,
    productionTimeSeconds: 78,
    requiredAssemblerMark: 2,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'autonomous_megafactories', percent: 0.001 }, maxBonusPercent: 3.4 }
  },
  {
    id: 'sentient_robot_posibrain_core_adv',
    name: 'Positronic Robot Brain',
    description: 'A sophisticated AI core approaching sentience. Boosts Sentient AI Consultancy income.',
    icon: Brain,
    tier: 3,
    recipe: [{ componentId: 'swarm_robotics_coordination_module', quantity: 2 }, { componentId: 'cognitive_matrix_core_adv', quantity: 1 }],
    rawMaterialCost: 100,
    productionTimeSeconds: 300,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'sentient_ai_consultancy', percent: 0.001 }, maxBonusPercent: 4.6 }
  },

  // Specific Business Boosts (Phase 4 Additions)
  {
    id: 'luxury_space_tourism_ai_concierge_module',
    name: 'AI Space Concierge',
    description: 'AI to cater to every whim of space tourists. Boosts Celestial Voyages income.',
    icon: UserPlus,
    tier: 3,
    recipe: [{ componentId: 'miniature_ai_core', quantity: 1 }, { componentId: 'encrypted_comms_chip_mil', quantity: 1 }],
    rawMaterialCost: 120,
    productionTimeSeconds: 330,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'luxury_space_tourism', percent: 0.001 }, maxBonusPercent: 6 }
  },
  {
    id: 'medimind_ai_clinics_diagnostic_scanner_upgrade',
    name: 'Advanced Diagnostic Scanner',
    description: 'Improves diagnostic accuracy for AI clinics. Boosts MediMind AI Clinics income.',
    icon: Scan,
    tier: 4,
    recipe: [{ componentId: 'multi_spectral_imaging_array', quantity: 1 }, { componentId: 'cognitive_matrix_core_adv', quantity: 1 }],
    rawMaterialCost: 150,
    productionTimeSeconds: 880,
    requiredAssemblerMark: 4,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'ai_driven_healthcare', percent: 0.001 }, maxBonusPercent: 7.2 }
  },
  {
    id: 'novaforge_materials_exotic_alloy_synthesizer',
    name: 'Exotic Alloy Synthesizer',
    description: 'Creates novel alloys with unique properties. Boosts NovaForge Materials income.',
    icon: TestTube,
    tier: 4,
    recipe: [{ componentId: 'power_regulator_mk3', quantity: 1 }, { componentId: 'focused_energy_crystal_refined', quantity: 2 }],
    rawMaterialCost: 250,
    productionTimeSeconds: 1000,
    requiredAssemblerMark: 4,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'advanced_materials_rd', percent: 0.001 }, maxBonusPercent: 7.8 }
  },
  {
    id: 'helios_fusion_energy_plasma_injector_optimized',
    name: 'Optimized Plasma Injector',
    description: 'Improves fuel efficiency in fusion reactors. Reduces Helios Fusion Energy level up cost.',
    icon: Snowflake,
    tier: 4,
    recipe: [{ componentId: 'plasma_conduit_segment_component_adv', quantity: 1 }, { componentId: 'alloy_gear', quantity: 1 }],
    rawMaterialCost: 200,
    productionTimeSeconds: 920,
    requiredAssemblerMark: 4,
    effects: { businessSpecificLevelUpCostReductionPercent: { businessId: 'fusion_power_plant', percent: 0.001 }, maxBonusPercent: 3.6 }
  },
  {
    id: 'cosmic_cartel_xeno_artifact_analyzer',
    name: 'Xeno-Artifact Analyzer',
    description: 'Identifies valuable alien artifacts for trade. Boosts Cosmic Cartel Traders income.',
    icon: TelescopeIconLucide,
    tier: 3,
    recipe: [{ componentId: 'gravimetric_sensor_suite', quantity: 1 }, { componentId: 'basic_environmental_sensor', quantity: 2 }],
    rawMaterialCost: 120,
    productionTimeSeconds: 340,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'interstellar_trading_guild', percent: 0.001 }, maxBonusPercent: 5.4 }
  },
  {
    id: 'synapse_dynamics_neural_feedback_loop',
    name: 'Neural Feedback Loop',
    description: 'Enhances precision of neural interfaces. Boosts Synapse Dynamics income.',
    icon: Brain,
    tier: 5,
    recipe: [{ componentId: 'quantum_entanglement_communicator_prototype', quantity: 1 }, { componentId: 'singularity_engine_fragment_component_adv', quantity: 1 }],
    rawMaterialCost: 500,
    productionTimeSeconds: 3700,
    requiredAssemblerMark: 5,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'neural_interface_tech', percent: 0.001 }, maxBonusPercent: 8.4 }
  },
  {
    id: 'aquatic_dome_structural_reinforcement_adv',
    name: 'Aquatic Dome Reinforcement',
    description: 'Strengthens underwater habitats. Boosts AquaDom Settlements income.',
    icon: Anchor,
    tier: 4,
    recipe: [{ componentId: 'null_g_support_structure', quantity: 2 }, { componentId: 'alloy_gear', quantity: 1 }],
    rawMaterialCost: 250,
    productionTimeSeconds: 1050,
    requiredAssemblerMark: 4,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'oceanic_colonization_project', percent: 0.001 }, maxBonusPercent: 6.6 }
  },
  {
    id: 'solara_construct_dyson_energy_collector_panel_max',
    name: 'Max-Efficiency Dyson Panel',
    description: 'Collects stellar energy with near-perfect efficiency. Boosts SolaraConstruct Dyson income.',
    icon: Sun,
    tier: 5,
    recipe: [{ componentId: 'focused_energy_crystal_refined', quantity: 3 }, { componentId: 'zero_point_tap_module_component_adv', quantity: 1 }],
    rawMaterialCost: 520,
    productionTimeSeconds: 3900,
    requiredAssemblerMark: 5,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'dyson_sphere_engineering', percent: 0.001 }, maxBonusPercent: 8.6 }
  },
  {
    id: 'galactic_exchange_quantum_ledger_processor',
    name: 'Quantum Ledger Processor',
    description: 'Processes galactic transactions at light speed. Boosts Galactic Exchange Authority income.',
    icon: LineChart,
    tier: 5,
    recipe: [{ componentId: 'quantum_processor_unit', quantity: 2 }, { componentId: 'holographic_data_crystal', quantity: 2 }],
    rawMaterialCost: 580,
    productionTimeSeconds: 4100,
    requiredAssemblerMark: 5,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'galactic_stock_exchange', percent: 0.001 }, maxBonusPercent: 8.2 }
  },
  {
    id: 'babel_link_universal_linguistic_matrix_prime',
    name: 'Prime Linguistic Matrix',
    description: 'The core of the universal translator. Boosts Babel Link Universal income.',
    icon: Languages,
    tier: 4,
    recipe: [{ componentId: 'cognitive_matrix_core_adv', quantity: 1 }, { componentId: 'encrypted_comms_chip_mil', quantity: 2 }],
    rawMaterialCost: 280,
    productionTimeSeconds: 1150,
    requiredAssemblerMark: 4,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'universal_translation_services', percent: 0.001 }, maxBonusPercent: 7.4 }
  },
  {
    id: 'dimensionx_labs_exotic_particle_manipulator',
    name: 'Exotic Particle Manipulator',
    description: 'Tool for manipulating unknown particles. Boosts DimensionX Labs income.',
    icon: TestTube,
    tier: 5,
    recipe: [{ componentId: 'perfect_resonance_gemstone_tuned', quantity: 2 }, { componentId: 'tachyon_field_emitter_component', quantity: 1 }],
    rawMaterialCost: 620,
    productionTimeSeconds: 4300,
    requiredAssemblerMark: 5,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'exotic_matter_research', percent: 0.001 }, maxBonusPercent: 9.4 }
  },
  {
    id: 'jumppoint_navigators_hyperspace_route_calculator_pro',
    name: 'Hyperspace Route Calculator',
    description: 'Calculates optimal FTL jump paths. Boosts JumpPoint Navigators income.',
    icon: Route,
    tier: 4,
    recipe: [{ componentId: 'quantum_processor_unit', quantity: 1 }, { componentId: 'gravimetric_sensor_suite', quantity: 2 }],
    rawMaterialCost: 300,
    productionTimeSeconds: 1200,
    requiredAssemblerMark: 4,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'hyperspace_travel_agency', percent: 0.001 }, maxBonusPercent: 7 }
  },
  {
    id: 'biosynth_creations_genome_writer_precision_tool',
    name: 'Precision Genome Writer',
    description: 'Device for accurately synthesizing DNA strands. Boosts BioSynth Creations income.',
    icon: PenTool,
    tier: 5,
    recipe: [{ componentId: 'genetic_sequencer_chip_adv', quantity: 2 }, { componentId: 'nanite_assembler_core', quantity: 1 }],
    rawMaterialCost: 550,
    productionTimeSeconds: 3950,
    requiredAssemblerMark: 5,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'custom_genome_design', percent: 0.001 }, maxBonusPercent: 8.5 }
  },
  {
    id: 'xenochronos_archives_artifact_scanner_deep_scan',
    name: 'Deep Artifact Scanner',
    description: 'Scans for deeply buried or hidden alien artifacts. Boosts XenoChronos Archives income.',
    icon: Scroll,
    tier: 4,
    recipe: [{ componentId: 'multi_spectral_imaging_array', quantity: 2 }, { componentId: 'survey_drone_module', quantity: 2 }],
    rawMaterialCost: 180,
    productionTimeSeconds: 900,
    requiredAssemblerMark: 4,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'galactic_archaeology_guild', percent: 0.001 }, maxBonusPercent: 7.2 }
  },
  {
    id: 'aetheria_energy_zero_point_regulator_stable',
    name: 'Stable Zero-Point Regulator',
    description: 'Regulates the flow of zero-point energy. Boosts Aetheria Energy Dynamics income.',
    icon: InfinityIcon,
    tier: 5,
    recipe: [{ componentId: 'zero_point_tap_module_component_adv', quantity: 1 }, { componentId: 'power_regulator_mk3', quantity: 1 }],
    rawMaterialCost: 580,
    productionTimeSeconds: 4000,
    requiredAssemblerMark: 5,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'zero_point_energy_solutions', percent: 0.001 }, maxBonusPercent: 9.6 }
  },
  {
    id: 'noosphere_collective_psionic_focus_crystal_pure',
    name: 'Pure Psionic Focus Crystal',
    description: 'Amplifies telepathic signals for the collective. Boosts The Noosphere Collective income.',
    icon: Share2,
    tier: 5,
    recipe: [{ componentId: 'perfect_resonance_gemstone_tuned', quantity: 2 }, { componentId: 'cognitive_matrix_core_adv', quantity: 1 }],
    rawMaterialCost: 500,
    productionTimeSeconds: 3800,
    requiredAssemblerMark: 5,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'universal_consciousness_network', percent: 0.001 }, maxBonusPercent: 7.8 }
  },
  {
    id: 'apex_transcendence_corp_ascension_matrix_core_nexus',
    name: 'Ascension Matrix Core',
    description: 'Core component for guiding beings to higher consciousness. Boosts Apex Transcendence Corp income.',
    icon: Aperture,
    tier: 5,
    recipe: [{ componentId: 'singularity_engine_fragment_component_adv', quantity: 1 }, { componentId: 'quantum_entanglement_communicator_prototype', quantity: 1 }],
    rawMaterialCost: 600,
    productionTimeSeconds: 4200,
    requiredAssemblerMark: 5,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'ascension_technologies', percent: 0.001 }, maxBonusPercent: 8.4 }
  },

  // Business Type Boosts (Phase 4 Additions)
  {
    id: 'manufacturing_automation_software_suite_pro',
    name: 'Pro Manufacturing Automation Suite',
    description: 'Advanced software for optimizing manufacturing processes. Boosts all MANUFACTURING type businesses.',
    icon: FactoryIcon,
    tier: 4,
    recipe: [{ componentId: 'logistics_ai_processor', quantity: 1 }, { componentId: 'advanced_logic_chip', quantity: 2 }],
    rawMaterialCost: 280,
    productionTimeSeconds: 1100,
    requiredAssemblerMark: 4,
    effects: { businessTypeIncomeBoostPercent: { businessType: 'MANUFACTURING', percent: 0.001 }, maxBonusPercent: 6.6 }
  },
  {
    id: 'biotech_research_simulation_platform_adv',
    name: 'Advanced Bio-Research Simulation Platform',
    description: 'Simulates complex biological interactions for research. Boosts all BIOTECH type businesses.',
    icon: Dna,
    tier: 4,
    recipe: [{ componentId: 'cognitive_matrix_core_adv', quantity: 1 }, { componentId: 'holographic_data_crystal', quantity: 1 }],
    rawMaterialCost: 250,
    productionTimeSeconds: 1000,
    requiredAssemblerMark: 4,
    effects: { businessTypeIncomeBoostPercent: { businessType: 'BIO_TECH', percent: 0.001 }, maxBonusPercent: 7.2 }
  },

  // Global/Factory Boosts (Phase 4 Additions)
  {
    id: 'universal_worker_efficiency_chip',
    name: 'Worker Efficiency Chip',
    description: 'A chip implanted in workers to slightly reduce factory worker energy drain.',
    icon: Users,
    tier: 3,
    recipe: [{ componentId: 'basic_robot_logic_core', quantity: 2 }, { componentId: 'nutrient_gel_pack_basic', quantity: 1 }],
    rawMaterialCost: 50,
    productionTimeSeconds: 180,
    requiredAssemblerMark: 3,
    effects: { factoryWorkerEnergyDrainModifier: 0.97, maxBonusPercent: 9.6 } // Reduces drain by 3% effectively
  },
  {
    id: 'advanced_cost_reduction_analyzer_global',
    name: 'Global Cost Reduction Analyzer',
    description: 'AI that identifies cost-saving measures across all businesses. Reduces global business level-up costs.',
    icon: DollarSign,
    tier: 5,
    recipe: [{ componentId: 'universal_resource_optimization_node', quantity: 1 }, { componentId: 'market_analysis_chip', quantity: 2 }],
    rawMaterialCost: 550,
    productionTimeSeconds: 4000,
    requiredAssemblerMark: 5,
    effects: { globalCostReductionPercent: 0.001, maxBonusPercent: 3 }
  },
  {
    id: 'experimental_energy_amplifier_factory_wide',
    name: 'Experimental Factory Energy Amplifier',
    description: 'A risky but potentially potent energy booster for the entire factory.',
    icon: ZapOff, 
    tier: 4,
    recipe: [{ componentId: 'zero_point_tap_module_component_adv', quantity: 1 }, { componentId: 'focused_energy_crystal_refined', quantity: 2 }],
    rawMaterialCost: 350,
    productionTimeSeconds: 1300,
    requiredAssemblerMark: 4,
    effects: { factoryGlobalPowerOutputBoostPercent: 0.001, maxBonusPercent: 10.8 }
  },
  {
    id: 'geospatial_deep_scan_array_global',
    name: 'Global Deep Scan Array',
    description: 'Enhances all material collectors with deep scanning capabilities. Boosts factory global material collection rate significantly.',
    icon: Satellite,
    tier: 4,
    recipe: [{ componentId: 'geospatial_mapping_unit', quantity: 2 }, { componentId: 'gravimetric_sensor_suite', quantity: 1 }],
    rawMaterialCost: 280,
    productionTimeSeconds: 1100,
    requiredAssemblerMark: 4,
    effects: { factoryGlobalMaterialCollectionBoostPercent: 0.001, maxBonusPercent: 9.6 }
  },
  // --- PHASE 5 ADDITIONS START HERE ---
  // Family: Advanced Cooling Systems
  {
    id: 'basic_heat_sink',
    name: 'Basic Heat Sink',
    description: 'Simple finned heat sink for passive cooling. Small reduction in factory power consumption.',
    icon: Snowflake, 
    tier: 1,
    recipe: [],
    rawMaterialCost: 9,
    productionTimeSeconds: 19,
    requiredAssemblerMark: 1,
    effects: { factoryGlobalPowerConsumptionModifier: 0.998, maxBonusPercent: 0.6 } // 0.2% reduction
  },
  {
    id: 'liquid_cooling_loop',
    name: 'Liquid Cooling Loop',
    description: 'Closed-loop liquid cooling for moderate heat loads. Reduces factory power consumption more.',
    icon: Snowflake, 
    tier: 2,
    recipe: [{ componentId: 'basic_heat_sink', quantity: 3 }, { componentId: 'servo_motor_mini', quantity: 1 }],
    rawMaterialCost: 30,
    productionTimeSeconds: 68,
    requiredAssemblerMark: 2,
    effects: { factoryGlobalPowerConsumptionModifier: 0.995, maxBonusPercent: 1.2 } // 0.5% reduction
  },
  {
    id: 'cryogenic_cooling_system_adv',
    name: 'Advanced Cryogenic Cooler',
    description: 'Ultra-low temperature cooling for high-performance systems. Significant factory power consumption reduction.',
    icon: Snowflake,
    tier: 3,
    recipe: [{ componentId: 'liquid_cooling_loop', quantity: 2 }, { componentId: 'power_regulator_mk1', quantity: 1 }],
    rawMaterialCost: 70,
    productionTimeSeconds: 230,
    requiredAssemblerMark: 3,
    effects: { factoryGlobalPowerConsumptionModifier: 0.99, maxBonusPercent: 2.4 } // 1% reduction
  },

  // Family: Automated Navigation Systems
  {
    id: 'simple_pathfinding_module',
    name: 'Simple Pathfinding Module',
    description: 'Basic algorithm for A-to-B navigation. Boosts AeroSwift Delivery income.',
    icon: RouteIcon,
    tier: 1,
    recipe: [],
    rawMaterialCost: 11,
    productionTimeSeconds: 24,
    requiredAssemblerMark: 1,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'drone_delivery_service', percent: 0.001 }, maxBonusPercent: 3 }
  },
  {
    id: 'traffic_collision_avoidance_system',
    name: 'Collision Avoidance System',
    description: 'Prevents drone collisions in busy airspace. Reduces Horizon Logistics level up cost.',
    icon: RouteIcon,
    tier: 2,
    recipe: [{ componentId: 'simple_pathfinding_module', quantity: 3 }, { componentId: 'basic_environmental_sensor', quantity: 1 }],
    rawMaterialCost: 38,
    productionTimeSeconds: 72,
    requiredAssemblerMark: 2,
    effects: { businessSpecificLevelUpCostReductionPercent: { businessId: 'global_shipping_network', percent: 0.001 }, maxBonusPercent: 1.8 }
  },
  {
    id: 'hyperspace_lane_charter_component', 
    name: 'Hyperspace Lane Charter',
    description: 'AI for charting safe FTL routes. Boosts JumpPoint Navigators income.',
    icon: RouteIcon,
    tier: 3,
    recipe: [{ componentId: 'traffic_collision_avoidance_system', quantity: 2 }, { componentId: 'advanced_navigation_module', quantity: 1 }],
    rawMaterialCost: 100,
    productionTimeSeconds: 300,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'hyperspace_travel_agency', percent: 0.001 }, maxBonusPercent: 5 }
  },

  // Family: Bio-Enhancement Serums
  {
    id: 'basic_stimulant_serum',
    name: 'Basic Stimulant Serum',
    description: 'Mild cognitive and physical enhancer. Slightly reduces worker energy regeneration.',
    icon: Syringe,
    tier: 1,
    recipe: [],
    rawMaterialCost: 13,
    productionTimeSeconds: 20,
    requiredAssemblerMark: 1,
    effects: { factoryWorkerEnergyRegenModifier: 1.01, maxBonusPercent: 3.6 }
  },
  {
    id: 'neuro_enhancement_cocktail',
    name: 'Neuro-Enhancement Cocktail',
    description: 'Boosts learning and decision-making. Increases manual RP generation.',
    icon: Syringe,
    tier: 2,
    recipe: [{ componentId: 'basic_stimulant_serum', quantity: 3 }, { componentId: 'nutrient_gel_pack_basic', quantity: 1 }],
    rawMaterialCost: 35,
    productionTimeSeconds: 70,
    requiredAssemblerMark: 2,
    effects: { factoryManualRPGenerationBoost: 0.001, maxBonusPercent: 0.36 }
  },
  {
    id: 'adaptive_regeneration_nanites_component', 
    name: 'Adaptive Regeneration Nanites',
    description: 'Microscopic bots that repair and enhance biological tissue. Boosts BioSynth Creations income.',
    icon: Syringe,
    tier: 3,
    recipe: [{ componentId: 'neuro_enhancement_cocktail', quantity: 2 }, { componentId: 'nanite_conduit', quantity: 1 }],
    rawMaterialCost: 90,
    productionTimeSeconds: 290,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'custom_genome_design', percent: 0.001 }, maxBonusPercent: 5.8 }
  },

  // --- PHASE 6 ADDITIONS START HERE ---
  // Family: Advanced AI Modules
  {
    id: 'ai_logic_gate_simple',
    name: 'Simple AI Logic Gate',
    description: 'Basic processing unit for AI decision making. Small global business level-up cost reduction.',
    icon: Binary,
    tier: 1,
    recipe: [],
    rawMaterialCost: 16,
    productionTimeSeconds: 24,
    requiredAssemblerMark: 1,
    effects: { globalCostReductionPercent: 0.001, maxBonusPercent: 0.4 }
  },
  {
    id: 'ai_neural_network_node_adv',
    name: 'Neural Network Node',
    description: 'A building block for complex neural networks. Boosts AI Research Lab income.',
    icon: BrainCircuit,
    tier: 2,
    recipe: [{ componentId: 'ai_logic_gate_simple', quantity: 3 }, { componentId: 'basic_circuit_board', quantity: 2 }],
    rawMaterialCost: 45,
    productionTimeSeconds: 80,
    requiredAssemblerMark: 2,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'ai_research_lab', percent: 0.001 }, maxBonusPercent: 3.6 }
  },
  {
    id: 'ai_self_learning_matrix_core',
    name: 'Self-Learning Matrix',
    description: 'An AI core capable of learning and adapting. Boosts Sentient AI Consultancy income.',
    icon: BotIcon,
    tier: 3,
    recipe: [{ componentId: 'ai_neural_network_node_adv', quantity: 2 }, { componentId: 'advanced_logic_chip', quantity: 1 }],
    rawMaterialCost: 100,
    productionTimeSeconds: 280,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'sentient_ai_consultancy', percent: 0.001 }, maxBonusPercent: 5.4 }
  },
  {
    id: 'ai_skynet_consciousness_core_adv',
    name: 'Skynet Consciousness Core',
    description: 'A highly advanced, potentially dangerous AI core. Boosts The Hegemon AI income.',
    icon: AlertTriangle, // Fallback for Skull
    tier: 4,
    recipe: [{ componentId: 'ai_self_learning_matrix_core', quantity: 2 }, { componentId: 'quantum_processor_unit', quantity: 1 }],
    rawMaterialCost: 220,
    productionTimeSeconds: 1000,
    requiredAssemblerMark: 4,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'galactic_governance_ai', percent: 0.001 }, maxBonusPercent: 6.6 }
  },
  {
    id: 'ai_universal_problem_solver_final',
    name: 'Universal Problem Solver AI',
    description: 'The ultimate AI, capable of solving any problem. Boosts The Omega Oracle income.',
    icon: KeyRound,
    tier: 5,
    recipe: [{ componentId: 'ai_skynet_consciousness_core_adv', quantity: 2 }, { componentId: 'singularity_engine_fragment_component_adv', quantity: 1 }],
    rawMaterialCost: 600,
    productionTimeSeconds: 4200,
    requiredAssemblerMark: 5,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'final_question_answering_service', percent: 0.001 }, maxBonusPercent: 8.4 }
  },

  // Family: Exotic Material Processors
  {
    id: 'material_basic_ore_crusher',
    name: 'Basic Ore Crusher',
    description: 'Crushes raw ore for initial processing. Slightly boosts factory material collection.',
    icon: Hammer,
    tier: 1,
    recipe: [],
    rawMaterialCost: 18,
    productionTimeSeconds: 28,
    requiredAssemblerMark: 1,
    effects: { factoryGlobalMaterialCollectionBoostPercent: 0.001, maxBonusPercent: 1.8 }
  },
  {
    id: 'material_magnetic_ore_separator_adv',
    name: 'Magnetic Ore Separator',
    description: 'Separates valuable metals from ore. Benefits Manufacturing businesses income.',
    icon: Magnet,
    tier: 2,
    recipe: [{ componentId: 'material_basic_ore_crusher', quantity: 3 }, { componentId: 'efficiency_coil', quantity: 2 }],
    rawMaterialCost: 50,
    productionTimeSeconds: 90,
    requiredAssemblerMark: 2,
    effects: { businessTypeIncomeBoostPercent: { businessType: 'MANUFACTURING', percent: 0.001 }, maxBonusPercent: 2.4 }
  },
  {
    id: 'material_plasma_isotope_refiner_pro',
    name: 'Plasma Isotope Refiner',
    description: 'Refines materials to specific isotopes. Boosts Fusion Power Plant income.',
    icon: AtomIcon,
    tier: 3,
    recipe: [{ componentId: 'material_magnetic_ore_separator_adv', quantity: 2 }, { componentId: 'power_regulator_mk2', quantity: 1 }],
    rawMaterialCost: 130,
    productionTimeSeconds: 330,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'fusion_power_plant', percent: 0.001 }, maxBonusPercent: 5 }
  },
  {
    id: 'material_dark_matter_stabilizer_xtreme',
    name: 'Dark Matter Stabilizer',
    description: 'Stabilizes exotic dark matter for research. Boosts Exotic Matter Research income.',
    icon: Orbit, // Fallback for CircleDotDashed
    tier: 4,
    recipe: [{ componentId: 'material_plasma_isotope_refiner_pro', quantity: 2 }, { componentId: 'perfect_resonance_gemstone_tuned', quantity: 1 }],
    rawMaterialCost: 280,
    productionTimeSeconds: 1100,
    requiredAssemblerMark: 4,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'exotic_matter_research', percent: 0.001 }, maxBonusPercent: 6 }
  },
  {
    id: 'material_chroniton_particle_agitator_ult',
    name: 'Chroniton Particle Agitator',
    description: 'Manipulates chroniton particles for temporal studies. Boosts Time-Space Manipulation Inc. income.',
    icon: Hourglass,
    tier: 5,
    recipe: [{ componentId: 'material_dark_matter_stabilizer_xtreme', quantity: 2 }, { componentId: 'tachyon_field_emitter_component', quantity: 1 }],
    rawMaterialCost: 650,
    productionTimeSeconds: 4500,
    requiredAssemblerMark: 5,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'time_space_manipulation_inc', percent: 0.001 }, maxBonusPercent: 7.2 }
  },

  // Family: Sensory Input Devices
  {
    id: 'sensory_basic_microphone_array',
    name: 'Basic Microphone Array',
    description: 'Captures audio input. Small boost to OmniMedia Group income.',
    icon: Mic,
    tier: 1,
    recipe: [],
    rawMaterialCost: 10,
    productionTimeSeconds: 20,
    requiredAssemblerMark: 1,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'omni_media_group', percent: 0.001 }, maxBonusPercent: 1.4 }
  },
  {
    id: 'sensory_olfactory_sensor_chip_adv',
    name: 'Olfactory Sensor Chip',
    description: 'Detects and analyzes smells. Boosts Artisan Bakery income.',
    icon: Wind, // Fallback for Nose
    tier: 2,
    recipe: [{ componentId: 'sensory_basic_microphone_array', quantity: 3 }, { componentId: 'basic_circuit_board', quantity: 1 }],
    rawMaterialCost: 35,
    productionTimeSeconds: 70,
    requiredAssemblerMark: 2,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'artisan_bakery', percent: 0.001 }, maxBonusPercent: 3.4 }
  },
  {
    id: 'sensory_tactile_feedback_glove_pro',
    name: 'Tactile Feedback Glove',
    description: 'Provides realistic touch sensations for VR. Boosts Elysian VR Realms income.',
    icon: Hand,
    tier: 3,
    recipe: [{ componentId: 'sensory_olfactory_sensor_chip_adv', quantity: 2 }, { componentId: 'advanced_logic_chip', quantity: 1 }],
    rawMaterialCost: 80,
    productionTimeSeconds: 260,
    requiredAssemblerMark: 3,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'virtual_reality_worlds', percent: 0.001 }, maxBonusPercent: 4.2 }
  },
  {
    id: 'sensory_advanced_bio_scanner_xtreme',
    name: 'Advanced Bio-Scanner',
    description: 'Detailed biological scanning for genetic work. Boosts BioSynth Creations income.',
    icon: ScanSearch,
    tier: 4,
    recipe: [{ componentId: 'sensory_tactile_feedback_glove_pro', quantity: 2 }, { componentId: 'genetic_sequencer_chip_adv', quantity: 1 }],
    rawMaterialCost: 200,
    productionTimeSeconds: 950,
    requiredAssemblerMark: 4,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'custom_genome_design', percent: 0.001 }, maxBonusPercent: 5.8 }
  },
  {
    id: 'sensory_omni_spectrum_analyzer_ult',
    name: 'Omni-Spectrum Analyzer',
    description: 'Analyzes data across all known spectrums. Boosts XenoChronos Archives income.',
    icon: SearchCode,
    tier: 5,
    recipe: [{ componentId: 'sensory_advanced_bio_scanner_xtreme', quantity: 2 }, { componentId: 'deep_space_observatory_lens_pro', quantity: 1 }],
    rawMaterialCost: 550,
    productionTimeSeconds: 4000,
    requiredAssemblerMark: 5,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'galactic_archaeology_guild', percent: 0.001 }, maxBonusPercent: 7.4 }
  },

  // Unique Components for High-Tier Businesses (Phase 6)
  {
    id: 'transdimensional_navigation_chart_unique',
    name: 'Transdimensional Navigation Chart',
    description: 'Essential for plotting routes through alternate dimensions. Boosts SlipStream Couriers income.',
    icon: MapPinned,
    tier: 5,
    recipe: [{ componentId: 'hyperspace_lane_charter_component', quantity: 2 }, { componentId: 'reality_distortion_lens_component', quantity: 1 }],
    rawMaterialCost: 750,
    productionTimeSeconds: 4800,
    requiredAssemblerMark: 5,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'transdimensional_shipping', percent: 0.001 }, maxBonusPercent: 7.2 }
  },
  {
    id: 'universal_diplomatic_seal_unique',
    name: 'Universal Diplomatic Seal',
    description: 'A recognized symbol of galactic diplomacy. Reduces United Galactic Concourse upgrade costs.',
    icon: Stamp,
    tier: 5,
    recipe: [{ componentId: 'babel_link_universal_linguistic_matrix_prime', quantity: 1 }, { componentId: 'perfect_resonance_gemstone_tuned', quantity: 1 }],
    rawMaterialCost: 700,
    productionTimeSeconds: 4600,
    requiredAssemblerMark: 5,
    effects: { businessSpecificUpgradeCostReductionPercent: { businessId: 'galactic_federation_embassy', percent: 0.001 }, maxBonusPercent: 3.6 }
  },
  {
    id: 'quantum_entangled_ledger_unique',
    name: 'Quantum Entangled Ledger',
    description: 'Securely links financial data across dimensions. Boosts Omega Corp stock dividend yield.',
    icon: BookLock,
    tier: 5,
    recipe: [{ componentId: 'galactic_exchange_quantum_ledger_processor', quantity: 1 }, { componentId: 'quantum_entanglement_communicator_prototype', quantity: 1 }],
    rawMaterialCost: 780,
    productionTimeSeconds: 4900,
    requiredAssemblerMark: 5,
    effects: { stockSpecificDividendYieldBoostPercent: { stockId: 'omega_corp', percent: 0.001 }, maxBonusPercent: 0.5 }
  },
  {
    id: 'philosophers_catalyst_stone_unique',
    name: 'Philosopher\'s Catalyst Stone',
    description: 'The ultimate catalyst for alchemical processes. Boosts Aurum Alchemica income.',
    icon: Gem,
    tier: 5,
    recipe: [{ componentId: 'aurum_alchemica_transmutation_catalyst_omega', quantity: 1 }, { componentId: 'focused_energy_crystal_refined', quantity: 2 }],
    rawMaterialCost: 900, // High cost to reflect Omega
    productionTimeSeconds: 5200,
    requiredAssemblerMark: 5,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'philosopher_stone_fabricators', percent: 0.001 }, maxBonusPercent: 8.4 }
  },
  {
    id: 'holocron_of_knowledge_unique',
    name: 'Holocron of Knowledge',
    description: 'A repository of immense galactic wisdom. Slightly boosts manual RP generation.',
    icon: Library,
    tier: 5,
    recipe: [{ componentId: 'akashic_record_data_compression_singularity', quantity: 1 }, { componentId: 'holographic_data_crystal', quantity: 2 }],
    rawMaterialCost: 850,
    productionTimeSeconds: 5100,
    requiredAssemblerMark: 5,
    effects: { factoryManualRPGenerationBoost: 0.005, maxBonusPercent: 1.2 }
  },
  {
    id: 'adaptive_cybernetic_core_unique',
    name: 'Adaptive Cybernetic Core',
    description: 'The heart of advanced cybernetic enhancements. Boosts CyberEvolve Augments income.',
    icon: MemoryStick, // Replaced Chip
    tier: 5,
    recipe: [{ componentId: 'cyberevolve_augments_sentient_nanite_cluster_node', quantity: 1 }, { componentId: 'cognitive_matrix_core_adv', quantity: 1 }],
    rawMaterialCost: 880,
    productionTimeSeconds: 5300,
    requiredAssemblerMark: 5,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'bio_cybernetic_enhancements', percent: 0.001 }, maxBonusPercent: 7.8 }
  },
  {
    id: 'planetary_resonance_tuner_unique',
    name: 'Planetary Resonance Tuner',
    description: 'Fine-tunes planetary energies for weather control. Reduces AtmoSphere Dynamics upgrade costs.',
    icon: Gauge,
    tier: 5,
    recipe: [{ componentId: 'atmosphere_dynamics_planetary_weather_core_stabilizer', quantity: 1 }, { componentId: 'perfect_resonance_gemstone_tuned', quantity: 1 }],
    rawMaterialCost: 760,
    productionTimeSeconds: 4800,
    requiredAssemblerMark: 5,
    effects: { businessSpecificUpgradeCostReductionPercent: { businessId: 'weather_control_systems', percent: 0.001 }, maxBonusPercent: 4.2 }
  },
  {
    id: 'collective_unconscious_link_unique',
    name: 'Collective Unconscious Link',
    description: 'Deepens the connection within a planetary mind. Boosts Gaia Mind Initiatives income.',
    icon: UserCog,
    tier: 5,
    recipe: [{ componentId: 'gaia_mind_initiatives_noospheric_harmonizer_node', quantity: 1 }, { componentId: 'noosphere_collective_psionic_focus_crystal_pure', quantity: 1 }],
    rawMaterialCost: 920,
    productionTimeSeconds: 5600,
    requiredAssemblerMark: 5,
    effects: { businessSpecificIncomeBoostPercent: { businessId: 'sentient_planetary_networks', percent: 0.001 }, maxBonusPercent: 8.2 }
  },
  {
    id: 'universal_assembly_ai_core_factory_wide',
    name: 'Factory Assembly AI Core',
    description: 'An AI core dedicated to optimizing all factory production speeds slightly.',
    icon: BoxIcon,
    tier: 5,
    recipe: [{ componentId: 'cognitive_matrix_core_adv', quantity: 2 }, { componentId: 'master_craftsman_calibration_tools', quantity: 1 }],
    rawMaterialCost: 700,
    productionTimeSeconds: 4800,
    requiredAssemblerMark: 5,
    effects: { factoryGlobalProductionSpeedModifier: 1.01, maxBonusPercent: 6 } // 1% speed boost
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
