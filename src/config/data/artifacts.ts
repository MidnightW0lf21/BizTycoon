
import type { Artifact } from '@/types';
import { Gem, Compass, BookOpen, Scaling, PiggyBank, Factory, Mountain } from 'lucide-react';

export const INITIAL_ARTIFACTS: Artifact[] = [
  {
    id: 'ancient_coin',
    name: 'Ancient Coin',
    description: 'A worn coin from a forgotten empire. Its residual luck grants a +1% global income boost.',
    icon: Gem,
    effects: { globalIncomeBoostPercent: 1 },
  },
  {
    id: 'master_blueprint',
    name: 'Master Blueprint',
    description: 'A complex schematic that reveals subtle efficiencies. Reduces all business level-up costs by 0.5%.',
    icon: Compass,
    effects: { globalCostReductionPercent: 0.5 },
  },
  {
    id: 'geode_of_plenty',
    name: 'Geode of Plenty',
    description: 'This crystal seems to attract resources. Increases manual material collection amount by 10.',
    icon: Mountain,
    effects: { increaseManualMaterialCollection: 10 },
  },
  {
    id: 'perpetual_motion_gear',
    name: 'Perpetual Motion Gear',
    description: 'A feat of impossible engineering that hums with energy. Increases factory power generation by 2%.',
    icon: Factory,
    effects: { factoryPowerGenerationBoostPercent: 2 },
  },
  {
    id: 'worn_ledger',
    name: 'The First Tycoon\'s Ledger',
    description: 'The financial records of a legendary entrepreneur. Provides an extra $25,000 starting cash after prestige.',
    icon: BookOpen,
    effects: { increaseStartingMoney: 25000 },
  },
  {
    id: 'investors_manual',
    name: 'Investor\'s Manual',
    description: 'A guide to shrewd investments, bound in worn leather. Increases global dividend yield by 5%.',
    icon: Scaling,
    effects: { globalDividendYieldBoostPercent: 5 },
  },
  {
    id: 'bottomless_piggy_bank',
    name: 'Bottomless Piggy Bank',
    description: 'It feels heavier than it should. A mysterious aura provides a permanent +1% to all income.',
    icon: PiggyBank,
    effects: { globalIncomeBoostPercent: 1 },
  },
];
