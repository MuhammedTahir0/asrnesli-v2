import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { calculateNextPrayer } from './prayerTimes';

describe('calculateNextPrayer', () => {
     // Common mock timings
     const mockTimings = {
          Fajr: '05:30',
          Sunrise: '07:00',
          Dhuhr: '13:00',
          Asr: '16:30',
          Maghrib: '19:45',
          Isha: '21:15',
     };

     beforeEach(() => {
          vi.useFakeTimers();
     });

     afterEach(() => {
          vi.useRealTimers();
     });


     it('should return Dhuhr if current time is after Sunrise but before Dhuhr', () => {
          // Mock current time to 10:00
          const mockDate = new Date();
          mockDate.setHours(10, 0, 0, 0);

          // Inject mock date by modifying the function or using system time mocking. 
          // Since calculateNextPrayer uses new Date() internally, we should ideally use vi.useFakeTimers()
          // or refactor the function to accept a 'now' parameter.
          // For this test file, assuming environment supports vi.useFakeTimers or we use the 'now' parameter if refactored.
          // However, looking at the code, it strictly uses "new Date()".
          // We will use vi.setSystemTime() for Vitest.

          vi.setSystemTime(mockDate);

          const result = calculateNextPrayer(mockTimings);

          expect(result.key).toBe('Dhuhr');
          expect(result.name).toBe('Öğle');
          expect(result.time).toBe('13:00');
     });

     it('should return Maghrib if current time is after Asr but before Maghrib', () => {
          const mockDate = new Date();
          mockDate.setHours(18, 0, 0, 0);
          vi.setSystemTime(mockDate);

          const result = calculateNextPrayer(mockTimings);

          expect(result.key).toBe('Maghrib');
          expect(result.name).toBe('Akşam');
     });

     it('should return next day Fajr if current time is after Isha', () => {
          const mockDate = new Date();
          mockDate.setHours(23, 0, 0, 0);
          vi.setSystemTime(mockDate);

          const result = calculateNextPrayer(mockTimings);

          expect(result.key).toBe('Fajr');
          expect(result.name).toBe('İmsak');

          // Check if targetDate is tomorrow
          const tomorrow = new Date(mockDate);
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(5, 30, 0, 0);

          expect(result.targetDate.getDate()).toBe(tomorrow.getDate());
          expect(result.targetDate.getHours()).toBe(5);
          expect(result.targetDate.getMinutes()).toBe(30);
     });

     it('should handle API time formats like "05:30 (+03)" correctly', () => {
          // The current implementation splits by ':' and uses parseInt.
          // "05:30 (+03)" -> split(':') -> ["05", "30 (+03)"]
          // parseInt("30 (+03)") usually parses up to non-digit, so it should be 30.
          // Let's verify this behavior.

          const complexTimings = {
               ...mockTimings,
               Asr: '16:30 (+03)'
          };

          const mockDate = new Date();
          mockDate.setHours(14, 0, 0, 0); // Before Asr
          vi.setSystemTime(mockDate);

          const result = calculateNextPrayer(complexTimings);

          // It should find Asr as next
          expect(result.key).toBe('Asr');
          expect(result.targetDate.getMinutes()).toBe(30);
     });
});
