
import type { BusinessSynergy } from '@/types';

export const BUSINESS_SYNERGIES: BusinessSynergy[] = [
  // Early Game Synergies
  {
    businessId: 'manufacturing_plant',
    perLevels: 100,
    effect: {
      type: 'STOCK_PRICE_BOOST',
      targetId: 'momentum_motors',
      value: 1, // +1% base price per 100 levels
    },
  },
  {
    businessId: 'ai_research_lab',
    perLevels: 50,
    effect: {
      type: 'ETF_DIVIDEND_BOOST',
      targetId: 'tech_etf',
      value: 0.5, // +0.5% dividend yield per 50 levels
    },
  },
  {
    businessId: 'renewable_energy_corp',
    perLevels: 75,
    effect: {
      type: 'ETF_DIVIDEND_BOOST',
      targetId: 'energy_etf',
      value: 0.75,
    },
  },
  {
    businessId: 'real_estate',
    perLevels: 125,
    effect: {
      type: 'ETF_DIVIDEND_BOOST',
      targetId: 'finance_etf',
      value: 1,
    },
  },
  // Mid Game Synergies
  {
    businessId: 'global_shipping_network',
    perLevels: 50,
    effect: {
      type: 'ETF_DIVIDEND_BOOST',
      targetId: 'industrial_etf',
      value: 0.6,
    },
  },
  {
    businessId: 'space_exploration_inc',
    perLevels: 25,
    effect: {
      type: 'ETF_DIVIDEND_BOOST',
      targetId: 'aerospace_etf',
      value: 0.4,
    },
  },
  {
    businessId: 'pharmaceutical_company',
    perLevels: 50,
    effect: {
      type: 'ETF_DIVIDEND_BOOST',
      targetId: 'biotech_etf',
      value: 0.7,
    },
  },
  // Late Game Synergies
  {
    businessId: 'dyson_sphere_engineering',
    perLevels: 10,
    effect: {
      type: 'STOCK_PRICE_BOOST',
      targetId: 'stellar_dynamics',
      value: 0.5,
    },
  },
  {
    businessId: 'final_question_answering_service',
    perLevels: 5,
    effect: {
      type: 'STOCK_PRICE_BOOST',
      targetId: 'omega_corp',
      value: 0.2,
    },
  },
];
