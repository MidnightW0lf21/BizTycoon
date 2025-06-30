
import type { QuarryUpgrade } from '@/types';

export const INITIAL_QUARRY_UPGRADES: QuarryUpgrade[] = [
  {
    id: 'reinforced_shovel',
    name: 'Reinforced Shovel',
    description: 'A stronger shovel that digs twice as much.',
    cost: 50,
    effects: {
      digPower: 1,
    },
  },
  {
    id: 'steel_pickaxe',
    name: 'Steel Pickaxe',
    description: 'A sturdy pickaxe for tougher ground. Digs an additional 4cm.',
    cost: 250,
    effects: {
      digPower: 4,
    },
  },
  {
    id: 'mining_helmet',
    name: 'Mining Helmet',
    description: 'Better lighting helps find weak spots. Digs an additional 10cm.',
    cost: 1000,
    effects: {
      digPower: 10,
    },
  },
  {
    id: 'automated_cart_mk1',
    name: 'Automated Cart Mk1',
    description: 'A small automated cart that digs 0.1cm/s on its own.',
    cost: 5000,
    effects: {
      automationRate: 0.1,
    },
  },
];
