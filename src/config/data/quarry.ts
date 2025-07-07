
import type { QuarryUpgrade } from '@/types';
import { Shovel, Pickaxe, HardHat, Bot, BatteryCharging, GitMerge as GitMergeIcon, Eye, Waves } from 'lucide-react';

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
    description: 'A small automated cart that digs 0.01cm/s on its own.',
    cost: 2500,
    icon: Bot,
    effects: {
      automationRate: 0.01,
    },
  },
  {
    id: 'automated_cart_mk2',
    name: 'Automated Cart Mk2',
    description: 'A more advanced cart that adds another 0.4cm/s of digging speed.',
    cost: 25000,
    icon: Bot,
    effects: {
      automationRate: 0.4,
    },
  },
  {
    id: 'automated_cart_mk3',
    name: 'Automated Cart Mk3',
    description: 'A highly advanced cart that adds another 4.08cm/s of digging speed.',
    cost: 120000,
    icon: Bot,
    effects: {
      automationRate: 4.08,
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
  {
    id: 'dowsing_rod',
    name: 'Dowsing Rod',
    description: 'A mystical tool to find mineral-rich pockets. Adds +5 to max minerals found per dig.',
    cost: 2000,
    icon: GitMergeIcon,
    effects: {
      mineralBonus: 5,
    },
  },
  {
    id: 'geologists_lens',
    name: 'Geologist\'s Lens',
    description: 'A special lens to spot rich veins. Adds +10 to max minerals found per dig.',
    cost: 8000,
    icon: Eye,
    effects: {
      mineralBonus: 10,
    },
  },
  {
    id: 'seismic_scanner',
    name: 'Seismic Scanner',
    description: 'Scans the ground for large deposits. Adds +20 to max minerals found per dig.',
    cost: 30000,
    icon: Waves,
    effects: {
      mineralBonus: 20,
    },
  }
];
