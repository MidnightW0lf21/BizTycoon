
import type { ETF } from '@/types';
import { Cpu, Zap, Landmark, Factory, Rocket, Dna } from 'lucide-react';

export const INITIAL_ETFS: ETF[] = [
  {
    id: 'tech_etf',
    ticker: 'TEC',
    name: 'Technology Sector ETF',
    description: 'A fund representing a basket of leading technology and AI companies.',
    sector: 'TECH',
    icon: Cpu,
    totalOutstandingShares: 5000000,
  },
  {
    id: 'energy_etf',
    ticker: 'NRG',
    name: 'Energy Sector ETF',
    description: 'Invest in the future of energy, from renewables to advanced fusion.',
    sector: 'ENERGY',
    icon: Zap,
    totalOutstandingShares: 7500000,
  },
  {
    id: 'finance_etf',
    ticker: 'FIN',
    name: 'Financial Sector ETF',
    description: 'A collection of real estate and financial service giants.',
    sector: 'FINANCE',
    icon: Landmark,
    totalOutstandingShares: 10000000,
  },
  {
    id: 'industrial_etf',
    ticker: 'IND',
    name: 'Industrial & Manufacturing ETF',
    description: 'Tracks the performance of major manufacturing and logistics corporations.',
    sector: 'INDUSTRIAL',
    icon: Factory,
    totalOutstandingShares: 8000000,
  },
  {
    id: 'aerospace_etf',
    ticker: 'AERO',
    name: 'Aerospace & Defense ETF',
    description: 'Invest in companies reaching for the stars and defending the skies.',
    sector: 'AEROSPACE',
    icon: Rocket,
    totalOutstandingShares: 4000000,
  },
  {
    id: 'biotech_etf',
    ticker: 'BIO',
    name: 'Bio-Technology & Pharma ETF',
    description: 'A fund focused on groundbreaking medical and genetic engineering firms.',
    sector: 'BIOTECH',
    icon: Dna,
    totalOutstandingShares: 6000000,
  },
];
