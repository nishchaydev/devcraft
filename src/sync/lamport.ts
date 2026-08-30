/**
 * Lamport Clock & Device Identity Manager
 */

export class LamportClock {
  private static clock = -1;
  private static deviceId = '';

  public static getDeviceId(): string {
    if (!this.deviceId) {
      if (typeof window !== 'undefined' && window.localStorage) {
        let stored = localStorage.getItem('devcraft_device_id');
        if (!stored) {
          stored = 'device_' + Math.random().toString(36).substring(2, 9);
          localStorage.setItem('devcraft_device_id', stored);
        }
        this.deviceId = stored;
      } else {
        this.deviceId = 'device_node_' + Math.random().toString(36).substring(2, 7);
      }
    }
    return this.deviceId;
  }

  public static setDeviceId(id: string): void {
    this.deviceId = id;
  }

  private static initClockIfNeeded(): void {
    if (this.clock === -1) {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem('devcraft_lamport');
        if (stored) {
          const parsed = parseInt(stored, 10);
          this.clock = isNaN(parsed) ? 0 : parsed;
        } else {
          this.clock = 0;
        }
      } else {
        this.clock = 0;
      }
    }
  }

  private static persistClock(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('devcraft_lamport', String(this.clock));
    }
  }

  public static tick(): number {
    this.initClockIfNeeded();
    this.clock += 1;
    this.persistClock();
    return this.clock;
  }

  public static update(remoteClock: number): number {
    this.initClockIfNeeded();
    this.clock = Math.max(this.clock, remoteClock) + 1;
    this.persistClock();
    return this.clock;
  }

  public static getClock(): number {
    this.initClockIfNeeded();
    return this.clock;
  }

  public static reset(val = 0): void {
    this.clock = val;
    this.persistClock();
  }
}
