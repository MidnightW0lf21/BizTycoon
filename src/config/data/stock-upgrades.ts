import type { StockUpgrade } from '@/types';
import { INITIAL_STOCKS } from './stocks';
import { Building, Cpu, Zap, FlaskConical, Landmark, Briefcase, TrendingUp, Lightbulb, Dna, TelescopeIcon, Package, ShieldAlert, Rocket, Bitcoin, BrainCircuit, AtomIcon, Building2 } from 'lucide-react';

export const INITIAL_STOCK_UPGRADES: StockUpgrade[] = [
  {
    id: 'gc_div_boost_1',
    name: 'GC Dividend Program',
    description: 'A corporate initiative to increase shareholder value. Boosts Global Corp dividend yield by 10%.',
    costMoney: 10000000,
    costPrestigePoints: 5,
    targetStockId: 'global_corp',
    icon: Building,
    effects: { dividendYieldBoost: 0.000002 },
  },
  {
    id: 'tinv_rd_breakthrough_1',
    name: 'TINV R&D Breakthrough',
    description: 'A major technological leap increases profitability. Boosts Tech Innovations dividend yield by 15%.',
    costMoney: 25000000,
    costPrestigePoints: 10,
    targetStockId: 'tech_innovations',
    icon: Cpu,
    effects: { dividendYieldBoost: 0.0000015 },
  },
  {
    id: 'gec_gov_subsidies_1',
    name: 'GEC Government Subsidies',
    description: 'Securing government subsidies for green energy. Boosts Green Energy Co. dividend yield by 20%.',
    costMoney: 15000000,
    costPrestigePoints: 8,
    targetStockId: 'green_energy_co',
    icon: Zap,
    effects: { dividendYieldBoost: 0.000003 },
  },
  {
    id: 'aprx_fda_approval_1',
    name: 'APRX Fast-Track Approval',
    description: 'A new blockbuster drug gets FDA approval ahead of schedule. Boosts Alpha Pharmaceuticals dividend yield by 12%.',
    costMoney: 30000000,
    costPrestigePoints: 12,
    targetStockId: 'alpha_pharma',
    icon: FlaskConical,
    effects: { dividendYieldBoost: 0.000003 },
  },
  {
    id: 'sre_zoning_deal_1',
    name: 'SRE Zoning Approval',
    description: 'Successfully lobbied for favorable zoning, unlocking new high-value development projects. Boosts SRE dividend yield by 15%.',
    costMoney: 12000000,
    costPrestigePoints: 6,
    targetStockId: 'summit_real_estate',
    icon: Landmark,
    effects: { dividendYieldBoost: 0.0000027 },
  },
  {
    id: 'bth_synergy_initiative_1',
    name: 'BTH Synergy Initiative',
    description: 'A corporate-wide initiative to improve synergy between subsidiaries. Boosts BTH dividend yield by 10%.',
    costMoney: 40000000,
    costPrestigePoints: 15,
    targetStockId: 'biz_tycoon_holdings',
    icon: Briefcase,
    effects: { dividendYieldBoost: 0.000003 },
  },
  {
    id: 'mmtr_battery_tech_1',
    name: 'MMTR Battery Breakthrough',
    description: 'A leap in battery technology lowers production costs and boosts profitability. Boosts MMTR dividend yield by 20%.',
    costMoney: 18000000,
    costPrestigePoints: 9,
    targetStockId: 'momentum_motors',
    icon: TrendingUp,
    effects: { dividendYieldBoost: 0.0000024 },
  },
  {
    id: 'qlc_qubit_stabilization_1',
    name: 'QLC Qubit Stabilization',
    description: 'A new technique for maintaining quantum coherence allows for more powerful computers. Boosts QLC dividend yield by 22%.',
    costMoney: 50000000,
    costPrestigePoints: 18,
    targetStockId: 'quantum_leap_computing',
    icon: Lightbulb,
    effects: { dividendYieldBoost: 0.0000011 },
  },
  {
    id: 'bsg_crispr_license_1',
    name: 'BSG Exclusive CRISPR License',
    description: 'Secures an exclusive license for next-gen gene editing technology. Boosts BSG dividend yield by 15%.',
    costMoney: 20000000,
    costPrestigePoints: 11,
    targetStockId: 'biosynth_genetics',
    icon: Dna,
    effects: { dividendYieldBoost: 0.0000033 },
  },
  {
    id: 'cvnt_asteroid_discovery_1',
    name: 'CVNT Rich Asteroid Find',
    description: 'Discovered an asteroid rich in rare-earth metals, securing massive future profits. Boosts CVNT dividend yield by 30%.',
    costMoney: 80000000,
    costPrestigePoints: 22,
    targetStockId: 'cosmic_ventures',
    icon: TelescopeIcon,
    effects: { dividendYieldBoost: 0.0000024 },
  },
  {
    id: 'bfm_bionic_limb_contract_1',
    name: 'BFM Military Contract',
    description: 'Signs a lucrative contract to supply advanced bionic limbs to the military. Boosts BFM dividend yield by 14%.',
    costMoney: 45000000,
    costPrestigePoints: 16,
    targetStockId: 'biofuture_med',
    icon: Dna,
    effects: { dividendYieldBoost: 0.00000392 },
  },
  {
    id: 'aetl_drone_network_expansion_1',
    name: 'AETL Network Expansion',
    description: 'Completes a major expansion of its automated delivery network. Boosts AETL dividend yield by 18%.',
    costMoney: 28000000,
    costPrestigePoints: 14,
    targetStockId: 'aether_logistics',
    icon: Package,
    effects: { dividendYieldBoost: 0.00000342 },
  },
  {
    id: 'crypx_security_audit_1',
    name: 'CRYPX Security Overhaul',
    description: 'A successful security audit boosts user trust and trading volume. Boosts CRYPX dividend yield by 50%.',
    costMoney: 5000000,
    costPrestigePoints: 4,
    targetStockId: 'crypto_currency_exchange',
    icon: Bitcoin,
    effects: { dividendYieldBoost: 0.0000005 },
  },
  {
    id: 'omg_speculative_tech_1',
    name: 'OMG Speculative Bet Pays Off',
    description: 'A high-risk research project yields incredible results. Boosts Omega Corp dividend yield by 25%.',
    costMoney: 100000000,
    costPrestigePoints: 25,
    targetStockId: 'omega_corp',
    icon: ShieldAlert,
    effects: { dividendYieldBoost: 0.00001 },
  },
  {
    id: 'stlr_mars_contract_1',
    name: 'STLR Exclusive Mars Contract',
    description: 'Secures the sole contract for Martian colonization infrastructure. Boosts Stellar Dynamics dividend yield by 18%.',
    costMoney: 250000000,
    costPrestigePoints: 40,
    targetStockId: 'stellar_dynamics',
    icon: Rocket,
    effects: { dividendYieldBoost: 0.0000063 },
  },
  {
    id: 'gc_global_synergy_2',
    name: 'GC Global Synergy',
    description: 'A massive restructuring improves synergy across all of Global Corp\'s ventures, unlocking significant value. Boosts dividend yield by an additional 18%.',
    costMoney: 500000000,
    costPrestigePoints: 50,
    targetStockId: 'global_corp',
    icon: TrendingUp,
    effects: { dividendYieldBoost: 0.0000036 },
  },
  {
    id: 'tinv_ai_integration_2',
    name: 'TINV AI Integration',
    description: 'Integrating a new powerful AI across all product lines streamlines R&D and production. Boosts dividend yield by an additional 25%.',
    costMoney: 750000000,
    costPrestigePoints: 65,
    targetStockId: 'tech_innovations',
    icon: BrainCircuit,
    effects: { dividendYieldBoost: 0.0000025 },
  },
  {
    id: 'gec_fusion_research_2',
    name: 'GEC Fusion Research',
    description: 'A breakthrough in fusion research promises a future of limitless clean energy. Boosts dividend yield by an additional 30%.',
    costMoney: 600000000,
    costPrestigePoints: 60,
    targetStockId: 'green_energy_co',
    icon: AtomIcon,
    effects: { dividendYieldBoost: 0.0000045 },
  },
  {
    id: 'aprx_gene_therapy_2',
    name: 'APRX Gene Therapy',
    description: 'Successful trials of a revolutionary gene therapy treatment opens up a massive new market. Boosts dividend yield by an additional 20%.',
    costMoney: 800000000,
    costPrestigePoints: 70,
    targetStockId: 'alpha_pharma',
    icon: Dna,
    effects: { dividendYieldBoost: 0.000005 },
  },
  {
    id: 'sre_megatower_project_2',
    name: 'SRE Megatower Project',
    description: 'Announces plans for a record-breaking skyscraper, generating massive investor interest. Boosts dividend yield by an additional 25%.',
    costMoney: 550000000,
    costPrestigePoints: 55,
    targetStockId: 'summit_real_estate',
    icon: Building2,
    effects: { dividendYieldBoost: 0.0000045 },
  },
];
