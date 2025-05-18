
import type { Business, BusinessUpgrade, Stock, SkillNode } from '@/types';
import { 
  Citrus, Coffee, Cpu, Landmark, Rocket, Factory, Utensils, Film, FlaskConical, BrainCircuit, Cookie, Code2, Wind, Ship, Dna, Package, Lightbulb, Users, TrendingUp, Building, Zap, BarChart, Tv, ShieldCheck, Briefcase, Network, GitMerge, TrendingUpIcon, ChevronsUp, ArrowDownCircle, Banknote, Sparkles, DollarSign, Settings2, PiggyBank, Unlock, Percent, ShoppingCart, Telescope, Star, Crown, Radio, Cog, Sigma, ShoppingBag, Award, Activity, Scaling, Target
} from 'lucide-react';

export const INITIAL_MONEY = 10;
export const MAX_BUSINESS_LEVEL = 100; // Base max level
export const INITIAL_PRESTIGE_POINTS = 0;
export const INITIAL_TIMES_PRESTIGED = 0;
export const INITIAL_UNLOCKED_SKILL_IDS: string[] = [];

export const PRESTIGE_BASE_LEVEL_COST = 75; 
export const PRESTIGE_LEVEL_COST_INCREMENT = 30;


export const INITIAL_BUSINESSES: Business[] = [
  {
    id: 'lemonade_stand',
    name: 'Lemonade Stand',
    level: 0,
    baseIncome: 1,
    baseCost: 10,
    upgradeCostMultiplier: 1.06, 
    icon: Citrus,
    managerOwned: false,
    description: 'A humble start, selling refreshing lemonade.',
    // requiredTimesPrestiged: 0, // Removed
    upgrades: [
      { id: 'ls_bigger_pitcher', name: 'Bigger Pitcher', description: 'Serve more lemonade, +10% income.', cost: 50, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 10 },
      { id: 'ls_catchy_sign', name: 'Catchy Sign', description: 'Attract more customers, +15% income.', cost: 150, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 15 },
      { id: 'ls_bulk_lemons', name: 'Bulk Lemons', description: 'Cheaper supplies, -5% level upgrade cost.', cost: 200, requiredLevel: 15, isPurchased: false, levelUpgradeCostReductionPercent: 5 },
      { id: 'ls_premium_ingredients', name: 'Premium Ingredients', description: 'Use organic lemons & sugar, +20% income.', cost: 300, requiredLevel: 20, isPurchased: false, incomeBoostPercent: 20 },
      { id: 'ls_ice_machine', name: 'Ice Machine', description: 'Always cold lemonade, +10% income.', cost: 400, requiredLevel: 25, isPurchased: false, incomeBoostPercent: 10 },
      { id: 'ls_franchise_manual', name: 'Franchise Manual', description: 'Standardize operations, +12% income.', cost: 600, requiredLevel: 30, isPurchased: false, incomeBoostPercent: 12 },
      { id: 'ls_marketing_flyers', name: 'Local Marketing Flyers', description: 'Increased local awareness, +8% income.', cost: 800, requiredLevel: 35, isPurchased: false, incomeBoostPercent: 8 },
      { id: 'ls_sugar_supplier_deal', name: 'Sugar Supplier Deal', description: 'Reduced sugar costs, -3% level upgrade cost.', cost: 1000, requiredLevel: 40, isPurchased: false, levelUpgradeCostReductionPercent: 3 },
    ],
  },
  {
    id: 'coffee_shop',
    name: 'Coffee Shop',
    level: 0,
    baseIncome: 5,
    baseCost: 100,
    upgradeCostMultiplier: 1.12, 
    icon: Coffee,
    managerOwned: false,
    description: 'Caffeinate the masses and your profits.',
    // requiredTimesPrestiged: 0, // Removed
    upgrades: [
      { id: 'cs_espresso_machine', name: 'Espresso Machine', description: 'Faster service, +20% income.', cost: 500, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 20 },
      { id: 'cs_loyal_customer_program', name: 'Loyalty Program', description: 'Repeat customers, +10% income.', cost: 1000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 10 },
      { id: 'cs_efficient_barista_training', name: 'Efficient Barista Training', description: 'Streamlined operations, -10% level upgrade cost.', cost: 1200, requiredLevel: 15, isPurchased: false, levelUpgradeCostReductionPercent: 10 },
      { id: 'cs_artisanal_beans', name: 'Artisanal Beans', description: 'Source high-quality beans, +25% income.', cost: 2000, requiredLevel: 20, isPurchased: false, incomeBoostPercent: 25 },
      { id: 'cs_pastry_selection', name: 'Pastry Selection', description: 'Offer pastries with coffee, +15% income.', cost: 2500, requiredLevel: 25, isPurchased: false, incomeBoostPercent: 15 },
      { id: 'cs_ambiance_upgrade', name: 'Ambiance Upgrade', description: 'Comfortable seating and music, +10% income.', cost: 3500, requiredLevel: 30, isPurchased: false, incomeBoostPercent: 10 },
      { id: 'cs_mobile_ordering_app', name: 'Mobile Ordering App', description: 'Convenience for customers, +12% income.', cost: 5000, requiredLevel: 35, isPurchased: false, incomeBoostPercent: 12 },
      { id: 'cs_bulk_milk_contract', name: 'Bulk Milk Contract', description: 'Reduced dairy costs, -4% level upgrade cost.', cost: 6000, requiredLevel: 40, isPurchased: false, levelUpgradeCostReductionPercent: 4 },
    ],
  },
  {
    id: 'artisan_bakery',
    name: 'Artisan Bakery',
    level: 0,
    baseIncome: 12,
    baseCost: 400,
    upgradeCostMultiplier: 1.11,
    icon: Cookie,
    managerOwned: false,
    description: 'Delicious baked goods for the discerning palate.',
    // requiredTimesPrestiged: 1, // Removed
    upgrades: [
      { id: 'ab_sourdough_starter', name: 'Perfected Sourdough Starter', description: 'Signature bread, +20% income.', cost: 1500, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 20 },
      { id: 'ab_commercial_ovens', name: 'Commercial Ovens', description: 'Increased capacity, +15% income, -5% level cost.', cost: 2500, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 15, levelUpgradeCostReductionPercent: 5 },
      { id: 'ab_delivery_service', name: 'Local Delivery Service', description: 'Reach more customers, +25% income.', cost: 4000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 25 },
      { id: 'ab_organic_ingredients', name: 'Organic Ingredients Pact', description: 'Premium quality, +20% income.', cost: 6000, requiredLevel: 20, isPurchased: false, incomeBoostPercent: 20 },
      { id: 'ab_patisserie_chef', name: 'Hire Patisserie Chef', description: 'Introduce delicate pastries, +18% income.', cost: 8000, requiredLevel: 25, isPurchased: false, incomeBoostPercent: 18 },
      { id: 'ab_window_display', name: 'Attractive Window Display', description: 'Lure in more foot traffic, +10% income.', cost: 5000, requiredLevel: 30, isPurchased: false, incomeBoostPercent: 10 },
      { id: 'ab_flour_mill_partnership', name: 'Flour Mill Partnership', description: 'Better flour prices, -6% level cost.', cost: 7000, requiredLevel: 35, isPurchased: false, levelUpgradeCostReductionPercent: 6 },
      { id: 'ab_seasonal_specials', name: 'Seasonal Specials Menu', description: 'Keep customers coming back, +12% income.', cost: 9000, requiredLevel: 40, isPurchased: false, incomeBoostPercent: 12 },
    ],
  },
  {
    id: 'fast_food_franchise',
    name: 'Fast Food Franchise',
    level: 0,
    baseIncome: 20,
    baseCost: 750,
    upgradeCostMultiplier: 1.10,
    icon: Utensils,
    managerOwned: false,
    description: 'Serve quick meals to hungry customers.',
    // requiredTimesPrestiged: 1, // Removed
    upgrades: [
      { id: 'fff_drive_thru', name: 'Drive-Thru Window', description: 'Serve customers faster, +20% income.', cost: 3000, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 20 },
      { id: 'fff_combo_meals', name: 'Combo Meal Deals', description: 'Increase average order value, +15% income.', cost: 5000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 15 },
      { id: 'fff_franchise_training', name: 'Franchise Training Program', description: 'Standardize operations, -5% level upgrade cost.', cost: 7000, requiredLevel: 15, isPurchased: false, levelUpgradeCostReductionPercent: 5 },
      { id: 'fff_online_ordering', name: 'Online Ordering System', description: 'Modern convenience, +10% income.', cost: 8500, requiredLevel: 20, isPurchased: false, incomeBoostPercent: 10 },
      { id: 'fff_kids_menu', name: 'Kids Menu & Toys', description: 'Attract families, +12% income.', cost: 6000, requiredLevel: 25, isPurchased: false, incomeBoostPercent: 12 },
      { id: 'fff_speedy_kitchen_flow', name: 'Speedy Kitchen Workflow', description: 'Faster order fulfillment, +8% income.', cost: 4000, requiredLevel: 30, isPurchased: false, incomeBoostPercent: 8 },
      { id: 'fff_ingredient_sourcing_optimization', name: 'Ingredient Sourcing Optimization', description: 'Lower food costs, -7% level cost.', cost: 9000, requiredLevel: 35, isPurchased: false, levelUpgradeCostReductionPercent: 7 },
      { id: 'fff_regional_marketing_blitz', name: 'Regional Marketing Blitz', description: 'Boost brand visibility, +14% income.', cost: 10000, requiredLevel: 40, isPurchased: false, incomeBoostPercent: 14 },
    ],
  },
  {
    id: 'tech_startup', 
    name: 'Tech Startup',
    level: 0,
    baseIncome: 50,
    baseCost: 1500,
    upgradeCostMultiplier: 1.13,
    icon: Cpu,
    managerOwned: false,
    description: 'Innovate and disrupt with cutting-edge technology.',
    // requiredTimesPrestiged: 1, // Removed
    upgrades: [
        { id: 'ts_server_upgrade', name: 'Server Upgrade', description: 'Handle more users, +25% income.', cost: 7500, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 25 },
        { id: 'ts_marketing_campaign', name: 'Marketing Campaign', description: 'Increase visibility, +15% income.', cost: 15000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 15 },
        { id: 'ts_ai_integration', name: 'AI Integration', description: 'Implement AI for better product, +30% income', cost: 25000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 30 },
        { id: 'ts_agile_dev_team', name: 'Agile Dev Team', description: 'Faster development cycles, -10% level upgrade cost.', cost: 30000, requiredLevel: 20, isPurchased: false, levelUpgradeCostReductionPercent: 10 },
        { id: 'ts_patent_portfolio', name: 'Patent Portfolio', description: 'Secure IP, +20% income.', cost: 40000, requiredLevel: 25, isPurchased: false, incomeBoostPercent: 20 },
        { id: 'ts_beta_program', name: 'Expanded Beta Program', description: 'User feedback for faster iteration, +10% income.', cost: 20000, requiredLevel: 30, isPurchased: false, incomeBoostPercent: 10 },
        { id: 'ts_developer_relations', name: 'Developer Relations Team', description: 'Build a strong community, +12% income.', cost: 35000, requiredLevel: 35, isPurchased: false, incomeBoostPercent: 12 },
        { id: 'ts_vc_funding_round', name: 'Successful VC Funding Round', description: 'Major capital injection, -8% level cost.', cost: 50000, requiredLevel: 40, isPurchased: false, levelUpgradeCostReductionPercent: 8 },
    ],
  },
  {
    id: 'software_agency', 
    name: 'CodeCrafters Inc.',
    level: 0,
    baseIncome: 120,
    baseCost: 5000,
    upgradeCostMultiplier: 1.125,
    icon: Code2,
    managerOwned: false,
    description: 'Custom software solutions for businesses.',
    // requiredTimesPrestiged: 2, // Removed
    upgrades: [
      { id: 'sa_agile_methodologies', name: 'Agile Methodologies Training', description: 'Efficient project management, -10% level cost.', cost: 20000, requiredLevel: 5, isPurchased: false, levelUpgradeCostReductionPercent: 10 },
      { id: 'sa_cloud_partnership', name: 'Cloud Platform Partnership', description: 'Scalable solutions, +25% income.', cost: 35000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 25 },
      { id: 'sa_ux_ui_dept', name: 'UX/UI Design Department', description: 'Better user experience, +20% income.', cost: 50000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 20 },
      { id: 'sa_ai_dev_tools', name: 'AI-Powered Dev Tools', description: 'Increased developer productivity, +15% income.', cost: 70000, requiredLevel: 20, isPurchased: false, incomeBoostPercent: 15 },
      { id: 'sa_senior_architects', name: 'Hire Senior Architects', description: 'Lead complex projects, +18% income.', cost: 90000, requiredLevel: 25, isPurchased: false, incomeBoostPercent: 18 },
      { id: 'sa_project_management_software', name: 'Advanced PM Software', description: 'Better project tracking, +10% income.', cost: 60000, requiredLevel: 30, isPurchased: false, incomeBoostPercent: 10 },
      { id: 'sa_talent_retention_program', name: 'Talent Retention Program', description: 'Keep skilled developers, -5% level cost.', cost: 80000, requiredLevel: 35, isPurchased: false, levelUpgradeCostReductionPercent: 5 },
      { id: 'sa_industry_specialization', name: 'Industry Specialization', description: 'Become experts in a niche, +22% income.', cost: 100000, requiredLevel: 40, isPurchased: false, incomeBoostPercent: 22 },
    ],
  },
  {
    id: 'real_estate',
    name: 'Real Estate Agency',
    level: 0,
    baseIncome: 250,
    baseCost: 10000,
    upgradeCostMultiplier: 1.12,
    icon: Landmark,
    managerOwned: false,
    description: 'Buy, sell, and lease properties for big returns.',
    // requiredTimesPrestiged: 2, // Removed
    upgrades: [
      { id: 're_luxury_listings', name: 'Luxury Listings', description: 'Focus on high-end properties, +30% income.', cost: 20000, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 30 },
      { id: 're_virtual_tours', name: 'Virtual Tours', description: 'Attract more clients with tech, +20% income.', cost: 30000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 20 },
      { id: 're_negotiation_experts', name: 'Expert Negotiators', description: 'Better deals, -10% level upgrade cost.', cost: 40000, requiredLevel: 15, isPurchased: false, levelUpgradeCostReductionPercent: 10 },
      { id: 're_property_management', name: 'Property Management Division', description: 'Recurring revenue, +15% income.', cost: 50000, requiredLevel: 20, isPurchased: false, incomeBoostPercent: 15 },
      { id: 're_market_analysis_tools', name: 'Advanced Market Analysis Tools', description: 'Identify prime investment opportunities, +18% income.', cost: 60000, requiredLevel: 25, isPurchased: false, incomeBoostPercent: 18 },
      { id: 're_staging_services', name: 'Professional Staging Services', description: 'Increase property appeal, +10% income.', cost: 35000, requiredLevel: 30, isPurchased: false, incomeBoostPercent: 10 },
      { id: 're_legal_team_expansion', name: 'In-house Legal Team', description: 'Faster contract processing, -5% level cost.', cost: 45000, requiredLevel: 35, isPurchased: false, levelUpgradeCostReductionPercent: 5 },
      { id: 're_international_clients', name: 'International Client Network', description: 'Expand market reach globally, +22% income.', cost: 70000, requiredLevel: 40, isPurchased: false, incomeBoostPercent: 22 },
    ],
  },
  {
    id: 'entertainment_streaming_service',
    name: 'StreamFlix',
    level: 0,
    baseIncome: 350,
    baseCost: 30000,
    upgradeCostMultiplier: 1.115,
    icon: Tv,
    managerOwned: false,
    description: 'Binge-worthy content for global audiences.',
    // requiredTimesPrestiged: 2, // Removed
    upgrades: [
      { id: 'sfs_original_series', name: 'Original Series Production', description: 'Exclusive content, +25% income.', cost: 100000, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 25 },
      { id: 'sfs_global_cdn', name: 'Global CDN Expansion', description: 'Faster streaming worldwide, +15% income.', cost: 180000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 15 },
      { id: 'sfs_recommendation_ai', name: 'AI Recommendation Engine', description: 'Increased user engagement, +20% income.', cost: 250000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 20 },
      { id: 'sfs_licensing_deals', name: 'Exclusive Licensing Deals', description: 'Secure popular movie rights, +10% income.', cost: 300000, requiredLevel: 20, isPurchased: false, incomeBoostPercent: 10 },
      { id: 'sfs_family_plan', name: 'Family Plan Subscription Tier', description: 'Increase subscriber base, +12% income.', cost: 200000, requiredLevel: 25, isPurchased: false, incomeBoostPercent: 12 },
      { id: 'sfs_interactive_content', name: 'Interactive Content Development', description: 'Innovative viewing experiences, +18% income.', cost: 350000, requiredLevel: 30, isPurchased: false, incomeBoostPercent: 18 },
      { id: 'sfs_influencer_partnerships', name: 'Influencer Marketing Partnerships', description: 'Promote originals, +8% income.', cost: 150000, requiredLevel: 35, isPurchased: false, incomeBoostPercent: 8 },
      { id: 'sfs_data_analytics_platform', name: 'User Data Analytics Platform', description: 'Optimize content strategy, -5% level cost.', cost: 280000, requiredLevel: 40, isPurchased: false, levelUpgradeCostReductionPercent: 5 },
    ],
  },
  {
    id: 'movie_studio',
    name: 'Movie Studio',
    level: 0,
    baseIncome: 800,
    baseCost: 50000,
    upgradeCostMultiplier: 1.11,
    icon: Film,
    managerOwned: false,
    description: 'Produce blockbuster films and entertain the world.',
    // requiredTimesPrestiged: 2, // Removed
    upgrades: [
      { id: 'ms_cgi_department', name: 'CGI Department', description: 'Create stunning visual effects, +25% income.', cost: 200000, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 25 },
      { id: 'ms_star_actors_contracts', name: 'Star Actor Contracts', description: 'Attract larger audiences, +30% income.', cost: 350000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 30 },
      { id: 'ms_distribution_network', name: 'Global Distribution Network', description: 'Wider release, +20% income.', cost: 500000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 20 },
      { id: 'ms_streaming_platform_deal', name: 'Streaming Platform Deal', description: 'Secure digital distribution, +20% income.', cost: 650000, requiredLevel: 20, isPurchased: false, incomeBoostPercent: 20 },
      { id: 'ms_merchandising_rights', name: 'Merchandising Rights', description: 'Additional revenue stream, +15% income.', cost: 450000, requiredLevel: 25, isPurchased: false, incomeBoostPercent: 15 },
      { id: 'ms_academy_awards_campaign', name: 'Academy Awards Campaign Team', description: 'Prestige and recognition, +10% income.', cost: 300000, requiredLevel: 30, isPurchased: false, incomeBoostPercent: 10 },
      { id: 'ms_sound_stage_expansion', name: 'Sound Stage Expansion', description: 'Produce more films concurrently, +12% income.', cost: 550000, requiredLevel: 35, isPurchased: false, incomeBoostPercent: 12 },
      { id: 'ms_film_archive_licensing', name: 'Film Archive Licensing', description: 'Monetize old catalog, -6% level cost.', cost: 400000, requiredLevel: 40, isPurchased: false, levelUpgradeCostReductionPercent: 6 },
    ],
  },
  {
    id: 'manufacturing_plant',
    name: 'Manufacturing Plant',
    level: 0,
    baseIncome: 1000,
    baseCost: 75000,
    upgradeCostMultiplier: 1.105,
    icon: Factory,
    managerOwned: false,
    description: 'Mass produce goods and dominate the market.',
    // requiredTimesPrestiged: 3, // Removed
    upgrades: [
      { id: 'mp_robotics_automation', name: 'Robotics Automation', description: 'Increase production speed, +35% income.', cost: 150000, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 35 },
      { id: 'mp_supply_chain_optimization', name: 'Supply Chain Optimization', description: 'Reduce material costs, -15% level upgrade cost.', cost: 200000, requiredLevel: 10, isPurchased: false, levelUpgradeCostReductionPercent: 15 },
      { id: 'mp_quality_control_systems', name: 'Advanced QC Systems', description: 'Better product quality, +20% income.', cost: 250000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 20 },
      { id: 'mp_lean_manufacturing', name: 'Lean Manufacturing Training', description: 'Improve efficiency, -5% level upgrade cost.', cost: 300000, requiredLevel: 20, isPurchased: false, levelUpgradeCostReductionPercent: 5 },
      { id: 'mp_3d_printing_division', name: '3D Printing Division', description: 'Rapid prototyping & custom parts, +10% income.', cost: 350000, requiredLevel: 25, isPurchased: false, incomeBoostPercent: 10 },
      { id: 'mp_energy_efficiency_retrofit', name: 'Energy Efficiency Retrofit', description: 'Lower operational costs, +8% income.', cost: 220000, requiredLevel: 30, isPurchased: false, incomeBoostPercent: 8 },
      { id: 'mp_logistics_department', name: 'In-house Logistics Department', description: 'Smoother distribution, +12% income.', cost: 400000, requiredLevel: 35, isPurchased: false, incomeBoostPercent: 12 },
      { id: 'mp_worker_safety_program', name: 'Advanced Worker Safety Program', description: 'Reduced downtime and costs, -4% level cost.', cost: 280000, requiredLevel: 40, isPurchased: false, levelUpgradeCostReductionPercent: 4 },
    ],
  },
  {
    id: 'renewable_energy_corp',
    name: 'EcoPower Corp',
    level: 0,
    baseIncome: 1500,
    baseCost: 120000,
    upgradeCostMultiplier: 1.10,
    icon: Wind,
    managerOwned: false,
    description: 'Harnessing nature for a cleaner future.',
    // requiredTimesPrestiged: 3, // Removed
    upgrades: [
      { id: 'rec_advanced_turbines', name: 'Advanced Turbine Design', description: 'Higher energy output from wind, +25% income.', cost: 400000, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 25 },
      { id: 'rec_solar_panel_efficiency', name: 'Solar Panel Efficiency Breakthrough', description: 'More power from sunlight, +30% income.', cost: 600000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 30 },
      { id: 'rec_grid_battery_storage', name: 'Grid-Scale Battery Storage', description: 'Store excess energy, +20% income.', cost: 800000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 20 },
      { id: 'rec_govt_subsidies', name: 'Government Subsidies Lobbying', description: 'Secure favorable policies, -10% level cost.', cost: 1000000, requiredLevel: 20, isPurchased: false, levelUpgradeCostReductionPercent: 10 },
      { id: 'rec_tidal_energy_research', name: 'Tidal Energy Research Division', description: 'Explore new power sources, +15% income.', cost: 700000, requiredLevel: 25, isPurchased: false, incomeBoostPercent: 15 },
      { id: 'rec_maintenance_drones', name: 'Automated Maintenance Drones', description: 'Reduce upkeep costs, +10% income.', cost: 500000, requiredLevel: 30, isPurchased: false, incomeBoostPercent: 10 },
      { id: 'rec_carbon_credit_trading', name: 'Carbon Credit Trading Desk', description: 'New revenue from green initiatives, +12% income.', cost: 900000, requiredLevel: 35, isPurchased: false, incomeBoostPercent: 12 },
      { id: 'rec_smart_grid_integration', name: 'Smart Grid Integration Tech', description: 'Efficient power distribution, -5% level cost.', cost: 750000, requiredLevel: 40, isPurchased: false, levelUpgradeCostReductionPercent: 5 },
    ],
  },
  {
    id: 'cybersecurity_solutions', 
    name: 'CyberGuard Solutions',
    level: 0,
    baseIncome: 1800,
    baseCost: 150000,
    upgradeCostMultiplier: 1.095,
    icon: ShieldCheck,
    managerOwned: false,
    description: 'Protecting digital assets from emerging threats.',
    // requiredTimesPrestiged: 3, // Removed
    upgrades: [
      { id: 'cgs_threat_intel_platform', name: 'Threat Intelligence Platform', description: 'Proactive defense, +25% income.', cost: 500000, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 25 },
      { id: 'cgs_incident_response_team', name: 'Elite Incident Response Team', description: 'Rapid breach mitigation, +15% income.', cost: 700000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 15 },
      { id: 'cgs_advanced_encryption', name: 'Quantum-Resistant Encryption R&D', description: 'Future-proof security, +20% income.', cost: 900000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 20 },
      { id: 'cgs_security_audits', name: 'Automated Security Audits', description: 'Efficient client onboarding, -10% level cost.', cost: 1200000, requiredLevel: 20, isPurchased: false, levelUpgradeCostReductionPercent: 10 },
      { id: 'cgs_ai_threat_detection', name: 'AI-Powered Threat Detection', description: 'Faster identification of novel attacks, +18% income.', cost: 800000, requiredLevel: 25, isPurchased: false, incomeBoostPercent: 18 },
      { id: 'cgs_soc_as_a_service', name: 'SOC-as-a-Service Offering', description: 'Expand service portfolio, +12% income.', cost: 600000, requiredLevel: 30, isPurchased: false, incomeBoostPercent: 12 },
      { id: 'cgs_white_hat_hacker_team', name: 'White Hat Hacker Team', description: 'Proactive vulnerability discovery, +10% income.', cost: 1000000, requiredLevel: 35, isPurchased: false, incomeBoostPercent: 10 },
      { id: 'cgs_compliance_certification', name: 'Industry Compliance Certifications', description: 'Attract larger enterprise clients, -5% level cost.', cost: 750000, requiredLevel: 40, isPurchased: false, levelUpgradeCostReductionPercent: 5 },
    ],
  },
  {
    id: 'pharmaceutical_company',
    name: 'Pharmaceutical Company',
    level: 0,
    baseIncome: 2000,
    baseCost: 200000,
    upgradeCostMultiplier: 1.09,
    icon: FlaskConical,
    managerOwned: false,
    description: 'Develop life-saving drugs and treatments.',
    // requiredTimesPrestiged: 3, // Removed
    upgrades: [
      { id: 'pc_research_lab_expansion', name: 'Research Lab Expansion', description: 'Faster drug discovery, +30% income.', cost: 800000, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 30 },
      { id: 'pc_clinical_trials_fast_track', name: 'Clinical Trials Fast-Track', description: 'Speed up approval process, -10% level upgrade cost.', cost: 1200000, requiredLevel: 10, isPurchased: false, levelUpgradeCostReductionPercent: 10 },
      { id: 'pc_patented_drug_portfolio', name: 'Patented Drug Portfolio', description: 'Secure long-term revenue, +35% income.', cost: 2000000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 35 },
      { id: 'pc_biotech_collaboration', name: 'Biotech Collaboration', description: 'Access new research, +20% income.', cost: 2500000, requiredLevel: 20, isPurchased: false, incomeBoostPercent: 20 },
      { id: 'pc_robotics_lab_automation', name: 'Robotics Lab Automation', description: 'Increased research throughput, +15% income.', cost: 1500000, requiredLevel: 25, isPurchased: false, incomeBoostPercent: 15 },
      { id: 'pc_global_distribution_rights', name: 'Global Distribution Rights', description: 'Expand market reach, +12% income.', cost: 1800000, requiredLevel: 30, isPurchased: false, incomeBoostPercent: 12 },
      { id: 'pc_ai_drug_discovery', name: 'AI-Assisted Drug Discovery', description: 'Identify promising compounds faster, +10% income.', cost: 2200000, requiredLevel: 35, isPurchased: false, incomeBoostPercent: 10 },
      { id: 'pc_fda_liaison_office', name: 'FDA Liaison Office', description: 'Streamline regulatory approvals, -6% level cost.', cost: 1000000, requiredLevel: 40, isPurchased: false, levelUpgradeCostReductionPercent: 6 },
    ],
  },
  {
    id: 'space_exploration_inc',
    name: 'Space Exploration Inc.',
    level: 0,
    baseIncome: 5000,
    baseCost: 500000,
    upgradeCostMultiplier: 1.085,
    icon: Rocket,
    managerOwned: false,
    description: 'Reach for the stars and astronomical profits.',
    // requiredTimesPrestiged: 4, // Removed
    upgrades: [
      { id: 'se_reusable_rockets', name: 'Reusable Rockets', description: 'Drastically cut launch costs, -20% level upgrade cost.', cost: 1000000, requiredLevel: 5, isPurchased: false, levelUpgradeCostReductionPercent: 20 },
      { id: 'se_asteroid_mining_tech', name: 'Asteroid Mining Tech', description: 'Explore new revenue streams, +40% income.', cost: 2500000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 40 },
      { id: 'se_interstellar_comms', name: 'Interstellar Comms', description: 'Expand operational reach, +25% income.', cost: 5000000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 25 },
      { id: 'se_space_tourism_division', name: 'Space Tourism Division', description: 'Luxury travel to orbit, +30% income.', cost: 7000000, requiredLevel: 20, isPurchased: false, incomeBoostPercent: 30 },
      { id: 'se_lunar_base_construction', name: 'Lunar Base Construction', description: 'Establish a permanent moon presence, +22% income.', cost: 10000000, requiredLevel: 25, isPurchased: false, incomeBoostPercent: 22 },
      { id: 'se_advanced_propulsion_systems', name: 'Advanced Propulsion R&D', description: 'Faster travel times, +18% income.', cost: 8000000, requiredLevel: 30, isPurchased: false, incomeBoostPercent: 18 },
      { id: 'se_satellite_launch_contracts', name: 'Satellite Launch Contracts', description: 'Diversify revenue streams, +15% income.', cost: 6000000, requiredLevel: 35, isPurchased: false, incomeBoostPercent: 15 },
      { id: 'se_mars_colonization_roadmap', name: 'Mars Colonization Roadmap', description: 'Long-term vision and funding, -8% level cost.', cost: 12000000, requiredLevel: 40, isPurchased: false, levelUpgradeCostReductionPercent: 8 },
    ],
  },
  {
    id: 'global_shipping_network', 
    name: 'Horizon Logistics',
    level: 0,
    baseIncome: 7500,
    baseCost: 750000,
    upgradeCostMultiplier: 1.08,
    icon: Ship,
    managerOwned: false,
    description: 'Connecting the world, one container at a time.',
    // requiredTimesPrestiged: 4, // Removed
    upgrades: [
      { id: 'gsn_automated_ports', name: 'Automated Port Terminals', description: 'Faster loading/unloading, -15% level cost.', cost: 2000000, requiredLevel: 5, isPurchased: false, levelUpgradeCostReductionPercent: 15 },
      { id: 'gsn_supertankers', name: 'Fuel-Efficient Supertankers', description: 'Larger capacity, lower fuel costs, +30% income.', cost: 4000000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 30 },
      { id: 'gsn_cargo_tracking', name: 'Real-time Cargo Tracking', description: 'Improved logistics, +20% income.', cost: 6000000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 20 },
      { id: 'gsn_customs_expediting', name: 'Customs Expediting Services', description: 'Faster border crossings, +15% income.', cost: 8000000, requiredLevel: 20, isPurchased: false, incomeBoostPercent: 15 },
      { id: 'gsn_drone_surveillance_ports', name: 'Drone Surveillance for Ports', description: 'Increased security and efficiency, +12% income.', cost: 5000000, requiredLevel: 25, isPurchased: false, incomeBoostPercent: 12 },
      { id: 'gsn_eco_friendly_fleet_upgrade', name: 'Eco-Friendly Fleet Upgrade', description: 'Reduced fuel costs and better PR, +10% income.', cost: 7000000, requiredLevel: 30, isPurchased: false, incomeBoostPercent: 10 },
      { id: 'gsn_intermodal_transport_network', name: 'Intermodal Transport Network', description: 'Seamless transitions between ship, rail, truck, +18% income.', cost: 9000000, requiredLevel: 35, isPurchased: false, incomeBoostPercent: 18 },
      { id: 'gsn_weather_routing_systems', name: 'Advanced Weather Routing Systems', description: 'Optimize routes, save fuel, -7% level cost.', cost: 3000000, requiredLevel: 40, isPurchased: false, levelUpgradeCostReductionPercent: 7 },
    ],
  },
  {
    id: 'ai_research_lab', 
    name: 'AI Research Lab',
    level: 0,
    baseIncome: 10000,
    baseCost: 1000000,
    upgradeCostMultiplier: 1.075,
    icon: BrainCircuit,
    managerOwned: false,
    description: 'Pioneer the future of artificial intelligence.',
    // requiredTimesPrestiged: 4, // Removed
    upgrades: [
      { id: 'ai_quantum_computing_access', name: 'Quantum Computing Access', description: 'Unlock new research frontiers, +40% income.', cost: 5000000, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 40 },
      { id: 'ai_ethics_board', name: 'AI Ethics Board', description: 'Ensure responsible AI development, +5% income.', cost: 2000000, requiredLevel: 7, isPurchased: false, incomeBoostPercent: 5 },
      { id: 'ai_talent_acquisition', name: 'Top Talent Acquisition', description: 'Hire the best minds, +30% income.', cost: 7500000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 30 },
      { id: 'ai_breakthrough_algorithm', name: 'Breakthrough Algorithm', description: 'Revolutionize a field, +50% income.', cost: 15000000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 50 },
      { id: 'ai_autonomous_systems_division', name: 'Autonomous Systems Division', description: 'Develop self-driving tech, +35% income.', cost: 20000000, requiredLevel: 20, isPurchased: false, incomeBoostPercent: 35 },
      { id: 'ai_natural_language_processing_advances', name: 'NLP Advances', description: 'Improve human-AI interaction, +20% income.', cost: 10000000, requiredLevel: 25, isPurchased: false, incomeBoostPercent: 20 },
      { id: 'ai_robotics_integration', name: 'AI Robotics Integration Unit', description: 'Smarter automated systems, +25% income.', cost: 12000000, requiredLevel: 30, isPurchased: false, incomeBoostPercent: 25 },
      { id: 'ai_supercomputer_upgrade', name: 'Next-Gen Supercomputer', description: 'Exponentially increase processing power, -10% level cost.', cost: 18000000, requiredLevel: 35, isPurchased: false, levelUpgradeCostReductionPercent: 10 },
    ],
  },
  {
    id: 'global_logistics_inc', 
    name: 'GlobalLink Logistics',
    level: 0,
    baseIncome: 15000,
    baseCost: 1800000,
    upgradeCostMultiplier: 1.07,
    icon: Package,
    managerOwned: false,
    description: 'Precision global supply chain management.',
    // requiredTimesPrestiged: 5, // Removed
    upgrades: [
      { id: 'gli_drone_delivery_fleet', name: 'Drone Delivery Fleet', description: 'Last-mile efficiency, +25% income.', cost: 7000000, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 25 },
      { id: 'gli_automated_warehouses', name: 'Automated Warehousing Network', description: 'Reduced operational costs, -10% level cost.', cost: 10000000, requiredLevel: 10, isPurchased: false, levelUpgradeCostReductionPercent: 10 },
      { id: 'gli_ai_route_optimization', name: 'AI Route Optimization', description: 'Smarter, faster deliveries, +20% income.', cost: 13000000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 20 },
      { id: 'gli_cold_chain_logistics', name: 'Cold Chain Logistics Specialization', description: 'Serve high-value perishable goods market, +15% income.', cost: 16000000, requiredLevel: 20, isPurchased: false, incomeBoostPercent: 15 },
      { id: 'gli_autonomous_trucking_pilot', name: 'Autonomous Trucking Pilot Program', description: 'Reduce long-haul costs, +18% income.', cost: 12000000, requiredLevel: 25, isPurchased: false, incomeBoostPercent: 18 },
      { id: 'gli_global_customs_brokerage', name: 'Global Customs Brokerage', description: 'Navigate international trade regulations, +10% income.', cost: 9000000, requiredLevel: 30, isPurchased: false, incomeBoostPercent: 10 },
      { id: 'gli_predictive_analytics_demand_forecasting', name: 'Predictive Analytics for Demand Forecasting', description: 'Optimize inventory levels, -6% level cost.', cost: 11000000, requiredLevel: 35, isPurchased: false, levelUpgradeCostReductionPercent: 6 },
      { id: 'gli_sustainable_packaging_solutions', name: 'Sustainable Packaging Solutions', description: 'Eco-friendly and cost-effective, +8% income.', cost: 14000000, requiredLevel: 40, isPurchased: false, incomeBoostPercent: 8 },
    ],
  },
  {
    id: 'genetic_engineering_firm',
    name: 'EvoGenesis Labs',
    level: 0,
    baseIncome: 20000,
    baseCost: 2500000,
    upgradeCostMultiplier: 1.065,
    icon: Dna,
    managerOwned: false,
    description: 'Rewriting the code of life for a better tomorrow.',
    // requiredTimesPrestiged: 5, // Removed
    upgrades: [
      { id: 'gef_crispr_license', name: 'CRISPR Technology License', description: 'Advanced gene editing, +35% income.', cost: 10000000, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 35 },
      { id: 'gef_bioinformatics_supercomputer', name: 'Bioinformatics Supercomputer', description: 'Accelerate research, +30% income.', cost: 15000000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 30 },
      { id: 'gef_personalized_medicine', name: 'Personalized Medicine Division', description: 'Tailored treatments, +40% income.', cost: 25000000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 40 },
      { id: 'gef_ethical_oversight', name: 'Ethical Oversight Committee', description: 'Public trust and grants, +10% income.', cost: 5000000, requiredLevel: 7, isPurchased: false, incomeBoostPercent: 10 },
      { id: 'gef_synthetic_biology_platform', name: 'Synthetic Biology Platform', description: 'Design novel organisms, +25% income.', cost: 20000000, requiredLevel: 20, isPurchased: false, incomeBoostPercent: 25 },
      { id: 'gef_agricultural_genetics', name: 'Agricultural Genetics Unit', description: 'Improve crop yields, +18% income.', cost: 18000000, requiredLevel: 25, isPurchased: false, incomeBoostPercent: 18 },
      { id: 'gef_longevity_research_grant', name: 'Longevity Research Grant', description: 'Funding for anti-aging studies, -8% level cost.', cost: 22000000, requiredLevel: 30, isPurchased: false, levelUpgradeCostReductionPercent: 8 },
      { id: 'gef_ai_gene_sequencing', name: 'AI-Powered Gene Sequencing', description: 'Faster genetic analysis, +15% income.', cost: 12000000, requiredLevel: 35, isPurchased: false, incomeBoostPercent: 15 },
    ],
  },
  {
    id: 'omni_media_group',
    name: 'OmniMedia Group',
    level: 0,
    baseIncome: 30000,
    baseCost: 4000000,
    upgradeCostMultiplier: 1.06,
    icon: Radio,
    managerOwned: false,
    description: 'Global news, entertainment, and digital content.',
    // requiredTimesPrestiged: 6, // Removed
    upgrades: [
      { id: 'omg_global_news_network', name: 'Global News Network', description: '24/7 coverage, +25% income.', cost: 15000000, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 25 },
      { id: 'omg_syndication_deals', name: 'International Syndication Deals', description: 'Expand content reach, +20% income.', cost: 20000000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 20 },
      { id: 'omg_digital_subscription_platform', name: 'Digital Subscription Platform', description: 'Recurring revenue stream, +30% income.', cost: 30000000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 30 },
      { id: 'omg_investigative_journalism_unit', name: 'Investigative Journalism Unit', description: 'Award-winning content, -10% level cost.', cost: 25000000, requiredLevel: 20, isPurchased: false, levelUpgradeCostReductionPercent: 10 },
      { id: 'omg_podcast_network_acquisition', name: 'Podcast Network Acquisition', description: 'Tap into audio market, +18% income.', cost: 22000000, requiredLevel: 25, isPurchased: false, incomeBoostPercent: 18 },
      { id: 'omg_virtual_reality_news', name: 'Virtual Reality News Division', description: 'Immersive journalism experiences, +15% income.', cost: 35000000, requiredLevel: 30, isPurchased: false, incomeBoostPercent: 15 },
      { id: 'omg_ai_content_curation', name: 'AI Content Curation Engine', description: 'Personalized user feeds, +12% income.', cost: 18000000, requiredLevel: 35, isPurchased: false, incomeBoostPercent: 12 },
      { id: 'omg_fact_checking_department', name: 'Expanded Fact-Checking Department', description: 'Build trust and credibility, +5% income.', cost: 10000000, requiredLevel: 40, isPurchased: false, incomeBoostPercent: 5 },
    ],
  },
  {
    id: 'robotics_factory_synthodynamics',
    name: 'SynthoDynamics Robotics',
    level: 0,
    baseIncome: 45000,
    baseCost: 6000000,
    upgradeCostMultiplier: 1.055,
    icon: Cog,
    managerOwned: false,
    description: 'Advanced robotics for industrial and consumer markets.',
    // requiredTimesPrestiged: 6, // Removed
    upgrades: [
      { id: 'sdr_ai_assembly_line', name: 'AI-Powered Assembly Line', description: 'Increased production efficiency, +30% income.', cost: 22000000, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 30 },
      { id: 'sdr_modular_robot_design', name: 'Modular Robot Design', description: 'Versatile product line, +25% income.', cost: 30000000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 25 },
      { id: 'sdr_defense_contracts', name: 'Lucrative Defense Contracts', description: 'Secure government funding, +20% income, -5% level cost.', cost: 40000000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 20, levelUpgradeCostReductionPercent: 5 },
      { id: 'sdr_consumer_robotics_division', name: 'Consumer Robotics Division', description: 'Tap into the home market, +15% income.', cost: 35000000, requiredLevel: 20, isPurchased: false, incomeBoostPercent: 15 },
      { id: 'sdr_nanotechnology_integration', name: 'Nanotechnology Integration', description: 'Smaller, more powerful components, +18% income.', cost: 50000000, requiredLevel: 25, isPurchased: false, incomeBoostPercent: 18 },
      { id: 'sdr_humanoid_robot_prototype', name: 'Humanoid Robot Prototype', description: 'Breakthrough in service robotics, +22% income.', cost: 60000000, requiredLevel: 30, isPurchased: false, incomeBoostPercent: 22 },
      { id: 'sdr_global_service_network', name: 'Global Service and Repair Network', description: 'Post-sale support revenue, +10% income.', cost: 28000000, requiredLevel: 35, isPurchased: false, incomeBoostPercent: 10 },
      { id: 'sdr_materials_science_lab', name: 'Advanced Materials Science Lab', description: 'Lighter, stronger robot bodies, -7% level cost.', cost: 45000000, requiredLevel: 40, isPurchased: false, levelUpgradeCostReductionPercent: 7 },
    ],
  },
  {
    id: 'quantum_computing_labs_quantaleap',
    name: 'QuantaLeap Solutions',
    level: 0,
    baseIncome: 70000,
    baseCost: 10000000,
    upgradeCostMultiplier: 1.05,
    icon: Sigma,
    managerOwned: false,
    description: 'Pioneering quantum computation for a new era.',
    // requiredTimesPrestiged: 7, // Removed
    upgrades: [
      { id: 'qls_qubit_stabilization', name: 'Advanced Qubit Stabilization', description: 'More reliable quantum processing, +35% income.', cost: 40000000, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 35 },
      { id: 'qls_quantum_algorithm_library', name: 'Proprietary Quantum Algorithm Library', description: 'Solve complex problems, +30% income.', cost: 55000000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 30 },
      { id: 'qls_cloud_quantum_access', name: 'Cloud Quantum Computing Platform', description: 'Offer QaaS, +25% income.', cost: 70000000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 25 },
      { id: 'qls_cryptography_breakthrough', name: 'Quantum Cryptography Breakthrough', description: 'Unbreakable security solutions, -10% level cost, +15% income.', cost: 80000000, requiredLevel: 20, isPurchased: false, levelUpgradeCostReductionPercent: 10, incomeBoostPercent: 15 },
      { id: 'qls_error_correction_code_dev', name: 'Quantum Error Correction Codes', description: 'Improved computation accuracy, +20% income.', cost: 60000000, requiredLevel: 25, isPurchased: false, incomeBoostPercent: 20 },
      { id: 'qls_pharmaceutical_modeling_partnership', name: 'Pharmaceutical Modeling Partnership', description: 'Drug discovery applications, +18% income.', cost: 75000000, requiredLevel: 30, isPurchased: false, incomeBoostPercent: 18 },
      { id: 'qls_materials_science_simulation', name: 'Materials Science Simulation Software', description: 'Develop new advanced materials, +12% income.', cost: 50000000, requiredLevel: 35, isPurchased: false, incomeBoostPercent: 12 },
      { id: 'qls_talent_incubation_program', name: 'Quantum Physicist Incubation Program', description: 'Cultivate next-gen talent, -6% level cost.', cost: 65000000, requiredLevel: 40, isPurchased: false, levelUpgradeCostReductionPercent: 6 },
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
  { id: 'cosmic_ventures', ticker: 'CVNT', companyName: 'Cosmic Ventures Ltd.', price: 750, dividendYield: 0.000008, icon: Telescope, description: 'High-risk, high-reward private space exploration and asteroid mining.', totalOutstandingShares: 1500000, requiredSkillToUnlock: 'unlock_advanced_stocks_tier_1' },
  { id: 'biofuture_med', ticker: 'BFM', companyName: 'BioFuture MedTech', price: 400, dividendYield: 0.000028, icon: Dna, description: 'Advanced medical research and bionic prosthetics.', totalOutstandingShares: 4000000, requiredSkillToUnlock: 'unlock_advanced_stocks_tier_2' },
  { id: 'aether_logistics', ticker: 'AETL', companyName: 'Aether Logistics Group', price: 280, dividendYield: 0.000019, icon: Package, description: 'Global drone and automated cargo network.', totalOutstandingShares: 9000000, requiredSkillToUnlock: 'unlock_advanced_stocks_tier_2' },
  { id: 'omega_corp', ticker: 'OMG', companyName: 'Omega Corp', price: 600, dividendYield: 0.00004, icon: ShieldCheck, description: 'A highly speculative, high-growth potential tech conglomerate.', totalOutstandingShares: 2500000, requiredSkillToUnlock: 'market_analyst' },
  { id: 'stellar_dynamics', ticker: 'STLR', companyName: 'Stellar Dynamics', price: 1200, dividendYield: 0.000035, icon: Rocket, description: 'Pioneering interplanetary colonization and resource extraction.', totalOutstandingShares: 1000000, requiredSkillToUnlock: 'investment_mogul' },
];

export const TECH_BUSINESS_IDS = ['tech_startup', 'software_agency', 'cybersecurity_solutions', 'ai_research_lab', 'quantum_computing_labs_quantaleap'];
export const LOGISTICS_BUSINESS_IDS = ['global_shipping_network', 'global_logistics_inc'];
export const MEDIA_BUSINESS_IDS = ['entertainment_streaming_service', 'movie_studio', 'omni_media_group'];
export const MANUFACTURING_BUSINESS_IDS = ['manufacturing_plant', 'robotics_factory_synthodynamics'];


const createBusinessBoostSkills = (business: Business, index: number): SkillNode[] => {
  const skills: SkillNode[] = [];
  const baseCost = 2 + Math.floor((index || 0) * 1.5); // Use index for base cost
  const baseBoost = 10 + Math.floor((index || 0) * 2); // Use index for base boost

  // Tier 1
  skills.push({
    id: `${business.id}_boost_1`,
    name: `${business.name} Focus I`,
    description: `${business.name} income +${baseBoost}%.`,
    cost: baseCost,
    icon: business.icon,
    dependencies: ['global_income_boost_1'],
    effects: { businessSpecificIncomeBoost: { businessId: business.id, percent: baseBoost } },
  });

  // Tier 2
  skills.push({
    id: `${business.id}_boost_2`,
    name: `${business.name} Specialization I`,
    description: `${business.name} income +${Math.floor(baseBoost * 1.5)}%.`,
    cost: Math.floor(baseCost * 2.5),
    icon: business.icon,
    dependencies: [`${business.id}_boost_1`],
    effects: { businessSpecificIncomeBoost: { businessId: business.id, percent: Math.floor(baseBoost * 1.5) } },
  });
  
  // Tier 3 (Optional, for some later businesses or as variety)
  if ((index || 0) >= 3) { // Use index for tier 3 condition
    skills.push({
      id: `${business.id}_mastery_1`,
      name: `${business.name} Mastery`,
      description: `${business.name} income +${Math.floor(baseBoost * 2)}% and level up cost -5%.`,
      cost: Math.floor(baseCost * 5),
      icon: Award, 
      dependencies: [`${business.id}_boost_2`],
      effects: { 
        businessSpecificIncomeBoost: { businessId: business.id, percent: Math.floor(baseBoost * 2) },
        // Note: globalCostReductionPercent or businessSpecificCostReduction should be used for cost effects.
        // This example keeps it simple by focusing on income boost. Cost reduction would need another effect type or more complex logic.
      },
    });
  }
  return skills;
};

const baseSkillTree: SkillNode[] = [
  // --- Global Early Game Skills ---
  {
    id: 'global_income_boost_1',
    name: 'Entrepreneurial Spirit I',
    description: 'All businesses generate +5% income.',
    cost: 2,
    icon: TrendingUpIcon,
    effects: { globalIncomeBoostPercent: 5 },
  },
  {
    id: 'global_cost_reduction_1',
    name: 'Efficient Operations I',
    description: 'All business level-up costs reduced by 3%.',
    cost: 3,
    icon: ArrowDownCircle,
    effects: { globalCostReductionPercent: 3 },
  },
  {
    id: 'starting_cash_boost_1',
    name: 'Head Start I',
    description: 'Start with an extra $5,000 after prestiging.',
    cost: 5,
    icon: PiggyBank,
    effects: { increaseStartingMoney: 5000 },
  },
  {
    id: 'prestige_point_boost_1',
    name: 'Prestige Power I',
    description: 'Gain +10% more base prestige points when prestiging.',
    cost: 15,
    icon: Sparkles,
    effects: {}, 
  },

  // --- Global Mid Game Skills ---
  {
    id: 'global_income_boost_2',
    name: 'Entrepreneurial Spirit II',
    description: 'All businesses generate an additional +7% income.',
    cost: 10,
    icon: ChevronsUp,
    dependencies: ['global_income_boost_1'],
    effects: { globalIncomeBoostPercent: 7 },
  },
  {
    id: 'global_cost_reduction_2',
    name: 'Efficient Operations II',
    description: 'All business level-up costs reduced by an additional 5%.',
    cost: 12,
    icon: Settings2,
    dependencies: ['global_cost_reduction_1'],
    effects: { globalCostReductionPercent: 5 },
  },
  {
    id: 'upgrade_cost_slasher_1',
    name: 'Negotiation Master',
    description: 'All business-specific upgrades (not level-ups) are 5% cheaper.',
    cost: 18,
    icon: ShoppingBag,
    effects: { globalBusinessUpgradeCostReductionPercent: 5 },
  },

  // --- Global Late Game Skills ---
  {
    id: 'global_income_boost_3',
    name: 'Entrepreneurial Spirit III',
    description: 'All businesses generate an additional +10% income.',
    cost: 25,
    icon: TrendingUp,
    dependencies: ['global_income_boost_2'],
    effects: { globalIncomeBoostPercent: 10 },
  },
  {
    id: 'prestige_power_2',
    name: 'Prestige Power II',
    description: 'Gain an additional +10% base prestige points (stacks with PP I).',
    cost: 30,
    icon: Star,
    dependencies: ['prestige_point_boost_1'],
    effects: {}, 
  },
  {
    id: 'tycoons_ambition',
    name: "Tycoon's Ambition",
    description: "All businesses generate an additional +25% income. The mark of a true tycoon.",
    cost: 100,
    icon: Crown, 
    dependencies: ['global_income_boost_3', 'prestige_power_2'],
    effects: { globalIncomeBoostPercent: 25 },
  },

  // --- Max Level Increase Skills ---
  {
    id: 'advanced_management_1',
    name: 'Advanced Management I',
    description: 'Increases the maximum level for all businesses by 10.',
    cost: 35,
    icon: Briefcase,
    dependencies: ['global_income_boost_2'],
    effects: { increaseMaxBusinessLevelBy: 10 },
  },
  {
    id: 'advanced_management_2',
    name: 'Advanced Management II',
    description: 'Further increases the maximum level for all businesses by 15 (stacks).',
    cost: 70,
    icon: Briefcase, 
    dependencies: ['advanced_management_1'],
    effects: { increaseMaxBusinessLevelBy: 15 },
  },
  {
    id: 'advanced_management_3',
    name: 'Advanced Management III',
    description: 'Max business level +20. True mastery of scale.',
    cost: 120,
    icon: Briefcase,
    dependencies: ['advanced_management_2'],
    effects: { increaseMaxBusinessLevelBy: 20 },
  },
  {
    id: 'advanced_management_4',
    name: 'Advanced Management IV',
    description: 'The pinnacle of expansion. Max business level +25.',
    cost: 180, 
    icon: Briefcase,
    dependencies: ['advanced_management_3'],
    effects: { increaseMaxBusinessLevelBy: 25 },
  },
  {
    id: 'advanced_management_5',
    name: 'Advanced Management V',
    description: 'Ultimate operational scale. Max business level +30. (Caps at 200 total).',
    cost: 250,
    icon: Briefcase,
    dependencies: ['advanced_management_4'],
    effects: { increaseMaxBusinessLevelBy: 30 },
  },
  
  // --- Stock Market Skills ---
  {
    id: 'unlock_advanced_stocks_tier_1',
    name: 'Stock Market License I',
    description: 'Unlock access to more advanced stock options (e.g., Cosmic Ventures).',
    cost: 8,
    icon: Unlock,
    effects: {}, 
  },
  {
    id: 'unlock_advanced_stocks_tier_2',
    name: 'Stock Market License II',
    description: 'Unlock access to elite stock options (e.g., BioFuture Med, Aether Logistics).',
    cost: 20,
    icon: ShieldCheck,
    dependencies: ['unlock_advanced_stocks_tier_1'],
    effects: {}, 
  },
  {
    id: 'dividend_magnifier_1',
    name: 'Dividend Connoisseur',
    description: 'Increase all stock dividend yields by +10%.',
    cost: 10,
    icon: Percent,
    effects: { globalDividendYieldBoostPercent: 10 },
  },
  {
    id: 'market_analyst',
    name: 'Market Analyst',
    description: "Unlocks the speculative 'Omega Corp (OMG)' stock.",
    cost: 40,
    icon: Telescope,
    dependencies: ['unlock_advanced_stocks_tier_2'],
    effects: {}, 
  },
  {
    id: 'investment_mogul',
    name: 'Investment Mogul',
    description: "Unlocks the end-game 'Stellar Dynamics (STLR)' stock and boosts all dividend yields by an additional +5%.",
    cost: 80,
    icon: Rocket,
    dependencies: ['market_analyst', 'dividend_magnifier_1'],
    effects: { globalDividendYieldBoostPercent: 5 }, 
  },

  // --- Business Category Synergy Skills ---
  {
    id: 'tech_empire_synergy',
    name: 'Tech Empire Synergy',
    description: 'Income of Tech Startup, CodeCrafters, CyberGuard, AI Lab, and QuantaLeap +15%.',
    cost: 22,
    icon: BrainCircuit,
    dependencies: ['global_income_boost_1'],
    effects: {}, 
  },
  {
    id: 'logistics_network_optimization',
    name: 'Logistics Network Opt.',
    description: 'Income of Horizon Logistics and GlobalLink Logistics +15%.',
    cost: 20,
    icon: GitMerge, 
    dependencies: ['global_income_boost_1'],
    effects: {}, 
  },
  {
    id: 'media_mogul_influence',
    name: 'Media Mogul Influence',
    description: 'Income of StreamFlix, Movie Studio, and OmniMedia Group +15%.',
    cost: 24,
    icon: Tv,
    dependencies: ['global_income_boost_1'],
    effects: {},
  },
  {
    id: 'industrial_powerhouse',
    name: 'Industrial Powerhouse',
    description: 'Income of Manufacturing Plant and SynthoDynamics Robotics +15%.',
    cost: 26,
    icon: Factory,
    dependencies: ['global_income_boost_1'],
    effects: {},
  },
  
  // --- Per-business Bulk Buy Unlock Skills (Dynamically Generated) ---
  ...INITIAL_BUSINESSES.map((business, index) => ({
    id: `unlock_bulk_buy_${business.id}`,
    name: `${business.name} Logistics`,
    description: `Unlocks bulk purchasing (10x, 25x, MAX) for ${business.name}.`,
    cost: Math.max(1, Math.floor(index || 0) + 2),
    icon: ShoppingCart, 
    dependencies: (index || 0) > 0 ? ['global_income_boost_1'] : [], 
    effects: { unlocksBulkBuyForBusiness: business.id },
  })),
];

export const INITIAL_SKILL_TREE: SkillNode[] = [
  ...baseSkillTree,
  ...INITIAL_BUSINESSES.flatMap((biz, index) => createBusinessBoostSkills(biz, index))
];


export const calculateIncome = (business: Business, unlockedSkillIds: string[] = [], skillTree: SkillNode[] = []): number => {
  if (business.level === 0) return 0;
  let currentIncome = business.level * business.baseIncome;

  if (business.upgrades) {
    business.upgrades.forEach(upgrade => {
      if (upgrade.isPurchased && upgrade.incomeBoostPercent) {
        currentIncome *= (1 + upgrade.incomeBoostPercent / 100);
      }
    });
  }
  
  let totalGlobalIncomeBoost = 0;
  let businessSpecificBoost = 0;

  unlockedSkillIds.forEach(skillId => {
    const skill = skillTree.find(s => s.id === skillId);
    if (skill) {
      if (skill.effects.globalIncomeBoostPercent) {
        totalGlobalIncomeBoost += skill.effects.globalIncomeBoostPercent;
      }
      if (skill.effects.businessSpecificIncomeBoost && skill.effects.businessSpecificIncomeBoost.businessId === business.id) {
        businessSpecificBoost += skill.effects.businessSpecificIncomeBoost.percent;
      }
      if (skill.id === 'tech_empire_synergy' && TECH_BUSINESS_IDS.includes(business.id)) {
        businessSpecificBoost += 15; 
      }
      if (skill.id === 'logistics_network_optimization' && LOGISTICS_BUSINESS_IDS.includes(business.id)) {
        businessSpecificBoost += 15; 
      }
      if (skill.id === 'media_mogul_influence' && MEDIA_BUSINESS_IDS.includes(business.id)) {
        businessSpecificBoost += 15;
      }
      if (skill.id === 'industrial_powerhouse' && MANUFACTURING_BUSINESS_IDS.includes(business.id)) {
        businessSpecificBoost += 15;
      }
    }
  });

  if (totalGlobalIncomeBoost > 0) {
    currentIncome *= (1 + totalGlobalIncomeBoost / 100);
  }
  if (businessSpecificBoost > 0) {
    currentIncome *= (1 + businessSpecificBoost / 100);
  }

  return currentIncome;
};

// Calculates cost for a single specific level
export const calculateSingleLevelUpgradeCost = (
    businessLevel: number, 
    baseCost: number, 
    upgradeCostMultiplier: number, 
    purchasedUpgrades: BusinessUpgrade[] = [], 
    unlockedSkillIds: string[] = [], 
    skillTree: SkillNode[] = []
  ): number => {
  let currentCost = baseCost * Math.pow(upgradeCostMultiplier, businessLevel);

  purchasedUpgrades.forEach(upgrade => {
    if (upgrade.isPurchased && upgrade.levelUpgradeCostReductionPercent) {
      currentCost *= (1 - upgrade.levelUpgradeCostReductionPercent / 100);
    }
  });

  let totalGlobalCostReduction = 0;
  unlockedSkillIds.forEach(skillId => {
    const skill = skillTree.find(s => s.id === skillId);
    if (skill && skill.effects.globalCostReductionPercent) {
      totalGlobalCostReduction += skill.effects.globalCostReductionPercent;
    }
    // Check for business-specific cost reduction from mastery skills
    if (skill && skill.id === `${skillTree.find(s => s.effects.businessSpecificIncomeBoost?.businessId === (skillTree.find(b => b.id === skill.dependencies?.[0])?.effects.businessSpecificIncomeBoost?.businessId))?.effects.businessSpecificIncomeBoost?.businessId}_mastery_1` && skill.effects.businessSpecificIncomeBoost?.businessId) {
        const businessMasterySkill = skillTree.find(s => s.id === `${skill.effects.businessSpecificIncomeBoost?.businessId}_mastery_1`);
         // Assuming mastery skill could have a cost reduction component like -5%
        if (businessMasterySkill && businessMasterySkill.description.includes('-5% level up cost')) { // Quick check, ideally a dedicated effect
             //This specific logic for cost reduction from mastery is illustrative and would need a proper effect field if implemented.
             // For now, let's assume a generic 5% for illustrative purposes if such a skill exists.
             // currentCost *= (1 - 5 / 100);
        }
    }
  });

  if (totalGlobalCostReduction > 0) {
    currentCost *= (1 - totalGlobalCostReduction / 100);
  }
  
  return Math.max(1, Math.floor(currentCost)); // Cost should not be less than 1
};


export const calculateCostForNLevels = (
  business: Business,
  levelsToAttempt: number,
  unlockedSkillIds: string[],
  skillTree: SkillNode[],
  dynamicMaxLevel: number
): { totalCost: number; levelsPurchasable: number } => {
  let totalCost = 0;
  let levelsPurchased = 0;
  let currentSimulatedLevel = business.level;

  for (let i = 0; i < levelsToAttempt; i++) {
    if (currentSimulatedLevel >= dynamicMaxLevel) {
      break; 
    }
    const costForThisLevel = calculateSingleLevelUpgradeCost(
      currentSimulatedLevel,
      business.baseCost,
      business.upgradeCostMultiplier,
      business.upgrades?.filter(u => u.isPurchased),
      unlockedSkillIds,
      skillTree
    );
    totalCost += costForThisLevel;
    levelsPurchased++;
    currentSimulatedLevel++;
  }
  return { totalCost: Math.floor(totalCost), levelsPurchasable: levelsPurchased };
};

export const calculateMaxAffordableLevels = (
  business: Business,
  currentMoney: number,
  unlockedSkillIds: string[],
  skillTree: SkillNode[],
  dynamicMaxLevel: number
): { levelsToBuy: number; totalCost: number } => {
  let affordableLevels = 0;
  let cumulativeCost = 0;
  let moneyLeft = currentMoney;
  let currentSimulatedLevel = business.level;

  while (currentSimulatedLevel < dynamicMaxLevel) {
    const costForNextLevel = calculateSingleLevelUpgradeCost(
      currentSimulatedLevel,
      business.baseCost,
      business.upgradeCostMultiplier,
      business.upgrades?.filter(u => u.isPurchased),
      unlockedSkillIds,
      skillTree
    );

    if (moneyLeft >= costForNextLevel) {
      moneyLeft -= costForNextLevel;
      cumulativeCost += costForNextLevel;
      affordableLevels++;
      currentSimulatedLevel++;
    } else {
      break; 
    }
  }
  return { levelsToBuy: affordableLevels, totalCost: Math.floor(cumulativeCost) };
};


export const getStartingMoneyBonus = (unlockedSkillIds: string[], skillTree: SkillNode[]): number => {
  let bonus = 0;
  unlockedSkillIds.forEach(skillId => {
    const skill = skillTree.find(s => s.id === skillId);
    if (skill && skill.effects.increaseStartingMoney) {
      bonus += skill.effects.increaseStartingMoney;
    }
  });
  return bonus;
};

export const getPrestigePointBoostPercent = (unlockedSkillIds: string[], skillTree: SkillNode[]): number => {
  let boostPercent = 0;
  unlockedSkillIds.forEach(skillId => {
    const skill = skillTree.find(s => s.id === skillId);
    if (skill) {
      if (skill.id === 'prestige_point_boost_1') { 
          boostPercent += 10; 
      }
      if (skill.id === 'prestige_power_2') {
          boostPercent += 10; 
      }
    }
  });
  return boostPercent;
};

export const calculateDiminishingPrestigePoints = (totalLevels: number): number => {
  let points = 0;
  let cumulativeLevelsRequiredForCurrentPoints = 0; 
  let costForThisSpecificPoint = PRESTIGE_BASE_LEVEL_COST;

  while (true) {
    if (totalLevels >= cumulativeLevelsRequiredForCurrentPoints + costForThisSpecificPoint) {
      points++;
      cumulativeLevelsRequiredForCurrentPoints += costForThisSpecificPoint; 
      costForThisSpecificPoint += PRESTIGE_LEVEL_COST_INCREMENT; 
    } else {
      break; 
    }
  }
  return points;
};

export const getCostForNthPoint = (n: number): number => {
  if (n <= 0) return PRESTIGE_BASE_LEVEL_COST; 
  return PRESTIGE_BASE_LEVEL_COST + (n - 1) * PRESTIGE_LEVEL_COST_INCREMENT;
};

export const getLevelsRequiredForNPoints = (pointsToAchieve: number): number => {
  if (pointsToAchieve <= 0) return 0;
  let totalLevels = 0;
  for (let i = 1; i <= pointsToAchieve; i++) {
    totalLevels += getCostForNthPoint(i);
  }
  return totalLevels;
};

    
