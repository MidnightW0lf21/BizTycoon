
import type { ResearchItemConfig } from '@/types';
import { Wrench, Drill, FlaskConical, PackagePlus, SlidersHorizontal, LayoutGrid, Settings, HardHat, Factory as FactoryIcon, PackageCheck, PackageSearch, Pickaxe, Mountain, Satellite, CloudCog, TrendingUp, Sun, Waves, Zap, AtomIcon, InfinityIcon, Users, Archive } from 'lucide-react';

export const INITIAL_RESEARCH_ITEMS_CONFIG: ResearchItemConfig[] = [
  // Assembler Unlocks
  {
    id: 'unlock_basic_assembler_mk1',
    name: 'Basic Assembly Automation',
    description: 'Unlocks the Basic Assembler Mk1 for component production.',
    icon: Wrench,
    costRP: 10,
    costMoney: 50000,
    effects: { unlocksFactoryMachineConfigIds: ['basic_assembler_mk1'] }
  },
  {
    id: 'unlock_basic_assembler_mk2',
    name: 'Improved Assembly Lines',
    description: 'Unlocks the Basic Assembler Mk2, allowing for more complex component production.',
    icon: Drill,
    costRP: 30,
    costMoney: 150000,
    dependencies: ['unlock_basic_assembler_mk1'],
    effects: { unlocksFactoryMachineConfigIds: ['basic_assembler_mk2'] }
  },
  {
    id: 'unlock_basic_assembler_mk3',
    name: 'Advanced Assembly Processes',
    description: 'Unlocks the Basic Assembler Mk3 for Tier 3 component production.',
    icon: Settings,
    costRP: 100,
    costMoney: 500000,
    dependencies: ['unlock_basic_assembler_mk2'],
    effects: { unlocksFactoryMachineConfigIds: ['basic_assembler_mk3'] }
  },
  {
    id: 'unlock_basic_assembler_mk4',
    name: 'Modular Manufacturing Systems',
    description: 'Unlocks the Basic Assembler Mk4, enabling Tier 4 component manufacturing.',
    icon: HardHat,
    costRP: 250,
    costMoney: 1500000,
    dependencies: ['unlock_basic_assembler_mk3'],
    effects: { unlocksFactoryMachineConfigIds: ['basic_assembler_mk4'] }
  },
  {
    id: 'unlock_basic_assembler_mk5',
    name: 'Automated Production Matrix',
    description: 'Unlocks the Basic Assembler Mk5, the apex of basic assembly for Tier 5 components.',
    icon: FactoryIcon,
    costRP: 500,
    costMoney: 4000000,
    dependencies: ['unlock_basic_assembler_mk4'],
    effects: { unlocksFactoryMachineConfigIds: ['basic_assembler_mk5'] }
  },

  // Assembler Specific Upgrade Unlocks
  {
    id: 'unlock_mk1_motor_efficiency_research',
    name: 'Mk1 Motor Efficiency Study',
    description: 'Unlocks the "Efficient Motor" upgrade for Basic Assembler Mk1 machines, reducing their power consumption.',
    icon: Zap,
    costRP: 10,
    costMoney: 25000,
    dependencies: ['unlock_basic_assembler_mk1'],
    effects: {}
  },
  {
    id: 'unlock_mk2_circuitry_research',
    name: 'Mk2 Circuitry Efficiency',
    description: 'Unlocks the "Optimized Circuitry" upgrade for Basic Assembler Mk2 machines.',
    icon: Zap,
    costRP: 20,
    costMoney: 75000,
    dependencies: ['unlock_basic_assembler_mk2'],
    effects: {}
  },
  {
    id: 'unlock_mk3_cryo_core_research',
    name: 'Mk3 Cryo-Cooling Tech',
    description: 'Unlocks the "Cryo-Cooled Core" upgrade for Basic Assembler Mk3 machines.',
    icon: Zap,
    costRP: 40,
    costMoney: 150000,
    dependencies: ['unlock_basic_assembler_mk3'],
    effects: {}
  },
  {
    id: 'unlock_mk4_fusion_cell_research',
    name: 'Mk4 Micro Fusion Power',
    description: 'Unlocks the "Micro Fusion Cell" upgrade for Basic Assembler Mk4 machines.',
    icon: AtomIcon,
    costRP: 100,
    costMoney: 500000,
    dependencies: ['unlock_basic_assembler_mk4'],
    effects: {}
  },
  {
    id: 'unlock_mk5_zpm_research',
    name: 'Mk5 Zero-Point Energy',
    description: 'Unlocks the "Zero-Point Module" upgrade for Basic Assembler Mk5 machines.',
    icon: InfinityIcon,
    costRP: 200,
    costMoney: 1000000,
    dependencies: ['unlock_basic_assembler_mk5'],
    effects: {}
  },

  // Production Line Unlocks
  {
    id: 'unlock_prod_line_2',
    name: 'Expand Factory Floor I',
    description: 'Unlocks Production Line 2, increasing your factory\'s parallel processing capabilities.',
    icon: PackagePlus,
    costRP: 50,
    costMoney: 200000,
    dependencies: ['unlock_basic_assembler_mk1'],
    effects: { unlocksProductionLineId: 'line_2' }
  },
  {
    id: 'unlock_prod_line_3',
    name: 'Factory Logistics II',
    description: 'Further expands operations by unlocking Production Line 3.',
    icon: PackagePlus,
    costRP: 100,
    costMoney: 500000,
    dependencies: ['unlock_prod_line_2', 'unlock_basic_assembler_mk2'],
    effects: { unlocksProductionLineId: 'line_3' }
  },
  {
    id: 'unlock_prod_line_4',
    name: 'Advanced Factory Layout',
    description: 'Optimizes factory space to unlock Production Line 4.',
    icon: LayoutGrid,
    costRP: 250,
    costMoney: 1200000,
    dependencies: ['unlock_prod_line_3', 'unlock_basic_assembler_mk3'],
    effects: { unlocksProductionLineId: 'line_4' }
  },
  {
    id: 'unlock_prod_line_5',
    name: 'Maximum Production Capacity',
    description: 'Pushes factory limits to unlock the final Production Line 5.',
    icon: LayoutGrid,
    costRP: 500,
    costMoney: 3000000,
    dependencies: ['unlock_prod_line_4', 'unlock_basic_assembler_mk4'],
    effects: { unlocksProductionLineId: 'line_5' }
  },

  // Material Collector Unlocks
  {
    id: 'unlock_drone_swarm_mk1',
    name: 'Basic Drone Logistics',
    description: 'Unlocks the Drone Swarm Mk1 for automated material collection.',
    icon: PackageSearch,
    costRP: 20,
    costMoney: 75000,
    dependencies: ['unlock_basic_assembler_mk1'],
    effects: { unlocksFactoryMaterialCollectorConfigIds: ['drone_swarm_mk1'] }
  },
  {
    id: 'unlock_drone_swarm_mk2',
    name: 'Advanced Drone Coordination',
    description: 'Unlocks the Heavy Drone Swarm Mk2 for superior material collection.',
    icon: PackagePlus,
    costRP: 60,
    costMoney: 250000,
    dependencies: ['unlock_drone_swarm_mk1'],
    effects: { unlocksFactoryMaterialCollectorConfigIds: ['drone_swarm_mk2'] }
  },
  {
    id: 'unlock_mining_rig_mk1',
    name: 'Automated Excavation Tech',
    description: 'Unlocks the Automated Mining Rig Mk1 for ground-based extraction.',
    icon: Pickaxe,
    costRP: 120,
    costMoney: 600000,
    dependencies: ['unlock_basic_assembler_mk2'],
    effects: { unlocksFactoryMaterialCollectorConfigIds: ['mining_rig_mk1'] }
  },
  {
    id: 'unlock_mining_rig_mk2',
    name: 'Enhanced Mining Operations',
    description: 'Unlocks the Automated Mining Rig Mk2 for deeper and faster extraction.',
    icon: Mountain,
    costRP: 200,
    costMoney: 1500000,
    dependencies: ['unlock_mining_rig_mk1'],
    effects: { unlocksFactoryMaterialCollectorConfigIds: ['mining_rig_mk2'] }
  },
  {
    id: 'unlock_orbital_debris_collector',
    name: 'Orbital Collection Systems',
    description: 'Unlocks the Orbital Debris Collector for space-based material gathering.',
    icon: Satellite,
    costRP: 350,
    costMoney: 3000000,
    dependencies: ['unlock_drone_swarm_mk2', 'unlock_basic_assembler_mk3'],
    effects: { unlocksFactoryMaterialCollectorConfigIds: ['orbital_debris_collector'] }
  },
  {
    id: 'unlock_nanite_harvester_swarm',
    name: 'Nanite Deconstruction',
    description: 'Unlocks the Nanite Harvester Swarm for advanced ambient matter conversion.',
    icon: CloudCog,
    costRP: 600,
    costMoney: 6000000,
    dependencies: ['unlock_orbital_debris_collector', 'unlock_basic_assembler_mk4'],
    effects: { unlocksFactoryMaterialCollectorConfigIds: ['nanite_harvester_swarm'] }
  },

  // Material Collector Boosts
  {
    id: 'boost_drone_swarm_mk1',
    name: 'Drone Swarm Mk1 Efficiency',
    description: 'Boosts Drone Swarm Mk1 material collection rate by 50%.',
    icon: PackageSearch,
    costRP: 40,
    costMoney: 100000,
    dependencies: ['unlock_drone_swarm_mk1'],
    effects: { factoryMaterialCollectorBoost: { collectorConfigId: 'drone_swarm_mk1', materialsPerSecondBoostPercent: 50 } }
  },
  {
    id: 'boost_drone_swarm_mk2',
    name: 'Drone Swarm Mk2 Optimization',
    description: 'Boosts Heavy Drone Swarm Mk2 material collection rate by 50%.',
    icon: PackagePlus,
    costRP: 80,
    costMoney: 300000,
    dependencies: ['unlock_drone_swarm_mk2'],
    effects: { factoryMaterialCollectorBoost: { collectorConfigId: 'drone_swarm_mk2', materialsPerSecondBoostPercent: 50 } }
  },
  {
    id: 'boost_mining_rig_mk1',
    name: 'Mining Rig Mk1 Augmentation',
    description: 'Boosts Mining Rig Mk1 material collection rate by 50%.',
    icon: Pickaxe,
    costRP: 150,
    costMoney: 700000,
    dependencies: ['unlock_mining_rig_mk1'],
    effects: { factoryMaterialCollectorBoost: { collectorConfigId: 'mining_rig_mk1', materialsPerSecondBoostPercent: 50 } }
  },
  {
    id: 'boost_mining_rig_mk2',
    name: 'Mining Rig Mk2 Overclock',
    description: 'Boosts Mining Rig Mk2 material collection rate by 50%.',
    icon: Mountain,
    costRP: 250,
    costMoney: 1800000,
    dependencies: ['unlock_mining_rig_mk2'],
    effects: { factoryMaterialCollectorBoost: { collectorConfigId: 'mining_rig_mk2', materialsPerSecondBoostPercent: 50 } }
  },
  {
    id: 'boost_orbital_debris_collector',
    name: 'Orbital Collector Targeting AI',
    description: 'Boosts Orbital Debris Collector material collection rate by 50%.',
    icon: Satellite,
    costRP: 400,
    costMoney: 3500000,
    dependencies: ['unlock_orbital_debris_collector'],
    effects: { factoryMaterialCollectorBoost: { collectorConfigId: 'orbital_debris_collector', materialsPerSecondBoostPercent: 50 } }
  },
  {
    id: 'boost_nanite_harvester_swarm',
    name: 'Nanite Swarm Coordination',
    description: 'Boosts Nanite Harvester Swarm material collection rate by 50%.',
    icon: CloudCog,
    costRP: 700,
    costMoney: 7000000,
    dependencies: ['unlock_nanite_harvester_swarm'],
    effects: { factoryMaterialCollectorBoost: { collectorConfigId: 'nanite_harvester_swarm', materialsPerSecondBoostPercent: 50 } }
  },

  // Power Building Unlocks
  {
    id: 'unlock_solar_mk1',
    name: 'Basic Solar Power',
    description: 'Unlocks Solar Panel Array Mk1 for basic power generation.',
    icon: Sun,
    costRP: 15,
    costMoney: 40000,
    effects: { unlocksFactoryPowerBuildingConfigIds: ['solar_panels_mk1'] }
  },
  {
    id: 'unlock_solar_mk2',
    name: 'Advanced Solar Tech',
    description: 'Unlocks the more efficient Solar Panel Array Mk2.',
    icon: Sun,
    costRP: 50,
    costMoney: 180000,
    dependencies: ['unlock_solar_mk1'],
    effects: { unlocksFactoryPowerBuildingConfigIds: ['solar_panels_mk2'] }
  },
  {
    id: 'unlock_hydro_dam_small',
    name: 'Hydroelectric Engineering',
    description: 'Unlocks the Small Hydro Dam for consistent power.',
    icon: Waves,
    costRP: 80,
    costMoney: 220000,
    dependencies: ['unlock_solar_mk1'],
    effects: { unlocksFactoryPowerBuildingConfigIds: ['hydro_dam_small'] }
  },
  {
    id: 'unlock_diesel_generator_basic',
    name: 'Combustion Power Systems',
    description: 'Unlocks the Backup Diesel Generator for reliable power.',
    icon: Zap,
    costRP: 40,
    costMoney: 120000,
    effects: { unlocksFactoryPowerBuildingConfigIds: ['diesel_generator_basic'] }
  },
  {
    id: 'unlock_geothermal_plant_mk1',
    name: 'Geothermal Energy Extraction',
    description: 'Unlocks the Geothermal Plant Mk1, tapping into Earth\'s heat.',
    icon: TrendingUp,
    costRP: 150,
    costMoney: 450000,
    dependencies: ['unlock_hydro_dam_small'],
    effects: { unlocksFactoryPowerBuildingConfigIds: ['geothermal_plant_mk1'] }
  },

  // Power Building Boosts (+50%)
  {
    id: 'boost_solar_mk1',
    name: 'Solar Panel Mk1 Calibration',
    description: 'Increases Solar Panel Mk1 power output by 50%.',
    icon: Sun,
    costRP: 30,
    costMoney: 80000,
    dependencies: ['unlock_solar_mk1'],
    effects: { factoryPowerBuildingBoost: { buildingConfigId: 'solar_panels_mk1', powerOutputBoostPercent: 50 } }
  },
  {
    id: 'boost_solar_mk2',
    name: 'Solar Panel Mk2 Enhancement',
    description: 'Increases Solar Panel Mk2 power output by 50%.',
    icon: Sun,
    costRP: 75,
    costMoney: 250000,
    dependencies: ['unlock_solar_mk2'],
    effects: { factoryPowerBuildingBoost: { buildingConfigId: 'solar_panels_mk2', powerOutputBoostPercent: 50 } }
  },
  {
    id: 'boost_hydro_dam_small',
    name: 'Hydro Dam Turbine Upgrade',
    description: 'Increases Small Hydro Dam power output by 50%.',
    icon: Waves,
    costRP: 120,
    costMoney: 300000,
    dependencies: ['unlock_hydro_dam_small'],
    effects: { factoryPowerBuildingBoost: { buildingConfigId: 'hydro_dam_small', powerOutputBoostPercent: 50 } }
  },
  {
    id: 'boost_diesel_generator_basic',
    name: 'Diesel Generator Overclock',
    description: 'Increases Backup Diesel Generator power output by 50%.',
    icon: Zap,
    costRP: 60,
    costMoney: 200000,
    dependencies: ['unlock_diesel_generator_basic'],
    effects: { factoryPowerBuildingBoost: { buildingConfigId: 'diesel_generator_basic', powerOutputBoostPercent: 50 } }
  },
  {
    id: 'boost_geothermal_plant_mk1',
    name: 'Geothermal Plant Deep Drill',
    description: 'Increases Geothermal Plant Mk1 power output by 50%.',
    icon: TrendingUp,
    costRP: 200,
    costMoney: 600000,
    dependencies: ['unlock_geothermal_plant_mk1'],
    effects: { factoryPowerBuildingBoost: { buildingConfigId: 'geothermal_plant_mk1', powerOutputBoostPercent: 50 } }
  },

  // Worker Energy Upgrades
  {
    id: 'worker_stamina_1',
    name: 'Stamina Training I',
    description: 'Increase max worker energy to 1 hour (from 30 min).',
    icon: Users,
    costRP: 20,
    costMoney: 100000,
    dependencies: ['unlock_basic_assembler_mk1'], // Base requirement to have workers be useful
    effects: { upgradesWorkerEnergyTier: true }
  },
  {
    id: 'worker_stamina_2',
    name: 'Stamina Training II',
    description: 'Increase max worker energy to 2 hours.',
    icon: Users,
    costRP: 50,
    costMoney: 300000,
    dependencies: ['worker_stamina_1'],
    effects: { upgradesWorkerEnergyTier: true }
  },
  {
    id: 'worker_stamina_3',
    name: 'Advanced Stamina Regimen',
    description: 'Increase max worker energy to 4 hours.',
    icon: Users,
    costRP: 120,
    costMoney: 800000,
    dependencies: ['worker_stamina_2'],
    effects: { upgradesWorkerEnergyTier: true }
  },
  {
    id: 'worker_stamina_4',
    name: 'Peak Physical Conditioning',
    description: 'Increase max worker energy to 8 hours.',
    icon: Users,
    costRP: 250,
    costMoney: 2000000,
    dependencies: ['worker_stamina_3'],
    effects: { upgradesWorkerEnergyTier: true }
  },
  {
    id: 'worker_stamina_5',
    name: 'Bio-Enhanced Endurance',
    description: 'Increase max worker energy to 12 hours.',
    icon: Users,
    costRP: 500,
    costMoney: 5000000,
    dependencies: ['worker_stamina_4'],
    effects: { upgradesWorkerEnergyTier: true }
  },

  // Manual RP Generation Boosts
  {
    id: 'manual_rp_boost_1',
    name: 'Research Focus I',
    description: 'Increases manual RP generation by +1 (Total 2 RP per click).',
    icon: FlaskConical,
    costRP: 10,
    costMoney: 20000,
    effects: { increaseManualResearchBonus: 1 }
  },
  {
    id: 'manual_rp_boost_2',
    name: 'Research Focus II',
    description: 'Increases manual RP generation by another +1 (Total 3 RP per click).',
    icon: FlaskConical,
    costRP: 20, // 10 + 10
    costMoney: 300000, // 20000 * 15
    dependencies: ['manual_rp_boost_1'],
    effects: { increaseManualResearchBonus: 1 }
  },
  {
    id: 'manual_rp_boost_3',
    name: 'Research Focus III',
    description: 'Increases manual RP generation by another +1 (Total 4 RP per click).',
    icon: FlaskConical,
    costRP: 30, // 20 + 10
    costMoney: 4500000, // 300000 * 15
    dependencies: ['manual_rp_boost_2'],
    effects: { increaseManualResearchBonus: 1 }
  },
  {
    id: 'manual_rp_boost_4',
    name: 'Research Focus IV',
    description: 'Increases manual RP generation by another +1 (Total 5 RP per click).',
    icon: FlaskConical,
    costRP: 40, // 30 + 10
    costMoney: 67500000, // 4500000 * 15
    dependencies: ['manual_rp_boost_3'],
    effects: { increaseManualResearchBonus: 1 }
  },
  {
    id: 'manual_rp_boost_5',
    name: 'Research Mastery',
    description: 'Increases manual RP generation by another +1 (Total 6 RP per click).',
    icon: FlaskConical,
    costRP: 50, // 40 + 10
    costMoney: 1012500000, // 67500000 * 15
    dependencies: ['manual_rp_boost_4'],
    effects: { increaseManualResearchBonus: 1 }
  },
  
  // Material Cap Upgrades
  {
    id: 'material_storage_1',
    name: 'Expanded Warehouse I',
    description: 'Increases raw material storage capacity to 1,000.',
    icon: Archive,
    costRP: 30,
    costMoney: 100000,
    dependencies: ['unlock_drone_swarm_mk1'],
    effects: { increaseFactoryRawMaterialsCap: 1000 }
  },
  {
    id: 'material_storage_2',
    name: 'Large-Scale Storage II',
    description: 'Increases raw material storage capacity to 5,000.',
    icon: Archive,
    costRP: 80,
    costMoney: 500000,
    dependencies: ['material_storage_1'],
    effects: { increaseFactoryRawMaterialsCap: 5000 }
  },
  {
    id: 'material_storage_3',
    name: 'Logistics Center III',
    description: 'Increases raw material storage capacity to 10,000.',
    icon: Archive,
    costRP: 150,
    costMoney: 1200000,
    dependencies: ['material_storage_2'],
    effects: { increaseFactoryRawMaterialsCap: 10000 }
  },
  {
    id: 'material_storage_4',
    name: 'Bulk Material Depot IV',
    description: 'Increases raw material storage capacity to 15,000.',
    icon: Archive,
    costRP: 300,
    costMoney: 3000000,
    dependencies: ['material_storage_3'],
    effects: { increaseFactoryRawMaterialsCap: 15000 }
  },
  {
    id: 'material_storage_5',
    name: 'Strategic Resource Silo V',
    description: 'Increases raw material storage capacity to 25,000.',
    icon: Archive,
    costRP: 500,
    costMoney: 7500000,
    dependencies: ['material_storage_4'],
    effects: { increaseFactoryRawMaterialsCap: 25000 }
  }
];
