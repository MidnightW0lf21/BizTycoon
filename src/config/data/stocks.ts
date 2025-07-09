
import type { Stock } from '@/types';
import { Building, Cpu, Zap, FlaskConical, Landmark, Briefcase, TrendingUp, Lightbulb, Dna, TelescopeIcon, Package, ShieldAlert, Rocket, Bitcoin } from 'lucide-react';

export const INITIAL_STOCKS: Stock[] = [
  { id: 'global_corp', ticker: 'GC', companyName: 'Global Corp', price: 100, dividendYield: 0.00002, icon: Building, description: 'A diversified multinational conglomerate.', totalOutstandingShares: 25000000, onMarket: true },
  { id: 'tech_innovations', ticker: 'TINV', companyName: 'Tech Innovations Inc.', price: 250, dividendYield: 0.00001, icon: Cpu, description: 'Pioneering future technologies.', totalOutstandingShares: 10000000, onMarket: true },
  { id: 'green_energy_co', ticker: 'GEC', companyName: 'Green Energy Co.', price: 150, dividendYield: 0.000015, icon: Zap, description: 'Leading the renewable energy revolution.', totalOutstandingShares: 15000000, onMarket: true },
  { id: 'alpha_pharma', ticker: 'APRX', companyName: 'Alpha Pharmaceuticals', price: 300, dividendYield: 0.000025, icon: FlaskConical, description: 'Developing life-saving medications.', totalOutstandingShares: 5000000, onMarket: true },
  { id: 'summit_real_estate', ticker: 'SRE', companyName: 'Summit Real Estate', price: 120, dividendYield: 0.000018, icon: Landmark, description: 'Prime properties and development projects.', totalOutstandingShares: 20000000, onMarket: true },
  { id: 'biz_tycoon_holdings', ticker: 'BTH', companyName: 'BizTycoon Holdings', price: 500, dividendYield: 0.00003, icon: Briefcase, description: 'The parent company of successful ventures.', totalOutstandingShares: 2000000, onMarket: true },
  { id: 'momentum_motors', ticker: 'MMTR', companyName: 'Momentum Motors', price: 180, dividendYield: 0.000012, icon: TrendingUp, description: 'Innovative electric vehicle manufacturer, known for its volatile stock.', totalOutstandingShares: 12000000, onMarket: true },
  { id: 'quantum_leap_computing', ticker: 'QLC', companyName: 'Quantum Leap Computing', price: 450, dividendYield: 0.000005, icon: Lightbulb, description: 'Cutting-edge quantum computing research and development.', totalOutstandingShares: 3000000, onMarket: false },
  { id: 'biosynth_genetics', ticker: 'BSG', companyName: 'BioSynth Genetics', price: 220, dividendYield: 0.000022, icon: Dna, description: 'Biotechnology firm specializing in gene therapy and synthetic biology.', totalOutstandingShares: 8000000, onMarket: false },
  { id: 'cosmic_ventures', ticker: 'CVNT', companyName: 'Cosmic Ventures Ltd.', price: 750, dividendYield: 0.000008, icon: TelescopeIcon, description: 'High-risk, high-reward private space exploration and asteroid mining.', totalOutstandingShares: 1500000, onMarket: false },
  { id: 'biofuture_med', ticker: 'BFM', companyName: 'BioFuture MedTech', price: 400, dividendYield: 0.000028, icon: Dna, description: 'Advanced medical research and bionic prosthetics.', totalOutstandingShares: 4000000, onMarket: false },
  { id: 'aether_logistics', ticker: 'AETL', companyName: 'Aether Logistics Group', price: 280, dividendYield: 0.000019, icon: Package, description: 'Global drone and automated cargo network.', totalOutstandingShares: 9000000, onMarket: false },
  { id: 'omega_corp', ticker: 'OMG', companyName: 'Omega Corp', price: 600, dividendYield: 0.00004, icon: ShieldAlert, description: 'A highly speculative, high-growth potential tech conglomerate.', totalOutstandingShares: 2500000, onMarket: false },
  { id: 'stellar_dynamics', ticker: 'STLR', companyName: 'Stellar Dynamics', price: 1200, dividendYield: 0.000035, icon: Rocket, description: 'Pioneering interplanetary colonization and resource extraction.', totalOutstandingShares: 1000000, onMarket: false },
  { id: 'crypto_currency_exchange', ticker: 'CRYPX', companyName: 'CryptoNexus Exchange', price: 50, dividendYield: 0.000001, icon: Bitcoin, description: 'Volatile cryptocurrency trading platform.', totalOutstandingShares: 50000000, onMarket: true },
];

export const STOCK_ETF_UNLOCK_ORDER: { id: string; type: 'STOCK' | 'ETF' }[] = [
  { id: 'global_corp', type: 'STOCK' },
  { id: 'tech_etf', type: 'ETF' },
  { id: 'green_energy_co', type: 'STOCK' },
  { id: 'energy_etf', type: 'ETF' },
  { id: 'summit_real_estate', type: 'STOCK' },
  { id: 'finance_etf', type: 'ETF' },
  { id: 'tech_innovations', type: 'STOCK' },
  { id: 'industrial_etf', type: 'ETF' },
  { id: 'momentum_motors', type: 'STOCK' },
  { id: 'aerospace_etf', type: 'ETF' },
  { id: 'alpha_pharma', type: 'STOCK' },
  { id: 'biotech_etf', type: 'ETF' },
  { id: 'biz_tycoon_holdings', type: 'STOCK' },
  { id: 'crypto_currency_exchange', type: 'STOCK' },
];
