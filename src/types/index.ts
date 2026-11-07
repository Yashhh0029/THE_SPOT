/**
 * Central Model Exports
 */

export * from './user';
export * from './event';
export * from './gaming';
export * from './squad';
export * from './community';
export * from './chat';

export interface FilterOptions {
  searchQuery: string;
  category: 'all' | 'parties' | 'gaming' | 'meetups' | 'squads' | 'communities';
  dateFilter: 'all' | 'tonight' | 'tomorrow' | 'this_weekend' | 'this_week';
  budgetMaxInr: number; // 0 means any
  maxDistanceKm: number; // 0 means any
  neighborhood: string; // 'all' or specific Pune area
}
