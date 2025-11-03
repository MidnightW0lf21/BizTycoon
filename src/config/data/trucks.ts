
import type { TruckConfig, DriverUpgrade } from '@/types';
import { Truck } from 'lucide-react';

export const TRUCKS_CONFIG: TruckConfig[] = [
    {
        id: 'delivery_truck_t1',
        name: 'Basic Delivery Van',
        icon: Truck,
        capacity: 50,
        speedKmh: 60,
        fuelCapacity: 80,
        fuelUsagePerKm: 0.1,
        baseCost: 200000000,
        wearRatePer1000Km: 5,
    },
    {
        id: 'delivery_truck_t2',
        name: 'Standard Box Truck',
        icon: Truck,
        capacity: 150,
        speedKmh: 80,
        fuelCapacity: 120,
        fuelUsagePerKm: 0.15,
        baseCost: 750000000,
        wearRatePer1000Km: 4,
    },
    {
        id: 'delivery_truck_t3',
        name: 'Heavy Duty Hauler',
        icon: Truck,
        capacity: 400,
        speedKmh: 70,
        fuelCapacity: 250,
        fuelUsagePerKm: 0.25,
        baseCost: 2500000000,
        wearRatePer1000Km: 3,
    },
    {
        id: 'delivery_truck_t4',
        name: 'Advanced Logistics Truck',
        icon: Truck,
        capacity: 800,
        speedKmh: 90,
        fuelCapacity: 300,
        fuelUsagePerKm: 0.2,
        baseCost: 8000000000,
        wearRatePer1000Km: 2,
    },
    {
        id: 'delivery_truck_t5',
        name: 'Quantum Road Train',
        icon: Truck,
        capacity: 2000,
        speedKmh: 120,
        fuelCapacity: 500,
        fuelUsagePerKm: 0.18,
        baseCost: 20000000000,
        wearRatePer1000Km: 1,
    }
];

export const DRIVER_UPGRADES_CONFIG: DriverUpgrade[] = [
    {
        id: 'maxEnergy',
        name: 'Stamina Training',
        description: 'Increases the driver\'s maximum energy, allowing for longer trips.',
        maxLevel: 10,
        costPerLevel: 75000000, // 75M
    },
    {
        id: 'rechargeRate',
        name: 'Recovery Training',
        description: 'Increases the rate at which the driver regains energy while resting.',
        maxLevel: 10,
        costPerLevel: 75000000, // 75M
    }
];
