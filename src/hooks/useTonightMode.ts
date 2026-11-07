/**
 * The Spot - Tonight Mode Dynamic Hook
 * Detects evening-oriented hours (after 6 PM) for amplified live experiences
 */

import { useState, useEffect } from 'react';

export interface TonightModeState {
  isTonightMode: boolean;
  headerBadge: string;
  greetingSuffix: string;
  hoursUntilMidnight: number;
}

export const useTonightMode = (): TonightModeState => {
  const [state, setState] = useState<TonightModeState>(() => {
    const now = new Date();
    const hour = now.getHours(); // Uses device local timezone
    const isNight = hour >= 18 || hour < 4;
    const hoursLeft = hour >= 18 ? 24 - hour : (hour < 4 ? 4 - hour : 0);

    return {
      isTonightMode: isNight,
      headerBadge: isNight ? 'Tonight Mode • Active' : 'Discover Pune',
      greetingSuffix: isNight ? 'Tonight’s Schedule' : 'Upcoming in Pune',
      hoursUntilMidnight: Math.max(1, hoursLeft),
    };
  });

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const hour = now.getHours(); // Uses device local timezone
      const isNight = hour >= 18 || hour < 4;
      const hoursLeft = hour >= 18 ? 24 - hour : (hour < 4 ? 4 - hour : 0);

      setState({
        isTonightMode: isNight,
        headerBadge: isNight ? 'Tonight Mode • Active' : 'Discover Pune',
        greetingSuffix: isNight ? 'Tonight’s Schedule' : 'Upcoming in Pune',
        hoursUntilMidnight: Math.max(1, hoursLeft),
      });
    };

    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return state;
};
