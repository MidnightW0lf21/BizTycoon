
export const WORKER_FIRST_NAMES: string[] = [
  "Alex", "Bob", "Charlie", "Dana", "Eve", "Finn", "Grace", "Hank", "Ivy", "Jack",
  "Kate", "Leo", "Mia", "Noah", "Olivia", "Paul", "Quinn", "Ryan", "Sofia", "Tom",
  "Uma", "Victor", "Wendy", "Xena", "Yara", "Zane"
];

export const WORKER_LAST_NAMES: string[] = [
  "Smith", "Jones", "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson",
  "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark",
  "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen"
];

export const INITIAL_WORKER_MAX_ENERGY = 1800; // 30 minutes in seconds
export const WORKER_ENERGY_TIERS = [
  1800,  // 30 minutes
  3600,  // 1 hour
  7200,  // 2 hours
  14400, // 4 hours
  28800, // 8 hours
  43200  // 12 hours
];
export const WORKER_ENERGY_RATE = 1; // 1 energy unit per second (for work depletion and rest regeneration)

export const WORKER_HIRE_COST_BASE = 50000; // Renamed for clarity
export const WORKER_HIRE_COST_MULTIPLIER = 1.15;
export const MAX_WORKERS = 30;
