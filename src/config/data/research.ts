
import type { ResearchItemConfig } from '@/types';
import { Wrench, Drill, FlaskConical, PackagePlus, SlidersHorizontal, LayoutGrid, Settings, HardHat, Factory as FactoryIcon, PackageCheck, PackageSearch, Pickaxe, Mountain, Satellite, CloudCog, TrendingUp } from 'lucide-react';

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
];
