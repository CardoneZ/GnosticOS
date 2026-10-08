/**
 * GnosticOS — Habit Crucible Types & Data Models
 */

import { AlchemicalStage } from './fordPoints';

export interface CrucibleCycle {
  id: string;
  pointNumber: number;
  startDate: string;        // YYYY-MM-DD
  targetDays: number;       // 21 to 30
  habitStatus: 'active' | 'completed' | 'paused' | 'broken';
  intentionText: string;     // The dogma, habit, or boundary being dismantled/built
  completedAt?: string | null;
  createdAt: string;
}

export interface CrucibleDailyLog {
  id: string;
  cycleId: string;
  logDate: string;          // YYYY-MM-DD
  dayIndex: number;         // 1 to 30
  observed: boolean;        // Herd conditioning or reactive instinct caught?
  overcome: boolean;        // Pattern broken / sovereign choice made?
  blackFlameRating: number; // 1 to 10
  reflectionNote: string;   // Sealed encrypted personal entry
}

export interface CrucibleCycleWithLogs extends CrucibleCycle {
  logs: CrucibleDailyLog[];
  currentDay: number;
  currentStage: AlchemicalStage;
  currentStreak: number;
  daysOvercomeCount: number;
  completionPercentage: number;
}
