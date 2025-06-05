
import type { ResearchItemConfig } from '@/types';
import { Wrench, Drill, FlaskConical, PackagePlus, SlidersHorizontal, LayoutGrid } from 'lucide-react'; // Added PackagePlus, SlidersHorizontal, LayoutGrid

export const INITIAL_RESEARCH_ITEMS_CONFIG: ResearchItemConfig[] = [
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
    dependencies: ['unlock_prod_line_3'],
    effects: { unlocksProductionLineId: 'line_4' }
  },
  {
    id: 'unlock_prod_line_5',
    name: 'Maximum Production Capacity',
    description: 'Pushes factory limits to unlock the final Production Line 5.',
    icon: LayoutGrid,
    costRP: 500,
    costMoney: 3000000,
    dependencies: ['unlock_prod_line_4'],
    effects: { unlocksProductionLineId: 'line_5' }
  }
];
