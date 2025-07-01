
import type { QuarryUpgrade } from '@/types';
import { Shovel, Pickaxe, HardHat, Bot, BatteryCharging } from 'lucide-react';

export const INITIAL_QUARRY_UPGRADES: QuarryUpgrade[] = [
  {
    id: 'reinforced_shovel',
    name: 'Reinforced Shovel',
    description: 'A stronger shovel that digs twice as much.',
    cost: 50,
    icon: Shovel,
    effects: {
      digPower: 1,
    },
  },
  {
    id: 'steel_pickaxe',
    name: 'Steel Pickaxe',
    description: 'A sturdy pickaxe for tougher ground. Digs an additional 4cm.',
    cost: 250,
    icon: Pickaxe,
    effects: {
      digPower: 4,
    },
  },
  {
    id: 'mining_helmet',
    name: 'Mining Helmet',
    description: 'Better lighting helps find weak spots. Digs an additional 10cm.',
    cost: 1000,
    icon: HardHat,
    effects: {
      digPower: 10,
    },
  },
  {
    id: 'automated_cart_mk1',
    name: 'Automated Cart Mk1',
    description: 'A small automated cart that digs 0.1cm/s on its own.',
    cost: 5000,
    icon: Bot,
    effects: {
      automationRate: 0.1,
    },
  },
  {
    id: 'energy_cooler',
    name: 'Energy Drink Cooler',
    description: '+25 Maximum Digging Energy.',
    cost: 750,
    icon: BatteryCharging,
    effects: {
      increaseMaxEnergy: 25,
    },
  },
  {
    id: 'snack_bar',
    name: 'Snack Bar',
    description: '+25 Maximum Digging Energy (Total +50).',
    cost: 2000,
    icon: BatteryCharging,
    effects: {
      increaseMaxEnergy: 25,
    },
  },
  {
    id: 'nap_pod',
    name: 'Nap Pod',
    description: '+25 Maximum Digging Energy (Total +75).',
    cost: 8000,
    icon: BatteryCharging,
    effects: {
      increaseMaxEnergy: 25,
    },
  },
];
