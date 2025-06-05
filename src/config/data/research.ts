
import type { ResearchItemConfig } from '@/types';
import { Wrench, Drill, FlaskConical } from 'lucide-react'; // Added Drill

export const INITIAL_RESEARCH_ITEMS_CONFIG: ResearchItemConfig[] = [
  {
    id: 'unlock_basic_assembler_mk1',
    name: 'Basic Assembly Automation',
    description: 'Unlocks the Basic Assembler Mk1 for component production.',
    icon: Wrench,
    costRP: 10,
    costMoney: 50000,
    requiredPrestigeLevelForHQ: 0,
    effects: { unlocksFactoryMachineConfigIds: ['basic_assembler_mk1'] }
  },
  {
    id: 'unlock_basic_assembler_mk2',
    name: 'Improved Assembly Lines',
    description: 'Unlocks the Basic Assembler Mk2, allowing for more complex component production.',
    icon: Drill, // Using Drill icon
    costRP: 30,
    costMoney: 150000,
    requiredPrestigeLevelForHQ: 0,
    dependencies: ['unlock_basic_assembler_mk1'],
    effects: { unlocksFactoryMachineConfigIds: ['basic_assembler_mk2'] }
  }
  // Example for a future research item
  // {
  //   id: 'advanced_component_synthesis',
  //   name: 'Advanced Component Synthesis',
  //   description: 'Unlocks the ability to craft Tier 2 components like Advanced Gears.',
  //   icon: FlaskConical,
  //   costRP: 50,
  //   costMoney: 200000,
  //   requiredPrestigeLevelForHQ: 0,
  //   dependencies: ['unlock_basic_assembler_mk1'],
  //   effects: { unlocksFactoryComponentConfigIds: ['advanced_gear'] } // Or unlocks a new assembler
  // }
];
