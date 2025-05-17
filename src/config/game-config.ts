
import type { Business, BusinessUpgrade, Stock } from '@/types';
import { Citrus, Coffee, Cpu, Landmark, Rocket, Factory, Utensils, Film, FlaskConical, BrainCircuit, Cookie, Code2, Wind, Ship, Dna, Package, Lightbulb, Users, TrendingUp, Building, Zap, BarChart, Tv, ShieldCheck, Briefcase } from 'lucide-react';

export const INITIAL_MONEY = 1000;
export const MAX_BUSINESS_LEVEL = 100;

export const INITIAL_BUSINESSES: Business[] = [
  {
    id: 'lemonade_stand',
    name: 'Lemonade Stand',
    level: 0,
    baseIncome: 1,
    baseCost: 10,
    upgradeCostMultiplier: 1.07,
    icon: Citrus,
    managerOwned: false,
    description: 'A humble start, selling refreshing lemonade.',
    upgrades: [
      { id: 'ls_bigger_pitcher', name: 'Bigger Pitcher', description: 'Serve more lemonade, +10% income.', cost: 50, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 10 },
      { id: 'ls_catchy_sign', name: 'Catchy Sign', description: 'Attract more customers, +15% income.', cost: 150, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 15 },
      { id: 'ls_bulk_lemons', name: 'Bulk Lemons', description: 'Cheaper supplies, -5% level upgrade cost.', cost: 200, requiredLevel: 15, isPurchased: false, levelUpgradeCostReductionPercent: 5 },
      { id: 'ls_premium_ingredients', name: 'Premium Ingredients', description: 'Use organic lemons & sugar, +20% income.', cost: 300, requiredLevel: 20, isPurchased: false, incomeBoostPercent: 20 },
      { id: 'ls_ice_machine', name: 'Ice Machine', description: 'Always cold lemonade, +10% income.', cost: 400, requiredLevel: 25, isPurchased: false, incomeBoostPercent: 10 },
    ],
  },
  {
    id: 'coffee_shop',
    name: 'Coffee Shop',
    level: 0,
    baseIncome: 5,
    baseCost: 100,
    upgradeCostMultiplier: 1.15,
    icon: Coffee,
    managerOwned: false,
    description: 'Caffeinate the masses and your profits.',
    upgrades: [
      { id: 'cs_espresso_machine', name: 'Espresso Machine', description: 'Faster service, +20% income.', cost: 500, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 20 },
      { id: 'cs_loyal_customer_program', name: 'Loyalty Program', description: 'Repeat customers, +10% income.', cost: 1000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 10 },
      { id: 'cs_efficient_barista', name: 'Efficient Barista Training', description: 'Streamlined operations, -10% level upgrade cost.', cost: 1200, requiredLevel: 15, isPurchased: false, levelUpgradeCostReductionPercent: 10 },
      { id: 'cs_artisanal_beans', name: 'Artisanal Beans', description: 'Source high-quality beans, +25% income.', cost: 2000, requiredLevel: 20, isPurchased: false, incomeBoostPercent: 25 },
      { id: 'cs_pastry_selection', name: 'Pastry Selection', description: 'Offer pastries with coffee, +15% income.', cost: 2500, requiredLevel: 25, isPurchased: false, incomeBoostPercent: 15 },
    ],
  },
  {
    id: 'artisan_bakery',
    name: 'Artisan Bakery',
    level: 0,
    baseIncome: 12,
    baseCost: 400,
    upgradeCostMultiplier: 1.16,
    icon: Cookie,
    managerOwned: false,
    description: 'Delicious baked goods for the discerning palate.',
    upgrades: [
      { id: 'ab_sourdough_starter', name: 'Perfected Sourdough Starter', description: 'Signature bread, +20% income.', cost: 1500, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 20 },
      { id: 'ab_commercial_ovens', name: 'Commercial Ovens', description: 'Increased capacity, +15% income, -5% level cost.', cost: 2500, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 15, levelUpgradeCostReductionPercent: 5 },
      { id: 'ab_delivery_service', name: 'Local Delivery Service', description: 'Reach more customers, +25% income.', cost: 4000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 25 },
      { id: 'ab_organic_ingredients', name: 'Organic Ingredients Pact', description: 'Premium quality, +20% income.', cost: 6000, requiredLevel: 20, isPurchased: false, incomeBoostPercent: 20 },
    ],
  },
  {
    id: 'fast_food_franchise',
    name: 'Fast Food Franchise',
    level: 0,
    baseIncome: 20,
    baseCost: 750,
    upgradeCostMultiplier: 1.17,
    icon: Utensils,
    managerOwned: false,
    description: 'Serve quick meals to hungry customers.',
    upgrades: [
      { id: 'fff_drive_thru', name: 'Drive-Thru Window', description: 'Serve customers faster, +20% income.', cost: 3000, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 20 },
      { id: 'fff_combo_meals', name: 'Combo Meal Deals', description: 'Increase average order value, +15% income.', cost: 5000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 15 },
      { id: 'fff_franchise_training', name: 'Franchise Training Program', description: 'Standardize operations, -5% level upgrade cost.', cost: 7000, requiredLevel: 15, isPurchased: false, levelUpgradeCostReductionPercent: 5 },
      { id: 'fff_online_ordering', name: 'Online Ordering System', description: 'Modern convenience, +10% income.', cost: 8500, requiredLevel: 20, isPurchased: false, incomeBoostPercent: 10 },
    ],
  },
  {
    id: 'tech_startup',
    name: 'Tech Startup',
    level: 0,
    baseIncome: 50,
    baseCost: 1500,
    upgradeCostMultiplier: 1.20,
    icon: Cpu,
    managerOwned: false,
    description: 'Innovate and disrupt with cutting-edge technology.',
    upgrades: [
        { id: 'ts_server_upgrade', name: 'Server Upgrade', description: 'Handle more users, +25% income.', cost: 7500, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 25 },
        { id: 'ts_marketing_campaign', name: 'Marketing Campaign', description: 'Increase visibility, +15% income.', cost: 15000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 15 },
        { id: 'ts_ai_integration', name: 'AI Integration', description: 'Implement AI for better product, +30% income', cost: 25000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 30 },
        { id: 'ts_agile_dev_team', name: 'Agile Dev Team', description: 'Faster development cycles, -10% level upgrade cost', cost: 30000, requiredLevel: 20, isPurchased: false, levelUpgradeCostReductionPercent: 10 },
        { id: 'ts_patent_portfolio', name: 'Patent Portfolio', description: 'Secure IP, +20% income.', cost: 40000, requiredLevel: 25, isPurchased: false, incomeBoostPercent: 20 },
    ],
  },
  {
    id: 'software_agency',
    name: 'CodeCrafters Inc.',
    level: 0,
    baseIncome: 120,
    baseCost: 5000,
    upgradeCostMultiplier: 1.19,
    icon: Code2,
    managerOwned: false,
    description: 'Custom software solutions for businesses.',
    upgrades: [
      { id: 'sa_agile_methodologies', name: 'Agile Methodologies Training', description: 'Efficient project management, -10% level cost.', cost: 20000, requiredLevel: 5, isPurchased: false, levelUpgradeCostReductionPercent: 10 },
      { id: 'sa_cloud_partnership', name: 'Cloud Platform Partnership', description: 'Scalable solutions, +25% income.', cost: 35000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 25 },
      { id: 'sa_ux_ui_dept', name: 'UX/UI Design Department', description: 'Better user experience, +20% income.', cost: 50000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 20 },
      { id: 'sa_ai_dev_tools', name: 'AI-Powered Dev Tools', description: 'Increased developer productivity, +15% income.', cost: 70000, requiredLevel: 20, isPurchased: false, incomeBoostPercent: 15 },
    ],
  },
  {
    id: 'real_estate',
    name: 'Real Estate Agency',
    level: 0,
    baseIncome: 250,
    baseCost: 10000,
    upgradeCostMultiplier: 1.18,
    icon: Landmark,
    managerOwned: false,
    description: 'Buy, sell, and lease properties for big returns.',
    upgrades: [
      { id: 're_luxury_listings', name: 'Luxury Listings', description: 'Focus on high-end properties, +30% income.', cost: 20000, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 30 },
      { id: 're_virtual_tours', name: 'Virtual Tours', description: 'Attract more clients with tech, +20% income.', cost: 30000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 20 },
      { id: 're_negotiation_experts', name: 'Expert Negotiators', description: 'Better deals, -10% level upgrade cost.', cost: 40000, requiredLevel: 15, isPurchased: false, levelUpgradeCostReductionPercent: 10 },
      { id: 're_property_management', name: 'Property Management Division', description: 'Recurring revenue, +15% income.', cost: 50000, requiredLevel: 20, isPurchased: false, incomeBoostPercent: 15 },
    ],
  },
  {
    id: 'entertainment_streaming_service',
    name: 'StreamFlix',
    level: 0,
    baseIncome: 350,
    baseCost: 30000,
    upgradeCostMultiplier: 1.185,
    icon: Tv,
    managerOwned: false,
    description: 'Binge-worthy content for global audiences.',
    upgrades: [
      { id: 'sfs_original_series', name: 'Original Series Production', description: 'Exclusive content, +25% income.', cost: 100000, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 25 },
      { id: 'sfs_global_cdn', name: 'Global CDN Expansion', description: 'Faster streaming worldwide, +15% income.', cost: 180000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 15 },
      { id: 'sfs_recommendation_ai', name: 'AI Recommendation Engine', description: 'Increased user engagement, +20% income.', cost: 250000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 20 },
      { id: 'sfs_licensing_deals', name: 'Exclusive Licensing Deals', description: 'Secure popular movie rights, +10% income.', cost: 300000, requiredLevel: 20, isPurchased: false, incomeBoostPercent: 10 },
    ],
  },
  {
    id: 'movie_studio',
    name: 'Movie Studio',
    level: 0,
    baseIncome: 800,
    baseCost: 50000,
    upgradeCostMultiplier: 1.19,
    icon: Film,
    managerOwned: false,
    description: 'Produce blockbuster films and entertain the world.',
    upgrades: [
      { id: 'ms_cgi_department', name: 'CGI Department', description: 'Create stunning visual effects, +25% income.', cost: 200000, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 25 },
      { id: 'ms_star_actors_contracts', name: 'Star Actor Contracts', description: 'Attract larger audiences, +30% income.', cost: 350000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 30 },
      { id: 'ms_distribution_network', name: 'Global Distribution Network', description: 'Wider release, +20% income.', cost: 500000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 20 },
      { id: 'ms_streaming_platform_deal', name: 'Streaming Platform Deal', description: 'Secure digital distribution, +20% income.', cost: 650000, requiredLevel: 20, isPurchased: false, incomeBoostPercent: 20 },
      { id: 'ms_merchandising_rights', name: 'Merchandising Rights', description: 'Additional revenue stream, +15% income.', cost: 450000, requiredLevel: 25, isPurchased: false, incomeBoostPercent: 15 },
    ],
  },
  {
    id: 'manufacturing_plant',
    name: 'Manufacturing Plant',
    level: 0,
    baseIncome: 1000,
    baseCost: 75000,
    upgradeCostMultiplier: 1.16,
    icon: Factory,
    managerOwned: false,
    description: 'Mass produce goods and dominate the market.',
    upgrades: [
      { id: 'mp_robotics_automation', name: 'Robotics Automation', description: 'Increase production speed, +35% income.', cost: 150000, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 35 },
      { id: 'mp_supply_chain_optimization', name: 'Supply Chain Optimization', description: 'Reduce material costs, -15% level upgrade cost.', cost: 200000, requiredLevel: 10, isPurchased: false, levelUpgradeCostReductionPercent: 15 },
      { id: 'mp_quality_control_systems', name: 'Advanced QC Systems', description: 'Better product quality, +20% income.', cost: 250000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 20 },
      { id: 'mp_lean_manufacturing', name: 'Lean Manufacturing Training', description: 'Improve efficiency, -5% level upgrade cost.', cost: 300000, requiredLevel: 20, isPurchased: false, levelUpgradeCostReductionPercent: 5 },
      { id: 'mp_3d_printing_division', name: '3D Printing Division', description: 'Rapid prototyping & custom parts, +10% income.', cost: 350000, requiredLevel: 25, isPurchased: false, incomeBoostPercent: 10 },
    ],
  },
  {
    id: 'renewable_energy_corp',
    name: 'EcoPower Corp',
    level: 0,
    baseIncome: 1500,
    baseCost: 120000,
    upgradeCostMultiplier: 1.20,
    icon: Wind,
    managerOwned: false,
    description: 'Harnessing nature for a cleaner future.',
    upgrades: [
      { id: 'rec_advanced_turbines', name: 'Advanced Turbine Design', description: 'Higher energy output from wind, +25% income.', cost: 400000, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 25 },
      { id: 'rec_solar_panel_efficiency', name: 'Solar Panel Efficiency Breakthrough', description: 'More power from sunlight, +30% income.', cost: 600000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 30 },
      { id: 'rec_grid_battery_storage', name: 'Grid-Scale Battery Storage', description: 'Store excess energy, +20% income.', cost: 800000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 20 },
      { id: 'rec_govt_subsidies', name: 'Government Subsidies Lobbying', description: 'Secure favorable policies, -10% level cost.', cost: 1000000, requiredLevel: 20, isPurchased: false, levelUpgradeCostReductionPercent: 10 },
    ],
  },
  {
    id: 'cybersecurity_solutions',
    name: 'CyberGuard Solutions',
    level: 0,
    baseIncome: 1800,
    baseCost: 150000,
    upgradeCostMultiplier: 1.205,
    icon: ShieldCheck,
    managerOwned: false,
    description: 'Protecting digital assets from emerging threats.',
    upgrades: [
      { id: 'cgs_threat_intel_platform', name: 'Threat Intelligence Platform', description: 'Proactive defense, +25% income.', cost: 500000, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 25 },
      { id: 'cgs_incident_response_team', name: 'Elite Incident Response Team', description: 'Rapid breach mitigation, +15% income.', cost: 700000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 15 },
      { id: 'cgs_advanced_encryption', name: 'Quantum-Resistant Encryption R&D', description: 'Future-proof security, +20% income.', cost: 900000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 20 },
      { id: 'cgs_security_audits', name: 'Automated Security Audits', description: 'Efficient client onboarding, -10% level cost.', cost: 1200000, requiredLevel: 20, isPurchased: false, levelUpgradeCostReductionPercent: 10 },
    ],
  },
  {
    id: 'pharmaceutical_company',
    name: 'Pharmaceutical Company',
    level: 0,
    baseIncome: 2000,
    baseCost: 200000,
    upgradeCostMultiplier: 1.21,
    icon: FlaskConical,
    managerOwned: false,
    description: 'Develop life-saving drugs and treatments.',
    upgrades: [
      { id: 'pc_research_lab_expansion', name: 'Research Lab Expansion', description: 'Faster drug discovery, +30% income.', cost: 800000, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 30 },
      { id: 'pc_clinical_trials_fast_track', name: 'Clinical Trials Fast-Track', description: 'Speed up approval process, -10% level upgrade cost.', cost: 1200000, requiredLevel: 10, isPurchased: false, levelUpgradeCostReductionPercent: 10 },
      { id: 'pc_patented_drug_portfolio', name: 'Patented Drug Portfolio', description: 'Secure long-term revenue, +35% income.', cost: 2000000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 35 },
      { id: 'pc_biotech_collaboration', name: 'Biotech Collaboration', description: 'Access new research, +20% income.', cost: 2500000, requiredLevel: 20, isPurchased: false, incomeBoostPercent: 20 },
    ],
  },
  {
    id: 'space_exploration_inc',
    name: 'Space Exploration Inc.',
    level: 0,
    baseIncome: 5000,
    baseCost: 500000,
    upgradeCostMultiplier: 1.22,
    icon: Rocket,
    managerOwned: false,
    description: 'Reach for the stars and astronomical profits.',
    upgrades: [
      { id: 'se_reusable_rockets', name: 'Reusable Rockets', description: 'Drastically cut launch costs, -20% level upgrade cost.', cost: 1000000, requiredLevel: 5, isPurchased: false, levelUpgradeCostReductionPercent: 20 },
      { id: 'se_asteroid_mining_prototype', name: 'Asteroid Mining Tech', description: 'Explore new revenue streams, +40% income.', cost: 2500000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 40 },
      { id: 'se_interstellar_comms', name: 'Interstellar Comms', description: 'Expand operational reach, +25% income.', cost: 5000000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 25 },
      { id: 'se_space_tourism_division', name: 'Space Tourism Division', description: 'Luxury travel to orbit, +30% income.', cost: 7000000, requiredLevel: 20, isPurchased: false, incomeBoostPercent: 30 },
    ],
  },
  {
    id: 'global_shipping_network',
    name: 'Horizon Logistics',
    level: 0,
    baseIncome: 7500,
    baseCost: 750000,
    upgradeCostMultiplier: 1.23,
    icon: Ship,
    managerOwned: false,
    description: 'Connecting the world, one container at a time.',
    upgrades: [
      { id: 'gsn_automated_ports', name: 'Automated Port Terminals', description: 'Faster loading/unloading, -15% level cost.', cost: 2000000, requiredLevel: 5, isPurchased: false, levelUpgradeCostReductionPercent: 15 },
      { id: 'gsn_supertankers', name: 'Fuel-Efficient Supertankers', description: 'Larger capacity, lower fuel costs, +30% income.', cost: 4000000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 30 },
      { id: 'gsn_cargo_tracking', name: 'Real-time Cargo Tracking', description: 'Improved logistics, +20% income.', cost: 6000000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 20 },
      { id: 'gsn_customs_expediting', name: 'Customs Expediting Services', description: 'Faster border crossings, +15% income.', cost: 8000000, requiredLevel: 20, isPurchased: false, incomeBoostPercent: 15 },
    ],
  },
  {
    id: 'ai_research_lab',
    name: 'AI Research Lab',
    level: 0,
    baseIncome: 10000,
    baseCost: 1000000,
    upgradeCostMultiplier: 1.25,
    icon: BrainCircuit,
    managerOwned: false,
    description: 'Pioneer the future of artificial intelligence.',
    upgrades: [
      { id: 'ai_quantum_computing_access', name: 'Quantum Computing Access', description: 'Unlock new research frontiers, +40% income.', cost: 5000000, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 40 },
      { id: 'ai_ethics_board', name: 'AI Ethics Board', description: 'Ensure responsible AI development, +5% income.', cost: 2000000, requiredLevel: 7, isPurchased: false, incomeBoostPercent: 5 },
      { id: 'ai_talent_acquisition', name: 'Top Talent Acquisition', description: 'Hire the best minds, +30% income.', cost: 7500000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 30 },
      { id: 'ai_breakthrough_algorithm', name: 'Breakthrough Algorithm', description: 'Revolutionize a field, +50% income.', cost: 15000000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 50 },
      { id: 'ai_autonomous_systems_division', name: 'Autonomous Systems Division', description: 'Develop self-driving tech, +35% income.', cost: 20000000, requiredLevel: 20, isPurchased: false, incomeBoostPercent: 35 },
    ],
  },
  {
    id: 'global_logistics_inc',
    name: 'GlobalLink Logistics',
    level: 0,
    baseIncome: 15000,
    baseCost: 1800000,
    upgradeCostMultiplier: 1.24,
    icon: Package,
    managerOwned: false,
    description: 'Precision global supply chain management.',
    upgrades: [
      { id: 'gli_drone_delivery_fleet', name: 'Drone Delivery Fleet', description: 'Last-mile efficiency, +25% income.', cost: 7000000, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 25 },
      { id: 'gli_automated_warehouses', name: 'Automated Warehousing Network', description: 'Reduced operational costs, -10% level cost.', cost: 10000000, requiredLevel: 10, isPurchased: false, levelUpgradeCostReductionPercent: 10 },
      { id: 'gli_ai_route_optimization', name: 'AI Route Optimization', description: 'Smarter, faster deliveries, +20% income.', cost: 13000000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 20 },
      { id: 'gli_cold_chain_logistics', name: 'Cold Chain Logistics Specialization', description: 'Serve high-value perishable goods market, +15% income.', cost: 16000000, requiredLevel: 20, isPurchased: false, incomeBoostPercent: 15 },
    ],
  },
  {
    id: 'genetic_engineering_firm',
    name: 'EvoGenesis Labs',
    level: 0,
    baseIncome: 20000,
    baseCost: 2500000,
    upgradeCostMultiplier: 1.26,
    icon: Dna,
    managerOwned: false,
    description: 'Rewriting the code of life for a better tomorrow.',
    upgrades: [
      { id: 'gef_crispr_license', name: 'CRISPR Technology License', description: 'Advanced gene editing, +35% income.', cost: 10000000, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 35 },
      { id: 'gef_bioinformatics_supercomputer', name: 'Bioinformatics Supercomputer', description: 'Accelerate research, +30% income.', cost: 15000000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 30 },
      { id: 'gef_personalized_medicine', name: 'Personalized Medicine Division', description: 'Tailored treatments, +40% income.', cost: 25000000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 40 },
      { id: 'gef_ethical_oversight', name: 'Ethical Oversight Committee', description: 'Public trust and grants, +10% income.', cost: 5000000, requiredLevel: 7, isPurchased: false, incomeBoostPercent: 10 },
    ],
  },
];

export const INITIAL_STOCKS: Stock[] = [
  { id: 'global_corp', ticker: 'GC', companyName: 'Global Corp', price: 100, dividendYield: 0.00002, icon: Building, description: 'A diversified multinational conglomerate.', totalOutstandingShares: 25000000 },
  { id: 'tech_innovations', ticker: 'TINV', companyName: 'Tech Innovations Inc.', price: 250, dividendYield: 0.00001, icon: Cpu, description: 'Pioneering future technologies.', totalOutstandingShares: 10000000 },
  { id: 'green_energy_co', ticker: 'GEC', companyName: 'Green Energy Co.', price: 150, dividendYield: 0.000015, icon: Zap, description: 'Leading the renewable energy revolution.', totalOutstandingShares: 15000000 },
  { id: 'alpha_pharma', ticker: 'APRX', companyName: 'Alpha Pharmaceuticals', price: 300, dividendYield: 0.000025, icon: FlaskConical, description: 'Developing life-saving medications.', totalOutstandingShares: 5000000 },
  { id: 'summit_real_estate', ticker: 'SRE', companyName: 'Summit Real Estate', price: 120, dividendYield: 0.000018, icon: Landmark, description: 'Prime properties and development projects.', totalOutstandingShares: 20000000 },
  { id: 'biz_tycoon_holdings', ticker: 'BTH', companyName: 'BizTycoon Holdings', price: 500, dividendYield: 0.00003, icon: Briefcase, description: 'The parent company of successful ventures.', totalOutstandingShares: 2000000 },
  { id: 'momentum_motors', ticker: 'MMTR', companyName: 'Momentum Motors', price: 180, dividendYield: 0.000012, icon: TrendingUp, description: 'Innovative electric vehicle manufacturer, known for its volatile stock.', totalOutstandingShares: 12000000 },
  { id: 'quantum_leap_computing', ticker: 'QLC', companyName: 'Quantum Leap Computing', price: 450, dividendYield: 0.000005, icon: Lightbulb, description: 'Cutting-edge quantum computing research and development.', totalOutstandingShares: 3000000 },
  { id: 'biosynth_genetics', ticker: 'BSG', companyName: 'BioSynth Genetics', price: 220, dividendYield: 0.000022, icon: Dna, description: 'Biotechnology firm specializing in gene therapy and synthetic biology.', totalOutstandingShares: 8000000 },
];


export const calculateIncome = (business: Business): number => {
  if (business.level === 0) return 0;
  let currentIncome = business.level * business.baseIncome;
  if (business.upgrades) {
    business.upgrades.forEach(upgrade => {
      if (upgrade.isPurchased && upgrade.incomeBoostPercent) {
        currentIncome *= (1 + upgrade.incomeBoostPercent / 100);
      }
    });
  }
  return currentIncome;
};

export const calculateUpgradeCost = (business: Business): number => {
  if (business.level >= MAX_BUSINESS_LEVEL) return Infinity;
  let currentCost = business.baseCost * Math.pow(business.upgradeCostMultiplier, business.level);
  if (business.upgrades) {
    business.upgrades.forEach(upgrade => {
      if (upgrade.isPurchased && upgrade.levelUpgradeCostReductionPercent) {
        currentCost *= (1 - upgrade.levelUpgradeCostReductionPercent / 100);
      }
    });
  }
  return Math.floor(currentCost);
};

